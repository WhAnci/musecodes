import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
        About musecodes
      </h2>

      <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-600">
        <p>
          musecodes is a lightweight community utility for finding and sharing
          Muse referral codes. It is not a social network — there are no
          profiles, feeds, or accounts required.
        </p>

        <h3 className="text-base font-semibold text-slate-900">
          How it works
        </h3>
        <ul className="list-inside list-disc space-y-1">
          <li>Submit your 6-character Muse referral code.</li>
          <li>Browse codes shared by others and copy one to try.</li>
          <li>
            After trying a code, leave simple feedback: Worked or Didn&apos;t
            Work.
          </li>
          <li>
            Recently verified working codes are surfaced to help others find
            active codes quickly.
          </li>
        </ul>

        <h3 className="text-base font-semibold text-slate-900">
          Referral rules
        </h3>
        <p>
          Referral codes must be entered in Muse Settings within 48 hours of
          signing up to be eligible for referral rewards, subject to Muse&apos;s
          current referral program rules. We cannot guarantee that any code will
          work for your account — eligibility depends on Muse&apos;s policies
          and your account status.
        </p>

        <h3 className="text-base font-semibold text-slate-900">
          Featured code
        </h3>
        <p>
          The site owner&apos;s referral code (S8D87N) is displayed in a
          clearly labeled Featured section at the top of the homepage. This
          placement is reserved for the site owner and does not participate in
          community ranking.
        </p>

        <h3 className="text-base font-semibold text-slate-900">Disclaimer</h3>
        <p>
          musecodes is not affiliated with, endorsed by, or sponsored by Muse.
          Referral rewards and program terms are determined solely by Muse. Code
          status labels (Working, Mixed Results, etc.) are derived from
          community feedback and are not official confirmations from Muse.
        </p>

        <p className="pt-2">
          <Link href="/" className="text-slate-900 underline">
            ← Back to codes
          </Link>
        </p>
      </div>
    </div>
  );
}
