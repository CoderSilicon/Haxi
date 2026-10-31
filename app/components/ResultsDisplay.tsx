"use client";

import type { LearnLink, RedFlagPayload } from "@/types/learnTypes";
import type { HaxiResult } from "@/types/types";
import EmergencyBanner from "./EmergencyBanner";
import FollowUpQuestions from "./FollowUpQuestions";
import LearnMore from "./LearnMore";

/* ── Small shared bits ───────────────────────────────────────────── */

const TRIAGE: Record<
  string,
  { label: string; kid: string; color: string; bg: string; pct: number }
> = {
  "Self-Care & Monitor": {
    label: "Self-Care & Monitor",
    kid: "Look after it at home",
    color: "text-success",
    bg: "bg-success-soft",
    pct: 25,
  },
  "Primary Care Appointment": {
    label: "Primary Care",
    kid: "See your doctor",
    color: "text-warning",
    bg: "bg-warning-soft",
    pct: 50,
  },
  "Specialist Referral": {
    label: "Specialist Referral",
    kid: "See a specialist",
    color: "text-alert",
    bg: "bg-alert-soft",
    pct: 75,
  },
  "Immediate Emergency Care": {
    label: "Emergency Care",
    kid: "Get help right now",
    color: "text-danger",
    bg: "bg-danger-soft",
    pct: 100,
  },
};

const VERDICT: Record<string, { label: string; tint: string }> = {
  Consistent: {
    label: "Your guess fits",
    tint: "bg-success-soft text-success",
  },
  "Partially Consistent": {
    label: "Your guess partly fits",
    tint: "bg-warning-soft text-warning",
  },
  Unlikely: {
    label: "Your guess does not fit",
    tint: "bg-danger-soft text-danger",
  },
};

const LIKELIHOOD_BAR: Record<string, { width: string; color: string }> = {
  High: { width: "w-full", color: "bg-danger/70" },
  Moderate: { width: "w-2/3", color: "bg-warning" },
  Low: { width: "w-1/3", color: "bg-faint" },
};

const LIKELIHOOD_TINT: Record<string, string> = {
  High: "bg-danger/10 text-danger",
  Moderate: "bg-warning-soft text-warning",
  Low: "bg-soft text-muted",
};

const ORDER: Record<string, number> = { High: 0, Moderate: 1, Low: 2 };

function SectionHeading({ title }: { title: string }) {
  return (
    <h2 className="mb-3 text-base font-bold tracking-tight sm:text-lg">
      {title}
    </h2>
  );
}

/** The care level, in one big readable shape. */
function CareLevel({ triageLevel }: { triageLevel: string }) {
  const config = TRIAGE[triageLevel] ?? TRIAGE["Self-Care & Monitor"];
  return (
    <div className="flex flex-col items-center">
      <div
        className={`flex h-20 w-20 items-center justify-center rounded-xl ${config.bg} border border-current/20`}
      >
        <span
          className={`text-center text-xs leading-tight font-bold px-1 ${config.color}`}
        >
          {config.kid}
        </span>
      </div>
    </div>
  );
}

