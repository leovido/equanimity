"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { getStorageItem, setStorageItem, getTodayKey } from "@/lib/storage";

interface PeaceEntry {
  date: string;
  emotionalState: string;
  extremes: string;
  rumination: string;
  catastrophizing: string;
  management: string;
}

const emotionalStates = [
  { value: "calm", label: "Calm", color: "bg-green-500" },
  { value: "anxious", label: "Anxious", color: "bg-yellow-500" },
  { value: "angry", label: "Angry", color: "bg-red-500" },
  { value: "sad", label: "Sad", color: "bg-blue-500" },
  { value: "joyful", label: "Joyful", color: "bg-purple-500" },
  { value: "neutral", label: "Neutral", color: "bg-gray-500" },
];

export default function InnerPeacePage() {
  const [selectedState, setSelectedState] = useState<string>("");
  const [extremes, setExtremes] = useState("");
  const [rumination, setRumination] = useState("");
  const [catastrophizing, setCatastrophizing] = useState("");
  const [management, setManagement] = useState("");
  const [saved, setSaved] = useState(false);
  const [todayEntries, setTodayEntries] = useState<PeaceEntry[]>([]);

  const todayKey = getTodayKey("inner-peace");

  useEffect(() => {
    // Load today's entry
    const todayEntry = getStorageItem<PeaceEntry>(todayKey);
    if (todayEntry) {
      setSelectedState(todayEntry.emotionalState || "");
      setExtremes(todayEntry.extremes || "");
      setRumination(todayEntry.rumination || "");
      setCatastrophizing(todayEntry.catastrophizing || "");
      setManagement(todayEntry.management || "");
    }

    // Load all entries for today (for tracking throughout the day)
    const allEntries = getStorageItem<PeaceEntry[]>("inner-peace-all") || [];
    const today = new Date().toISOString().split("T")[0];
    const filtered = allEntries.filter((e) => e.date === today);
    setTodayEntries(filtered);
  }, [todayKey]);

  const handleSave = () => {
    const entry: PeaceEntry = {
      date: new Date().toISOString().split("T")[0],
      emotionalState: selectedState,
      extremes,
      rumination,
      catastrophizing,
      management,
    };
    setStorageItem(todayKey, entry);

    // Also add to all entries
    const allEntries = getStorageItem<PeaceEntry[]>("inner-peace-all") || [];
    const updated = [...allEntries.filter((e) => e.date !== entry.date), entry];
    setStorageItem("inner-peace-all", updated);
    setTodayEntries(updated.filter((e) => e.date === entry.date));

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleQuickCheck = (state: string) => {
    setSelectedState(state);
    const entry: PeaceEntry = {
      date: new Date().toISOString().split("T")[0],
      emotionalState: state,
      extremes: "",
      rumination: "",
      catastrophizing: "",
      management: "",
    };
    const allEntries = getStorageItem<PeaceEntry[]>("inner-peace-all") || [];
    const updated = [...allEntries, entry];
    setStorageItem("inner-peace-all", updated);
    setTodayEntries(updated.filter((e) => e.date === entry.date));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Inner Peace</h1>
            <p className="text-slate-300 italic mb-4">
              &ldquo;Equanimity is best maintained by managing emotional extremes so
              they do not manage you&rdquo; — Seneca
            </p>
            <p className="text-slate-400 text-sm">
              Reduce rumination and catastrophizing. Maintain emotional balance.
            </p>
          </header>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Quick Emotional Check-in
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {emotionalStates.map((state) => (
                <button
                  key={state.value}
                  type="button"
                  onClick={() => handleQuickCheck(state.value)}
                  className={`${state.color} text-white py-3 px-4 rounded-lg font-medium hover:opacity-80 transition-opacity text-sm`}
                >
                  {state.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Detailed Reflection
            </h2>
            <div className="space-y-6">
              <div>
                <div className="block text-sm font-medium text-slate-300 mb-2">
                  Current Emotional State
                </div>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {emotionalStates.map((state) => (
                    <button
                      key={state.value}
                      type="button"
                      onClick={() => setSelectedState(state.value)}
                      className={`py-2 px-3 rounded-lg font-medium text-sm transition-all ${
                        selectedState === state.value
                          ? `${state.color} text-white ring-2 ring-offset-2 ring-offset-slate-800 ring-white`
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      }`}
                    >
                      {state.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="extremes"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  What emotional extremes did you experience today?
                </label>
                <textarea
                  id="extremes"
                  value={extremes}
                  onChange={(e) => setExtremes(e.target.value)}
                  placeholder="Identify moments of emotional intensity..."
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label
                  htmlFor="rumination"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Instances of Rumination (repetitive negative thinking)
                </label>
                <textarea
                  id="rumination"
                  value={rumination}
                  onChange={(e) => setRumination(e.target.value)}
                  placeholder="Note when you found yourself stuck in repetitive thoughts..."
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label
                  htmlFor="catastrophizing"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Instances of Catastrophizing (imagining worst-case scenarios)
                </label>
                <textarea
                  id="catastrophizing"
                  value={catastrophizing}
                  onChange={(e) => setCatastrophizing(e.target.value)}
                  placeholder="Identify when you spiraled into worst-case thinking..."
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label
                  htmlFor="management"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  How did you manage these emotional states?
                </label>
                <textarea
                  id="management"
                  value={management}
                  onChange={(e) => setManagement(e.target.value)}
                  placeholder="Describe the strategies you used to maintain equanimity..."
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>

              <button
                type="button"
                onClick={handleSave}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                {saved ? "✓ Saved" : "Save Reflection"}
              </button>
            </div>
          </div>

          {todayEntries.length > 0 && (
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Today&apos;s Check-ins
              </h2>
              <div className="space-y-3">
                {todayEntries.map((entry, index) => (
                  <div
                    key={`${entry.date}-${index}-${entry.emotionalState}`}
                    className="bg-slate-900/50 border border-slate-700 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          emotionalStates.find((s) => s.value === entry.emotionalState)
                            ?.color || "bg-gray-500"
                        }`}
                      />
                      <span className="text-white font-medium">
                        {
                          emotionalStates.find((s) => s.value === entry.emotionalState)
                            ?.label
                        }
                      </span>
                      <span className="text-slate-400 text-sm">
                        {new Date().toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    {entry.management && (
                      <p className="text-slate-300 text-sm mt-2">
                        {entry.management}
                      </p>
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

