"use client";

import { useState, useEffect, useCallback } from "react";
import { Navigation } from "@/components/navigation";
import { getStorageItem, setStorageItem, removeStorageItem, getTodayKey } from "@/lib/storage";

interface AuditEntry {
  date: string;
  badHabitsChecked: string;
  improvements: string;
  reflection: string;
  mode?: "personal" | "work";
  categories?: string[];
  sentiment?: {
    score: number;
    label: string;
    explanation: string;
  };
  analyzedAt?: string;
}

export default function NightlyAuditPage() {
  const [badHabitsChecked, setBadHabitsChecked] = useState("");
  const [improvements, setImprovements] = useState("");
  const [reflection, setReflection] = useState("");
  const [mode, setMode] = useState<"personal" | "work">("personal");
  const [saved, setSaved] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<{
    categories: string[];
    sentiment: { score: number; label: string; explanation: string };
  } | null>(null);
  const [pastEntries, setPastEntries] = useState<AuditEntry[]>([]);

  const todayKey = getTodayKey("nightly-audit");

  const reloadPastEntries = useCallback(() => {
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
  }, []);

  const handleDeleteEntry = (entryDate: string) => {
    if (confirm("Are you sure you want to delete this reflection? This action cannot be undone.")) {
      const key = `nightly-audit-${entryDate}`;
      removeStorageItem(key);
      reloadPastEntries();
    }
  };

  const handleClearToday = () => {
    if (confirm("Are you sure you want to clear today's reflection? This action cannot be undone.")) {
      removeStorageItem(todayKey);
      setBadHabitsChecked("");
      setImprovements("");
      setReflection("");
      setMode("personal");
      setCurrentAnalysis(null);
      setSaved(false);
      reloadPastEntries(); // Refresh the recent reflections list
    }
  };

  useEffect(() => {
    // Load today's entry if it exists
    const todayEntry = getStorageItem<AuditEntry>(todayKey);
    if (todayEntry) {
      setBadHabitsChecked(todayEntry.badHabitsChecked || "");
      setImprovements(todayEntry.improvements || "");
      setReflection(todayEntry.reflection || "");
      setMode(todayEntry.mode || "personal");
      if (todayEntry.categories && todayEntry.sentiment) {
        setCurrentAnalysis({
          categories: todayEntry.categories,
          sentiment: todayEntry.sentiment,
        });
      }
    }

    // Load past entries (last 7 days)
    reloadPastEntries();
  }, [todayKey, reloadPastEntries]);

  const handleSave = async () => {
    const entry: AuditEntry = {
      date: new Date().toISOString().split("T")[0],
      badHabitsChecked,
      improvements,
      reflection,
      mode,
    };
    setStorageItem(todayKey, entry);
    setSaved(true);
    setAnalysisError(null);
    reloadPastEntries(); // Refresh the recent reflections list
    setTimeout(() => setSaved(false), 3000);

    // Analyze with AI
    if (badHabitsChecked || improvements || reflection) {
      setAnalyzing(true);
      try {
        const response = await fetch("/api/analyze-audit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            badHabitsChecked,
            improvements,
            reflection,
            mode,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Unknown error occurred" }));
          throw new Error(errorData.error || `Failed to analyze reflection (${response.status})`);
        }

        const analysis = await response.json();
        setCurrentAnalysis(analysis);

        // Update entry with analysis results
        const updatedEntry: AuditEntry = {
          ...entry,
          categories: analysis.categories,
          sentiment: analysis.sentiment,
          analyzedAt: new Date().toISOString(),
        };
        setStorageItem(todayKey, updatedEntry);
        reloadPastEntries(); // Refresh the recent reflections list with updated analysis
      } catch (error) {
        console.error("Analysis error:", error);
        setAnalysisError(
          error instanceof Error
            ? error.message
            : "Failed to analyze reflection. Please try again."
        );
      } finally {
        setAnalyzing(false);
      }
    }
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
              &ldquo;Examine your spirit each night. What bad habits did you check?
              How did you improve?&rdquo; — Sextius
            </p>
            <p className="text-slate-400 text-sm">
              Practice happiness hygiene by reflecting on your day
            </p>
          </header>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 mb-8">
            <div className="space-y-6">
              {/* Mode Toggle */}
              <div>
                <div className="block text-sm font-medium text-slate-300 mb-2">
                  Context Mode
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMode("personal")}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      mode === "personal"
                        ? "bg-slate-700 text-white"
                        : "bg-slate-900/50 text-slate-400 hover:bg-slate-900/70"
                    }`}
                  >
                    Personal
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("work")}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      mode === "work"
                        ? "bg-slate-700 text-white"
                        : "bg-slate-900/50 text-slate-400 hover:bg-slate-900/70"
                    }`}
                  >
                    Work
                  </button>
                </div>
              </div>

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

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={analyzing}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  {analyzing
                    ? "Analyzing your reflection..."
                    : saved
                      ? "✓ Saved"
                      : "Save Reflection"}
                </button>
                {(badHabitsChecked || improvements || reflection) && (
                  <button
                    type="button"
                    onClick={handleClearToday}
                    disabled={analyzing}
                    className="bg-red-900/50 hover:bg-red-900/70 disabled:bg-slate-800 disabled:cursor-not-allowed text-red-300 font-medium py-3 px-6 rounded-lg transition-colors"
                    title="Clear today's reflection"
                  >
                    Clear
                  </button>
                )}
              </div>

              {analysisError && (
                <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                  <p className="text-red-400 text-sm">{analysisError}</p>
                </div>
              )}

              {/* Category Tags */}
              {currentAnalysis && currentAnalysis.categories.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-slate-300 mb-2">
                    Categories
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {currentAnalysis.categories.map((category) => (
                      <span
                        key={`category-${category}`}
                        className="px-3 py-1 bg-slate-700 text-slate-200 rounded-full text-sm"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sentiment Analysis Section */}
          {currentAnalysis?.sentiment && (
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Sentiment Analysis
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300">
                      {currentAnalysis.sentiment.label}
                    </span>
                    <span className="text-sm font-medium text-slate-300">
                      {currentAnalysis.sentiment.score}/100
                    </span>
                  </div>
                  <div className="w-full bg-slate-900/50 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        currentAnalysis.sentiment.score >= 70
                          ? "bg-green-500"
                          : currentAnalysis.sentiment.score >= 40
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{
                        width: `${currentAnalysis.sentiment.score}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-400">
                    {currentAnalysis.sentiment.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {pastEntries.length > 0 && (
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Recent Reflections
              </h2>
              <div className="space-y-4">
                {pastEntries.map((entry, index) => (
                  <div
                    key={`entry-${entry.date}-${index}`}
                    className="bg-slate-900/50 border border-slate-700 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm text-slate-400">
                        {new Date(entry.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <div className="flex items-center gap-2">
                        {entry.mode && (
                          <span className="text-xs px-2 py-1 bg-slate-700 text-slate-300 rounded-full">
                            {entry.mode === "work" ? "Work" : "Personal"}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteEntry(entry.date)}
                          className="text-xs px-2 py-1 bg-red-900/50 hover:bg-red-900/70 text-red-300 rounded transition-colors"
                          title="Delete this reflection"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Categories */}
                    {entry.categories && entry.categories.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-2">
                          {entry.categories.map((category, catIndex) => (
                            <span
                              key={`past-category-${entry.date}-${category}-${catIndex}`}
                              className="px-2 py-1 bg-slate-800 text-slate-300 rounded-full text-xs"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sentiment */}
                    {entry.sentiment && (
                      <div className="mb-3 p-3 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-slate-300">
                            Sentiment: {entry.sentiment.label}
                          </span>
                          <span className="text-xs text-slate-400">
                            {entry.sentiment.score}/100
                          </span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-2 mb-2">
                          <div
                            className={`h-full ${
                              entry.sentiment.score >= 70
                                ? "bg-green-500"
                                : entry.sentiment.score >= 40
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                            style={{
                              width: `${entry.sentiment.score}%`,
                            }}
                          />
                        </div>
                        <p className="text-xs text-slate-400">
                          {entry.sentiment.explanation}
                        </p>
                      </div>
                    )}

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

