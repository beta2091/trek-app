"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface UserData {
  id: string;
  name: string | null;
  trekStart: string | null;
  trekEnd: string | null;
  timezone: string;
  optedIn: boolean;
}

const FOOTPRINTS = [
  { key: "faith", label: "Faith", icon: "\u{1F64F}", color: "#a855f7" },
  { key: "family", label: "Family", icon: "\u2764\uFE0F", color: "#ef4444" },
  { key: "fitness", label: "Fitness", icon: "\u{1F4AA}", color: "#22c55e" },
  { key: "finance", label: "Finance", icon: "\u{1F4B0}", color: "#3b82f6" },
  { key: "fulfillment", label: "Fulfillment", icon: "\u2728", color: "#f59e0b" },
];

const MOTIVATIONAL = [
  "Every day you show up, you grow stronger.",
  "Small steps, massive impact. Keep going.",
  "The man in the arena never quits.",
  "You're building the life you deserve.",
  "Consistency beats intensity. Always.",
  "Your future self is thanking you right now.",
  "Iron sharpens iron. Stay on the path.",
];

function getTrekDay(trekStart: string): number {
  const start = new Date(trekStart + "T00:00:00");
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.floor(
    (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  return Math.max(1, Math.min(28, diff + 1));
}

function Slider({
  footprint,
  value,
  onChange,
}: {
  footprint: (typeof FOOTPRINTS)[number];
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{footprint.icon}</span>
          <span className="font-medium text-sm">{footprint.label}</span>
        </div>
        <span
          className="text-lg font-bold tabular-nums w-8 text-right"
          style={{ color: footprint.color }}
        >
          {value}
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${footprint.color} 0%, ${footprint.color} ${((value - 1) / 9) * 100}%, #262626 ${((value - 1) / 9) * 100}%, #262626 100%)`,
          accentColor: footprint.color,
        }}
      />
      <div className="flex justify-between text-[10px] text-neutral-400">
        <span>Struggling</span>
        <span>Crushing it</span>
      </div>
    </div>
  );
}

export default function CheckinPage() {
  const params = useParams();
  const token = params.token as string;

  const [user, setUser] = useState<UserData | null>(null);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);

  const [ratings, setRatings] = useState<Record<string, number>>({
    faith: 5,
    family: 5,
    fitness: 5,
    finance: 5,
    fulfillment: 5,
  });
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch(`/api/users/by-token?token=${token}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Invalid link");
        }
        const data = await res.json();
        setUser(data.user);
      } catch (err: unknown) {
        setLoadError(
          err instanceof Error ? err.message : "Failed to load check-in"
        );
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [token]);

  async function handleSubmit() {
    if (!user || !user.trekStart) return;
    setSubmitError("");
    setSubmitting(true);

    const trekDay = getTrekDay(user.trekStart);
    const today = new Date().toISOString().split("T")[0];

    try {
      const res = await fetch("/api/checkins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          trekDay,
          date: today,
          ratings,
          note: note.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save check-in");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to save check-in"
      );
    } finally {
      setSubmitting(false);
    }
  }

  // Loading state
  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="text-neutral-400 animate-pulse">Loading...</div>
      </main>
    );
  }

  // Error state
  if (loadError) {
    return (
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="text-center space-y-3">
          <p className="text-red-400">{loadError}</p>
          <p className="text-sm text-neutral-400">
            This check-in link may be invalid or expired.
          </p>
        </div>
      </main>
    );
  }

  // Trek not active
  if (user && !user.trekStart) {
    return (
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="text-center space-y-3">
          <p className="text-neutral-400">Your TREK hasn&apos;t started yet.</p>
          <p className="text-sm text-neutral-400">
            Complete the TREK worksheet to set your start date.
          </p>
        </div>
      </main>
    );
  }

  const trekDay = user?.trekStart ? getTrekDay(user.trekStart) : 0;
  const progressPct = (trekDay / 28) * 100;

  // Success state
  if (submitted) {
    const quote =
      MOTIVATIONAL[Math.floor(Math.random() * MOTIVATIONAL.length)];
    return (
      <main className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="text-center space-y-6 max-w-sm animate-fade-in">
          <div className="text-5xl">{"\u{1F525}"}</div>
          <h2 className="text-2xl font-bold">Day {trekDay} logged.</h2>
          <p className="text-neutral-400 italic">&ldquo;{quote}&rdquo;</p>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-neutral-400">
              <span>Day 1</span>
              <span>Day 28</span>
            </div>
            <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-sm text-neutral-400">
              Day {trekDay} of 28 &mdash;{" "}
              {28 - trekDay > 0
                ? `${28 - trekDay} days remaining`
                : "Final day!"}
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Check-in form
  return (
    <main className="flex-1 flex flex-col px-6 py-6 max-w-lg mx-auto w-full">
      {/* Header */}
      <div className="text-center space-y-2 mb-6">
        <p className="text-xs text-neutral-400 uppercase tracking-widest">
          TREK Check-In
        </p>
        <h1 className="text-xl font-bold">
          Day {trekDay}{" "}
          <span className="text-neutral-400 font-normal">of 28</span>
        </h1>
        {user?.name && (
          <p className="text-sm text-neutral-400">
            How did yesterday go, {user.name}?
          </p>
        )}
        {/* Progress bar */}
        <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden mt-3">
          <div
            className="h-full bg-amber-500 rounded-full transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Footprint Sliders */}
      <div className="space-y-5 flex-1">
        {FOOTPRINTS.map((fp) => (
          <Slider
            key={fp.key}
            footprint={fp}
            value={ratings[fp.key]}
            onChange={(v) => setRatings((prev) => ({ ...prev, [fp.key]: v }))}
          />
        ))}

        {/* Note */}
        <div className="pt-2">
          <label className="text-sm text-neutral-400 block mb-1">
            Notes <span className="text-neutral-500">(optional)</span>
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Anything on your mind today..."
            className="w-full px-4 py-3 bg-transparent border border-neutral-700 rounded-lg text-neutral-200 focus:border-amber-500 focus:outline-none transition-colors resize-none text-base"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="pt-4" style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom, 0px))" }}>
        {submitError && (
          <p className="text-red-400 text-sm text-center mb-3">
            {submitError}
          </p>
        )}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
            submitting
              ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
              : "bg-amber-500 text-black hover:bg-amber-400 active:scale-[0.98]"
          }`}
        >
          {submitting ? "Saving..." : "Log Check-In"}
        </button>
      </div>
    </main>
  );
}
