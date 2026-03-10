import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  FormLayout,
  FormCard,
  Title,
  Label,
  Input,
  PrimaryButton,
  ErrorBox,
} from "../layouts/LoginLayout";

export default function ResetAdminPassword() {
  const [searchParams] = useSearchParams();
  const nav = useNavigate();
  
  // Extract token and role directly from URL
  const urlToken = searchParams.get("token") || "";
  const urlRole = searchParams.get("role") || "admin";

  const [token, setToken] = useState(urlToken);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role] = useState(urlRole);
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-fill token if it arrives in the URL later
  useEffect(() => {
    if (urlToken) {
      setToken(urlToken);
    }
  }, [urlToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match.");
    }
    if (newPassword.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:3000/test/complete-reset", {
        token,
        role,
        newPassword,
      });

      sessionStorage.setItem("signupBanner", "Password updated successfully. Please login.");
      nav("/login?role=" + role);
    } catch (err) {
      setError(err?.response?.data?.error || "Reset failed. Token may be invalid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormLayout>
      <FormCard>
        <Title>Set New Password</Title>
        {error && <ErrorBox>{error}</ErrorBox>}
        
        <form onSubmit={handleSubmit} className="grid gap-3">
          <Label>Reset Token</Label>
          <Input
            type="text"
            placeholder="Token will appear here automatically"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
            className={urlToken ? "bg-gray-50 border-green-200" : ""}
          />

          <Label>New Password</Label>
          <Input
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <Label>Confirm New Password</Label>
          <Input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <PrimaryButton type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </PrimaryButton>
        </form>
      </FormCard>
    </FormLayout>
  );
}