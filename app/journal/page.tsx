"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  addCheckIn,
  type CheckIn,
  type JournalEntry,
  loadJournal,
  removeEntry,
} from "@/lib/journal";
import JournalView from "../components/JournalView";

export default function JournalPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setEntries(loadJournal());
    setReady(true);
  }, []);

  const refresh = useCallback(() => setEntries(loadJournal()), []);

  function handleCheckIn(id: string, checkIn: CheckIn) {
    addCheckIn(id, checkIn);
    refresh();
  }

  function handleDelete(id: string) {
    removeEntry(id);
    refresh();
  }

  return (
    <div className="animate-in fade-in">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Journal
            </h1>
            <p className="mt-1 text-sm text-body">
              Saved on this device
            </p>
          </div>
          <Link href="/evaluate" className="k-btn px-5">
            <span aria-hidden="true">+</span>
            New check
          </Link>
        </div>

        {ready ? (
          <JournalView
            entries={entries}
            onStart={() => router.push("/evaluate")}
            onOpenReport={(id) => router.push(`/report/${id}`)}
            onCheckIn={handleCheckIn}
            onDelete={handleDelete}
          />
        ) : null}
      </div>
    </div>
  );
}
