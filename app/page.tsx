import Link from "next/link";
import { Navigation } from "@/components/navigation";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-4">
              Build a Life
            </h1>
            <p className="text-xl text-slate-300 mb-2">
              A Stoic Practice for Daily Mastery
            </p>
            <p className="text-slate-400">
              "No man is free who is not master of himself" — Epictetus
            </p>
          </header>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Link
              href="/nightly-audit"
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:bg-slate-800/70 transition-all hover:border-slate-600 hover:scale-105"
            >
              <h2 className="text-2xl font-semibold text-white mb-3">
                The Nightly Audit
              </h2>
              <p className="text-slate-300 mb-4">
                Examine your spirit each night. What bad habits did you check?
                How did you improve?
              </p>
              <p className="text-sm text-slate-400 italic">
                — Sextius
              </p>
            </Link>

            <Link
              href="/stoic-mastery"
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:bg-slate-800/70 transition-all hover:border-slate-600 hover:scale-105"
            >
              <h2 className="text-2xl font-semibold text-white mb-3">
                Stoic Mastery
              </h2>
              <p className="text-slate-300 mb-4">
                Master yourself. Stop being managed by external desires. Inhabit
                the present moment.
              </p>
              <p className="text-sm text-slate-400 italic">
                — Epictetus
              </p>
            </Link>

            <Link
              href="/inner-peace"
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:bg-slate-800/70 transition-all hover:border-slate-600 hover:scale-105"
            >
              <h2 className="text-2xl font-semibold text-white mb-3">
                Inner Peace
              </h2>
              <p className="text-slate-300 mb-4">
                Manage emotional extremes so they do not manage you. Reduce
                rumination and catastrophizing.
              </p>
              <p className="text-sm text-slate-400 italic">
                — Seneca
              </p>
            </Link>
          </div>

          <div className="text-center text-slate-400 text-sm">
            <p>
              "Equanimity is best maintained by managing emotional extremes"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

