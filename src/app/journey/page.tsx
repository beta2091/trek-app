"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

// ── Phases of the emotional uphill ──────────────────────────────────

type Phase = "settle" | "breathe" | "narrative" | "commit";

// ── Narrative slides ────────────────────────────────────────────────

interface Slide {
  text: string;
  subtext?: string;
  emphasis?: boolean; // renders larger, bolder
  interactive?: "days-counter"; // special interactive slide
}

const SLIDES: Slide[] = [
  {
    text: "Think about the last year of your life.",
    subtext: "The highs. The lows. The ordinary days in between.",
  },
  {
    text: "Now think about the man you were twelve months ago.",
    subtext: "Has he grown? Or has he stayed the same?",
  },
  {
    text: "Here\u2019s a hard truth most people avoid:",
  },
  {
    text: "You will not get unlimited chances to become who you\u2019re meant to be.",
    emphasis: true,
  },
  {
    text: "Your time is finite.",
    subtext: "The average man lives about 28,000 days.",
    interactive: "days-counter",
  },
  {
    text: "This isn\u2019t meant to scare you.",
    subtext: "It\u2019s meant to wake you up.",
  },
  {
    text: "Because life \u2014 when you really see it \u2014 is sacred.",
    emphasis: true,
  },
  {
    text: "Every relationship you build matters.",
    subtext: "Every challenge you face shapes you.",
  },
  {
    text: "Every morning you wake up is another chance to move the needle.",
  },
  {
    text: "The men who change their lives aren\u2019t superhuman.",
    subtext: "They just decided to be honest about where they are.",
  },
  {
    text: "That\u2019s what TREK is.",
    subtext:
      "A 28-day journey across five Footprints of your life \u2014 Faith, Family, Fitness, Finance, and Fulfillment.",
  },
  {
    text: "No judgment. No grades. Just clarity.",
    subtext: "Answer from the gut. The only wrong answer is a dishonest one.",
  },
];

// ── Breathing component ─────────────────────────────────────────────

function BreathingExercise({ onComplete }: { onComplete: () => void }) {
  const [breathCount, setBreathCount] = useState(0);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [opacity, setOpacity] = useState(1);
  const [mounted, setMounted] = useState(false);
  const totalBreaths = 3;

  // Start small, then trigger first inhale expansion via CSS transition
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (breathCount >= totalBreaths) {
      // Fade out, then complete
      const fadeTimer = setTimeout(() => setOpacity(0), 200);
      const doneTimer = setTimeout(onComplete, 1000);
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(doneTimer);
      };
    }

    // Breathing cycle: 4s inhale, 2s hold, 4s exhale
    let timer: NodeJS.Timeout;

    if (phase === "inhale") {
      timer = setTimeout(() => setPhase("hold"), 4000);
    } else if (phase === "hold") {
      timer = setTimeout(() => setPhase("exhale"), 2000);
    } else {
      timer = setTimeout(() => {
        setBreathCount((c) => c + 1);
        setPhase("inhale");
      }, 4000);
    }

    return () => clearTimeout(timer);
  }, [phase, breathCount, onComplete, totalBreaths]);

  const expanded = mounted && (phase === "inhale" || phase === "hold");
  const circleScale = expanded ? "scale-100" : "scale-50";
  const circleDuration =
    phase === "inhale"
      ? "duration-[4000ms]"
      : phase === "hold"
        ? "duration-[2000ms]"
        : "duration-[4000ms]";

  const label =
    phase === "inhale"
      ? "Breathe in\u2026"
      : phase === "hold"
        ? "Hold\u2026"
        : "Breathe out\u2026";

  return (
    <div
      className="flex flex-col items-center justify-center gap-12 transition-opacity duration-700"
      style={{ opacity }}
    >
      {/* Breathing circle */}
      <div className="relative flex items-center justify-center w-48 h-48">
        <div
          className={`absolute w-48 h-48 rounded-full border border-amber-500/30 bg-amber-500/5 transition-transform ease-in-out ${circleDuration} ${circleScale}`}
          style={{ transformOrigin: "center" }}
        />
        <div
          className={`absolute w-32 h-32 rounded-full border border-amber-500/20 bg-amber-500/10 transition-transform ease-in-out ${circleDuration} ${circleScale}`}
        />
      </div>

      <div className="space-y-3 text-center">
        <p className="text-2xl md:text-3xl font-light text-neutral-200 transition-all duration-500">
          {label}
        </p>
        <p className="text-sm text-neutral-600">
          {breathCount + 1} of {totalBreaths}
        </p>
      </div>
    </div>
  );
}

// ── Days counter interactive element ────────────────────────────────

