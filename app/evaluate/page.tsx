"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  extractImages,
  type JournalEntry,
  parseBaseline,
  saveEntry,
  uid,
} from "@/lib/journal";
import type { EvaluateResponse } from "../api/evaluate/route";
import HaxiWizard from "../components/HaxiWizard";

export default function EvaluatePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleEvaluate(formData: FormData) {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        body: formData,
      });

      const payload = await res.json();
      if (!res.ok) {
        throw new Error(
          payload?.error ?? "Something went wrong. Please try again.",
        );
      }

      const { result, redFlags = [], learn = [] } = payload as EvaluateResponse;

      const symptoms = (formData.get("symptoms") as string) ?? "";
      const images = await extractImages(formData);

      const entry: JournalEntry = {
        id: uid(),
        createdAt: Date.now(),
        label:
          result.differential_analysis?.[0]?.condition_name ??
          result.user_hypothesis_analysis?.user_suspected_condition ??
          "My check-in",
        primaryComplaint: symptoms,
        baselineSeverity: parseBaseline(symptoms),
        conditionName:
          result.differential_analysis?.[0]?.condition_name ?? null,
        triageLevel: result.triage_level,
        result,
        redFlags,
        learn,
        images,
        checkIns: [],
      };

      saveEntry(entry);
      router.push(`/result/${entry.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="animate-in fade-in">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Check symptoms
          </h1>
          <p className="mt-1 text-sm text-body">
            One question at a time. Skip if unsure.
          </p>
        </div>

        <div className="rounded-xl border border-line bg-surface p-5 sm:p-8">
          <HaxiWizard onComplete={handleEvaluate} isLoading={isLoading} />
          {error && (
            <div className="mt-5 flex items-start justify-between gap-4 rounded-lg border border-danger/30 bg-danger-soft px-4 py-3">
              <p className="text-sm text-danger">{error}</p>
              <button
                type="button"
                onClick={() => setError(null)}
                className="shrink-0 text-xs font-semibold text-danger hover:underline"
              >
                Close
              </button>
            </div>
          )}
        </div>

        <p className="mt-5 text-xs text-muted">
          If something feels dangerous, call your local emergency number now.
        </p>
      </div>
    </div>
  );
}
