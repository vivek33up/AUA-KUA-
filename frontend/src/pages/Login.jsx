// src/pages/Login.jsx
import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import RoleTabs from "../components/RoleTabs";
import { setSession } from "../services/auth";
import axios from "axios";
import "../styles/auth.css";

const ROLE_REDIRECT = {
  user: "/dashboard",
  auditor: "/auditor",
  admin: "/admin",
};

export default function Login() {
  const nav = useNavigate();
  const loc = useLocation();
  const qs = useMemo(() => new URLSearchParams(loc.search), [loc.search]);

  const [role, setRole] = useState(qs.get("role") || "user");
  const [form, setForm] = useState({ email: qs.get("email") || "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [banner] = useState(() => {
    const msg = sessionStorage.getItem("signupBanner");
    if (msg) sessionStorage.removeItem("signupBanner");
    return msg || "";
  });

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const { email, password } = form;
    if (!email || !password) { setError("All fields required."); return; }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", { email: email.trim(), password: password.trim(), role });
      setSession({ userId: res.data.userId, name: res.data.name, email: res.data.email, role: res.data.role, organization: res.data.organization });
      nav(ROLE_REDIRECT[role] || "/dashboard", { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.error;
      if (msg === "USER_NOT_FOUND") setError("Account not found. Please sign up first.");
      else if (msg === "INVALID_PASSWORD") setError("Incorrect password.");
      else setError(msg || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-wrap">
        <div className="auth-header">
          <div className="auth-logo">🛡️</div>
          <h1>Sign in</h1>
          <p className="auth-subtitle">AUA/KUA Compliance Portal</p>
        </div>

        {banner && <div className="auth-banner">{banner}</div>}

        <RoleTabs role={role} onChange={(r) => { setRole(r); if (error) setError(""); }} />

        <form className="auth-form" onSubmit={submit}>
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={onChange} placeholder="you@organization.com" autoFocus />

          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={onChange} placeholder="••••••••" />

          {error && <div className="auth-error">{error}</div>}

          <button className="primary" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="helper">
            Don't have an account?{" "}
            <Link to={`/signup?role=${role}${form.email ? `&email=${encodeURIComponent(form.email)}` : ""}`}>
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}