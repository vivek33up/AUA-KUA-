// src/pages/ForgotPassword.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/auth.css";

export default function ForgotPassword() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const email = form.email.trim();
    const newPassword = form.newPassword.trim();
    const confirmPassword = form.confirmPassword.trim();

    if (!email || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      await axios.post("http://localhost:3000/test/forgot-password-user", {
        email,
        newPassword,
      });

      setSuccess("Password reset successful! Redirecting to login...");
      setTimeout(() => {
        nav(`/login?role=user&email=${encodeURIComponent(email)}`, { replace: true });
      }, 1500);
    } catch (err) {
      const msg = err?.response?.data?.error;
      if (msg === "USER_NOT_FOUND") {
        setError("No account found with this email.");
      } else {
        setError(msg || "Something went wrong.");
      }
    }
  };

  return (
    <div className="auth-wrap">
      <h1>Reset Password</h1>

      <form className="auth-form" onSubmit={submit}>
        <label>Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          placeholder="you@org.com"
          autoFocus
        />

        <label>New Password</label>
        <input
          name="newPassword"
          type="password"
          value={form.newPassword}
          onChange={onChange}
          placeholder="Create a strong password"
        />

        <label>Confirm Password</label>
        <input
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={onChange}
          placeholder="Confirm your password"
        />

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <button className="primary" type="submit">
          Reset Password
        </button>

        <p className="helper">
          Remember your password?{" "}
          <Link to="/login?role=user">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
