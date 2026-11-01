import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { learnLinksFor } from "@/lib/learnLinks";
import { HAXI_SYSTEM_PROMPT, OUTPUT_SHAPE_NOTE } from "@/lib/prompts";
import { applyRedFlagOverride, scanRedFlags } from "@/lib/redflags";
import type { HaxiResult, LearnLink, RedFlagPayload } from "@/types/types";

const MIME_MAP: Record<string, string> = {
  "image/jpeg": "image/jpeg",
  "image/png": "image/png",
  "image/webp": "image/webp",
  "image/gif": "image/gif",
};

export const maxDuration = 60;

export interface EvaluateResponse {
  result: HaxiResult;
  redFlags: RedFlagPayload[];
  learn: LearnLink[];
}

async function readForm(formData: FormData) {
  const symptoms = (formData.get("symptoms") as string) ?? "";
  const skinContext = (formData.get("skinContext") as string) ?? "";
  const userHypothesis = (formData.get("userHypothesis") as string) ?? "";
  const additionalNotes = (formData.get("additionalNotes") as string) ?? "";

  const textParts: string[] = [`### WHAT THEY REPORT\n${symptoms}`];
  if (skinContext.trim()) {
    textParts.push(`### BODY DETAILS AND NUMBERS\n${skinContext}`);
  }
  if (userHypothesis.trim()) {
    textParts.push(`### THEIR OWN GUESS\n${userHypothesis}`);
  }
  if (additionalNotes.trim()) {
    textParts.push(`### THEIR HEALTH BACKGROUND\n${additionalNotes}`);
  }

  const imageParts: Array<{
    inlineData: { mimeType: string; data: string };
  }> = [];
  const imageCount = Number(formData.get("image_count") || "0");
  for (let i = 0; i < imageCount && i < 4; i++) {
    const file = formData.get(`image_${i}`) as File | null;
    if (!file || !file.type.startsWith("image/")) continue;
    const mimeType = MIME_MAP[file.type] ?? "image/jpeg";
    const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
    imageParts.push({ inlineData: { mimeType, data: base64 } });
  }
  if (imageParts.length > 0) {
    textParts.unshift(
      `### PHOTOS\n${imageParts.length} photo(s) attached. Look at each one and describe only what you can actually see.`,
    );
  }

  return { symptoms, textParts, imageParts };
}

function parseJson(raw: string): HaxiResult {
  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  return JSON.parse(cleaned) as HaxiResult;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const { symptoms, textParts, imageParts } = await readForm(formData);

    if (!symptoms.trim()) {
      return NextResponse.json(
        { error: "Please tell us what is wrong first." },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const modelName = process.env.GEMINI_MODEL;
    if (!apiKey) {
      return NextResponse.json(
        { error: "The server is missing parameters." },
        { status: 500 },
      );
    }
    if (!modelName) {
      return NextResponse.json(
        { error: "The server is missing its parameters" },
        { status: 500 },
      );
    }

    // Step 1: word-based safety scan. Runs first, on its own, so a scary
    // symptom can never slip through because of how the AI answered.
    const rawText = [
      symptoms,
      (formData.get("skinContext") as string) ?? "",
      (formData.get("additionalNotes") as string) ?? "",
    ].join(" . ");
    const redFlags = scanRedFlags(rawText);

    // Step 2: ask the AI.
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: `${HAXI_SYSTEM_PROMPT}\n\n${OUTPUT_SHAPE_NOTE}`,
    });

    const parts: Array<
      { text: string } | { inlineData: { mimeType: string; data: string } }
    > = [{ text: textParts.join("\n\n") }, ...imageParts];

    const completion = await model.generateContent({
      contents: [{ role: "user", parts }],
    });

    let parsed: HaxiResult;
    try {
      parsed = parseJson(completion.response.text());
    } catch {
      return NextResponse.json(
        { error: "We could not read the answer. Please try again." },
        { status: 502 },
      );
    }

    // A hard red flag always wins over whatever the AI decided.
    parsed = applyRedFlagOverride(parsed, redFlags);

    // Step 3: trusted reading. If this fails we still return the result.
    let learn: LearnLink[] = [];
    try {
      learn = await learnLinksFor(parsed.differential_analysis ?? [], 3);
    } catch{
      console.warn("Could not load learning links");
    }

    return NextResponse.json({
      result: parsed,
      redFlags,
      learn,
    } satisfies EvaluateResponse);
  } catch {
    return NextResponse.json(
      { error: "There was an error processing your request. Please try again." },
      { status: 500 },
    );
  }
}
