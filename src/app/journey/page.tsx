"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Slide {
  text: string;
  subtext?: string;
  pause?: number; // extra ms before auto-advance
}

const SLIDES: Slide[] = [
  {
    text: "Before we begin, take a breath.",
    subtext: "Put your phone on silent. Close the other tabs. Be here.",
    pause: 1000,
  },
  {
    text: "Think about the last year of your life.",
    subtext: "The highs. The lows. The ordinary days in between.",
  },
  {
    text: "Now think about the man you were twelve months ago.",
    subtext: "Has he grown? Has he stayed the same?",
  },
  {
    text: "Here's a hard truth most people avoid:",
  },
  {
    text: "You will not get unlimited chances to become who you're meant to be.",
    pause: 2000,
  },
  {
    text: "Your time is finite.",
    subtext: "The average man lives about 28,000 days. How many have you spent?",
    pause: 1500,
  },
  {
    text: "This isn't meant to scare you.",
    subtext: "It's meant to wake you up.",
  },
  {
    text: "Because life — when you really see it — is sacred.",
    pause: 1000,
  },
  {
    text: "Every relationship you build matters.",
    subtext: "Every challenge you face shapes you.",
  },
  {
    text: "Every morning you wake up is another chance to move the needle.",
  },
  {
    text: "The men who change their lives aren't superhuman.",
    subtext: "They just decided to be honest about where they are.",
  },
  {
    text: "That's what TREK is.",
    subtext:
      "An honest look at four dimensions of your life — Tribe, Resilience, Energy, and Knowledge.",
    pause: 1500,
  },
  {
    text: "No judgment. No grades. Just clarity.",
    subtext: "Answer from the gut. The only wrong answer is a dishonest one.",
  },
];

export default function JourneyPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visible, setVisible] = useState(true);
  const [started, setStarted] = useState(false);

  const isLastSlide = currentSlide === SLIDES.length - 1;
  const slide = SLIDES[currentSlide];

  const goNext = useCallback(() => {
    if (isLastSlide) {
      router.push("/questionnaire");
      return;
    }
    setVisible(false);
    setTimeout(() => {
      setCurrentSlide((s) => s + 1);
      setVisible(true);
    }, 500);
  }, [isLastSlide, router]);

  const goPrev = useCallback(() => {
    if (currentSlide === 0) return;
    setVisible(false);
    setTimeout(() => {
      setCurrentSlide((s) => s - 1);
      setVisible(true);
    }, 500);
  }, [currentSlide]);

  // Keyboard navigation
  useEffect(() => {
    if (!started) return;
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
  }, [started, goNext, goPrev]);

  if (!started) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-lg space-y-8">
          <p className="text-2xl md:text-3xl font-light text-neutral-300 animate-fade-in">
            Find a quiet place.
          </p>
          <p className="text-lg text-neutral-500 animate-fade-in-slow delay-400">
            This will take about 10 minutes. <br />
            Give yourself that time.
          </p>
          <button
            onClick={() => setStarted(true)}
            className="animate-fade-in delay-800 mt-6 px-8 py-4 border border-neutral-700 text-neutral-300 rounded-lg text-lg hover:border-amber-500 hover:text-amber-500 transition-all"
          >
            I&apos;m ready
          </button>
        </div>
      </main>
    );
  }

  return (
    <main
      className="flex-1 flex flex-col items-center justify-center px-6 text-center cursor-pointer select-none"
      onClick={goNext}
    >
      <div className="max-w-2xl mx-auto space-y-6 min-h-[200px] flex flex-col justify-center">
        <div
          className={`transition-opacity duration-500 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-2xl md:text-4xl font-light leading-relaxed text-neutral-200">
            {slide.text}
          </p>
          {slide.subtext && (
            <p className="mt-4 text-base md:text-lg text-neutral-500">
              {slide.subtext}
            </p>
          )}
        </div>
      </div>

      {/* Progress dots */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5">
        {SLIDES.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              i === currentSlide
                ? "bg-amber-500 w-4"
                : i < currentSlide
                ? "bg-neutral-600"
                : "bg-neutral-800"
            }`}
          />
        ))}
      </div>

      {/* Navigation hint */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 text-xs text-neutral-700">
        {isLastSlide ? "tap to begin questionnaire" : "tap to continue"}
      </div>

      {/* Back button */}
      {currentSlide > 0 && (
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
