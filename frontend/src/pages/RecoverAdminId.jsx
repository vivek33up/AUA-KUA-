// src/pages/RecoverAdminId.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function RecoverAdminId() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [adminId, setAdminId] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setAdminId("");

    if (!email.trim()) {
      setMsg("Please enter your email.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/test/recover-admin-id", {
        email: email.trim(),
      });
      setAdminId(res.data.adminId);
    } catch (err) {
      const errorMsg = err?.response?.data?.error;
      setMsg(errorMsg || "No admin account found for this email.");
    }
  };

  const copyAndGo = async () => {
    if (!adminId) return;
    try {
      await navigator.clipboard.writeText(adminId);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = adminId;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand("copy");
      } finally {
        document.body.removeChild(ta);
      }
    } finally {
      sessionStorage.setItem(
        "signupBanner",
        `Admin ID copied: ${adminId}. Please sign in using this ID.`,
      );
      nav(`/login?role=admin&adminId=${encodeURIComponent(adminId)}`, {
        replace: true,
      });
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 520, margin: "2rem auto" }}>
      <h2>Find my Admin ID</h2>

      <form
        onSubmit={submit}
        style={{ display: "grid", gap: 8, marginTop: 12 }}
      >
        <label>Official Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@org.com"
        />
        <button type="submit" className="primary">
          Find ID
        </button>
      </form>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}

      {adminId ? (
        <div style={{ marginTop: 16 }}>
          <p>
            Your Admin ID is: <b>{adminId}</b>
          </p>
          <button className="primary" onClick={copyAndGo}>
            Copy &amp; Go to Login
          </button>
        </div>
      ) : (
        msg && (
          <p style={{ marginTop: 16 }}>
            Don't have an admin account?{" "}
            <Link to="/signup?role=admin">Create Admin Account</Link>
          </p>
        )
      )}
    </div>
  );
}
