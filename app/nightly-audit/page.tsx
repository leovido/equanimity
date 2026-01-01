"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { getStorageItem, setStorageItem, getTodayKey } from "@/lib/storage";

interface AuditEntry {
  date: string;
  badHabitsChecked: string;
  improvements: string;
  reflection: string;
}

export default function NightlyAuditPage() {
  const [badHabitsChecked, setBadHabitsChecked] = useState("");
  const [improvements, setImprovements] = useState("");
  const [reflection, setReflection] = useState("");
  const [saved, setSaved] = useState(false);
  const [pastEntries, setPastEntries] = useState<AuditEntry[]>([]);

  const todayKey = getTodayKey("nightly-audit");

  useEffect(() => {
    // Load today's entry if it exists
    const todayEntry = getStorageItem<AuditEntry>(todayKey);
    if (todayEntry) {
      setBadHabitsChecked(todayEntry.badHabitsChecked || "");
      setImprovements(todayEntry.improvements || "");
      setReflection(todayEntry.reflection || "");
    }

    // Load past entries (last 7 days)
    const entries: AuditEntry[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = `nightly-audit-${date.toISOString().split("T")[0]}`;
      const entry = getStorageItem<AuditEntry>(key);
      if (entry) {
        entries.push(entry);
      }
    }
    setPastEntries(entries);
  }, [todayKey]);

  const handleSave = () => {
    const entry: AuditEntry = {
      date: new Date().toISOString().split("T")[0],
      badHabitsChecked,
      improvements,
      reflection,
    };
    setStorageItem(todayKey, entry);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              The Nightly Audit
            </h1>
            <p className="text-slate-300 italic mb-4">
              "Examine your spirit each night. What bad habits did you check?
              How did you improve?" — Sextius
            </p>
            <p className="text-slate-400 text-sm">
              Practice happiness hygiene by reflecting on your day
            </p>
          </header>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 mb-8">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="bad-habits"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  What bad habits did you check or avoid today?
                </label>
                <textarea
                  id="bad-habits"
                  value={badHabitsChecked}
                  onChange={(e) => setBadHabitsChecked(e.target.value)}
                  placeholder="Reflect on the habits you resisted or avoided..."
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>

              <div>
                <label
                  htmlFor="improvements"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  How did you improve today?
                </label>
                <textarea
                  id="improvements"
                  value={improvements}
                  onChange={(e) => setImprovements(e.target.value)}
                  placeholder="Note the ways you grew, learned, or became better..."
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>

              <div>
                <label
                  htmlFor="reflection"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  General Reflection
                </label>
                <textarea
                  id="reflection"
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="Any other thoughts or observations about your day..."
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none"
                  rows={5}
                />
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                {saved ? "✓ Saved" : "Save Reflection"}
              </button>
            </div>
          </div>

          {pastEntries.length > 0 && (
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Recent Reflections
              </h2>
              <div className="space-y-4">
                {pastEntries.map((entry, index) => (
                  <div
                    key={index}
                    className="bg-slate-900/50 border border-slate-700 rounded-lg p-4"
                  >
                    <p className="text-sm text-slate-400 mb-3">
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    {entry.badHabitsChecked && (
                      <div className="mb-3">
                        <p className="text-xs text-slate-500 mb-1">
                          Habits Checked:
                        </p>
                        <p className="text-slate-300">{entry.badHabitsChecked}</p>
                      </div>
                    )}
                    {entry.improvements && (
                      <div className="mb-3">
                        <p className="text-xs text-slate-500 mb-1">
                          Improvements:
                        </p>
                        <p className="text-slate-300">{entry.improvements}</p>
                      </div>
                    )}
                    {entry.reflection && (
                      <div>
                        <p className="text-xs text-slate-500 mb-1">
                          Reflection:
                        </p>
                        <p className="text-slate-300">{entry.reflection}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

