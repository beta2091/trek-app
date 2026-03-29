"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS, DIMENSIONS, type TrekDimension } from "@/lib/trek-data";

const SCALE_LABELS = [
  "Not at all",
  "Rarely",
  "Sometimes",
  "Often",
  "Almost always",
];

export default function QuestionnairePage() {
  const router = useRouter();
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const question = QUESTIONS[currentIndex];
  const totalQuestions = QUESTIONS.length;
  const progress = ((currentIndex) / totalQuestions) * 100;

  const currentDimension = useMemo(
    () => DIMENSIONS.find((d) => d.key === question.dimension)!,
    [question.dimension]
  );

  // Group questions by dimension to show dimension transitions
  const isNewDimension = useMemo(() => {
    if (currentIndex === 0) return true;
    return QUESTIONS[currentIndex - 1].dimension !== question.dimension;
  }, [currentIndex, question.dimension]);

  const [showDimensionIntro, setShowDimensionIntro] = useState(true);

  useEffect(() => {
    if (isNewDimension) {
      setShowDimensionIntro(true);
      const timer = setTimeout(() => setShowDimensionIntro(false), 2000);
      return () => clearTimeout(timer);
    } else {
      setShowDimensionIntro(false);
    }
  }, [isNewDimension, currentIndex]);

  const selectAnswer = useCallback(
    (value: number) => {
      setResponses((prev) => ({ ...prev, [question.id]: value }));
      // Auto-advance after selection
      setTimeout(() => {
        if (currentIndex < totalQuestions - 1) {
          setVisible(false);
          setTimeout(() => {
            setCurrentIndex((i) => i + 1);
            setVisible(true);
          }, 300);
        } else {
          // All done — go to results
          const allResponses = { ...responses, [question.id]: value };
          localStorage.setItem("trek-responses", JSON.stringify(allResponses));
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

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key >= "1" && e.key <= "5") {
        selectAnswer(parseInt(e.key));
      }
      if (e.key === "ArrowLeft" || e.key === "Backspace") {
        e.preventDefault();
        goBack();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectAnswer, goBack]);

  if (showDimensionIntro) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="animate-fade-in space-y-4">
          <span className="text-5xl">{currentDimension.icon}</span>
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{ color: currentDimension.color }}
          >
            {currentDimension.fullName}
          </h2>
          <p className="text-neutral-400 text-lg max-w-md mx-auto">
            {currentDimension.description}
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
              backgroundColor: currentDimension.color,
            }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-neutral-600">
          <span>
            {currentDimension.icon} {currentDimension.fullName}
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

          {/* Rating scale */}
          <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
            {SCALE_LABELS.map((label, i) => {
              const value = i + 1;
              const isSelected = responses[question.id] === value;
              return (
                <button
                  key={value}
                  onClick={() => selectAnswer(value)}
                  className={`flex items-center gap-4 px-5 py-3.5 rounded-lg border transition-all text-left ${
                    isSelected
                      ? "border-amber-500 bg-amber-500/10 text-amber-400"
                      : "border-neutral-800 hover:border-neutral-600 text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-mono shrink-0 ${
                      isSelected
                        ? "border-amber-500 bg-amber-500 text-black"
                        : "border-neutral-700"
                    }`}
                  >
                    {value}
                  </span>
                  <span className="text-sm">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Back nav */}
      {currentIndex > 0 && (
        <button
          onClick={goBack}
          className="fixed left-6 top-1/2 -translate-y-1/2 text-neutral-700 hover:text-neutral-400 transition-colors text-2xl"
          aria-label="Previous question"
        >
          &larr;
        </button>
      )}
    </main>
  );
}
