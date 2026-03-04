// src/components/RoleTabs.jsx
import "../styles/auth.css";

const ROLES = [
  { key: "user", label: "AUA/KUA Entity" },
  { key: "auditor", label: "Auditor" },
  { key: "admin", label: "Admin (UIDAI)" },
];

export default function RoleTabs({ role, onChange }) {
  return (
    <div className="role-tabs">
      {ROLES.map((r) => (
        <button
          key={r.key}
          type="button"
          className={`role-btn ${role === r.key ? "active" : ""}`}
          onClick={() => onChange(r.key)}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
