"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const email = new FormData(form).get("email") as string;

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center md:items-start gap-3 py-4">
        <p className="text-brand-primary font-semibold text-lg">
          You&rsquo;re in.
        </p>
        <p className="text-sm text-neutral-400">
          Watch for The Herd Note in your inbox this Sunday.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label
        htmlFor="herd-email"
        className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase"
      >
        Email
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          id="herd-email"
          type="email"
          name="email"
          required
          placeholder="you@domain.com"
          className="flex-1 px-4 py-3 bg-neutral-950 border border-neutral-800 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-brand-primary transition-colors rounded-sm text-sm"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center px-6 py-3 bg-brand-primary text-black font-semibold uppercase tracking-[0.15em] text-xs rounded-sm hover:bg-brand-primary-light transition-colors whitespace-nowrap disabled:opacity-60"
        >
          {status === "loading" ? "Joining\u2026" : "Join the Herd"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-red-400 text-xs mt-1">{errorMsg}</p>
      )}
    </form>
  );
}
