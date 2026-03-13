import React from "react";

export default function HomeLayout({ logoSrc, coverSrc, onGetStarted }) {
  // Keep header height consistent across the component
  const HEADER_H = 40; // 40px ~ h-10

  return (
    <div
      className="
        h-screen overflow-hidden
        bg-slate-900 text-white
        grid grid-rows-[1fr]
        relative
      "
      style={{ "--header-h": `${HEADER_H}px` }}
    >
      {/* Header: seamless blend, no border, no shadow */}
      <header
        className={`
          absolute inset-x-0 top-0 z-50
          h-10
          bg-transparent
        `}
      >
        <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 h-full relative flex items-center">
          {/* Localized dark fade behind the logo only (for readability) */}
          <div
            aria-hidden="true"
            className="
              absolute left-2 right-2 top-0 h-10 -z-10
              bg-[linear-gradient(180deg,rgba(2,6,23,0.85)_0%,rgba(2,6,23,0.65)_40%,rgba(2,6,23,0.00)_100%)]
              [mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)]
            "
          />
          <img
            src={logoSrc}
            alt="Logo"
            className="
              h-6 sm:h-7 w-auto object-contain
              select-none pointer-events-none
              drop-shadow-[0_0_10px_rgba(0,0,0,0.25)]
            "
            draggable={false}
          />
        </div>
      </header>

      {/* Hero fills entire viewport, header floats above  */}
      <main
        className="
          relative isolate
          h-full
        "
      >
        {/* Base dark gradient — SAME palette */}
        <div className="absolute inset-0 -z-40 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950" />

        {/* Cover image behind content, right-aligned
             mask-image feathers the image from the LEFT so it dissolves into the bg */}
        <img
          src={coverSrc}
          alt=""
          aria-hidden="true"
          className="
            pointer-events-none select-none
            absolute inset-y-0 right-[-6%]
            w-[120%] max-w-none
            md:right-[-4%] md:w-[98%]
            lg:right-0 lg:w-[68%]
            object-cover
            -z-30
            [mask-image:linear-gradient(to_right,rgba(0,0,0,0)_0%,rgba(0,0,0,0.55)_14%,rgba(0,0,0,0.85)_28%,black_42%,black_100%)]
          "
        />

        {/* Left blend for readability to fully merge text area with the image */}
        <div
          className="
            absolute inset-0 -z-20
            bg-[linear-gradient(270deg,rgba(15,23,42,0)_0%,rgba(15,23,42,0.40)_28%,rgba(15,23,42,0.70)_54%,rgba(15,23,42,0.88)_80%)]
          "
        />

        {/* Top atmospheric wash to erase any perceived header boundary */}
        <div
          aria-hidden="true"
          className="
            absolute inset-x-0 top-0 h-24 -z-10
            bg-[radial-gradient(120%_80%_at_50%_0%,rgba(2,6,23,0.75),rgba(2,6,23,0)_70%)]
            [mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)]
          "
        />

        {/* Top-left radial wash to blend both top and left corners seamlessly */}
        <div
          aria-hidden="true"
          className="
            absolute -top-6 -left-6 h-48 w-64 -z-10
            bg-[radial-gradient(140%_90%_at_0%_0%,rgba(2,6,23,0.85)_0%,rgba(2,6,23,0.55)_45%,rgba(2,6,23,0)_100%)]
            [mask-image:radial-gradient(120%_90%_at_0%_0%,black_65%,transparent_100%)]
          "
        />

        {/* Accent glows */}
        <div className="pointer-events-none absolute -top-28 -right-24 h-[22rem] w-[22rem] rounded-full bg-yellow-500/12 blur-3xl -z-10" />
        <div className="pointer-events-none absolute -bottom-28 -left-24 h-[22rem] w-[22rem] rounded-full bg-indigo-500/12 blur-3xl -z-10" />

        {/* Particles */}
        <svg
          className="absolute inset-0 h-full w-full opacity-15 -z-10"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="g" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          {[...Array(22)].map((_, i) => {
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const r = 0.2 + Math.random() * 0.5;
            return <circle key={i} cx={x} cy={y} r={r} fill="url(#g)" />;
          })}
        </svg>

        {/* Content */}
        <div className="h-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center pt-10">
          {/* pt-10 ensures content doesn't clash visually with the floating header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 w-full">
            <div className="lg:col-span-7 xl:col-span-6">
              <p className="inline-block rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium tracking-wide text-white/80 backdrop-blur">
                Unified Secure Platform
              </p>

              <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
                Secure Access to{" "}
                <span className="text-yellow-400">Authentication Services</span>
                <br className="hidden sm:block" />
                for AUA &amp; KUA Partners
              </h1>

              <p className="mt-5 max-w-xl text-white/70">
                Manage onboarding, authentication services, and compliance through a unified secure platform.
              </p>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={onGetStarted}
                  className="
                    inline-flex items-center justify-center
                    rounded-md bg-yellow-400 px-5 py-2.5
                    text-slate-900 font-medium shadow-sm
                    hover:bg-yellow-300
                    focus:outline-none focus-visible:ring-2
                    focus-visible:ring-offset-2 focus-visible:ring-yellow-300
                    focus-visible:ring-offset-slate-900
                    transition
                  "
                >
                  Get Started
                </button>
              </div>
            </div>

            <div className="hidden lg:block lg:col-span-5 xl:col-span-6" />
          </div>
        </div>
      </main>
    </div>
  );
}
