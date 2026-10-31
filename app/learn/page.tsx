"use client";

import { useState } from "react";
import { BODY_AREAS } from "@/lib/bodyAreas";
import type { LearnLink } from "@/types/learnTypes";
import { useLearnQuery } from "@/lib/useLearn";

const AREAS = BODY_AREAS;

function TopicCard({ topic }: { topic: LearnLink }) {
  return (
    <a
      href={topic.url}
      target="_blank"
      rel="noreferrer noopener"
      className="group block rounded-xl border border-line bg-surface p-5 transition-colors duration-200 hover:border-accent/40 sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="max-w-xl text-base font-semibold leading-snug tracking-tight">
          {topic.title}
        </h3>

        <span
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-base text-muted transition-colors group-hover:text-accent-strong"
        >
          ↗
        </span>
      </div>

      {topic.snippet && (
        <p className="mt-3 max-w-2xl text-sm leading-6 text-body line-clamp-2">
          {topic.snippet}
        </p>
      )}

      <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-accent-strong">
        Read resource
        <span aria-hidden="true">→</span>
      </div>
    </a>
  );
}

export default function LearnPage() {
  const [area, setArea] = useState<string>("lungs");
  const [term, setTerm] = useState("");
  const [submitted, setSubmitted] = useState("");

  const areaKey = JSON.stringify({ area, limit: "12" });
  const searchKey = JSON.stringify({ q: submitted, limit: "12" });

  const byArea = useLearnQuery(areaKey, submitted.length === 0);
  const bySearch = useLearnQuery(searchKey, submitted.length > 0);

  const active = submitted.length > 0 ? bySearch : byArea;
  const current = AREAS.find((a) => a.id === area);

  return (

<div className="animate-in fade-in">
  <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-9">

    {/* Header */}
    <header className="mb-6">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Learn
        </h1>
      </div>
      <p className="mt-1 text-sm text-muted">
        Reliable health information, powered by MedlinePlus.
      </p>
    </header>

    {/* Search */}
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(term.trim());
      }}
      className="flex items-center gap-2 rounded-xl border border-subtle bg-surface p-1.5 shadow-sm"
    >
      <input
        type="search"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search health topics..."
        aria-label="Search health topics"
        className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted"
      />

      {submitted.length > 0 && (
        <button
          type="button"
          onClick={() => {
            setTerm("");
            setSubmitted("");
          }}
          className="rounded-lg px-3 py-2 text-xs font-medium text-muted hover:bg-surface-secondary"
        >
          Clear
        </button>
      )}

      <button
        type="submit"
        className="k-btn shrink-0 rounded-lg px-4 py-2 text-sm"
      >
        Search
      </button>
    </form>

    {/* Categories */}
    {submitted.length === 0 && (
      <section className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-tight">
            Explore topics
          </h2>
          <span className="text-xs text-muted">
            Browse by body area
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {AREAS.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setArea(a.id)}
              aria-pressed={area === a.id}
              className={`k-chip rounded-full px-3 py-1.5 text-xs transition-colors ${
                area === a.id
                  ? "k-chip-on"
                  : "k-chip-off hover:bg-surface-secondary"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </section>
    )}

    {/* Results */}
    <section className="mt-8">

      {active.loading && (
        <p className="py-8 text-center text-sm text-muted">
          Finding health topics...
        </p>
      )}

      {active.error && (
        <div className="rounded-xl border border-danger/20 px-4 py-3">
          <p className="text-sm text-danger">{active.error}</p>
        </div>
      )}

      {!active.loading &&
        !active.error &&
        active.topics.length === 0 && (
          <p className="py-10 text-center text-sm text-muted">
            No topics found. Try another search.
          </p>
        )}

      {!active.loading &&
        !active.error &&
        active.topics.length > 0 && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold tracking-tight">
                {submitted.length > 0
                  ? "Search results"
                  : current
                    ? `${current.label}`
                    : "Explore"}
              </h2>

              <span className="text-xs text-muted">
                {active.topics.length} topics
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {active.topics.map((topic) => (
                <TopicCard key={topic.url} topic={topic} />
              ))}
            </div>
          </>
        )}
    </section>
  </div>
</div>

  );
}
