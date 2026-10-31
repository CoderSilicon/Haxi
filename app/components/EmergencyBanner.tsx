"use client";

import type { RedFlagPayload } from "@/types/learnTypes";

/**
 * The big red banner. Shown first, always above everything else, whenever a
 * danger sign is found. Says exactly what to do, in one short line.
 */
export default function EmergencyBanner({
  flags,
  warning,
}: {
  flags: RedFlagPayload[];
  warning: string | null;
}) {
  if (flags.length === 0 && !warning) return null;

  return (
    <div className="mt-4 rounded-xl border-2 border-danger bg-danger-soft px-4 py-4">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-danger text-sm font-bold text-white"
        >
          !
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-danger uppercase tracking-wide">
            EMERGENCY
          </p>

          {flags.map((f) => (
            <p key={f.id} className="mt-1.5 text-sm leading-relaxed text-danger">
              <span className="font-semibold">{f.title}.</span> {f.advice}
            </p>
          ))}

          {warning && flags.length === 0 && (
            <p className="mt-1.5 text-sm leading-relaxed text-danger">{warning}</p>
          )}

          <p className="mt-3 text-sm font-bold text-danger">
            Call your local emergency number now.
          </p>
        </div>
      </div>
    </div>
  );
}
