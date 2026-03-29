import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight animate-fade-in-up">
          T<span className="text-amber-500">R</span>E
          <span className="text-amber-500">K</span>
        </h1>

        <p className="text-lg md:text-xl text-neutral-400 animate-fade-in-up delay-200">
          Tribe. Resilience. Energy. Knowledge.
        </p>

        <p className="text-base md:text-lg text-neutral-500 max-w-md mx-auto animate-fade-in-up delay-400">
          A tool built for men ready to look honestly at their lives — and take
          the next step toward becoming who they were meant to be.
        </p>

        <div className="animate-fade-in-up delay-600">
          <Link
            href="/journey"
            className="inline-block mt-4 px-8 py-4 bg-amber-500 text-black font-semibold rounded-lg text-lg hover:bg-amber-400 transition-all animate-pulse-glow"
          >
            Begin Your TREK
          </Link>
        </div>

        <p className="text-xs text-neutral-600 animate-fade-in-up delay-800">
          The Bison Tribe
        </p>
      </div>
    </main>
  );
}
