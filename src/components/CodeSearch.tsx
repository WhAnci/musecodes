"use client";

import { useState } from "react";
import Link from "next/link";
import { STATUS_LABELS, STATUS_STYLES } from "@/lib/status";
import type { CodeStatus } from "@/lib/types";
import { formatRelativeTime } from "@/lib/format";

interface SearchResult {
  found: boolean;
  code?: string;
  status?: CodeStatus;
  worked_count?: number;
  failed_count?: number;
  last_worked_at?: string | null;
  is_featured?: boolean;
  url?: string;
  error?: string;
}

export function CodeSearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(query.trim())}`,
      );
      const data: SearchResult = await res.json();
      setResult(data);
    } catch {
      setResult({ found: false, error: "Search failed." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value.toUpperCase())}
          placeholder="Search code"
          maxLength={6}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal placeholder:font-sans focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
        >
          {loading ? "..." : "Search"}
        </button>
      </form>

      {result && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
          {result.error && !result.found && (
            <p className="text-slate-600">{result.error}</p>
          )}
          {!result.found && !result.error && (
            <p className="text-slate-600">
              Code <span className="font-mono font-medium">{result.code}</span>{" "}
              has not been submitted yet.{" "}
              <Link href="/submit" className="text-slate-900 underline">
                Add it
              </Link>
            </p>
          )}
          {result.found && result.status && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-bold">{result.code}</span>
                {result.is_featured && (
                  <span className="text-xs text-amber-700">Featured</span>
                )}
                <span
                  className={`rounded-md border px-2 py-0.5 text-xs font-semibold uppercase ${STATUS_STYLES[result.status]}`}
                >
                  {STATUS_LABELS[result.status]}
                </span>
              </div>
              <p className="text-slate-600">
                {result.worked_count} worked · {result.failed_count} didn&apos;t
                work
              </p>
              {result.last_worked_at && (
                <p className="text-slate-500">
                  Last confirmed working:{" "}
                  {formatRelativeTime(result.last_worked_at)}
                </p>
              )}
              {result.url && (
                <Link
                  href={result.url}
                  className="inline-block text-slate-900 underline"
                >
                  View details →
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
