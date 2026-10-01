"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { SortOption } from "@/lib/types";

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: "recently_verified", label: "Recently Verified" },
  { value: "most_successful", label: "Most Successful" },
  { value: "newest", label: "Newest" },
  { value: "random", label: "Random" },
];

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = (searchParams.get("sort") as SortOption) || "recently_verified";

  function handleChange(value: SortOption) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "recently_verified") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <label htmlFor="sort" className="text-slate-600">
        Sort by
      </label>
      <select
        id="sort"
        value={current}
        onChange={(e) => handleChange(e.target.value as SortOption)}
        className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-slate-700 focus:border-slate-400 focus:outline-none"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
