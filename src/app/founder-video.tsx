"use client";

import { useState } from "react";

// Replace with Ken's actual YouTube video ID
const VIDEO_ID = "dQw4w9WgXcQ";

export default function FounderVideo() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="relative border-t border-neutral-900 px-6 py-24 md:py-32">
      {/* Subtle radial glow behind the video */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(184,134,11,0.10) 0%, rgba(26,20,16,0) 60%)",
        }}
      />

      <div className="w-full max-w-4xl mx-auto">
        {/* Eyebrow */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-px bg-brand-primary/50" />
          <p className="text-[10px] md:text-xs tracking-[0.4em] text-brand-primary uppercase">
            Meet the Founder
          </p>
        </div>

        {/* Headline */}
        <h2 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tight text-neutral-100 leading-[1.1] mb-4">
          The Vision
        </h2>
        <p className="text-base md:text-lg text-neutral-400 max-w-2xl leading-relaxed mb-10">
          Ken Younce on why the Bison Tribe exists &mdash; and what it means to
          walk into the storm.
        </p>

        {/* Video embed container */}
        <div className="relative w-full aspect-video rounded-sm overflow-hidden border border-neutral-800 group">
          {!playing ? (
            <>
              {/* YouTube thumbnail as poster */}
              <img
                src={`https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`}
                alt="Ken Younce — The Vision"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />

              {/* Play button */}
              <button
                onClick={() => setPlaying(true)}
                aria-label="Play video"
                className="absolute inset-0 flex items-center justify-center z-10"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-brand-primary/80 bg-black/50 flex items-center justify-center group-hover:border-brand-primary group-hover:bg-black/60 transition-all group-hover:scale-105">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-8 h-8 md:w-10 md:h-10 text-brand-primary ml-1"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </button>
            </>
          ) : (
            <iframe
              src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
              title="Ken Younce — The Vision"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          )}
        </div>
      </div>
    </section>
  );
}
