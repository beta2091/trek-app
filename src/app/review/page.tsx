"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  REVIEW_GRADE_AREAS,
  REVIEW_PROMPTS,
  type PostTrekReview,
} from "@/lib/trek-data";

type Step = "grades" | "reflections" | "retake" | "complete";

export default function ReviewPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("grades");

  const [review, setReview] = useState<PostTrekReview>({
    grades: {
      strongestFootprint: 0,
      timeTrade: 0,
      weakestFootprint1: 0,
      weakestFootprint2: 0,
      demon: 0,
      asTrekPartner: 0,
    },
    circleOfInfluence: "",
    knockoffs: "",
    discoveries: "",
    permanentChanges: "",
  });

  const allGraded = Object.values(review.grades).every((g) => g > 0);
  const allReflected =
    review.circleOfInfluence.trim() &&
    review.knockoffs.trim() &&
    review.discoveries.trim() &&
    review.permanentChanges.trim();

  function setGrade(key: keyof PostTrekReview["grades"], value: number) {
    setReview((r) => ({
      ...r,
      grades: { ...r.grades, [key]: value },
    }));
  }

  function saveReview() {
    localStorage.setItem("trek-review", JSON.stringify(review));
  }

  // Grades step
  if (step === "grades") {
    return (
      <main className="flex-1 flex flex-col px-6 py-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto w-full space-y-8">
          <div className="text-center space-y-2 animate-fade-in">
            <h1 className="text-3xl font-bold">Post-TREK Review</h1>
            <p className="text-neutral-400">
              Grade yourself 1-10 on each focus area. Be honest.
            </p>
          </div>

          <div className="space-y-6 animate-fade-in delay-200">
            {REVIEW_GRADE_AREAS.map((area) => (
              <div key={area.key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300 text-sm font-medium">
                    {area.label}
                  </span>
                  <span className="text-amber-500 font-mono text-sm">
                    {review.grades[area.key] || "—"}/10
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => setGrade(area.key, n)}
                      className={`flex-1 min-h-[44px] rounded text-xs font-mono transition-all ${
                        review.grades[area.key] === n
                          ? "bg-amber-500 text-black font-bold"
                          : review.grades[area.key] > 0 &&
                              n <= review.grades[area.key]
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-neutral-800 text-neutral-500 hover:bg-neutral-700"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4" style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom, 0px))" }}>
            <button
              onClick={() => setStep("reflections")}
              disabled={!allGraded}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                allGraded
                  ? "bg-amber-500 text-black hover:bg-amber-400"
                  : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
              }`}
            >
              Next: Reflections
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Reflections step
  if (step === "reflections") {
    return (
      <main className="flex-1 flex flex-col px-6 py-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto w-full space-y-8">
          <div className="text-center space-y-2 animate-fade-in">
            <h1 className="text-3xl font-bold">Reflect</h1>
            <p className="text-neutral-400">
              Take a moment to think deeply about your 28-day journey.
            </p>
          </div>

          <div className="space-y-6 animate-fade-in delay-200">
            {REVIEW_PROMPTS.map((prompt) => (
              <div key={prompt.key} className="space-y-2">
                <label className="text-neutral-300 text-sm font-medium block">
                  {prompt.prompt}
                </label>
                <textarea
                  value={review[prompt.key as keyof PostTrekReview] as string}
                  onChange={(e) =>
                    setReview((r) => ({
                      ...r,
                      [prompt.key]: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full px-4 py-3 bg-transparent border border-neutral-700 rounded-lg text-neutral-200 focus:border-amber-500 focus:outline-none transition-colors resize-none text-base"
                  placeholder="Take your time..."
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4" style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom, 0px))" }}>
            <button
              onClick={() => setStep("grades")}
              className="px-6 py-3 border border-neutral-800 rounded-lg text-neutral-400 hover:text-neutral-300 transition-all"
            >
              Back
            </button>
            <button
              onClick={() => {
                saveReview();
                setStep("retake");
              }}
              disabled={!allReflected}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                allReflected
                  ? "bg-amber-500 text-black hover:bg-amber-400"
                  : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
              }`}
            >
              Next: Retake Assessment
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Retake prompt
  if (step === "retake") {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-lg space-y-8 animate-fade-in">
          <h1 className="text-3xl font-bold">Retake Your Footprint</h1>
          <p className="text-neutral-400 text-lg">
            Now retake the Footprint Assessment to compare your before and after
            scores. See how 28 days of intentional living moved the needle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/questionnaire"
              className="px-8 py-4 bg-amber-500 text-black font-semibold rounded-lg text-lg hover:bg-amber-400 transition-all animate-pulse-glow"
            >
              Retake Footprint Assessment
            </Link>
            <Link
              href="/"
              className="px-6 py-4 border border-neutral-800 rounded-lg text-neutral-400 hover:text-neutral-300 transition-all"
            >
              Return Home
            </Link>
          </div>
          <p className="text-xs text-neutral-400">
            Rejoin your group and discuss in the next coaching session.
          </p>
        </div>
      </main>
    );
  }

  return null;
}
