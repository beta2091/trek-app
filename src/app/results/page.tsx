"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DIMENSIONS,
  calculateScores,
  getRecommendations,
  type TrekScores,
  type Recommendation,
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
            {score.toFixed(1)}
          </span>
        </div>
      </div>
      <span className="text-sm text-neutral-400">{label}</span>
    </div>
  );
}

function OverallScore({ score }: { score: number }) {
  const [animated, setAnimated] = useState(0);
  const percentage = (score / 5) * 100;

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
            {score.toFixed(1)}
          </span>
          <span className="text-xs text-neutral-500">/ 5.0</span>
        </div>
      </div>
      <span className="text-neutral-400 font-medium">Overall TREK Score</span>
    </div>
  );
}

function RecommendationCard({ rec }: { rec: Recommendation }) {
  const dim = DIMENSIONS.find((d) => d.key === rec.dimension)!;
  return (
    <div className="border border-neutral-800 rounded-xl p-6 space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{dim.icon}</span>
        <h3 className="text-lg font-semibold" style={{ color: dim.color }}>
          {rec.title}
        </h3>
      </div>
      <p className="text-neutral-400 leading-relaxed">{rec.body}</p>
    </div>
  );
}

export default function ResultsPage() {
  const router = useRouter();
  const [scores, setScores] = useState<TrekScores | null>(null);
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [showRecs, setShowRecs] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("trek-responses");
    if (!stored) {
      router.push("/");
      return;
    }
    const responses = JSON.parse(stored);
    const s = calculateScores(responses);
    setScores(s);
    setRecs(getRecommendations(s));
    setTimeout(() => setShowRecs(true), 1500);
  }, [router]);

  if (!scores) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="animate-pulse text-neutral-500">
          Calculating your results...
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col items-center px-6 py-12 overflow-y-auto">
      <div className="max-w-2xl w-full mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold">Your TREK Results</h1>
          <p className="text-neutral-500">
            Here&apos;s where you stand. No judgment — just clarity.
          </p>
        </div>

        {/* Overall Score */}
        <div className="flex justify-center animate-fade-in delay-200">
          <OverallScore score={scores.overall} />
        </div>

        {/* Dimension Scores */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center animate-fade-in delay-400">
          {DIMENSIONS.map((dim) => (
            <ScoreRing
              key={dim.key}
              score={scores[dim.key]}
              maxScore={5}
              color={dim.color}
              label={dim.fullName}
              icon={dim.icon}
            />
          ))}
        </div>

        {/* Score Bar Chart */}
        <div className="space-y-4 animate-fade-in delay-600">
          {DIMENSIONS.map((dim) => {
            const score = scores[dim.key];
            const pct = (score / 5) * 100;
            return (
              <div key={dim.key} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">
                    {dim.icon} {dim.fullName}
                  </span>
                  <span style={{ color: dim.color }}>
                    {score.toFixed(1)} / 5.0
                  </span>
                </div>
                <div className="h-3 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: dim.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Recommendations */}
        {showRecs && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">
                Your Top Areas to Focus On
              </h2>
              <p className="text-neutral-500 mt-1">
                Start here. Small, intentional moves compound over time.
              </p>
            </div>

            <div className="space-y-4">
              {recs.map((rec) => (
                <RecommendationCard key={rec.dimension} rec={rec} />
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 pb-8 animate-fade-in delay-800">
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: "My TREK Score",
                  text: `My TREK score is ${scores.overall.toFixed(
                    1
                  )}/5.0. T:${scores.tribe.toFixed(
                    1
                  )} R:${scores.resilience.toFixed(
                    1
                  )} E:${scores.energy.toFixed(
                    1
                  )} K:${scores.knowledge.toFixed(1)}`,
                });
              } else {
                navigator.clipboard.writeText(
                  `My TREK score: ${scores.overall.toFixed(
                    1
                  )}/5.0 | T:${scores.tribe.toFixed(
                    1
                  )} R:${scores.resilience.toFixed(
                    1
                  )} E:${scores.energy.toFixed(
                    1
                  )} K:${scores.knowledge.toFixed(1)}`
                );
                alert("Score copied to clipboard!");
              }
            }}
            className="px-6 py-3 border border-neutral-700 rounded-lg text-neutral-300 hover:border-amber-500 hover:text-amber-500 transition-all"
          >
            Share Results
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-neutral-800 rounded-lg text-neutral-500 hover:text-neutral-300 transition-all text-center"
          >
            Retake TREK
          </Link>
        </div>
      </div>
    </main>
  );
}
