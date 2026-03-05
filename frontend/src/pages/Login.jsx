// src/pages/Login.jsx
import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import RoleTabs from "../components/RoleTabs";
import { setToken } from "../services/auth";
import axios from "axios";
import "../styles/auth.css";

export default function Login() {
  const nav = useNavigate();
  const loc = useLocation();
  const qs = useMemo(() => new URLSearchParams(loc.search), [loc.search]);

  const [role, setRole] = useState(qs.get("role") === "admin" ? "admin" : "user");

  const [form, setForm] = useState({
    email: qs.get("email") || "",
    password: "",
    adminId: qs.get("adminId") || "",
  });

  const [error, setError] = useState("");

  // Show signup banner if exists
  const [banner] = useState(() => {
    const msg = sessionStorage.getItem("signupBanner");
    if (msg) sessionStorage.removeItem("signupBanner");
    return msg || "";
  });

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const onRoleChange = (r) => {
    setRole(r);
    if (error) setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (role === "user") {
      const email = form.email.trim();
      const password = form.password.trim();
      if (!email || !password) {
        setError("Enter email and password.");
        return;
      }

      try {
        // Call backend /test/login for user
        const res = await axios.post("http://localhost:3000/test/login", {
          email,
          password,
          role: "user",
        });

        // Store JWT token
        setToken(res.data.token);

        // Also keep userId/role in sessionStorage for quick access
        sessionStorage.setItem("userId", res.data.userId);
        sessionStorage.setItem("role", res.data.role);

        nav("/application", { replace: true });
      } catch (err) {
        const msg = err?.response?.data?.error;
        if (msg === "USER_NOT_FOUND") {
          nav(`/signup?role=user&email=${encodeURIComponent(email)}`, {
            replace: true,
          });
        } else if (msg === "Incorrect password") {
          setError("Incorrect password.");
        } else {
          setError(msg || "Something went wrong.");
        }
      }
    } else {
      // ADMIN
      const adminId = form.adminId.trim();
      const password = form.password.trim();
      if (!adminId || !password) {
        setError("Enter admin ID and password.");
        return;
      }

      try {
        // Call backend /test/login for admin
        const res = await axios.post("http://localhost:3000/test/login", {
          adminId,
          password,
          role: "admin",
        });

        // Store JWT token
        setToken(res.data.token);

        // Also keep userId/role in sessionStorage for quick access
        sessionStorage.setItem("userId", res.data.userId);
        sessionStorage.setItem("role", res.data.role);

        nav("/admin", { replace: true });
      } catch (err) {
        const msg = err?.response?.data?.error;
        if (msg === "Admin ID not found") {
          setError(
            "Admin ID not found. Check your ID or use 'Find my Admin ID'."
          );
        } else if (msg === "Incorrect password") {
          setError("Incorrect password.");
        } else {
          setError(msg || "Something went wrong.");
        }
      }
    }
  };

  return (
    <div className="auth-wrap">
      <h1>Sign in</h1>

      {banner && <div className="auth-banner">{banner}</div>}

      <RoleTabs role={role} onChange={onRoleChange} />

      <form className="auth-form" onSubmit={submit}>
        {role === "user" ? (
          <>
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="you@org.com"
              autoFocus
            />
          </>
        ) : (
          <>
            <label>Admin ID</label>
            <input
              name="adminId"
              type="text"
              value={form.adminId}
              onChange={onChange}
              placeholder="e.g. ADM-20260304-XXXXXX"
              autoFocus
            />
          </>
        )}

        <label>Password</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          placeholder="••••••••"
        />

        {error && <div className="auth-error">{error}</div>}

        <button className="primary" type="submit">
          Login
        </button>

        <p className="helper">
          {role === "admin" ? (
            <>
              <Link to="/recover-admin-id">Find my Admin ID</Link>{" · "}
              <Link to="/reset-admin-password">Forgot password?</Link>{" · "}
              <Link to="/signup?role=admin">Create account</Link>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <Link
                to={`/signup?role=user${form.email ? `&email=${encodeURIComponent(form.email)}` : ""
                  }`}
              >
                Create one
              </Link>
              {" · "}
              <Link to="/forgot-password">Forgot password?</Link>
            </>
          )}
        </p>
      </form>
    </div>
  );
}