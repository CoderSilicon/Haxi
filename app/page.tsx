import Link from "next/link";

const STEPS = [
  {
    num: "01",
    title: "Tell us",
    desc: "Answer a few questions about how you're feeling and what you're experiencing.",
  },
  {
    num: "02",
    title: "Add context as well",
    desc: "Optionally you might add a photo or more details if helpful. Yes, you can even add what you suspect might be going on.",
  },
  {
    num: "03",
    title: "Get answers clearly",
    desc: "See what the symptoms might be and what precautions and necessary steps to do right now.",
  },
  {
    num: "04",
    title: "Jot it down",
    desc: "Check in daily to see how things are going on and track your progress. You can also download a PDF report of your symptoms and the results.",
  },
];

const FEATURES = [
  {
    title: "Safety first",
    desc: "Emergency signs are caught before anything else.",
  },
  {
    title: "Ask back",
    desc: "Smart follow-ups help get a more accurate picture.",
  },
  {
    title: "Real sources",
    desc: "All information comes from MedlinePlus, trusted and verified.",
  },
];

export default function Home() {
  return (
    <div className="animate-in fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-accent/8 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-3xl">

            <h1 className="text-balance text-4xl leading-[1.12] font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Find out what your symptoms
              <span className="text-accent"> could mean.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-body sm:text-lg">
              Answer a few questions and get a clear, honest explanation
              of what might be going on and what to do next.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/evaluate" className="k-btn justify-center gap-3 px-6 py-3">
                Check my symptoms
              </Link>

              <Link href="/learn" className="k-btn-ghost justify-center px-6 py-3">
                Explore health topics
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                About 2 minutes
              </span>
              <span>No account needed</span>
            </div>

          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="relative overflow-hidden border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">

          <div className="mb-10 max-w-xl">
            <span className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-accent-strong">
              <span className="h-px w-6 bg-accent" />
              The process
            </span>

            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              How it works<span className="text-accent">.</span>
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-body sm:text-base">
              Four simple steps to get started and reach your goal.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {STEPS.map((s, i) => (
              <div key={s.num} className="relative">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent/25 bg-accent-soft text-sm font-bold text-accent-strong">
                    {String(s.num).padStart(2, "0")}
                  </div>

                  {i !== STEPS.length - 1 && (
                    <div className="hidden h-px flex-1 bg-linear-to-r from-accent/40 to-line lg:block" />
                  )}
                </div>

                <h3 className="text-base font-bold tracking-tight sm:text-lg">
                  {s.title}
                </h3>

                <p className="mt-2 max-w-xs text-sm leading-6 text-body">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">

          <div className="mb-10 max-w-xl">
            <span className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-accent-strong">
              <span className="h-px w-6 bg-accent" />
              The advantages
            </span>

            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Why use this tool<span className="text-accent">?</span>
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-body sm:text-base">
              Everything you need, without unnecessary complexity.
            </p>
          </div>

          <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="relative border-l-2 border-accent/25 pl-5">
                <span className="mb-3 block text-xs font-bold tabular-nums tracking-widest text-accent-strong">
                  0{i + 1}
                </span>

                <h3 className="text-base font-bold tracking-tight sm:text-lg">
                  {f.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-body">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="relative isolate overflow-hidden rounded-3xl bg-accent px-6 py-12 text-white sm:px-10 sm:py-16 lg:px-14 lg:py-20">

            <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full border border-white/10" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

              <div className="max-w-2xl">
                <span className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white/75">
                  <span className="h-px w-6 bg-white/70" />
                  Take the next step
                </span>

                <h2 className="text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                  Not sure if it's worth worrying about?
                </h2>

                <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                  Get a clearer picture of what your symptoms could mean
                  and what steps you might consider taking next.
                </p>
              </div>

              <div className="relative shrink-0">
                <Link
                  href="/evaluate"
                  className="inline-flex min-h-14 w-full items-center justify-center gap-4 rounded-xl bg-white px-8 py-4 text-base font-bold text-accent shadow-sm transition-colors duration-200 hover:bg-white/90 sm:w-auto"
                >
                  Check my symptoms
                  <span aria-hidden="true" className="text-xl">→</span>
                </Link>

                <p className="mt-3 text-center text-xs text-white/70">
                  About 2 minutes · No account needed
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
