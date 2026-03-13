import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
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

export default function ResetPasswordRequest() {
  const [searchParams] = useSearchParams();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [role] = useState(searchParams.get("role") || "user");
  const [bannerContent, setBannerContent] = useState(null); // Changed to object for better UI
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
// frontend/src/pages/ResetPasswordRequest.jsx

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setBannerContent(null);
  setLoading(true);

  try {
    // CHANGE THIS LINE: from /forgot-password to /request-reset
    const res = await axios.post("http://localhost:3000/test/request-reset", {
      email,
      role, // Ensure your backend logic handles the 'role' if needed
    });

    const token = res.data.resetToken;
    const targetUrl = `/reset-admin-password?role=${role}&token=${token}`;

    setBannerContent({
      message: res.data.message,
      url: targetUrl
    });
  } catch (err) {
    // This will now catch the 404 if the email is missing or 500 on server error
    setError(err?.response?.data?.error || "Failed to request reset.");
  } finally {
    setLoading(false);
  }
};

  return (
    <FormLayout>
      <FormCard>
        <Title>Reset Password</Title>
        <p className="text-sm text-center mb-4 text-gray-600">
          Enter your {role} email to receive a reset token.
        </p>

        {bannerContent && (
          <Banner style={{ backgroundColor: "#dcfce7", color: "#166534", padding: "1rem" }}>
            <div className="flex flex-col gap-2">
              <p className="font-medium">{bannerContent.message}</p>
              <button 
                onClick={() => nav(bannerContent.url)}
                className="bg-green-700 text-white px-3 py-1.5 rounded text-sm font-bold hover:bg-green-800 transition shadow-sm"
              >
                Click here to Reset Password now
              </button>
            </div>
          </Banner>
        )}

        {error && <ErrorBox>{error}</ErrorBox>}

        <form onSubmit={handleSubmit} className="grid gap-3 mt-4">
          <Label>Email Address</Label>
          <Input
            type="email"
            placeholder="you@org.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <PrimaryButton type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </PrimaryButton>

          <div className="text-center mt-2">
            <Link to="/login" className="text-sm underline">Back to Login</Link>
          </div>
        </form>
      </FormCard>
    </FormLayout>
  );
}