// src/pages/Login.jsx
import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import RoleTabs from "../components/RoleTabs";
import { setToken } from "../services/auth";
import axios from "axios";

import {
  FormLayout,
  FormCard,
  Title,
  Label,
  Input,
  PrimaryButton,
  ErrorBox,
  Banner,
} from "../layouts/LoginLayout";

export default function Login() {
  const nav = useNavigate();
  const loc = useLocation();
  const qs = useMemo(() => new URLSearchParams(loc.search), [loc.search]);

  const [role, setRole] = useState(qs.get("role") === "admin" ? "admin" : "user");

  // We now use 'email' for both Admin and User
  const [form, setForm] = useState({
    email: qs.get("email") || "",
    password: "",
  });

  const [error, setError] = useState("");

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

    const email = form.email.trim();
    const password = form.password.trim();

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/test/login", {
        email,
        password,
        role, // Dynamically sends 'admin' or 'user'
      });

      setToken(res.data.token);
      sessionStorage.setItem("userId", res.data.userId);
      sessionStorage.setItem("role", res.data.role);

      // Redirect based on role
      if (res.data.role === "admin") {
        nav("/admin", { replace: true });
      } else {
        nav("/application", { replace: true });
      }
    } catch (err) {
      const msg = err?.response?.data?.error;
      
      if (msg === "USER_NOT_FOUND" || msg === "Admin account not found") {
        setError(`${role === 'admin' ? 'Admin' : 'User'} account not found.`);
      } else if (msg === "Incorrect password") {
        setError("Incorrect password. Please try again.");
      } else {
        setError(msg || "Something went wrong.");
      }
    }
  };

  return (
    <FormLayout>
      <FormCard>
        <Title>Sign in</Title>

        {banner && <Banner>{banner}</Banner>}

        <RoleTabs role={role} onChange={onRoleChange} />

        <form className="grid gap-3" onSubmit={submit}>
          <Label>{role === "admin" ? "Admin Email" : "Email"}</Label>
          <Input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            placeholder={role === "admin" ? "admin@org.com" : "you@org.com"}
            autoFocus
            required
          />

          <Label>Password</Label>
          <Input
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            placeholder="••••••••"
            required
          />

          {error && <ErrorBox>{error}</ErrorBox>}

          <PrimaryButton type="submit">Login</PrimaryButton>

          <div className="text-sm mt-1" style={{ color: "#201f1f" }}>
            {role === "admin" ? (
              <div className="flex flex-wrap gap-2">
                <Link to="/forgot-password?role=admin" className="underline">Forgot password?</Link>
                <span>·</span>
                <Link to="/signup?role=admin" className="underline">Create admin account</Link>
              </div>
            ) : (
              <p>
                Don&apos;t have an account?{" "}
                <Link
                  to={`/signup?role=user${form.email ? `&email=${encodeURIComponent(form.email)}` : ""}`}
                  className="underline"
                >
                  Create one
                </Link>
              </p>
            )}
          </div>
        </form>
      </FormCard>
    </FormLayout>
  );
}