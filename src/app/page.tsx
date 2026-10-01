import { Suspense } from "react";
import { FeaturedCode } from "@/components/FeaturedCode";
import { CodeCard } from "@/components/CodeCard";
import { CodeSearch } from "@/components/CodeSearch";
import { StatsBar } from "@/components/StatsBar";
import { SortSelect } from "@/components/SortSelect";
import {
  getCommunityCodes,
  getFeaturedCode,
  getSiteStats,
} from "@/lib/queries";
import type { SortOption } from "@/lib/types";

export const dynamic = "force-dynamic";

interface HomePageProps {
  searchParams: Promise<{ sort?: string }>;
}

const VALID_SORTS: SortOption[] = [
  "recently_verified",
  "most_successful",
  "newest",
  "random",
];

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const sortParam = params.sort as SortOption | undefined;
  const sort: SortOption =
    sortParam && VALID_SORTS.includes(sortParam)
      ? sortParam
      : "recently_verified";

  const [featured, communityCodes, stats] = await Promise.all([
    getFeaturedCode(),
    getCommunityCodes(sort),
    getSiteStats(),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <section className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Find and share working Muse referral codes.
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Enter a referral code in Muse Settings within 48 hours of signing up
          to receive the referral reward, subject to Muse&apos;s current referral
          rules.
        </p>
      </section>

      {featured && (
        <div className="mb-8">
          <FeaturedCode code={featured} />
        </div>
      )}

      <section className="mb-6 space-y-4">
        <CodeSearch />
        <StatsBar stats={stats} />
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">
            Community Codes
          </h3>
          <Suspense fallback={null}>
            <SortSelect />
          </Suspense>
        </div>

        {communityCodes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <p className="text-slate-600">No community codes yet.</p>
            <p className="mt-1 text-sm text-slate-500">
              Be the first to{" "}
              <a href="/submit" className="text-slate-900 underline">
                add your code
              </a>
              .
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {communityCodes.map((code) => (
              <CodeCard key={code.id} code={code} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
