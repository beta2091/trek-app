"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FOOTPRINTS,
  calculateScores,
  getBestFootprint,
  getWorstFootprints,
  ACTION_STEPS,
  type FootprintScores,
  type Footprint,
} from "@/lib/trek-data";

function ScoreRing({
  score,
  maxScore,
  color,
  size = 120,
  label,
  icon,
}: {
  score: number;
  maxScore: number;
  color: string;
  size?: number;
  label: string;
  icon: string;
}) {
  const [animated, setAnimated] = useState(0);
  const percentage = (score / maxScore) * 100;
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animated / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(percentage), 300);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#262626"
            strokeWidth="8"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg">{icon}</span>
          <span className="text-lg font-bold" style={{ color }}>
            {score}
          </span>
          <span className="text-[10px] text-neutral-400">/ {maxScore}</span>
        </div>
      </div>
      <span className="text-sm text-neutral-400">{label}</span>
    </div>
  );
}

function OverallScore({ percentage }: { percentage: number }) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(percentage), 500);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-40 h-40">
        <svg width={160} height={160} className="-rotate-90">
          <circle
            cx={80}
            cy={80}
            r={68}
            fill="none"
            stroke="#262626"
            strokeWidth="10"
          />
          <circle
            cx={80}
            cy={80}
            r={68}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 68}
            strokeDashoffset={
              2 * Math.PI * 68 - (animated / 100) * 2 * Math.PI * 68
            }
            className="transition-all duration-1500 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-amber-500">
            {percentage}%
          </span>
          <span className="text-xs text-neutral-400">Footprint Score</span>
        </div>
      </div>
    </div>
  );
}

function FootprintHighlight({
  type,
  footprint,
  score,
}: {
  type: "best" | "worst";
  footprint: Footprint;
  score: number;
}) {
  const fp = FOOTPRINTS.find((f) => f.key === footprint)!;
  const steps = ACTION_STEPS[footprint];
  const borderColor = type === "best" ? "border-green-500/30" : "border-red-500/30";

  return (
    <div className={`border ${borderColor} rounded-xl p-6 space-y-3`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{fp.icon}</span>
          <div>
            <h3 className="text-lg font-semibold" style={{ color: fp.color }}>
              {fp.fullName}
            </h3>
            <p className="text-xs text-neutral-400">
              {type === "best" ? "Your strongest" : "Needs attention"} &middot;{" "}
              {score}/20
            </p>
          </div>
        </div>
        <span
          className={`text-sm font-mono px-2 py-1 rounded ${
            type === "best"
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {Math.round((score / 20) * 100)}%
        </span>
      </div>
      <div className="space-y-1">
        <p className="text-xs text-neutral-400 uppercase tracking-wide">
          Suggested action steps
        </p>
        <div className="flex flex-wrap gap-2">
          {steps.slice(0, 4).map((step) => (
            <span
              key={step}
              className="text-xs px-2 py-1 rounded-full border border-neutral-800 text-neutral-400"
            >
              {step}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const router = useRouter();
  const [scores, setScores] = useState<FootprintScores | null>(null);
  const [best, setBest] = useState<Footprint | null>(null);
  const [worst, setWorst] = useState<Footprint[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("trek-responses");
    if (!stored) {
      router.push("/");
      return;
    }
    const responses = JSON.parse(stored);
    const s = calculateScores(responses);
    setScores(s);
    setBest(getBestFootprint(s));
    setWorst(getWorstFootprints(s, 2));
    setTimeout(() => setShowDetails(true), 1500);
  }, [router]);

  if (!scores) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="animate-pulse text-neutral-400">
          Calculating your Footprint...
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col items-center px-6 py-12 overflow-y-auto">
      <div className="max-w-2xl w-full mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold">
            Your Footprint Assessment
          </h1>
          <p className="text-neutral-400">
            Here&apos;s where you stand. No judgment — just clarity.
          </p>
        </div>

        {/* Overall Score */}
        <div className="flex justify-center animate-fade-in delay-200">
          <OverallScore percentage={scores.percentage} />
        </div>

        {/* Footprint Scores */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 justify-items-center animate-fade-in delay-400">
          {FOOTPRINTS.map((fp) => (
            <ScoreRing
              key={fp.key}
              score={scores[fp.key]}
              maxScore={20}
              color={fp.color}
              label={fp.fullName}
              icon={fp.icon}
              size={100}
            />
          ))}
        </div>

        {/* Bar Chart */}
        <div className="space-y-4 animate-fade-in delay-600">
          {FOOTPRINTS.map((fp) => {
            const score = scores[fp.key];
            const pct = (score / 20) * 100;
            return (
              <div key={fp.key} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">
                    {fp.icon} {fp.fullName}
                  </span>
                  <span style={{ color: fp.color }}>
                    {score} / 20
                  </span>
                </div>
                <div className="h-3 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: fp.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Best & Worst Highlights */}
        {showDetails && best && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Your TREK Focus Areas</h2>
              <p className="text-neutral-400 mt-1">
                Reach higher with your best. Execute on your weakest.
              </p>
            </div>

            <FootprintHighlight
              type="best"
              footprint={best}
              score={scores[best]}
            />
            {worst.map((w) => (
              <FootprintHighlight
                key={w}
                type="worst"
                footprint={w}
                score={scores[w]}
              />
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fade-in delay-800" style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom, 0px))" }}>
          <Link
            href="/worksheet"
            className="px-6 py-3 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition-all text-center animate-pulse-glow"
          >
            Start Your 28-Day TREK
          </Link>
          <button
            onClick={() => {
              const text = `My Footprint Score: ${scores.percentage}% | ${FOOTPRINTS.map(
                (fp) => `${fp.fullName}: ${scores[fp.key]}/20`
              ).join(" | ")}`;
              if (navigator.share) {
                navigator.share({ title: "My Footprint Score", text });
              } else {
                navigator.clipboard.writeText(text);
                alert("Score copied to clipboard!");
              }
            }}
            className="px-6 py-3 border border-neutral-700 rounded-lg text-neutral-300 hover:border-amber-500 hover:text-amber-500 transition-all"
          >
            Share Results
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-neutral-800 rounded-lg text-neutral-400 hover:text-neutral-300 transition-all text-center"
          >
            Retake Assessment
          </Link>
        </div>
      </div>
    </main>
  );
}
