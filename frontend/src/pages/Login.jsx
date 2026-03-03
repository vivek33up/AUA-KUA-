import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import RoleTabs from "../components/RoleTabs";
import { loginUser, loginAdmin, logout } from "../services/auth";
import "../styles/auth.css";

export default function Login() {
  const nav = useNavigate();
  const loc = useLocation();
  const qs = useMemo(() => new URLSearchParams(loc.search), [loc.search]);

  const [role, setRole] = useState(
    qs.get("role") === "admin" ? "admin" : "user",
  );

  const [form, setForm] = useState({
    email: qs.get("email") || "",
    password: "",
    adminId: qs.get("adminId") || "",
  });

  const [error, setError] = useState("");

  // Read banner only once from sessionStorage (no effect setState)
  const [banner] = useState(() => {
    const msg = sessionStorage.getItem("signupBanner");
    if (msg) sessionStorage.removeItem("signupBanner");
    return msg || "";
  });

  useEffect(() => {
    logout(); // safe, idempotent
  }, []);

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const onRoleChange = (r) => {
    setRole(r);
    if (error) setError("");
  };

  const submit = (e) => {
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
        loginUser({ email, password });
        nav("/application", { replace: true });
      } catch (err) {
        if (err && typeof err === "object" && "message" in err) {
          const msg = err.message;
          if (msg === "USER_NOT_FOUND") {
            // (Optional) auto-route to signup for user
            nav(`/signup?role=user&email=${encodeURIComponent(email)}`, {
              replace: true,
            });
          } else if (msg === "INVALID_PASSWORD") {
            setError("Incorrect password.");
          } else {
            setError(
              typeof msg === "string" && msg ? msg : "Something went wrong.",
            );
          }
        } else {
          setError("Something went wrong.");
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
        loginAdmin({ adminId, password });
        nav("/admin", { replace: true });
      } catch (err) {
        if (err && typeof err === "object" && "message" in err) {
          const msg = err.message;
          if (msg === "INVALID_PASSWORD") {
            setError("Incorrect password.");
          } else if (msg === "ADMIN_NOT_FOUND") {
            setError(
              "Admin ID not found. Check your ID or use 'Find my Admin ID' below.",
            );
          } else {
            setError(
              typeof msg === "string" && msg ? msg : "Something went wrong.",
            );
          }
        } else {
          setError("Something went wrong.");
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
              placeholder="e.g. ADM-20260303-AB7X9Q"
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
              <Link to="/recover-admin-id">Find my Admin ID</Link>
              {" · "}
              <Link to="/reset-admin-password">Forgot password?</Link>
              {" · "}
              <Link to="/signup?role=admin">Create account</Link>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <Link
                to={`/signup?role=user${form.email ? `&email=${encodeURIComponent(form.email)}` : ""}`}
              >
                Create one
              </Link>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
