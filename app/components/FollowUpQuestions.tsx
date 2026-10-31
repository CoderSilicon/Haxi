"use client";

import { useState } from "react";
import type { FollowUpQuestion } from "@/types/types";

/**
 * The short extra questions. Answers are handed back to the parent, which
 * sends them to /api/followup to sharpen the result.
 */
export default function FollowUpQuestions({
  questions,
  onSubmit,
  onCancel,
  isLoading,
}: {
  questions: FollowUpQuestion[];
  onSubmit: (
    answers: Array<{ id: string; question: string; answer: string }>,
  ) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [free, setFree] = useState<Record<string, string>>({});
  const [showAll, setShowAll] = useState(false);

  if (questions.length === 0) return null;

  const answered = questions.filter((q) => answers[q.id]?.trim()).length;
  const allAnswered = answered === questions.length;

  function pick(q: FollowUpQuestion, choice: string) {
    setAnswers((prev) => ({ ...prev, [q.id]: choice }));
    setFree((prev) => ({ ...prev, [q.id]: "" }));
  }

  function type(q: FollowUpQuestion, value: string) {
    setFree((prev) => ({ ...prev, [q.id]: value }));
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
  }

  function submit() {
    onSubmit(
      questions.map((q) => ({
        id: q.id,
        question: q.question,
        answer: answers[q.id] ?? "",
      })),
    );
  }

  const visible = showAll ? questions : questions.slice(0, 2);

  return (
    <div className="rounded-3xl border border-accent/20 bg-accent-soft/30 p-6 sm:p-8">
      <p className="text-xs font-medium uppercase tracking-wider text-accent-strong">
        Follow-up
      </p>
      <h2 className="mt-2 text-lg font-medium tracking-tight sm:text-xl">
        A few more questions
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-body">
        Answers help refine the result.
      </p>

      <div className="mt-6 space-y-6">
        {visible.map((q) => (
          <div key={q.id}>
            <p className="text-sm font-semibold text-ink">{q.question}</p>
            {q.why && (
              <p className="mt-1 text-xs leading-relaxed text-muted">{q.why}</p>
            )}

            <div className="mt-3 flex flex-wrap gap-2">
              {q.choices.map((choice) => {
                const active = answers[q.id] === choice;
                return (
                  <button
                    key={choice}
                    type="button"
                    onClick={() => pick(q, choice)}
                    aria-pressed={active}
                    className={`k-chip ${active ? "k-chip-on" : "k-chip-off"}`}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>

            <input
              type="text"
              value={free[q.id] ?? ""}
              onChange={(e) => type(q, e.target.value)}
              placeholder="Or type your own answer"
              className="k-input mt-3"
            />
          </div>
        ))}
      </div>

      {questions.length > 2 && !showAll && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mt-5 text-sm font-semibold text-accent-strong link"
        >
          Show the last question
        </button>
      )}

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={submit}
          disabled={answered === 0 || isLoading}
          className="k-btn px-7"
        >
          {isLoading
            ? "Thinking…"
            : allAnswered
              ? "Get my better answer"
              : `Answer to continue (${answered}/${questions.length})`}
        </button>
        <button type="button" onClick={onCancel} className="k-btn-ghost px-5">
          Skip, I&apos;m done
        </button>
      </div>
    </div>
  );
}
