// src/components/RoleTabs.jsx
import "../styles/auth.css";

export default function RoleTabs({ role, onChange }) {
  return (
    <div className="role-tabs">
      <button
        type="button"
        className={`role-btn ${role === "user" ? "active" : ""}`}
        onClick={() => onChange("user")}
      >
        User
      </button>

      <button
        type="button"
        className={`role-btn ${role === "admin" ? "active" : ""}`}
        onClick={() => onChange("admin")}
      >
        Admin
      </button>
    </div>
  );
}
