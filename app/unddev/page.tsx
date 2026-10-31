"use client";
export default function UnderDevelopment() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md text-center">

        {/* Illustration */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-500/10">
          <span className="text-4xl" role="img" aria-label="Under construction">
            🚧
          </span>
        </div>

        {/* Status */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          <span className="text-xs font-semibold tracking-wide text-amber-700">
            UNDER DEVELOPMENT
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Something is in the works.
        </h1>

        <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-muted">
          This page isn't available just yet. We're working on
          bringing you something useful. Please check back later.
        </p>

        {/* Notice */}
        <div className="mt-7 rounded-xl border border-subtle bg-surface-secondary/50 p-4 text-left">
          <p className="flex items-center gap-2 text-sm font-medium">
            <span aria-hidden="true">ℹ️</span>
            Not ready for access
          </p>
          <p className="mt-1 pl-6 text-xs leading-5 text-muted">
            This section is currently being developed.
            Please explore the available sections instead.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => window.history.back()}
            className="k-btn px-5 py-2.5"
          >
            Go back
          </button>

          <button
            onClick={() => window.location.href = "/"}
            className="k-btn-ghost px-5 py-2.5"
          >
           Back to home
          </button>
        </div>

        <p className="mt-10 text-xs text-muted">
          Thank you for your patience.
        </p>
      </div>
    </main>
  );
}