function Indicators({
  matching,
  differentiating,
}: {
  matching: string[];
  differentiating: string[];
}) {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {matching.map((t) => (
        <span key={`m-${t}`} className="k-pill bg-success-soft text-success">
          <span className="h-1 w-1 rounded-full bg-success" />
          {t}
        </span>
      ))}
      {differentiating.map((t) => (
        <span key={`d-${t}`} className="k-pill bg-soft text-muted">
          <span className="h-1 w-1 rounded-full bg-faint" />
          {t}
        </span>
      ))}
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────── */

export default function ResultsDisplay({
  result,
  redFlags = [],
  learn = [],
  followupQuestions = [],
  onAnswerFollowUps,
  onSkipFollowUps,
  onPrepareReport,
  onViewJournal,
  isRefining = false,
}: {
  result: HaxiResult;
  redFlags?: RedFlagPayload[];
  learn?: LearnLink[];
  followupQuestions?: HaxiResult["followup_questions"];
  onAnswerFollowUps?: (
    answers: Array<{ id: string; question: string; answer: string }>,
  ) => void;
  onSkipFollowUps?: () => void;
  onPrepareReport: () => void;
  onViewJournal: () => void;
  isRefining?: boolean;
}) {
  const sorted = [...(result.differential_analysis ?? [])].sort(
    (a, b) => (ORDER[a.likelihood] ?? 3) - (ORDER[b.likelihood] ?? 3),
  );
  const top = sorted[0];
  const rest = sorted.slice(1);
  const guess = result.user_hypothesis_analysis;
  const verdict = VERDICT[guess?.verdict ?? ""];
  const showFollowUps =
    !result.is_emergency && followupQuestions.length > 0 && !!onAnswerFollowUps;

  return (
    <div className="animate-in slide-up">
      <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Result
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onViewJournal}
              className="k-btn-ghost px-3 py-1.5 text-xs"
            >
              Journal
            </button>
            <button
              type="button"
              onClick={onPrepareReport}
              className="k-btn px-3 py-1.5 text-xs"
            >
              Doctor report
            </button>
          </div>
        </div>

        {/* Danger first, always */}
        <EmergencyBanner flags={redFlags} warning={result.emergency_warning} />

        {/* The answer, in plain words */}
        <section className="mt-4 k-card p-5 sm:p-6">
          <div className="grid items-start gap-5 md:grid-cols-[auto_1fr]">
            <CareLevel triageLevel={result.triage_level} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Summary
              </p>
              <p className="mt-2 text-lg leading-relaxed font-semibold text-ink sm:text-xl">
                {result.haxi_eval_summary}
              </p>
              {result.plain_summary && (
                <div className="mt-3 rounded-lg bg-soft/80 p-3 ring-1 ring-line/60">
                  <p className="text-sm leading-relaxed text-body">{result.plain_summary}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Follow-up questions */}
        {showFollowUps && (
          <div className="mt-6">
            <FollowUpQuestions
              questions={followupQuestions}
              onSubmit={
                onAnswerFollowUps as NonNullable<typeof onAnswerFollowUps>
              }
              onCancel={onSkipFollowUps as NonNullable<typeof onSkipFollowUps>}
              isLoading={isRefining}
            />
          </div>
        )}

        {/* Most likely */}
        {top && (
          <section className="mt-10">
            <SectionHeading title="Most likely" />
            <div className="relative overflow-hidden rounded-xl border-2 border-accent/70 bg-surface p-5 sm:p-6 shadow-(--shadow-card)">
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent/8 blur-3xl" />
              <div className="relative flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-linear-to-br from-accent to-accent-strong text-xs font-bold text-white shadow-sm">1</span>
                  <h3 className="text-lg font-bold tracking-tight">
                    {top.condition_name}
                  </h3>
                </div>
                <span
                  className={`k-pill ${
                    LIKELIHOOD_TINT[top.likelihood] ?? "bg-soft text-muted"
                  }`}
                >
                  {top.likelihood}
                </span>
              </div>

              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-line-soft">
                <div
                  className={`h-full rounded-full ${
                    LIKELIHOOD_BAR[top.likelihood]?.color ?? "bg-faint"
                  } ${LIKELIHOOD_BAR[top.likelihood]?.width ?? "w-1/3"}`}
                />
              </div>

              <p className="mt-5 text-sm leading-relaxed text-body">
                {top.clinical_overview}
              </p>
              <Indicators
                matching={top.matching_indicators ?? []}
                differentiating={top.differentiating_indicators ?? []}
              />
            </div>
          </section>
        )}

        {/* Other possibilities */}
        {rest.length > 0 && (
          <section className="mt-10">
            <SectionHeading title="Other things it could be" />
            <div className="space-y-4">
              {rest.map((dx, i) => {
                const bar = LIKELIHOOD_BAR[dx.likelihood] ?? LIKELIHOOD_BAR.Low;
                return (
                  <div key={dx.condition_name} className="k-card-hover p-5">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded bg-soft text-xs font-semibold text-muted">
                          {i + 2}
                        </span>
                        <h4 className="text-base font-semibold">
                          {dx.condition_name}
                        </h4>
                      </div>
                      <span
                        className={`k-pill ${
                          LIKELIHOOD_TINT[dx.likelihood] ?? "bg-soft text-muted"
                        }`}
                      >
                        {dx.likelihood} chance
                      </span>
                    </div>

                    <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-line-soft">
                      <div
                        className={`h-full rounded-full ${bar.color} ${bar.width}`}
                      />
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-body">
                      {dx.clinical_overview}
                    </p>
                    <Indicators
                      matching={dx.matching_indicators ?? []}
                      differentiating={dx.differentiating_indicators ?? []}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Their guess */}
        {guess?.user_suspected_condition && (
          <section className="mt-10">
            <SectionHeading title="What you thought it was" />
            <div className="k-card p-6">
              <div className="flex flex-wrap items-center gap-3">
                <h4 className="text-base font-semibold">
                  {guess.user_suspected_condition}
                </h4>
                {verdict && (
                  <span className={`k-pill ${verdict.tint}`}>
                    {verdict.label}
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-body">
                {guess.clinical_reasoning}
              </p>
            </div>
          </section>
        )}

        {/* What to do now */}
        {result.recommended_actions?.length > 0 && (
          <section className="mt-10">
            <SectionHeading title="What to do now" />
            <div className="space-y-2">
              {result.recommended_actions.map((action, i) => (
                <div
                  key={action}
                  className="flex items-start gap-3 rounded-lg border border-line bg-surface px-4 py-3"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-accent-soft text-xs font-bold text-accent-strong">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-body">{action}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Questions to ask */}
        {result.physician_consult_guide?.length > 0 && (
          <section className="mt-10">
            <SectionHeading title="Questions to ask your doctor" />
            <div className="k-card p-6">
              <ul className="space-y-3">
                {result.physician_consult_guide.map((q) => (
                  <li
                    key={q}
                    className="flex items-start gap-3 text-sm text-body"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-soft text-[11px] font-semibold text-muted">
                      ?
                    </span>
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* How sure */}
        {result.confidence_note && (
          <section className="mt-10">
            <SectionHeading title="How sure are we?" />
            <div className="rounded-2xl border border-line bg-soft px-6 py-5">
              <p className="text-sm leading-relaxed text-body">
                {result.confidence_note}
              </p>
              {result.additional_warning && (
                <p className="mt-3 rounded-xl border border-warning/25 bg-warning-soft px-4 py-3 text-sm leading-relaxed text-warning">
                  <span className="font-semibold">Also worth knowing: </span>
                  {result.additional_warning}
                </p>
              )}
            </div>
          </section>
        )}

        {/* Trusted reading */}
        <LearnMore links={learn} />

        {/* Next steps */}
        <section className="mt-10 no-print">
          <SectionHeading title="Next steps" />
          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={onPrepareReport}
              className="flex items-center justify-between rounded-lg border border-accent bg-accent px-4 py-3 text-left text-white transition-colors hover:bg-accent-strong"
            >
              <span className="text-sm font-semibold">Doctor report</span>
              <span aria-hidden="true">→</span>
            </button>
            <button
              type="button"
              onClick={onViewJournal}
              className="flex items-center justify-between rounded-lg border border-line bg-surface px-4 py-3 text-left transition-colors hover:bg-soft"
            >
              <span className="text-sm font-semibold text-ink">Go to journal</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
