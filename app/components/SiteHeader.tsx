"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { JOURNAL_EVENT, loadJournal } from "@/lib/journal";
import Image from "next/image";

export default function SiteHeader() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const refresh = () => setCount(loadJournal().length);
    refresh();
    window.addEventListener(JOURNAL_EVENT, refresh);
    return () => window.removeEventListener(JOURNAL_EVENT, refresh);
  }, []);

  return (
    <header className="no-print sticky top-0 z-40 w-full border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">

        {/* Brand */}
        <Link
          href="/"
          aria-label="Haxi home"
          className="flex shrink-0 items-center gap-2.5"
        >
          <Image
            src="/favicon.svg"
            alt=""
            width={32}
            height={32}
            className="size-8"
          />
          <span className="hidden text-lg font-bold tracking-tight sm:inline">
            Haxi
          </span>
        </Link>

        {/* Navigation */}
        <nav aria-label="Main navigation" className="flex items-center gap-3 sm:gap-6">
          <Link
            href="/learn"
            className="text-xs font-medium text-body transition-colors hover:text-accent-strong sm:text-sm"
          >
            Learn
          </Link>

          <Link
            href="/journal"
            className="inline-flex items-center gap-1 text-xs font-medium text-body transition-colors hover:text-accent-strong sm:gap-1.5 sm:text-sm"
          >
            Journal
            {count > 0 && (
              <span className="inline-flex min-w-4 items-center justify-center rounded-full bg-accent-soft px-1 text-[10px] font-semibold text-accent-strong">
                {count}
              </span>
            )}
          </Link>

          <Link
            href="/evaluate"
            className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-accent px-3 text-xs font-semibold text-white sm:min-h-10 sm:gap-2 sm:px-4 sm:text-sm"
          >
            <span className="sm:hidden">Check</span>
            <span className="hidden sm:inline">Check symptoms</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}