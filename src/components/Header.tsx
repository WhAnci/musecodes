import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <Link href="/" className="group">
          <h1 className="text-lg font-semibold tracking-tight text-slate-900 group-hover:text-slate-700">
            Muse Referral Codes
          </h1>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/about"
            className="text-slate-600 hover:text-slate-900 transition-colors"
          >
            About
          </Link>
          <Link
            href="/submit"
            className="rounded-lg bg-slate-900 px-3 py-1.5 font-medium text-white hover:bg-slate-800 transition-colors"
          >
            Add Your Code
          </Link>
        </nav>
      </div>
    </header>
  );
}
