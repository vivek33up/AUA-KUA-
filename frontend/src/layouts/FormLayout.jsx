// src/layouts/FormLayout.jsx
import React from "react";

/** Theme tokens (centralized so we never scatter hex values) */
export const theme = {
  bg: "#333333",
  accent: "#ffe600",
  muted: "#999999",
  light: "#cccccc",
  card: "rgba(0,0,0,0.30)",
  cardSolid: "rgba(20,20,20,0.80)",

  // Inputs
  inputBg: "#f5f5f5",
  inputText: "#000000",
};

/* -------------------------- STATIC BACKGROUND -------------------------- */
export function FormLayout({ children }) {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col" style={{ backgroundColor: theme.bg }}>
      {/* Static Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">

        {/* Yellow Circles (NO animation) */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 -translate-y-1/2 translate-x-1/2"
             style={{ backgroundColor: theme.accent }} />

        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10 translate-y-1/2 -translate-x-1/2"
             style={{ backgroundColor: theme.accent }} />

        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full opacity-5 -translate-x-1/2 -translate-y-1/2"
             style={{ backgroundColor: theme.accent }} />

        {/* Geometric Shapes (STATIC) */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 opacity-20 rotate-45"
             style={{ border: `4px solid ${theme.accent}` }} />

        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 opacity-20 rotate-12"
             style={{ border: `4px solid ${theme.muted}` }} />

        <div className="absolute top-1/3 right-1/3 w-24 h-24 opacity-15 rounded-full"
             style={{ border: `4px solid ${theme.light}` }} />

        {/* Diagonal Lines (STATIC) */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/3 left-0 w-full h-1 transform -rotate-12"
               style={{ backgroundImage: `linear-gradient(to right, transparent, ${theme.accent}33, transparent)` }} />

          <div className="absolute top-2/3 left-0 w-full h-1 transform rotate-12"
               style={{ backgroundImage: `linear-gradient(to right, transparent, ${theme.muted}33, transparent)` }} />

          <div className="absolute top-1/2 left-0 w-1 h-full transform rotate-12"
               style={{ backgroundImage: `linear-gradient(to bottom, transparent, ${theme.accent}26, transparent)` }} />
        </div>

        {/* Static Grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(${theme.accent}08 1px, transparent 1px),
              linear-gradient(90deg, ${theme.accent}08 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Radial wash (STATIC) */}
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(circle at center, ${theme.accent}0D, transparent 60%)` }}
        />
      </div>

      {/* Foreground content */}
      <div className="relative z-10 flex-1 flex items-start md:items-center justify-center py-10 px-4 md:px-6">
        {children}
      </div>
    </div>
  );
}

/* --------------------------- Cards & Typography -------------------------- */
export function FormCard({ className = "", children }) {
  return (
    <div
      className={`w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md ${className}`}
      style={{ border: `1px solid ${theme.muted}4D`, backgroundColor: theme.card }}
    >
      {children}
    </div>
  );
}

export function Title({ children }) {
  return <h1 className="text-2xl font-bold" style={{ color: theme.accent }}>{children}</h1>;
}

export function Label({ children }) {
  return (
    <label className="text-sm mb-1 block font-medium" style={{ color: "#000000" }}>
      {children}
    </label>
  );
}

/* ----------------------------- Input Components --------------------------- */
export function Input(props) {
  return (
    <input
      {...props}
      className="w-full rounded-lg px-3 py-2 outline-none border transition"
      style={{
        backgroundColor: theme.inputBg,
        color: theme.inputText,
        borderColor: theme.light,
      }}
      onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.accent}66`)}
      onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
    />
  );
}

export const FieldInput = Input;

export function FieldTextarea(props) {
  return (
    <textarea
      {...props}
      className="w-full rounded-lg px-3 py-2 outline-none border transition min-h-28"
      style={{
        backgroundColor: theme.inputBg,
        color: theme.inputText,
        borderColor: theme.light,
      }}
      onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.accent}66`)}
      onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
    />
  );
}

export function FieldSelect({ children, ...props }) {
  return (
    <select
      {...props}
      className="w-full rounded-lg px-3 py-2 outline-none border transition"
      style={{
        backgroundColor: theme.inputBg,
        color: theme.inputText,
        borderColor: theme.light,
      }}
      onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 2px ${theme.accent}66`)}
      onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      {children}
    </select>
  );
}

export function FieldRadio(props) {
  return <input type="radio" {...props} className="h-4 w-4 accent-current" style={{ color: theme.accent }} />;
}

export function FieldCheckbox(props) {
  return <input type="checkbox" {...props} className="h-4 w-4 accent-current" style={{ color: theme.accent }} />;
}

