"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  FOOTPRINTS,
  ACTION_STEPS,
  calculateScores,
  getBestFootprint,
  getWorstFootprints,
  type Footprint,
  type TrekWorksheet,
} from "@/lib/trek-data";

type Step =
  | "names"
  | "dates"
  | "trade"
  | "reach"
  | "execute1"
  | "execute2"
  | "kill"
  | "summary";

const STEP_ORDER: Step[] = [
  "names",
  "dates",
  "trade",
  "reach",
  "execute1",
  "execute2",
  "kill",
  "summary",
];

const STEP_LABELS: Record<Step, string> = {
  names: "Trekkers",
  dates: "Dates",
  trade: "Trade",
  reach: "Reach",
  execute1: "Execute #1",
  execute2: "Execute #2",
  kill: "Kill",
  summary: "Your TREK",
};

function ActionStepPicker({
  footprint,
  selected,
  onSelect,
  label,
}: {
  footprint: Footprint;
  selected: string;
  onSelect: (step: string) => void;
  label: string;
}) {
  const steps = ACTION_STEPS[footprint];
  const [custom, setCustom] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  return (
    <div className="space-y-2">
      <p className="text-sm text-neutral-500">{label}</p>
      <div className="flex flex-wrap gap-2">
        {steps.map((step) => (
          <button
            key={step}
            onClick={() => onSelect(step)}
            className={`text-sm px-3 py-2 rounded-lg border transition-all ${
              selected === step
                ? "border-amber-500 bg-amber-500/10 text-amber-400"
                : "border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-neutral-300"
            }`}
          >
            {step}
          </button>
        ))}
        <button
          onClick={() => setShowCustom(!showCustom)}
          className={`text-sm px-3 py-2 rounded-lg border transition-all ${
            showCustom
              ? "border-amber-500 text-amber-400"
              : "border-neutral-800 text-neutral-600 hover:border-neutral-600"
          }`}
        >
          + Custom
        </button>
      </div>
      {showCustom && (
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="Be specific and observable..."
            className="flex-1 px-3 py-2 bg-transparent border border-neutral-700 rounded-lg text-sm text-neutral-200 focus:border-amber-500 focus:outline-none"
          />
          <button
            onClick={() => {
              if (custom.trim()) {
                onSelect(custom.trim());
                setShowCustom(false);
                setCustom("");
              }
            }}
            className="px-4 py-2 border border-neutral-700 rounded-lg text-sm text-neutral-400 hover:border-amber-500 hover:text-amber-500 transition-all"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}

export default function WorksheetPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("names");
  const [bestFp, setBestFp] = useState<Footprint>("faith");
  const [worstFps, setWorstFps] = useState<Footprint[]>(["fitness", "finance"]);

  const [worksheet, setWorksheet] = useState<TrekWorksheet>({
    trekkerName: "",
    trekPartnerName: "",
    startDate: "",
    endDate: "",
    timeTrade: { oldHabit: "", newHabit: "" },
    reach: { footprint: "faith", actionSteps: ["", ""] },
    execute: {
      footprint1: "fitness",
      actionSteps1: ["", ""],
      footprint2: "finance",
      actionSteps2: ["", ""],
    },
    kill: { demon: "", strategy: "" },
  });

  // Load scores from assessment to pre-fill best/worst
  useEffect(() => {
    const stored = localStorage.getItem("trek-responses");
    if (stored) {
      const responses = JSON.parse(stored);
      const scores = calculateScores(responses);
      const b = getBestFootprint(scores);
      const w = getWorstFootprints(scores, 2);
      setBestFp(b);
      setWorstFps(w);
      setWorksheet((prev) => ({
        ...prev,
        reach: { ...prev.reach, footprint: b },
        execute: {
          ...prev.execute,
          footprint1: w[0],
          footprint2: w[1],
        },
      }));
    }
  }, []);

  // Auto-calculate end date when start date changes
  useEffect(() => {
    if (worksheet.startDate) {
      const start = new Date(worksheet.startDate);
      start.setDate(start.getDate() + 28);
      setWorksheet((prev) => ({
        ...prev,
        endDate: start.toISOString().split("T")[0],
      }));
    }
  }, [worksheet.startDate]);

  const stepIndex = STEP_ORDER.indexOf(step);
  const progress = ((stepIndex + 1) / STEP_ORDER.length) * 100;

  const canProceed = useMemo(() => {
    switch (step) {
      case "names":
        return worksheet.trekkerName.trim() && worksheet.trekPartnerName.trim();
      case "dates":
        return worksheet.startDate;
      case "trade":
        return worksheet.timeTrade.oldHabit.trim() && worksheet.timeTrade.newHabit.trim();
      case "reach":
        return worksheet.reach.actionSteps[0] && worksheet.reach.actionSteps[1];
      case "execute1":
        return worksheet.execute.actionSteps1[0] && worksheet.execute.actionSteps1[1];
      case "execute2":
        return worksheet.execute.actionSteps2[0] && worksheet.execute.actionSteps2[1];
      case "kill":
        return worksheet.kill.demon.trim() && worksheet.kill.strategy.trim();
      case "summary":
        return true;
      default:
        return false;
    }
  }, [step, worksheet]);

  function goNext() {
    const next = STEP_ORDER[stepIndex + 1];
    if (next) setStep(next);
  }

  function goBack() {
    const prev = STEP_ORDER[stepIndex - 1];
    if (prev) setStep(prev);
  }

  function saveTrek() {
    localStorage.setItem("trek-worksheet", JSON.stringify(worksheet));
    router.push("/opt-in");
  }

  const bestInfo = FOOTPRINTS.find((f) => f.key === worksheet.reach.footprint)!;
  const worst1Info = FOOTPRINTS.find((f) => f.key === worksheet.execute.footprint1)!;
  const worst2Info = FOOTPRINTS.find((f) => f.key === worksheet.execute.footprint2)!;

  return (
    <main className="flex-1 flex flex-col px-6 py-8">
      {/* Progress */}
      <div className="w-full max-w-2xl mx-auto">
        <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-neutral-600">
          <span>TREK Worksheet</span>
          <span>{STEP_LABELS[step]}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
        {/* Step: Names */}
        {step === "names" && (
          <div className="space-y-8 w-full max-w-md animate-fade-in">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Never trek alone.</h2>
              <p className="text-neutral-500">
                You need a Trek Partner — someone to hold you accountable for 28
                days.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-neutral-500 block mb-1">
                  Your name
                </label>
                <input
                  type="text"
                  value={worksheet.trekkerName}
                  onChange={(e) =>
                    setWorksheet((w) => ({ ...w, trekkerName: e.target.value }))
                  }
                  className="w-full px-4 py-3 bg-transparent border border-neutral-700 rounded-lg text-neutral-200 focus:border-amber-500 focus:outline-none transition-colors"
                  placeholder="Trekker name"
                />
              </div>
              <div>
                <label className="text-sm text-neutral-500 block mb-1">
                  Trek Partner name
                </label>
                <input
                  type="text"
                  value={worksheet.trekPartnerName}
                  onChange={(e) =>
                    setWorksheet((w) => ({
                      ...w,
                      trekPartnerName: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-transparent border border-neutral-700 rounded-lg text-neutral-200 focus:border-amber-500 focus:outline-none transition-colors"
                  placeholder="Your accountability partner"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step: Dates */}
        {step === "dates" && (
          <div className="space-y-8 w-full max-w-md animate-fade-in">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Set your 28-day window.</h2>
              <p className="text-neutral-500">
                Pick a start date. Your TREK ends exactly 28 days later.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-neutral-500 block mb-1">
                  Start date
                </label>
                <input
                  type="date"
                  value={worksheet.startDate}
                  onChange={(e) =>
                    setWorksheet((w) => ({ ...w, startDate: e.target.value }))
                  }
                  className="w-full px-4 py-3 bg-transparent border border-neutral-700 rounded-lg text-neutral-200 focus:border-amber-500 focus:outline-none transition-colors"
                />
              </div>
              {worksheet.endDate && (
                <div className="text-center text-neutral-400">
                  <p className="text-sm">Your TREK ends on</p>
                  <p className="text-lg font-medium text-amber-500">
                    {new Date(worksheet.endDate + "T00:00:00").toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step: Trade */}
        {step === "trade" && (
          <div className="space-y-8 w-full max-w-md animate-fade-in">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">
                <span className="text-amber-500">T</span>rade
              </h2>
              <p className="text-neutral-500">
                Trade a less beneficial use of time for one that serves your
                core values.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-neutral-500 block mb-1">
                  Old habit (what you&apos;re giving up)
                </label>
                <input
                  type="text"
                  value={worksheet.timeTrade.oldHabit}
                  onChange={(e) =>
                    setWorksheet((w) => ({
                      ...w,
                      timeTrade: { ...w.timeTrade, oldHabit: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-3 bg-transparent border border-neutral-700 rounded-lg text-neutral-200 focus:border-amber-500 focus:outline-none transition-colors"
                  placeholder="e.g., Scrolling social media for 30 min before bed"
                />
              </div>
              <div className="flex justify-center">
                <span className="text-neutral-700 text-2xl">&darr;</span>
              </div>
              <div>
                <label className="text-sm text-neutral-500 block mb-1">
                  New habit (what you&apos;re replacing it with)
                </label>
                <input
                  type="text"
                  value={worksheet.timeTrade.newHabit}
                  onChange={(e) =>
                    setWorksheet((w) => ({
                      ...w,
                      timeTrade: { ...w.timeTrade, newHabit: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-3 bg-transparent border border-neutral-700 rounded-lg text-neutral-200 focus:border-amber-500 focus:outline-none transition-colors"
                  placeholder="e.g., Reading for 30 min before bed"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step: Reach (Best Footprint) */}
        {step === "reach" && (
          <div className="space-y-8 w-full max-w-lg animate-fade-in">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">
                <span className="text-amber-500">R</span>each
              </h2>
              <p className="text-neutral-500">
                Your strongest Footprint. Create 2 action steps to reach maximum
                performance.
              </p>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg border border-green-500/20 bg-green-500/5">
              <span className="text-2xl">{bestInfo.icon}</span>
              <div>
                <p className="font-semibold" style={{ color: bestInfo.color }}>
                  {bestInfo.fullName}
                </p>
                <p className="text-xs text-neutral-500">
                  Your strongest Footprint
                </p>
              </div>
            </div>

            <ActionStepPicker
              footprint={worksheet.reach.footprint}
              selected={worksheet.reach.actionSteps[0]}
              onSelect={(s) =>
                setWorksheet((w) => ({
                  ...w,
                  reach: {
                    ...w.reach,
                    actionSteps: [s, w.reach.actionSteps[1]],
                  },
                }))
              }
              label="Action Step 1"
            />
            <ActionStepPicker
              footprint={worksheet.reach.footprint}
              selected={worksheet.reach.actionSteps[1]}
              onSelect={(s) =>
                setWorksheet((w) => ({
                  ...w,
                  reach: {
                    ...w.reach,
                    actionSteps: [w.reach.actionSteps[0], s],
                  },
                }))
              }
              label="Action Step 2"
            />
          </div>
        )}

        {/* Step: Execute #1 (Worst Footprint 1) */}
        {step === "execute1" && (
          <div className="space-y-8 w-full max-w-lg animate-fade-in">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">
                <span className="text-amber-500">E</span>xecute — Footprint #1
              </h2>
              <p className="text-neutral-500">
                Your weakest Footprint. Create 2 action steps and execute them.
              </p>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg border border-red-500/20 bg-red-500/5">
              <span className="text-2xl">{worst1Info.icon}</span>
              <div>
                <p
                  className="font-semibold"
                  style={{ color: worst1Info.color }}
                >
                  {worst1Info.fullName}
                </p>
                <p className="text-xs text-neutral-500">Needs most attention</p>
              </div>
            </div>

            <ActionStepPicker
              footprint={worksheet.execute.footprint1}
              selected={worksheet.execute.actionSteps1[0]}
              onSelect={(s) =>
                setWorksheet((w) => ({
                  ...w,
                  execute: {
                    ...w.execute,
                    actionSteps1: [s, w.execute.actionSteps1[1]],
                  },
                }))
              }
              label="Action Step 1"
            />
            <ActionStepPicker
              footprint={worksheet.execute.footprint1}
              selected={worksheet.execute.actionSteps1[1]}
              onSelect={(s) =>
                setWorksheet((w) => ({
                  ...w,
                  execute: {
                    ...w.execute,
                    actionSteps1: [w.execute.actionSteps1[0], s],
                  },
                }))
              }
              label="Action Step 2"
            />
          </div>
        )}

        {/* Step: Execute #2 (Worst Footprint 2) */}
        {step === "execute2" && (
          <div className="space-y-8 w-full max-w-lg animate-fade-in">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">
                <span className="text-amber-500">E</span>xecute — Footprint #2
              </h2>
              <p className="text-neutral-500">
                Your second weakest Footprint. Create 2 more action steps.
              </p>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg border border-red-500/20 bg-red-500/5">
              <span className="text-2xl">{worst2Info.icon}</span>
              <div>
                <p
                  className="font-semibold"
                  style={{ color: worst2Info.color }}
                >
                  {worst2Info.fullName}
                </p>
                <p className="text-xs text-neutral-500">Needs attention</p>
              </div>
            </div>

            <ActionStepPicker
              footprint={worksheet.execute.footprint2}
              selected={worksheet.execute.actionSteps2[0]}
              onSelect={(s) =>
                setWorksheet((w) => ({
                  ...w,
                  execute: {
                    ...w.execute,
                    actionSteps2: [s, w.execute.actionSteps2[1]],
                  },
                }))
              }
              label="Action Step 1"
            />
            <ActionStepPicker
              footprint={worksheet.execute.footprint2}
              selected={worksheet.execute.actionSteps2[1]}
              onSelect={(s) =>
                setWorksheet((w) => ({
                  ...w,
                  execute: {
                    ...w.execute,
                    actionSteps2: [w.execute.actionSteps2[0], s],
                  },
                }))
              }
              label="Action Step 2"
            />
          </div>
        )}

        {/* Step: Kill */}
        {step === "kill" && (
          <div className="space-y-8 w-full max-w-md animate-fade-in">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">
                <span className="text-amber-500">K</span>ill
              </h2>
              <p className="text-neutral-500">
                Identify a demon in your life and create a gameplan to kill it in
                28 days.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-neutral-500 block mb-1">
                  Your demon
                </label>
                <input
                  type="text"
                  value={worksheet.kill.demon}
                  onChange={(e) =>
                    setWorksheet((w) => ({
                      ...w,
                      kill: { ...w.kill, demon: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-3 bg-transparent border border-neutral-700 rounded-lg text-neutral-200 focus:border-amber-500 focus:outline-none transition-colors"
                  placeholder="e.g., Procrastination, negative self-talk, poor diet..."
                />
              </div>
              <div>
                <label className="text-sm text-neutral-500 block mb-1">
                  Strategy to kill it
                </label>
                <textarea
                  value={worksheet.kill.strategy}
                  onChange={(e) =>
                    setWorksheet((w) => ({
                      ...w,
                      kill: { ...w.kill, strategy: e.target.value },
                    }))
                  }
                  rows={4}
                  className="w-full px-4 py-3 bg-transparent border border-neutral-700 rounded-lg text-neutral-200 focus:border-amber-500 focus:outline-none transition-colors resize-none"
                  placeholder="Be specific: what will you do daily to eliminate this demon?"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step: Summary */}
        {step === "summary" && (
          <div className="space-y-8 w-full max-w-lg animate-fade-in">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Your TREK Plan</h2>
              <p className="text-neutral-500">
                {worksheet.trekkerName} &amp; {worksheet.trekPartnerName} &middot;{" "}
                28 days
              </p>
            </div>

            <div className="space-y-4">
              {/* Trade */}
              <div className="border border-neutral-800 rounded-xl p-4 space-y-2">
                <h3 className="text-amber-500 font-semibold">T — Trade</h3>
                <p className="text-neutral-400 text-sm">
                  <span className="text-red-400 line-through">
                    {worksheet.timeTrade.oldHabit}
                  </span>{" "}
                  &rarr;{" "}
                  <span className="text-green-400">
                    {worksheet.timeTrade.newHabit}
                  </span>
                </p>
              </div>

              {/* Reach */}
              <div className="border border-neutral-800 rounded-xl p-4 space-y-2">
                <h3 className="text-amber-500 font-semibold">
                  R — Reach ({bestInfo.fullName} {bestInfo.icon})
                </h3>
                <ul className="text-neutral-400 text-sm space-y-1">
                  {worksheet.reach.actionSteps.map((s, i) => (
                    <li key={i}>• {s}</li>
                  ))}
                </ul>
              </div>

              {/* Execute */}
              <div className="border border-neutral-800 rounded-xl p-4 space-y-2">
                <h3 className="text-amber-500 font-semibold">
                  E — Execute ({worst1Info.fullName} {worst1Info.icon} &amp;{" "}
                  {worst2Info.fullName} {worst2Info.icon})
                </h3>
                <p className="text-xs text-neutral-600">{worst1Info.fullName}:</p>
                <ul className="text-neutral-400 text-sm space-y-1">
                  {worksheet.execute.actionSteps1.map((s, i) => (
                    <li key={i}>• {s}</li>
                  ))}
                </ul>
                <p className="text-xs text-neutral-600 mt-2">{worst2Info.fullName}:</p>
                <ul className="text-neutral-400 text-sm space-y-1">
                  {worksheet.execute.actionSteps2.map((s, i) => (
                    <li key={i}>• {s}</li>
                  ))}
                </ul>
              </div>

              {/* Kill */}
              <div className="border border-neutral-800 rounded-xl p-4 space-y-2">
                <h3 className="text-amber-500 font-semibold">K — Kill</h3>
                <p className="text-neutral-400 text-sm">
                  <span className="font-medium text-neutral-300">Demon:</span>{" "}
                  {worksheet.kill.demon}
                </p>
                <p className="text-neutral-400 text-sm">
                  <span className="font-medium text-neutral-300">Strategy:</span>{" "}
                  {worksheet.kill.strategy}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="max-w-2xl mx-auto w-full flex justify-between mt-8 pb-4">
        {stepIndex > 0 ? (
          <button
            onClick={goBack}
            className="px-6 py-3 border border-neutral-800 rounded-lg text-neutral-500 hover:text-neutral-300 transition-all"
          >
            Back
          </button>
        ) : (
          <div />
        )}
        {step === "summary" ? (
          <button
            onClick={saveTrek}
            className="px-8 py-3 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition-all"
          >
            Save &amp; Begin TREK
          </button>
        ) : (
          <button
            onClick={goNext}
            disabled={!canProceed}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              canProceed
                ? "bg-amber-500 text-black hover:bg-amber-400"
                : "bg-neutral-800 text-neutral-600 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        )}
      </div>
    </main>
  );
}