function DaysCounter() {
  const [age, setAge] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (age !== null && !showResult) {
      const timer = setTimeout(() => setShowResult(true), 400);
      return () => clearTimeout(timer);
    }
  }, [age, showResult]);

  const daysLived = age !== null ? Math.round(age * 365.25) : 0;
  const daysRemaining = age !== null ? Math.max(0, 28000 - daysLived) : 0;
  const percentUsed = age !== null ? Math.min(100, (daysLived / 28000) * 100) : 0;

  return (
    <div className="mt-8 space-y-6" onClick={(e) => e.stopPropagation()}>
      {age === null ? (
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <p className="text-neutral-500 text-sm">How old are you?</p>
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="number"
              min={10}
              max={100}
              placeholder="Age"
              className="w-20 px-4 py-3 bg-transparent border border-neutral-700 rounded-lg text-center text-xl text-neutral-200 focus:border-amber-500 focus:outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const val = parseInt((e.target as HTMLInputElement).value);
                  if (val >= 10 && val <= 100) {
                    setAge(val);
                  }
                }
                e.stopPropagation();
              }}
            />
            <button
              onClick={() => {
                const val = parseInt(inputRef.current?.value || "0");
                if (val >= 10 && val <= 100) setAge(val);
              }}
              className="px-4 py-3 border border-neutral-700 rounded-lg text-neutral-400 hover:border-amber-500 hover:text-amber-500 transition-all text-sm"
            >
              Enter
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`space-y-4 transition-opacity duration-700 ${showResult ? "opacity-100" : "opacity-0"}`}
        >
          {/* Progress bar of life */}
          <div className="max-w-xs mx-auto">
            <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${percentUsed}%` }}
              />
            </div>
          </div>
          <p className="text-amber-500 text-lg font-medium">
            {daysLived.toLocaleString()} days spent
          </p>
          <p className="text-neutral-500 text-sm">
            ~{daysRemaining.toLocaleString()} remaining
          </p>
        </div>
      )}
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────────

export default function JourneyPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("settle");
  const [slideIndex, setSlideIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const slide = SLIDES[slideIndex];
  const isLastSlide = slideIndex === SLIDES.length - 1;

  // Background gradient shifts as we progress through the narrative
  const narrativeProgress = slideIndex / Math.max(1, SLIDES.length - 1);
  const bgStyle =
    phase === "narrative" || phase === "commit"
      ? {
          background: `radial-gradient(ellipse at 50% 50%, rgba(245, 158, 11, ${0.03 + narrativeProgress * 0.04}) 0%, #0a0a0a 70%)`,
          transition: "background 1.5s ease",
        }
      : {};

  const goNext = useCallback(() => {
    if (isLastSlide) {
      setPhase("commit");
      return;
    }
    setVisible(false);
    setTimeout(() => {
      setSlideIndex((s) => s + 1);
      setVisible(true);
    }, 500);
  }, [isLastSlide]);

  const goPrev = useCallback(() => {
    if (slideIndex === 0) return;
    setVisible(false);
    setTimeout(() => {
      setSlideIndex((s) => s - 1);
      setVisible(true);
    }, 500);
  }, [slideIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (phase !== "narrative") return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        goNext();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, goNext, goPrev]);

  // ── Phase: Settle ──────────────────────────────────────────────

  if (phase === "settle") {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-lg space-y-8">
          <p className="text-2xl md:text-3xl font-light text-neutral-300 animate-fade-in">
            Find a quiet place.
          </p>
          <p className="text-lg text-neutral-500 animate-fade-in-slow delay-400">
            Put your phone on silent. Close the other tabs.
            <br />
            Give yourself the next 10 minutes.
          </p>
          <button
            onClick={() => setPhase("breathe")}
            className="animate-fade-in delay-800 mt-6 px-8 py-4 border border-neutral-700 text-neutral-300 rounded-lg text-lg hover:border-amber-500 hover:text-amber-500 transition-all"
          >
            I&apos;m ready
          </button>
        </div>
      </main>
    );
  }

  // ── Phase: Breathing exercise ──────────────────────────────────

  if (phase === "breathe") {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <BreathingExercise onComplete={() => setPhase("narrative")} />
      </main>
    );
  }

  // ── Phase: Commit (final moment before questionnaire) ─────────

  if (phase === "commit") {
    return (
      <main
        className="flex-1 flex flex-col items-center justify-center px-6 text-center"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(245, 158, 11, 0.08) 0%, #0a0a0a 70%)",
        }}
      >
        <div className="max-w-lg space-y-8 animate-fade-in">
          <p className="text-3xl md:text-5xl font-light text-neutral-200 leading-tight">
            Are you ready to be honest with yourself?
          </p>
          <p className="text-neutral-500 text-lg">
            This is your starting line. Not a test. Not a score to beat.
            <br />A mirror.
          </p>
          <button
            onClick={() => router.push("/questionnaire")}
            className="mt-4 px-10 py-4 bg-amber-500 text-black font-semibold rounded-lg text-lg hover:bg-amber-400 transition-all animate-pulse-glow"
          >
            Begin TREK
          </button>
        </div>
      </main>
    );
  }

  // ── Phase: Narrative slides ────────────────────────────────────

  return (
    <main
      className="flex-1 flex flex-col items-center justify-center px-6 text-center cursor-pointer select-none"
      onClick={goNext}
      style={bgStyle}
    >
      <div className="max-w-2xl mx-auto space-y-6 min-h-[280px] flex flex-col justify-center">
        <div
          className={`transition-opacity duration-500 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          <p
            className={`font-light leading-relaxed text-neutral-200 ${
              slide.emphasis
                ? "text-3xl md:text-5xl"
                : "text-2xl md:text-4xl"
            }`}
          >
            {slide.text}
          </p>
          {slide.subtext && (
            <p className="mt-4 text-base md:text-lg text-neutral-500">
              {slide.subtext}
            </p>
          )}

          {/* Interactive days counter */}
          {slide.interactive === "days-counter" && <DaysCounter />}
        </div>
      </div>

      {/* Progress dots */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5">
        {SLIDES.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              i === slideIndex
                ? "bg-amber-500 w-4"
                : i < slideIndex
                  ? "bg-neutral-600"
                  : "bg-neutral-800"
            }`}
          />
        ))}
      </div>

      {/* Navigation hint */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 text-xs text-neutral-700">
        tap to continue
      </div>

      {/* Back button */}
      {slideIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          className="fixed left-6 top-1/2 -translate-y-1/2 text-neutral-700 hover:text-neutral-400 transition-colors text-2xl"
          aria-label="Previous"
        >
          &larr;
        </button>
      )}
    </main>
  );
}
