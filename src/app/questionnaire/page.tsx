"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  QUESTIONS,
  FOOTPRINTS,
  ANSWER_OPTIONS,
  type Footprint,
} from "@/lib/trek-data";

export default function QuestionnairePage() {
  const router = useRouter();
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const question = QUESTIONS[currentIndex];
  const totalQuestions = QUESTIONS.length;
  const progress = (currentIndex / totalQuestions) * 100;

  const currentFootprint = useMemo(
    () => FOOTPRINTS.find((f) => f.key === question.footprint)!,
    [question.footprint]
  );

  const isNewFootprint = useMemo(() => {
    if (currentIndex === 0) return true;
    return QUESTIONS[currentIndex - 1].footprint !== question.footprint;
  }, [currentIndex, question.footprint]);

  const [showFootprintIntro, setShowFootprintIntro] = useState(true);

  useEffect(() => {
    if (isNewFootprint) {
      setShowFootprintIntro(true);
      const timer = setTimeout(() => setShowFootprintIntro(false), 2000);
      return () => clearTimeout(timer);
    } else {
      setShowFootprintIntro(false);
    }
  }, [isNewFootprint, currentIndex]);

  const selectAnswer = useCallback(
    (value: number) => {
      setResponses((prev) => ({ ...prev, [question.id]: value }));
      setTimeout(() => {
        if (currentIndex < totalQuestions - 1) {
          setVisible(false);
          setTimeout(() => {
            setCurrentIndex((i) => i + 1);
            setVisible(true);
          }, 300);
        } else {
          const allResponses = { ...responses, [question.id]: value };
          localStorage.setItem(
            "trek-responses",
            JSON.stringify(allResponses)
          );
          router.push("/results");
        }
      }, 400);
    },
    [currentIndex, totalQuestions, question.id, responses, router]
  );

  const goBack = useCallback(() => {
    if (currentIndex === 0) return;
    setVisible(false);
    setTimeout(() => {
      setCurrentIndex((i) => i - 1);
      setVisible(true);
    }, 300);
  }, [currentIndex]);

  // Keyboard shortcuts: 1=Yes, 2=Sometimes, 3=No
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "1") selectAnswer(4);
      if (e.key === "2") selectAnswer(2);
      if (e.key === "3") selectAnswer(0);
      if (e.key === "ArrowLeft" || e.key === "Backspace") {
        e.preventDefault();
        goBack();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectAnswer, goBack]);

  // Footprint question count (e.g. "3 of 5")
  const footprintQuestions = QUESTIONS.filter(
    (q) => q.footprint === question.footprint
  );
  const questionInFootprint =
    footprintQuestions.findIndex((q) => q.id === question.id) + 1;

  if (showFootprintIntro) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="animate-fade-in space-y-4">
          <span className="text-5xl">{currentFootprint.icon}</span>
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{ color: currentFootprint.color }}
          >
            {currentFootprint.fullName}
          </h2>
          <p className="text-neutral-400 text-lg max-w-md mx-auto">
            {currentFootprint.description}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col px-6">
      {/* Progress bar */}
      <div className="w-full max-w-2xl mx-auto mt-8">
        <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progress}%`,
              backgroundColor: currentFootprint.color,
            }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-neutral-400">
          <span>
            {currentFootprint.icon} {currentFootprint.fullName} &middot;{" "}
            {questionInFootprint} of 5
          </span>
          <span>
            {currentIndex + 1} / {totalQuestions}
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
        <div
          className={`transition-opacity duration-300 w-full ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-xl md:text-2xl font-light leading-relaxed text-center mb-12">
            {question.text}
          </p>

          {/* Answer options: Yes / Sometimes / No */}
          <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
            {ANSWER_OPTIONS.map((option, i) => {
              const isSelected = responses[question.id] === option.value;
              const colors: Record<number, { border: string; bg: string; text: string }> = {
                4: { border: "border-green-500", bg: "bg-green-500/10", text: "text-green-400" },
                2: { border: "border-amber-500", bg: "bg-amber-500/10", text: "text-amber-400" },
                0: { border: "border-red-500", bg: "bg-red-500/10", text: "text-red-400" },
              };
              const c = colors[option.value];
              return (
                <button
                  key={option.value}
                  onClick={() => selectAnswer(option.value)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-lg border transition-all text-left ${
                    isSelected
                      ? `${c.border} ${c.bg} ${c.text}`
                      : "border-neutral-800 hover:border-neutral-600 text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-mono shrink-0 ${
                      isSelected
                        ? `${c.border} ${c.text}`
                        : "border-neutral-700"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="text-base font-medium">{option.label}</span>
                </button>
              );
            })}
          </div>

          <p className="text-xs text-neutral-500 text-center mt-6">
            Press 1, 2, or 3 to answer
          </p>
        </div>
      </div>

      {/* Back nav */}
      {currentIndex > 0 && (
        <button
          onClick={goBack}
          className="fixed top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center text-neutral-500 hover:text-neutral-400 transition-colors text-2xl"
          style={{ left: "calc(1.5rem + env(safe-area-inset-left, 0px))" }}
          aria-label="Previous question"
        >
          &larr;
        </button>
      )}
    </main>
  );
}
