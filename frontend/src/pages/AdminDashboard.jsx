// src/pages/AdminDashboard.jsx
import { useNavigate } from "react-router-dom";
import { getSession, logout } from "../services/auth";

export default function AdminDashboard() {
  const nav = useNavigate();
  const session = getSession();

  return (
    <div style={{ padding: 24 }}>
      <h2>Admin Dashboard</h2>
      <p>
        Signed in as: <b>{session?.userId}</b> (Role: {session?.role})
      </p>
      <ul>
        <li>Review onboarding applications</li>
        <li>View audits &amp; statuses</li>
        {/* Add admin tools here */}
      </ul>
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
