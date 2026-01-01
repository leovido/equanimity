"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-xl font-bold text-white hover:text-slate-300 transition-colors"
          >
            Build a Life
          </Link>
          <div className="flex gap-6">
            <Link
              href="/nightly-audit"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/nightly-audit")
                  ? "bg-slate-700 text-white"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              Nightly Audit
            </Link>
            <Link
              href="/stoic-mastery"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/stoic-mastery")
                  ? "bg-slate-700 text-white"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              Stoic Mastery
            </Link>
            <Link
              href="/inner-peace"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/inner-peace")
                  ? "bg-slate-700 text-white"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              Inner Peace
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

