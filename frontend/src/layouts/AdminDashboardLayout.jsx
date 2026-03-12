// src/layouts/AdminLayout.jsx
import React from "react";
import { FormLayout } from "./LoginLayout";

/** ---------- Admin Shell ---------- */

export function AdminShell({ children }) {
  return (
    <FormLayout>
      <div className="w-[95%] max-w-7xl mx-auto text-[#111827] py-6">
        {children}
      </div>
    </FormLayout>
  );
}

/** ---------- Logout Button ----------
 * Yellow accent button (matches your theme) with accessible focus states.
 */
export function LogoutButton(props) {
  return (
    <button
      {...props}
      className="
        inline-flex items-center gap-2 rounded-lg font-semibold
        px-4 py-2 transition shadow hover:shadow-lg focus:outline-none
        focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#ffe600] focus-visible:ring-offset-white
        bg-[#ffe600] text-[#111827] border border-black/10
        active:translate-y-[1px]
      "
      type="button"
      aria-label="Log out"
      title="Log out"
    >
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="M16 17l5-5-5-5" />
        <path d="M21 12H9" />
      </svg>
      Logout
    </button>
  );
}

/** ---------- Rule ----------
 * Optional divider you can use outside cards if you stack sections.
 */
export function Rule() {
  return <hr className="border-white/30 my-6" />;
}

export function DataCard({
  className = "",
  children,
  title,
  subtitle,
  actions,
}) {
  return (
    <div
      className={[
        // Bigger, more premium card
        "bg-white text-[#111827] rounded-2xl border border-[#E5E7EB] shadow-2xl overflow-hidden",
        // Increase inner spacing
        "pb-4 sm:pb-6",
        className,
      ].join(" ")}
    >
      {/* Black header bar */}
      <div className="bg-[#111111] text-white px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            {title && (
              <div className="flex items-center gap-3">
                {/* Accent dot to tie with your yellow brand */}
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#ffe600]" />
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-wide">
                  {title}
                </h2>
              </div>
            )}
            {subtitle && (
              <p className="text-sm text-[#D1D5DB] mt-2">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-3">{actions}</div>
          )}
        </div>
      </div>

      {/* Inner body beautification wrapper */}
      <div className="px-5 sm:px-6 pt-4">{children}</div>
    </div>
  );
}

/** ---------- Table ---------- */

export function Table({ columns = [], children, stickyHeader = true }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#E5E7EB]">
      <table className="w-full border-collapse">
        <thead className={stickyHeader ? "sticky top-0 z-10" : ""}>
          <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
            {columns.map((col, idx) => (
              <th
                key={col.key ?? idx}
                className={[
                  "text-left font-semibold text-xs sm:text-sm text-[#374151]",
                  "uppercase tracking-wide",
                ].join(" ")}
                style={{
                  padding: "14px 16px",
                  width: col.width ?? "auto",
                }}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        {/* Zebra rows + hover highlight */}
        <tbody className="divide-y divide-[#E5E7EB]">
          {React.Children.count(children) > 0 ? (
            React.Children.map(children, (row, idx) => (
              <tr
                className={[
                  "transition-colors",
                  idx % 2 === 1 ? "bg-white" : "bg-[#FBFBFB]",
                  "hover:bg-[#F3F4F6]",
                ].join(" ")}
              >
                {row.props?.children}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length || 1}
                className="text-center py-16 text-[#6B7280]"
              >
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/** ---------- Badge ----------
 * Refined tones for white surface.
 */
export function Badge({ tone = "default", children }) {
  const tones = {
    default: "bg-gray-100 text-gray-800 border-gray-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-rose-50 text-rose-700 border-rose-200",
    info: "bg-sky-50 text-sky-700 border-sky-200",
  };
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border",
        "shadow-sm",
        tones[tone] || tones.default,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

/** ---------- StatusBadge ----------
 * Auto-maps a status string to the right tone.
 * Includes special handling so "Submitted" shows as a pleasant light green.
 */
export function StatusBadge({ value }) {
  const s = String(value || "").toLowerCase().trim();

  // Map common statuses
  let tone = "default";
  if (/(submitted|approve|approved|success|completed|done)/.test(s)) tone = "success";
  else if (/(pending|in\s*progress|waiting|queued|hold)/.test(s)) tone = "warning";
  else if (/(reject|rejected|declined|failed|error)/.test(s)) tone = "danger";
  else if (/(review|info|open)/.test(s)) tone = "info";

  // Normalize display text (capitalize first letter)
  const label =
    value && typeof value === "string"
      ? value.charAt(0).toUpperCase() + value.slice(1)
      : "Unknown";

  return <Badge tone={tone}>{label}</Badge>;
}

/** ---------- View Button (Updated) ---------- */
 

export function ViewButton({ className = "", children = "View", ...props }) {
  return (
    <button
      {...props}
      type="button"
      className={[
        "inline-flex items-center gap-2 rounded-full font-semibold",
        "px-4 py-1.5 transition border",
        "bg-black text-white border-black shadow-sm",
        "hover:bg-[#111111] hover:shadow",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe600]",
        "active:translate-y-[1px]",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default {
  AdminShell,
  Rule,
  DataCard,
  Table,
  Badge,
  StatusBadge,
  ViewButton,
  LogoutButton,
};