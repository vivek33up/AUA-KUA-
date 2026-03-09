// src/layouts/LoginLayout.jsx
import React from "react";


export const theme = {
  bg: "#333333",
  accent: "#ffe600",
  muted: "#999999",
  light: "#cccccc",
};

export function FormLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#333333] relative overflow-hidden flex flex-col">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Yellow Circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ffe600] rounded-full opacity-10 -translate-y-1/2 translate-x-1/2 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#ffe600] rounded-full opacity-10 translate-y-1/2 -translate-x-1/2 animate-pulse [animation-delay:1s]" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#ffe600] rounded-full opacity-5 -translate-x-1/2 -translate-y-1/2 animate-pulse [animation-delay:2s]" />

        {/* Geometric Shapes */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border-4 border-[#ffe600] opacity-20 rotate-45 animate-spin [animation-duration:20s]" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 border-4 border-[#999999] opacity-20 rotate-12 animate-spin [animation-duration:25s] [animation-direction:reverse]" />
        <div className="absolute top-1/3 right-1/3 w-24 h-24 border-4 border-[#cccccc] opacity-15 rounded-full animate-ping [animation-duration:3s]" />

        {/* Diagonal Lines */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ffe600]/20 to-transparent -rotate-12 animate-pulse" />
          <div className="absolute top-2/3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#999999]/20 to-transparent rotate-12 animate-pulse [animation-delay:1s]" />
          <div className="absolute top-1/2 left-0 w-1 h-full bg-gradient-to-b from-transparent via-[#ffe600]/15 to-transparent rotate-12 animate-pulse [animation-delay:0.5s]" />
        </div>

        {/* Grid Pattern */}
        <div
          className="
            absolute inset-0
            [background-image:linear-gradient(rgba(255,230,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,230,0,0.03)_1px,transparent_1px)]
            [background-size:50px_50px]
          "
        />

        {/* Floating Dots */}
        <div className="absolute top-1/4 right-1/3 w-3 h-3 bg-[#ffe600] rounded-full opacity-30 animate-bounce" />
        <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-[#cccccc] rounded-full opacity-40 animate-bounce [animation-delay:0.5s]" />
        <div className="absolute top-2/3 right-1/4 w-4 h-4 bg-[#999999] rounded-full opacity-20 animate-bounce [animation-delay:1s]" />

        {/* Radial Gradient Wash */}
        <div className="[background-image:radial-gradient(circle_at_center,#ffe6000d,transparent_60%)] absolute inset-0" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center py-12 px-4">
        {children}
      </div>
    </div>
  );
}

/** ====== FORM CARD (white content area) ======
 */
export function FormCard({ className = "", children }) {
  return (
    <div
      className={[
        "w-full max-w-md rounded-2xl shadow-2xl",
        "bg-white text-[#333333] ring-1 ring-black/5 border border-[#e5e7eb]",
        "p-6 sm:p-8",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

/** ===== (dark header with yellow avatar) ======
 */
export function Title({ children }) {
  return (
    <div className="relative -mx-6 -mt-6 mb-6 rounded-t-2xl bg-[#1e1e1e] px-6 pt-14 pb-6 text-center shadow-inner sm:-mx-8 sm:pt-16 sm:px-8">
      {/* Yellow circular avatar — positioned from the top of the header, NOT outside the card */}
      <div
        className="
          absolute left-1/2 -translate-x-1/2
          top-0 translate-y-[-50%]    /* shows the top half outside the header but inside the card boundary */
          w-14 h-14 sm:w-16 sm:h-16 rounded-full
          bg-[#ffe600] text-[#333333] flex items-center justify-center shadow-lg
        "
      >
        <svg
          className="w-7 h-7 sm:w-8 sm:h-8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20 21a8 8 0 1 0-16 0" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>

      <h1 className="text-white text-xl sm:text-2xl font-bold">{children}</h1>
      <p className="text-[#cccccc] text-sm mt-1">Sign in to continue</p>
    </div>
  );
}

/** Labels  */
export function Label({ children }) {
  return <label className="text-sm mb-1 text-black">{children}</label>;
}

/** Inputs: white, rounded, soft border, yellow focus ring */
export function Input(props) {
  return (
    <input
      {...props}
      className="
        w-full rounded-xl px-3 py-2
        bg-white text-[#333333] placeholder:text-[#9ca3af]
        border border-[#e5e7eb] shadow-sm
        outline-none transition
        focus:ring-2 focus:ring-[#ffe600]/50 focus:border-[#ffe600]
      "
    />
  );
}

/** Helper text (muted) */
export function HelperText({ children }) {
  return <p className="text-xs mt-2 text-[#6b7280]">{children}</p>;
}

/** Error (soft red) */
export function ErrorBox({ children }) {
  return (
    <div className="rounded-lg px-3 py-2 text-sm bg-[#ff4d4d]/10 text-[#b91c1c] border border-[#ff4d4d]/30">
      {children}
    </div>
  );
}

/** Banner (accent) */
export function Banner({ children }) {
  return (
    <div className="rounded-lg px-3 py-2 text-sm mb-4 text-[#8a6d00] border border-[#ffe600]/50 bg-[#ffe600]/20">
      {children}
    </div>
  );
}

/** Primary CTA (yellow) */
export function PrimaryButton({ className = "", ...props }) {
  return (
    <button
      {...props}
      className={[
        "w-full rounded-lg font-medium px-4 py-2 transition shadow hover:shadow-lg disabled:opacity-60",
        "bg-[#ffe600] text-[#333333]",
        className,
      ].join(" ")}
    />
  );
}

/** Secondary button (neutral outline) */
export function SecondaryButton({ className = "", ...props }) {
  return (
    <button
      {...props}
      className={[
        "w-full rounded-lg font-medium px-4 py-2 transition border",
        "bg-white text-[#374151] border-[#e5e7eb] hover:bg-gray-50",
        className,
      ].join(" ")}
    />
  );
}

/** Inline code chip (for Admin ID reveal) */
export function CodeChip({ children }) {
  return (
    <code className="px-3 py-2 rounded-lg text-sm bg-gray-100 text-[#333333] border border-[#e5e7eb]">
      {children}
    </code>
  );
}

/** Dialog Backdrop (darken page) */
export function DialogBackdrop({ children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      {children}
    </div>
  );
}

/** Dialog Card (dark translucent) */
export function DialogCard({ children }) {
  return (
    <div className="w-full max-w-md rounded-2xl border border-[#999999]/30 shadow-2xl backdrop-blur-md p-6 sm:p-8 bg-[rgba(20,20,20,0.85)]">
      {children}
    </div>
  );
}

/** Role Tabs — matches the Figma pill/segmented control look */
export function RoleTab({ active = false, children, ...props }) {
  return (
    <button
      type="button"
      {...props}
      className={[
        "px-6 py-2 rounded-full font-medium transition-all border",
        active
          ? "bg-[#ffe600] text-[#333333] border-[#ffe600] shadow-md"
          : "bg-white text-[#6b7280] border-[#e5e7eb] hover:text-[#374151]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
