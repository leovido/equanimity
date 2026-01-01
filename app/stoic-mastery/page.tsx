"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { getStorageItem, setStorageItem, getTodayKey } from "@/lib/storage";

interface MasteryEntry {
  date: string;
  presentMoment: string;
  externalDesires: string;
  selfControl: string;
  practice: string;
}

interface MasteryPractice {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

const practices: Omit<MasteryPractice, "completed">[] = [
  {
    id: "1",
    title: "Morning Intention",
    description:
      "Set an intention to remain present and not be controlled by external desires today.",
  },
  {
    id: "2",
    title: "Desire Awareness",
    description:
      "Notice when external desires arise. Acknowledge them without being controlled by them.",
  },
  {
    id: "3",
    title: "Present Moment Check",
    description:
      "Take three deep breaths and ground yourself in the present moment.",
  },
  {
    id: "4",
    title: "Evening Review",
    description:
      "Reflect on moments when you successfully maintained self-mastery.",
  },
];

export default function StoicMasteryPage() {
  const [presentMoment, setPresentMoment] = useState("");
  const [externalDesires, setExternalDesires] = useState("");
  const [selfControl, setSelfControl] = useState("");
  const [practice, setPractice] = useState("");
  const [completedPractices, setCompletedPractices] = useState<Set<string>>(
    new Set()
  );
  const [saved, setSaved] = useState(false);

  const todayKey = getTodayKey("stoic-mastery");
  const practicesKey = getTodayKey("stoic-practices");

  useEffect(() => {
    // Load today's entry
    const todayEntry = getStorageItem<MasteryEntry>(todayKey);
    if (todayEntry) {
      setPresentMoment(todayEntry.presentMoment || "");
      setExternalDesires(todayEntry.externalDesires || "");
      setSelfControl(todayEntry.selfControl || "");
      setPractice(todayEntry.practice || "");
    }

    // Load completed practices
    const completed = getStorageItem<string[]>(practicesKey);
    if (completed) {
      setCompletedPractices(new Set(completed));
    }
  }, [todayKey, practicesKey]);

  const handleSave = () => {
    const entry: MasteryEntry = {
      date: new Date().toISOString().split("T")[0],
      presentMoment,
      externalDesires,
      selfControl,
      practice,
    };
    setStorageItem(todayKey, entry);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const togglePractice = (id: string) => {
    const newCompleted = new Set(completedPractices);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompletedPractices(newCompleted);
    setStorageItem(practicesKey, Array.from(newCompleted));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Stoic Mastery
            </h1>
            <p className="text-slate-300 italic mb-4">
              "No man is free who is not master of himself" — Epictetus
            </p>
            <p className="text-slate-400 text-sm">
              Stop being managed by external desires. Inhabit the present moment.
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Daily Practices
              </h2>
              <div className="space-y-3">
                {practices.map((practiceItem) => (
                  <div
                    key={practiceItem.id}
                    className="bg-slate-900/50 border border-slate-700 rounded-lg p-4"
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={completedPractices.has(practiceItem.id)}
                        onChange={() => togglePractice(practiceItem.id)}
                        className="mt-1 w-5 h-5 text-slate-600 bg-slate-800 border-slate-600 rounded focus:ring-slate-500"
                      />
                      <div className="flex-1">
                        <h3
                          className={`font-medium mb-1 ${
                            completedPractices.has(practiceItem.id)
                              ? "text-slate-400 line-through"
                              : "text-white"
                          }`}
                        >
                          {practiceItem.title}
                        </h3>
                        <p className="text-sm text-slate-400">
                          {practiceItem.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Reflection
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="present-moment"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    How did you inhabit the present moment today?
                  </label>
                  <textarea
                    id="present-moment"
                    value={presentMoment}
                    onChange={(e) => setPresentMoment(e.target.value)}
                    placeholder="Reflect on moments of presence..."
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <label
                    htmlFor="external-desires"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    What external desires tried to manage you?
                  </label>
                  <textarea
                    id="external-desires"
                    value={externalDesires}
                    onChange={(e) => setExternalDesires(e.target.value)}
                    placeholder="Identify desires that attempted to control you..."
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <label
                    htmlFor="self-control"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    How did you exercise self-control?
                  </label>
                  <textarea
                    id="self-control"
                    value={selfControl}
                    onChange={(e) => setSelfControl(e.target.value)}
                    placeholder="Describe your acts of self-mastery..."
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <label
                    htmlFor="practice"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Additional Practice Notes
                  </label>
                  <textarea
                    id="practice"
                    value={practice}
                    onChange={(e) => setPractice(e.target.value)}
                    placeholder="Any other thoughts on your mastery practice..."
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none"
                    rows={3}
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
          </div>
        </div>
      </div>
    </div>
  );
}

