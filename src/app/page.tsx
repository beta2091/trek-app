import Image from "next/image";
import Link from "next/link";
import FounderVideo from "./founder-video";
import NewsletterForm from "./newsletter-form";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
    <section className="relative min-h-screen flex flex-col items-center justify-between px-4 py-10 md:py-12 overflow-hidden">
      {/* Ambient warm glow — layered for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 50% 55%, rgba(184,134,11,0.24) 0%, rgba(160,112,74,0.08) 40%, rgba(26,20,16,0) 70%)",
        }}
      />

      {/* Architectural grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #D4A84B 1px, transparent 1px), linear-gradient(to bottom, #D4A84B 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Eyebrow */}
      <div className="pt-6 md:pt-10 text-center relative z-10">
        <p className="text-[10px] md:text-xs tracking-[0.4em] text-brand-primary uppercase">
          Est. 2026 &middot; Into the Storm
        </p>
      </div>

      {/* Bison + mountain scene */}
      <div className="flex-1 w-full flex items-center justify-center relative z-0 py-4 scene-rise">
        {/* Bison silhouette layered in front of mountains */}
        <div className="absolute inset-0 flex items-end justify-center pb-[8%] pointer-events-none z-10">
          <Image
            src="/bison-only.png?v=2"
            alt="The Bison"
            width={553}
            height={257}
            priority
            unoptimized
            className="w-[70vw] max-w-[640px] h-auto"
            style={{
              filter:
                "drop-shadow(0 0 50px rgba(212,168,75,0.35)) drop-shadow(0 12px 30px rgba(0,0,0,0.6))",
            }}
          />
        </div>

        {/* Mountain range */}
        <svg
          viewBox="0 0 1200 900"
          className="w-[115vw] max-w-[1500px] h-auto"
          aria-hidden
        >
          <g>
            <path
              d="M -80 780 L 220 380 L 460 780 Z"
              fill="#D4A84B"
              fillOpacity="0.12"
            />
            <path
              d="M 280 780 L 600 200 L 900 780 Z"
              fill="#D4A84B"
              fillOpacity="0.18"
            />
            <path
              d="M 760 780 L 1020 320 L 1280 780 Z"
              fill="#D4A84B"
              fillOpacity="0.14"
            />
            <path
              d="M 555 284 L 600 200 L 650 292 L 620 310 L 600 295 L 580 310 Z"
              fill="#D4A84B"
              fillOpacity="0.45"
            />
            <path
              d="M 985 398 L 1020 320 L 1060 404 L 1038 418 L 1020 408 L 1003 418 Z"
              fill="#D4A84B"
              fillOpacity="0.38"
            />
            <line
              x1="-80"
              y1="780"
              x2="1280"
              y2="780"
              stroke="#D4A84B"
              strokeOpacity="0.3"
              strokeWidth="2"
            />
          </g>
        </svg>
      </div>

      {/* Wordmark + CTA block */}
      <div className="pb-16 md:pb-20 flex flex-col items-center relative z-10">
        {/* Brand logo mark */}
        <div className="mb-5 md:mb-6 animate-fade-in">
          <img
            src="/bison-tribe-logo.png"
            alt="The Bison Tribe"
            className="w-16 md:w-24 h-auto drop-shadow-[0_0_20px_rgba(184,134,11,0.4)]"
          />
        </div>

        <h1
          className="font-display font-black uppercase tracking-[0.04em] text-neutral-100 leading-none text-center animate-fade-in-up"
          style={{ fontSize: "clamp(1.75rem, 5vw, 4.5rem)" }}
        >
          The Bison Tribe
        </h1>

        <div className="flex items-center gap-4 md:gap-6 mt-5 md:mt-6 animate-fade-in delay-200">
          <div className="w-12 md:w-20 h-px bg-brand-primary/50" />
          <p className="text-[10px] md:text-xs tracking-[0.4em] text-brand-primary uppercase whitespace-nowrap">
            Face the Storm
          </p>
          <div className="w-12 md:w-20 h-px bg-brand-primary/50" />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 w-full sm:w-auto animate-fade-in-up delay-400">
          <Link
            href="/journey"
            className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 bg-brand-primary text-black font-semibold uppercase tracking-[0.15em] text-sm rounded-sm hover:bg-brand-primary-light transition-colors"
          >
            Begin Your TREK
          </Link>
          <Link
            href="#footprints"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-brand-border text-neutral-200 font-medium uppercase tracking-[0.15em] text-sm rounded-sm hover:border-brand-primary hover:text-brand-primary transition-colors"
          >
            The 5 Footprints
          </Link>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-fade-in-slow delay-1000">
        <div className="flex flex-col items-center gap-2 text-neutral-600">
          <span className="text-[9px] tracking-[0.35em] uppercase">
            Scroll
          </span>
          <div className="w-px h-6 bg-gradient-to-b from-neutral-600 to-transparent" />
        </div>
      </div>

      {/* Scene rise-in animation */}
      <style>{`
        .scene-rise {
          animation: riseIn 1.4s ease-out both;
        }
        @keyframes riseIn {
          from { opacity: 0; transform: translateY(40px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </section>

    {/* Tribal chevron divider */}
    <div className="tribal-divider py-2" aria-hidden>
      <div className="tribal-chevrons">
        <span /><span /><span />
      </div>
    </div>

    {/* SECTION — Meet the Founder (Ken's testimony video) */}
    <FounderVideo />

    {/* SECTION 2 — Who it's for */}
    <section className="relative border-t border-brand-border/30 px-6 py-24 md:py-32">
      <div className="w-full max-w-3xl mx-auto">
        {/* Eyebrow */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-px bg-brand-primary/50" />
          <p className="text-[10px] md:text-xs tracking-[0.4em] text-brand-primary uppercase">
            For the Man
          </p>
        </div>

        {/* Headline */}
        <h2 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tight text-neutral-100 leading-[1.1]">
          Who refuses
          <br />
          <span className="text-brand-primary">to drift.</span>
        </h2>

        {/* Lead paragraph */}
        <p className="text-base md:text-lg text-neutral-300 mt-10 max-w-2xl leading-relaxed">
          You know what matters. Faith. Family. Fitness. Finance. Fulfillment.
          <br className="hidden md:block" />
          {" "}But knowing isn&rsquo;t the same as showing up.
        </p>

        {/* Qualifying statements */}
        <div className="mt-14 border-t border-neutral-800">
          {[
            {
              n: "01",
              text: "You&rsquo;re auto-piloting through the roles that matter most.",
            },
            {
              n: "02",
              text: "You&rsquo;ve tried the apps, the programs, the motivational swipe files &mdash; and still feel stuck.",
            },
            {
              n: "03",
              text: "You&rsquo;re ready to stop managing your life and start leading it.",
            },
          ].map(({ n, text }) => (
            <div
              key={n}
              className="grid grid-cols-[auto_1fr] gap-6 md:gap-10 py-6 md:py-8 border-b border-neutral-800"
            >
              <span className="text-xs md:text-sm font-mono text-brand-primary/70 tracking-widest pt-1">
                {n}
              </span>
              <p
                className="text-base md:text-xl text-neutral-200 leading-snug"
                dangerouslySetInnerHTML={{ __html: text }}
              />
            </div>
          ))}
        </div>

        {/* Close */}
        <div className="mt-14 md:mt-16 max-w-xl">
          <p className="text-lg md:text-2xl text-neutral-100 font-display font-medium leading-snug">
            You don&rsquo;t need another system.
          </p>
          <p className="text-lg md:text-2xl text-brand-primary font-display font-medium leading-snug mt-1">
            You need a tribe that walks into the storm with you.
          </p>
        </div>

        {/* Secondary CTA */}
        <div className="mt-12">
          <Link
            href="/journey"
            className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.15em] text-brand-primary hover:text-brand-primary-light transition-colors group"
          >
            <span>Start the Footprint Assessment</span>
            <span className="inline-block transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </section>

    {/* SECTION 3 — The 5 Footprints */}
    <section
      id="footprints"
      className="relative border-t border-neutral-900 px-6 py-24 md:py-32 overflow-hidden"
    >
      {/* Diagonal hoofprint trail backdrop — paired prints for realism */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 6% 92%, #D4A84B 3px, transparent 4px), radial-gradient(circle at 10% 88%, #D4A84B 2px, transparent 3px), radial-gradient(circle at 22% 74%, #D4A84B 3px, transparent 4px), radial-gradient(circle at 26% 70%, #D4A84B 2px, transparent 3px), radial-gradient(circle at 40% 56%, #D4A84B 3px, transparent 4px), radial-gradient(circle at 44% 52%, #D4A84B 2px, transparent 3px), radial-gradient(circle at 58% 38%, #D4A84B 3px, transparent 4px), radial-gradient(circle at 62% 34%, #D4A84B 2px, transparent 3px), radial-gradient(circle at 76% 20%, #D4A84B 3px, transparent 4px), radial-gradient(circle at 80% 16%, #D4A84B 2px, transparent 3px), radial-gradient(circle at 92% 6%, #D4A84B 3px, transparent 4px), radial-gradient(circle at 96% 2%, #D4A84B 2px, transparent 3px)",
        }}
      />

      <div className="w-full max-w-6xl mx-auto">
        {/* Eyebrow */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-px bg-brand-primary/50" />
          <p className="text-[10px] md:text-xs tracking-[0.4em] text-brand-primary uppercase">
            The Five Footprints
          </p>
        </div>

        {/* Headline */}
        <h2 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tight text-neutral-100 leading-[1.1]">
          Five marks.
          <br />
          <span className="text-brand-primary">One path.</span>
        </h2>

        {/* Intro */}
        <p className="text-base md:text-lg text-neutral-300 mt-10 max-w-2xl leading-relaxed">
          Every man leaves a trail. These are the five places it shows:
          the prints you leave in the lives around you, measured honestly,
          walked intentionally.
        </p>

        {/* 5 Footprints grid */}
        <div className="mt-16 md:mt-20 border-t border-neutral-800">
          {[
            {
              n: "01",
              name: "Faith",
              desc: "Inner peace. Values alignment. Service. Community.",
            },
            {
              n: "02",
              name: "Fitness",
              desc: "Discipline of the body. Energy. Presence. Strength.",
            },
            {
              n: "03",
              name: "Family",
              desc: "Showing up for the people you love &mdash; first, not last.",
            },
            {
              n: "04",
              name: "Finance",
              desc: "Stewardship of your resources. Clarity. Freedom.",
            },
            {
              n: "05",
              name: "Fulfillment",
              desc: "Purpose. Contribution. The work that&rsquo;s yours alone.",
            },
          ].map(({ n, name, desc }) => (
            <div
              key={n}
              className="group grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto] gap-6 md:gap-12 items-baseline py-8 md:py-10 border-b border-neutral-800 transition-colors hover:bg-neutral-900/40"
            >
              <span className="text-xs md:text-sm font-mono text-brand-primary/70 tracking-widest">
                {n}
              </span>
              <div>
                <h3 className="text-2xl md:text-4xl font-display font-black uppercase tracking-tight text-neutral-100 leading-none group-hover:text-brand-primary transition-colors">
                  {name}
                </h3>
                <p
                  className="text-sm md:text-base text-neutral-400 mt-3 leading-relaxed max-w-xl"
                  dangerouslySetInnerHTML={{ __html: desc }}
                />
              </div>
              <span className="hidden md:block text-[10px] tracking-[0.25em] text-neutral-600 uppercase self-center">
                5 Questions
              </span>
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div className="mt-14 md:mt-16 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <p className="text-base md:text-lg text-neutral-300 max-w-md leading-relaxed">
            25 questions. 5 minutes. An honest look at where you stand.
          </p>
          <Link
            href="/questionnaire"
            className="inline-flex items-center justify-center px-8 py-4 bg-brand-primary text-black font-semibold uppercase tracking-[0.15em] text-sm rounded-sm hover:bg-brand-primary-light transition-colors w-full md:w-auto"
          >
            Take the Footprint Check
          </Link>
        </div>
      </div>
    </section>

    {/* SECTION 4 — The TREK Method */}
    <section
      id="trek"
      className="relative border-t border-neutral-900 px-6 py-24 md:py-32 overflow-hidden"
    >
      {/* Storm atmosphere layer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 storm-atmosphere"
      />

      <div className="w-full max-w-6xl mx-auto">
        {/* Eyebrow */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-px bg-brand-primary/50" />
          <p className="text-[10px] md:text-xs tracking-[0.4em] text-brand-primary uppercase">
            The Method
          </p>
        </div>

        {/* Headline */}
        <h2 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tight text-neutral-100 leading-[1.1]">
          Twenty-eight days.
          <br />
          <span className="text-brand-primary">Four moves.</span>
        </h2>

        {/* Intro */}
        <p className="text-base md:text-lg text-neutral-300 mt-10 max-w-2xl leading-relaxed">
          No more apps. No more hacks. A simple sequence you run against your
          own life, witnessed by men who will hold you to it.
        </p>

        {/* 4 TREK steps */}
        <div className="mt-16 md:mt-20 border-t border-neutral-800">
          {[
            {
              letter: "T",
              step: "Step 01",
              word: "Trade",
              headline: "Audit the drift.",
              body: "Trade a less beneficial use of time for one that serves your core values. Name what&rsquo;s stealing you and give it up on paper first.",
            },
            {
              letter: "R",
              step: "Step 02",
              word: "Reach",
              headline: "Press your strength.",
              body: "Select your strongest footprint. Build two action steps. Reach toward maximum performance on the ground you already hold.",
            },
            {
              letter: "E",
              step: "Step 03",
              word: "Execute",
              headline: "Repair the weak.",
              body: "Select your two weakest footprints. Two action steps each. Execute them without negotiation &mdash; not perfectly, but daily.",
            },
            {
              letter: "K",
              step: "Step 04",
              word: "Kill",
              headline: "Name the demon.",
              body: "Identify the one thing dragging you back. Build the gameplan. Kill it inside 28 days.",
            },
          ].map(({ letter, step, word, headline, body }) => (
            <div
              key={letter}
              className="grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto] gap-6 md:gap-12 items-start py-10 md:py-14 border-b border-neutral-800 group"
            >
              {/* Giant letter */}
              <div className="flex flex-col">
                <span className="text-5xl md:text-8xl font-display font-black text-brand-primary leading-none group-hover:text-brand-primary-light transition-colors">
                  {letter}
                </span>
              </div>

              {/* Content */}
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] md:text-xs font-mono tracking-[0.25em] text-brand-primary/60 uppercase">
                    {step}
                  </span>
                  <span className="h-px flex-1 bg-neutral-800 max-w-[80px]" />
                  <span className="text-[10px] md:text-xs tracking-[0.3em] text-neutral-500 uppercase">
                    {word}
                  </span>
                </div>
                <h3 className="text-xl md:text-3xl font-display font-black uppercase tracking-tight text-neutral-100 leading-tight">
                  {headline}
                </h3>
                <p
                  className="text-sm md:text-base text-neutral-400 mt-4 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: body }}
                />
              </div>

              {/* Day marker (desktop) */}
              <div className="hidden md:flex flex-col items-end text-right self-start pt-1">
                <span className="text-[9px] tracking-[0.3em] text-neutral-600 uppercase">
                  Days
                </span>
                <span className="text-xs font-mono text-neutral-500 tracking-wider mt-1">
                  {letter === "T"
                    ? "01–07"
                    : letter === "R"
                    ? "08–14"
                    : letter === "E"
                    ? "15–21"
                    : "22–28"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Closing + CTA */}
        <div className="mt-14 md:mt-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <p className="text-lg md:text-2xl text-neutral-100 font-display font-medium leading-snug max-w-md">
            Not a program. A trek.{" "}
            <span className="text-brand-primary">Walked, not watched.</span>
          </p>
          <Link
            href="/journey"
            className="inline-flex items-center justify-center px-8 py-4 bg-brand-primary text-black font-semibold uppercase tracking-[0.15em] text-sm rounded-sm hover:bg-brand-primary-light transition-colors w-full md:w-auto"
          >
            Begin Your TREK
          </Link>
        </div>
      </div>
    </section>

    {/* Tribal chevron divider */}
    <div className="tribal-divider py-2" aria-hidden>
      <div className="tribal-chevrons">
        <span /><span /><span />
      </div>
    </div>

    {/* SECTION 5 — Into the Storm Podcast */}
    <section
      id="podcast"
      className="relative border-t border-neutral-900 px-6 py-24 md:py-32"
    >
      <div className="w-full max-w-6xl mx-auto">
        {/* Eyebrow */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-px bg-brand-primary/50" />
          <p className="text-[10px] md:text-xs tracking-[0.4em] text-brand-primary uppercase">
            The Podcast
          </p>
        </div>

        {/* Split headline layout */}
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-10 md:gap-16 items-end">
          <div>
            <h2 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tight text-neutral-100 leading-[1.1]">
              Into the
              <br />
              <span className="text-brand-primary">Storm.</span>
            </h2>
            <p className="text-base md:text-lg text-neutral-300 mt-8 max-w-xl leading-relaxed">
              Long-form conversations with men walking the trek &mdash;
              the fathers, founders, operators, and fighters who refuse to
              drift. Hosted by Ken Younce.
            </p>
          </div>

          <div className="flex flex-col md:items-end gap-3">
            <p className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase">
              Watch on
            </p>
            <a
              href="https://www.youtube.com/@IntotheStormPodcast-TBT"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-lg md:text-xl font-black uppercase tracking-wide text-neutral-100 hover:text-brand-primary transition-colors group"
            >
              <span>YouTube</span>
              <span className="inline-block transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </a>
          </div>
        </div>

        {/* Episode grid */}
        <div className="mt-16 md:mt-20 grid md:grid-cols-3 gap-px bg-neutral-800 border border-neutral-800">
          {/*
            TODO: Replace these placeholder episodes with live data from the
            YouTube Data API once a channel ID + API key are wired in.
          */}
          {[
            {
              ep: "EP 001",
              tag: "Faith",
              title: "Walking the trail you were given.",
            },
            {
              ep: "EP 002",
              tag: "Fitness",
              title: "Discipline isn't punishment. It's love.",
            },
            {
              ep: "EP 003",
              tag: "Fulfillment",
              title: "The work nobody else can do for you.",
            },
          ].map(({ ep, tag, title }) => (
            <a
              key={ep}
              href="https://www.youtube.com/@IntotheStormPodcast-TBT"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-neutral-950 p-6 md:p-8 hover:bg-neutral-900 transition-colors flex flex-col gap-6"
            >
              {/* Play icon mark */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-[0.25em] text-brand-primary/70 uppercase">
                  {ep}
                </span>
                <span className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase">
                  {tag}
                </span>
              </div>

              {/* Thumb placeholder */}
              <div className="aspect-video bg-neutral-900 border border-neutral-800 flex items-center justify-center relative overflow-hidden">
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-[0.05]"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 50%, #D4A84B 0%, transparent 70%)",
                  }}
                />
                <div className="w-12 h-12 rounded-full border border-brand-primary/40 flex items-center justify-center group-hover:border-brand-primary group-hover:bg-brand-primary/10 transition-all">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-brand-primary ml-0.5"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              <p className="text-base md:text-lg text-neutral-100 font-semibold leading-snug group-hover:text-brand-primary transition-colors">
                {title}
              </p>
            </a>
          ))}
        </div>

        {/* Footer link */}
        <div className="mt-10 flex items-center justify-center">
          <a
            href="https://www.youtube.com/@IntotheStormPodcast-TBT"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.15em] text-brand-primary hover:text-brand-primary-light transition-colors group"
          >
            <span>All Episodes</span>
            <span className="inline-block transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </a>
        </div>
      </div>
    </section>

    {/* SECTION 6 — Be REAL */}
    <section
      id="be-real"
      className="relative border-t border-neutral-900 px-6 py-24 md:py-32"
    >
      <div className="w-full max-w-6xl mx-auto">
        {/* Eyebrow */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-px bg-brand-primary/50" />
          <p className="text-[10px] md:text-xs tracking-[0.4em] text-brand-primary uppercase">
            The Companion
          </p>
        </div>

        {/* 2-col intro */}
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-10 md:gap-16 items-end">
          <div>
            <h2 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tight text-neutral-100 leading-[1.1]">
              Same trek.
              <br />
              <span className="text-brand-primary">In the arena.</span>
            </h2>
            <p className="text-base md:text-lg text-neutral-300 mt-8 max-w-xl leading-relaxed">
              <span className="font-semibold text-neutral-100">Be REAL</span>{" "}
              is Ken Younce&rsquo;s sales training system &mdash; the same
              framework sharpened on the craft of selling. Built on
              Resilience, Excellence, Accountability, and Leadership.
            </p>
          </div>
          <div className="flex flex-col md:items-end gap-2">
            <p className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase">
              Core Values
            </p>
            <p className="text-xs md:text-sm tracking-[0.25em] text-brand-primary/80 uppercase md:text-right">
              Resilience &middot; Excellence
              <br />
              Accountability &middot; Leadership
            </p>
          </div>
        </div>

        {/* R.E.A.L. 2x2 grid */}
        <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-800 border border-neutral-800">
          {[
            {
              letter: "R",
              word: "Relate",
              body: "Meet them where they actually are. Presence before pitch.",
            },
            {
              letter: "E",
              word: "Educate",
              body: "Teach, don&rsquo;t sell. The buyer rises to your depth.",
            },
            {
              letter: "A",
              word: "Ask",
              body: "The question is the lever. Curiosity opens what closing can&rsquo;t.",
            },
            {
              letter: "L",
              word: "Listen",
              body: "More than you think. The deal is inside what they don&rsquo;t say.",
            },
          ].map(({ letter, word, body }) => (
            <div
              key={letter}
              className="bg-neutral-950 p-8 md:p-10 hover:bg-neutral-900 transition-colors group"
            >
              <div className="flex items-baseline gap-5">
                <span className="text-5xl md:text-6xl font-display font-black text-brand-primary leading-none group-hover:text-brand-primary-light transition-colors">
                  {letter}
                </span>
                <span className="text-xl md:text-2xl font-display font-black uppercase tracking-tight text-neutral-100">
                  {word}
                </span>
              </div>
              <p
                className="text-sm md:text-base text-neutral-400 mt-5 leading-relaxed max-w-md"
                dangerouslySetInnerHTML={{ __html: body }}
              />
            </div>
          ))}
        </div>

        {/* Closing + CTA */}
        <div className="mt-14 md:mt-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <p className="text-lg md:text-2xl text-neutral-100 font-display font-medium leading-snug max-w-lg">
            Your life is your trek.{" "}
            <span className="text-brand-primary">Your craft is the arena.</span>
          </p>
          <a
            href="https://www.berealsalestraining.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-brand-primary text-brand-primary font-semibold uppercase tracking-[0.15em] text-sm rounded-sm hover:bg-brand-primary hover:text-black transition-colors w-full md:w-auto group"
          >
            <span>Explore Be REAL</span>
            <span className="inline-block transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </a>
        </div>
      </div>
    </section>

    {/* SECTION 7 — Join the Tribe */}
    <section
      id="join"
      className="relative border-t border-neutral-900 px-6 py-24 md:py-32 overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(184,134,11,0.12) 0%, rgba(26,20,16,0) 70%)",
        }}
      />

      <div className="w-full max-w-3xl mx-auto text-center">
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="w-12 h-px bg-brand-primary/50" />
          <p className="text-[10px] md:text-xs tracking-[0.4em] text-brand-primary uppercase">
            The Invitation
          </p>
          <div className="w-12 h-px bg-brand-primary/50" />
        </div>

        <h2 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tight text-neutral-100 leading-[1.1]">
          Join the <span className="text-brand-primary">Tribe.</span>
        </h2>

        <p className="text-base md:text-lg text-neutral-300 mt-8 max-w-xl mx-auto leading-relaxed">
          This isn&rsquo;t a sales pitch. It&rsquo;s a campfire. A circle of men
          who decided drifting wasn&rsquo;t an option. Your seat is waiting.
        </p>

        <div className="mt-10">
          <Link
            href="/journey"
            className="inline-flex items-center justify-center px-10 py-4 bg-brand-primary text-black font-semibold uppercase tracking-[0.15em] text-sm rounded-sm hover:bg-brand-primary-light transition-colors"
          >
            Begin Your TREK
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-px bg-neutral-800 border border-neutral-800">
          <a
            href="https://www.youtube.com/@IntotheStormPodcast-TBT"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-neutral-950 p-6 md:p-8 hover:bg-neutral-900 transition-colors flex flex-col items-center gap-3"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-brand-primary">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.35 29 29 0 0 0-.46-5.33z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="m9.75 15.02 5.75-3.27-5.75-3.27v6.54z" fill="currentColor"/>
            </svg>
            <span className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase">Podcast</span>
            <span className="text-sm font-semibold text-neutral-200 group-hover:text-brand-primary transition-colors">Into the Storm</span>
          </a>

          <a
            href="#herd-note"
            className="group bg-neutral-950 p-6 md:p-8 hover:bg-neutral-900 transition-colors flex flex-col items-center gap-3"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-brand-primary">
              <rect x="2" y="4" width="20" height="16" rx="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="m2 7 10 6 10-6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
            <span className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase">Newsletter</span>
            <span className="text-sm font-semibold text-neutral-200 group-hover:text-brand-primary transition-colors">The Herd Note</span>
          </a>

          <a
            href="mailto:ken@berealsalestraining.com"
            className="group bg-neutral-950 p-6 md:p-8 hover:bg-neutral-900 transition-colors flex flex-col items-center gap-3"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-brand-primary">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M12 16v-4m0-4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase">Contact</span>
            <span className="text-sm font-semibold text-neutral-200 group-hover:text-brand-primary transition-colors">Reach Ken</span>
          </a>
        </div>
      </div>
    </section>

    {/* SECTION 8 — Footer with Herd Note signup */}
    <footer className="relative border-t border-neutral-900 px-6 pt-24 pb-10 md:pt-32 md:pb-12">
      <div className="w-full max-w-6xl mx-auto">
        {/* Newsletter signup */}
        <div id="herd-note" className="grid md:grid-cols-[1.2fr_1fr] gap-10 md:gap-16 items-end pb-16 md:pb-20 border-b border-neutral-900">
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-px bg-brand-primary/50" />
              <p className="text-[10px] md:text-xs tracking-[0.4em] text-brand-primary uppercase">
                The Herd Note
              </p>
            </div>
            <h3 className="text-2xl md:text-4xl font-display font-black uppercase tracking-tight text-neutral-100 leading-[1.1]">
              One note. <span className="text-brand-primary">Every Sunday.</span>
            </h3>
            <p className="text-sm md:text-base text-neutral-400 mt-5 max-w-md leading-relaxed">
              A weekly signal from the tribe &mdash; one question, one
              practice, one story from the trek. No noise. Unsubscribe anytime.
            </p>
          </div>

          <NewsletterForm />
        </div>

        {/* Footer grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 pt-16 md:pt-20">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-4">
              <img
                src="/bison-tribe-logo.png"
                alt="The Bison Tribe"
                className="w-16 md:w-20 h-auto drop-shadow-[0_0_12px_rgba(184,134,11,0.25)]"
              />
              <div className="flex flex-col">
                <span className="text-sm font-display font-black uppercase tracking-widest text-neutral-100">
                  The Bison Tribe
                </span>
                <span className="text-[9px] tracking-[0.3em] text-brand-primary/70 uppercase mt-1">
                  Into the Storm
                </span>
              </div>
            </div>
            <p className="text-xs text-neutral-500 mt-5 leading-relaxed max-w-xs">
              A tribe of men who refuse to drift. Built on the Footprint
              framework by Ken Younce.
            </p>
          </div>

          {/* Navigate */}
          <div>
            <p className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase mb-5">
              Navigate
            </p>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-neutral-300 hover:text-brand-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="#footprints"
                  className="text-neutral-300 hover:text-brand-primary transition-colors"
                >
                  5 Footprints
                </Link>
              </li>
              <li>
                <Link
                  href="#trek"
                  className="text-neutral-300 hover:text-brand-primary transition-colors"
                >
                  The Method
                </Link>
              </li>
              <li>
                <Link
                  href="/journey"
                  className="text-neutral-300 hover:text-brand-primary transition-colors"
                >
                  Begin Your TREK
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow */}
          <div>
            <p className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase mb-5">
              Follow
            </p>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <a
                  href="https://www.youtube.com/@IntotheStormPodcast-TBT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-300 hover:text-brand-primary transition-colors"
                >
                  YouTube
                </a>
              </li>
              <li>
                <Link
                  href="#podcast"
                  className="text-neutral-300 hover:text-brand-primary transition-colors"
                >
                  Podcast
                </Link>
              </li>
              <li>
                <a
                  href="https://www.berealsalestraining.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-300 hover:text-brand-primary transition-colors"
                >
                  Be REAL
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[10px] tracking-[0.3em] text-neutral-500 uppercase mb-5">
              Contact
            </p>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <a
                  href="mailto:ken@berealsalestraining.com"
                  className="text-neutral-300 hover:text-brand-primary transition-colors break-all"
                >
                  ken@berealsalestraining.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal line */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-10 mt-10 border-t border-neutral-900">
          <p className="text-[10px] tracking-[0.25em] text-neutral-600 uppercase">
            &copy; {new Date().getFullYear()} The Bison Tribe. All rights
            reserved.
          </p>
          <p className="text-[10px] tracking-[0.25em] text-neutral-600 uppercase">
            Built with the TREK.
          </p>
        </div>
      </div>
    </footer>
    </main>
  );
}
