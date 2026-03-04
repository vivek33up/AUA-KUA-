// src/pages/Signup.jsx
import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import RoleTabs from "../components/RoleTabs";
import axios from "axios";
import "../styles/auth.css";

export default function Signup() {
  const nav = useNavigate();
  const loc = useLocation();
  const qs = useMemo(() => new URLSearchParams(loc.search), [loc.search]);

  const [role, setRole] = useState(qs.get("role") || "user");
  const [form, setForm] = useState({ name: "", email: qs.get("email") || "", password: "", organization: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const { name, email, password, organization } = form;
    if (!name || !email || !password) { setError("Name, email and password are required."); return; }
    if (role === "user" && !organization) { setError("Organization name is required for AUA/KUA entities."); return; }

    setLoading(true);
    try {
      await axios.post("http://localhost:3000/api/auth/signup", {
        name: name.trim(), email: email.trim(), password: password.trim(), role, organization: organization.trim() || null,
      });
      sessionStorage.setItem("signupBanner", "Account created successfully. Please sign in.");
      nav(`/login?role=${role}&email=${encodeURIComponent(email.trim())}`, { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.error;
      if (msg === "EMAIL_TAKEN") setError("An account with this email already exists for this role.");
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
          <h1>Create account</h1>
          <p className="auth-subtitle">AUA/KUA Compliance Portal</p>
        </div>

        <RoleTabs role={role} onChange={(r) => { setRole(r); if (error) setError(""); }} />

        <form className="auth-form" onSubmit={submit}>
          <label>Full name</label>
          <input name="name" type="text" value={form.name} onChange={onChange} placeholder="Your full name" />

          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={onChange} placeholder="you@organization.com" />

          {role === "user" && (
            <>
              <label>Organization</label>
              <input name="organization" type="text" value={form.organization} onChange={onChange} placeholder="Entity / Ministry / Department name" />
            </>
          )}

          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={onChange} placeholder="Create a strong password" />

          {error && <div className="auth-error">{error}</div>}

          <button className="primary" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Sign up"}
          </button>

          <p className="helper">
            Already have an account?{" "}
            <Link to={`/login?role=${role}${form.email ? `&email=${encodeURIComponent(form.email)}` : ""}`}>
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}