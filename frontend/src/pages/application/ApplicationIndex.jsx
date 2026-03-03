// src/pages/application/ApplicationIndex.jsx
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/auth";

export default function ApplicationIndex() {
  const nav = useNavigate();
  return (
    <div style={{ padding: 24 }}>
      <h2>Application Area</h2>
      <p>this is the Application Form</p>
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
