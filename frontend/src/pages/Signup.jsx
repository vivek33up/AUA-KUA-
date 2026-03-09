// src/pages/Signup.jsx
import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import RoleTabs from "../components/RoleTabs";
import axios from "axios";

import {
  FormLayout,
  FormCard,
  Title,
  Label,
  Input,
  PrimaryButton,
  SecondaryButton,
  ErrorBox,
  DialogBackdrop,
  DialogCard,
  CodeChip,
  HelperText,
} from "../layouts/LoginLayout";

export default function Signup() {
  const nav = useNavigate();
  const loc = useLocation();
  const qs = useMemo(() => new URLSearchParams(loc.search), [loc.search]);

  const [role, setRole] = useState(qs.get("role") === "admin" ? "admin" : "user");
  const [form, setForm] = useState({
    name: "",
    email: qs.get("email") || "",
    password: "",
  });
  const [error, setError] = useState("");

  // Admin ID reveal state
  const [adminReveal, setAdminReveal] = useState({ show: false, adminId: "" });

  // Input change handler
  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  // Copy admin ID & navigate to login
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
        `Admin ID copied: ${id}. Please sign in using this ID.`
      );
      nav(`/login?role=admin&adminId=${encodeURIComponent(id)}`, { replace: true });
    }
  };

  // Skip copy, just navigate
  const gotoAdminLoginWithoutCopy = () => {
    const id = adminReveal.adminId;
    sessionStorage.setItem(
      "signupBanner",
      `Your Admin ID is ${id}. Please sign in using this ID.`
    );
    nav(`/login?role=admin&adminId=${encodeURIComponent(id)}`, { replace: true });
  };

  // Form submission
  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, password } = form;
    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/test/add-user", {
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        role,
      });

      if (role === "user") {
        sessionStorage.setItem(
          "signupBanner",
          "Your account was created. Please sign in."
        );
        nav(`/login?role=user&email=${encodeURIComponent(email.trim())}`, {
          replace: true,
        });
      } else {
        // Admin: show generated admin ID
        const adminId = res.data.adminId;
        setAdminReveal({ show: true, adminId });
      }
    } catch (err) {
      const msg = err?.response?.data?.error;

      if (msg === "USER_EXISTS") {
        setError("An account with this email already exists. Try logging in.");
      } else if (msg === "ADMIN_EMAIL_TAKEN") {
        setError("An admin with this email already exists. Try logging in or recovery.");
      } else {
        setError("Something went wrong.");
      }
    }
  };

  return (
    <FormLayout>
      <FormCard>
        <Title>Create account</Title>

        <RoleTabs
          role={role}
          onChange={(r) => {
            setRole(r);
            if (error) setError("");
          }}
        />

        <form className="grid gap-3" onSubmit={submit}>
          <Label>Full name</Label>
          <Input
            name="name"
            type="text"
            value={form.name}
            onChange={onChange}
            placeholder="Your name"
          />

          {/* Email input */}
          {role === "user" && (
            <>
              <Label>Email</Label>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="you@org.com"
              />
            </>
          )}

          {role === "admin" && (
            <>
              <Label>Official Email</Label>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="admin@org.com"
              />
              <HelperText>We’ll generate an Admin ID from this email.</HelperText>
            </>
          )}

          <Label>Password</Label>
          <Input
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            placeholder="Create a strong password"
          />

          {error && <ErrorBox>{error}</ErrorBox>}

          <PrimaryButton type="submit">Sign up</PrimaryButton>

          <p className="text-sm mt-1" style={{ color: "#201f1f" }}>
            Already have an account?{" "}
            <Link
              to={`/login?role=${role}${
                role === "user" && form.email ? `&email=${encodeURIComponent(form.email)}` : ""
              }`}
              className="underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </FormCard>

      {/* Admin ID Reveal Card */}
      {adminReveal.show && (
        <DialogBackdrop>
          <DialogCard>
            <h2 className="text-xl font-semibold mb-2" style={{ color: "#ffe600" }}>
              Admin ID generated
            </h2>
            <p className="text-sm mb-4" style={{ color: "#201f1f"}}>
              Save this ID securely. You’ll use it to sign in.
            </p>

            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <CodeChip>{adminReveal.adminId}</CodeChip>
              <PrimaryButton onClick={copyAdminIdAndGotoLogin}>
                Copy &amp; Go to Login
              </PrimaryButton>
            </div>

            <SecondaryButton onClick={gotoAdminLoginWithoutCopy}>
              Skip &amp; Go to Login
            </SecondaryButton>
          </DialogCard>
        </DialogBackdrop>
      )}
    </FormLayout>
  );
}
