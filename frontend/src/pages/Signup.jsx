// src/pages/Signup.jsx
import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import RoleTabs from "../components/RoleTabs";
import { signupUser, signupAdmin } from "../services/auth";
import "../styles/auth.css";

export default function Signup() {
  const nav = useNavigate();
  const loc = useLocation();
  const qs = useMemo(() => new URLSearchParams(loc.search), [loc.search]);

  const [role, setRole] = useState(
    qs.get("role") === "admin" ? "admin" : "user",
  );
  const [form, setForm] = useState({
    name: "",
    email: qs.get("email") || "",
    password: "",
  });
  const [error, setError] = useState("");

  // After admin signup, reveal the generated Admin ID with a Copy button
  const [adminReveal, setAdminReveal] = useState({ show: false, adminId: "" });

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const copyAdminIdAndGotoLogin = async () => {
    const id = adminReveal.adminId;
    if (!id) return;

    try {
      await navigator.clipboard.writeText(id);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = id;
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
        `Admin ID copied: ${id}. Please sign in using this ID.`,
      );
      nav(`/login?role=admin&adminId=${encodeURIComponent(id)}`, {
        replace: true,
      });
    }
  };

  const gotoAdminLoginWithoutCopy = () => {
    const id = adminReveal.adminId;
    sessionStorage.setItem(
      "signupBanner",
      `Your Admin ID is ${id}. Please sign in using this ID.`,
    );
    nav(`/login?role=admin&adminId=${encodeURIComponent(id)}`, {
      replace: true,
    });
  };

  const submit = (e) => {
    e.preventDefault();
    setError("");

    if (role === "user") {
      const { name, email, password } = form;
      if (!name || !email || !password) {
        setError("All fields are required.");
        return;
      }
      try {
        signupUser({
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
        });
        sessionStorage.setItem(
          "signupBanner",
          "Your account was created. Please sign in.",
        );
        nav(`/login?role=user&email=${encodeURIComponent(email.trim())}`, {
          replace: true,
        });
      } catch (err) {
        if (err && typeof err === "object" && "message" in err) {
          const msg = err.message;
          if (msg === "USER_EXISTS") {
            setError(
              "An account with this email already exists. Try logging in.",
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
    } else {
      const { name, email, password } = form;
      if (!name || !email || !password) {
        setError("All fields are required.");
        return;
      }
      try {
        const admin = signupAdmin({
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
        });

        setAdminReveal({ show: true, adminId: admin.adminId });
      } catch (err) {
        if (err && typeof err === "object" && "message" in err) {
          const msg = err.message;
          if (msg === "ADMIN_EMAIL_TAKEN") {
            setError(
              "An admin with this email already exists. Try logging in or recovery.",
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
      <h1>Create account</h1>

      <RoleTabs
        role={role}
        onChange={(r) => {
          setRole(r);
          if (error) setError("");
        }}
      />

      <form className="auth-form" onSubmit={submit}>
        <label>Full name</label>
        <input
          name="name"
          type="text"
          value={form.name}
          onChange={onChange}
          placeholder="Your name"
        />

        {/* USER fields */}
        {role === "user" && (
          <>
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="you@org.com"
            />
          </>
        )}

        {/* ADMIN fields (Admin ID is generated; not an input) */}
        {role === "admin" && (
          <>
            <label>Official Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="admin@org.com"
            />
          </>
        )}

        <label>Password</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          placeholder="Create a strong password"
        />

        {error && <div className="auth-error">{error}</div>}

        <button className="primary" type="submit">
          Sign up
        </button>

        <p className="helper">
          Already have an account?{" "}
          <Link
            to={`/login?role=${role}${
              role === "user" && form.email
                ? `&email=${encodeURIComponent(form.email)}`
                : ""
            }`}
          >
            Sign in
          </Link>
        </p>
      </form>

      {/* Admin ID Reveal Card */}
      {adminReveal.show && (
        <div className="reveal-backdrop">
          <div className="reveal-card">
            <h2>Admin ID generated</h2>
            <p className="muted">
              Save this ID securely. You’ll use it to sign in.
            </p>

            <div className="code-row">
              <code className="code-chip">{adminReveal.adminId}</code>
              <button className="primary" onClick={copyAdminIdAndGotoLogin}>
                Copy &amp; Go to Login
              </button>
            </div>

            <button className="secondary" onClick={gotoAdminLoginWithoutCopy}>
              Skip &amp; Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
