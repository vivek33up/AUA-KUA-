// src/pages/application/ApplicationIndex.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/auth";

export default function ApplicationIndex() {
  const nav = useNavigate();

  // Auto-redirect to the form when this page mounts
  useEffect(() => {
    nav("/application/form", { replace: true });
  }, [nav]);

  return (
    <div style={{ padding: 24 }}>
      <h2>Application Area</h2>
      <p>Redirecting to the Application Form…</p>

      {/* Keep logout accessible if needed */}
      <button
        onClick={() => {
          logout();
          nav("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
}