/* ------------------------------ Buttons --------------------------------- */
export function PrimaryButton({ className = "", ...props }) {
  return (
    <button
      {...props}
      className={`rounded-lg font-medium px-4 py-2 transition shadow hover:shadow-lg disabled:opacity-60 ${className}`}
      style={{ backgroundColor: theme.accent, color: theme.bg }}
    />
  );
}

export function SecondaryButton({ className = "", ...props }) {
  return (
    <button
      {...props}
      className={`rounded-lg font-medium px-4 py-2 transition border ${className}`}
      style={{ backgroundColor: theme.bg, color: theme.light, borderColor: theme.muted }}
    />
  );
}

export function AnimatedCtaButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      type={props.type || "button"}
      className={[
        "group relative inline-flex items-center justify-center rounded-md",
        "px-6 py-3 text-base font-semibold transition-all duration-200",
        "bg-slate-900 text-white hover:bg-slate-800",
        "focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:ring-offset-2 focus:ring-offset-slate-900",
        "active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed",
        className,
      ].join(" ")}
    >
      {/* Label + arrow */}
      <span className="inline-flex items-center gap-2">
        {children}
        <svg
          className="h-5 w-5 translate-x-0 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100"
          viewBox="0 0 448 512"
        >
          <path
            className="fill-current transition-colors duration-200 group-hover:text-amber-300"
            d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"
          />
        </svg>
      </span>

      {/* Sheen animation */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-md">
        <span
          className="
            absolute inset-y-0 left-[-120%] w-[140%]
            bg-gradient-to-r from-amber-300/0 via-amber-300/50 to-amber-300/0
            opacity-0 transition-all duration-700 ease-out
            group-hover:left-[120%] group-hover:opacity-100
          "
        />
      </span>
    </button>
  );
}

/* --------------------------- Alerts ------------------------------------ */
export function ErrorBox({ children }) {
  return (
    <div className="rounded-lg px-3 py-2 text-sm"
         style={{ backgroundColor: "#ff4d4d22", color: "#ff4d4d", border: "1px solid #ff4d4d55" }}>
      {children}
    </div>
  );
}

export function SuccessBox({ children }) {
  return (
    <div className="rounded-lg px-3 py-2 text-sm"
         style={{ backgroundColor: "rgba(16,185,129,0.15)", color: "#0f5132", border: "1px solid rgba(16,185,129,0.45)" }}>
      {children}
    </div>
  );
}

/* --------------------------- Wizard Stepper ---------------------------- */
export function BubbleStepper({ sections = [], currentIndex = 0 }) {
  const steps = sections.map((s) => (typeof s === "string" ? { title: s } : s));
  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        {steps.map((s, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          return (
            <React.Fragment key={i}>
              <div className="flex items-center gap-2">
                <div
                  className="h-8 w-8 rounded-full grid place-items-center text-sm font-semibold"
                  style={{
                    backgroundColor: active || done ? theme.accent : "rgba(255,255,255,0.12)",
                    color: active || done ? theme.bg : theme.light,
                    border: `1px solid ${done ? theme.accent : theme.muted}`,
                  }}
                >
                  {i + 1}
                </div>
                <div className="hidden sm:block text-xs" style={{ color: active ? theme.accent : theme.light }}>
                  {s.title}
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-[2px] relative">
                  <div className="absolute inset-0 rounded" style={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
                  <div
                    className="absolute inset-y-0 left-0 rounded"
                    style={{
                      width: done ? "100%" : "0%",
                      backgroundColor: theme.accent,
                      transition: "width .3s ease",
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

/* --------------------------- Wizard Shell ----------------------------- */
export function WizardShellHeader({ title, subtitle, percent, sections, currentIndex }) {
  return (
    <div className="px-5 sm:px-8 py-5"
         style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.65), rgba(0,0,0,0.45))" }}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold" style={{ color: theme.accent }}>
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm mt-0.5" style={{ color: theme.light }}>
              {subtitle}
            </p>
          )}
        </div>

        <div className="text-right">
          <div className="text-lg font-bold" style={{ color: theme.accent }}>{percent}%</div>
          <div className="text-[11px]" style={{ color: theme.light }}>Complete</div>
        </div>
      </div>

      <div className="mt-4">
        <BubbleStepper sections={sections} currentIndex={currentIndex} />
      </div>
    </div>
  );
}

/** Wraps header + white body card */
export function WizardShell({ title, subtitle, percent, sections, currentIndex, children }) {
  return (
    <FormCard className="p-0">
      <WizardShellHeader
        title={title}
        subtitle={subtitle}
        percent={percent}
        sections={sections}
        currentIndex={currentIndex}
      />
      {/* White region is black text by default */}
      <div className="bg-white text-black p-5 sm:p-8">{children}</div>
    </FormCard>
  );
}