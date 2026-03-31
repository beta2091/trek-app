"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TIMEZONES = [
  { value: "America/New_York", label: "Eastern (ET)" },
  { value: "America/Chicago", label: "Central (CT)" },
  { value: "America/Denver", label: "Mountain (MT)" },
  { value: "America/Los_Angeles", label: "Pacific (PT)" },
  { value: "America/Anchorage", label: "Alaska (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii (HT)" },
];

type Step = "phone" | "verify" | "success";

export default function OptInPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [timezone, setTimezone] = useState("America/Chicago");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Get trekker name and start date from worksheet in localStorage
  const getWorksheetData = () => {
    try {
      const stored = localStorage.getItem("trek-worksheet");
      if (stored) return JSON.parse(stored);
    } catch {}
    return null;
  };

  async function sendCode() {
    setError("");
    setLoading(true);

    // Normalize phone: ensure it starts with +1 for US
    let normalized = phone.replace(/[^\d+]/g, "");
    if (!normalized.startsWith("+")) {
      normalized = "+1" + normalized;
    }

    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalized }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send code");
      }

      setPhone(normalized);
      setStep("verify");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send code");
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode() {
    setError("");
    setLoading(true);

    const worksheet = getWorksheetData();
    const trekStart =
      worksheet?.startDate || new Date().toISOString().split("T")[0];
    const name = worksheet?.trekkerName || null;

    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          code,
          name,
          trekStart,
          timezone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Verification failed");
      }

      // Store user info for reference
      localStorage.setItem("trek-user", JSON.stringify(data.user));
      setStep("success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex-1 flex flex-col px-6 py-8">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        {step === "phone" && (
          <div className="space-y-8 w-full animate-fade-in">
            <div className="text-center space-y-3">
              <div className="text-4xl">&#128242;</div>
              <h2 className="text-2xl font-bold">Stay on track.</h2>
              <p className="text-neutral-400">
                Get a daily check-in text during your 28-day TREK. Rate your 5
                Footprints in under 30 seconds.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-neutral-400 block mb-1">
                  Phone number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-3 bg-transparent border border-neutral-700 rounded-lg text-neutral-200 focus:border-amber-500 focus:outline-none transition-colors text-lg"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-sm text-neutral-400 block mb-1">
                  Your timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-neutral-700 rounded-lg text-neutral-200 focus:border-amber-500 focus:outline-none transition-colors"
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              <button
                onClick={sendCode}
                disabled={loading || phone.replace(/\D/g, "").length < 10}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  loading || phone.replace(/\D/g, "").length < 10
                    ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                    : "bg-amber-500 text-black hover:bg-amber-400"
                }`}
              >
                {loading ? "Sending..." : "Send verification code"}
              </button>

              <button
                onClick={() => router.push("/")}
                className="w-full py-3 text-neutral-500 hover:text-neutral-400 text-sm transition-colors"
              >
                Skip for now
              </button>
            </div>
          </div>
        )}

        {step === "verify" && (
          <div className="space-y-8 w-full animate-fade-in">
            <div className="text-center space-y-3">
              <div className="text-4xl">&#128172;</div>
              <h2 className="text-2xl font-bold">Enter your code.</h2>
              <p className="text-neutral-400">
                We sent a 6-digit code to{" "}
                <span className="text-neutral-300">{phone}</span>
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="000000"
                className="w-full px-4 py-4 bg-transparent border border-neutral-700 rounded-lg text-neutral-200 focus:border-amber-500 focus:outline-none transition-colors text-2xl text-center tracking-[0.5em] font-mono"
                autoFocus
              />

              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              <button
                onClick={verifyCode}
                disabled={loading || code.length !== 6}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  loading || code.length !== 6
                    ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                    : "bg-amber-500 text-black hover:bg-amber-400"
                }`}
              >
                {loading ? "Verifying..." : "Verify"}
              </button>

              <button
                onClick={() => {
                  setCode("");
                  setError("");
                  setStep("phone");
                }}
                className="w-full py-3 text-neutral-500 hover:text-neutral-400 text-sm transition-colors"
              >
                Use a different number
              </button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="space-y-8 w-full animate-fade-in text-center">
            <div className="space-y-3">
              <div className="text-5xl">&#9989;</div>
              <h2 className="text-2xl font-bold">You&apos;re all set.</h2>
              <p className="text-neutral-400">
                You&apos;ll get a daily text each morning during your TREK with a
                link to log your check-in. It takes less than 30 seconds.
              </p>
            </div>

            <div className="border border-neutral-800 rounded-xl p-4 text-left space-y-2">
              <p className="text-sm text-neutral-400">What to expect:</p>
              <ul className="text-sm text-neutral-400 space-y-1">
                <li>
                  &#8226; Daily SMS between 7-9 AM in your timezone
                </li>
                <li>
                  &#8226; Tap the link to rate your 5 Footprints (1-10)
                </li>
                <li>
                  &#8226; Optional note to capture your thoughts
                </li>
                <li>
                  &#8226; Reply STOP anytime to opt out
                </li>
              </ul>
            </div>

            <button
              onClick={() => router.push("/")}
              className="w-full py-3 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition-all"
            >
              Begin your TREK
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
