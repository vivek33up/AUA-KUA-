// src/pages/AdminDashboard.jsx
import { useNavigate } from "react-router-dom";
import { getSession, logout } from "../services/auth";
import {
  FormLayout,
  FormCard,
  Title,
  PrimaryButton,
} from "../layouts/LoginLayout";

export default function AdminDashboard() {
  const nav = useNavigate();
  const session = getSession();

  return (
    <FormLayout>
      <FormCard>
        <Title>Admin Dashboard</Title>
        <p className="mb-4" style={{ color: "#cccccc" }}>
          Signed in as: <b>{session?.userId}</b> (Role: {session?.role})
        </p>
        <ul className="list-disc ml-5 space-y-1 mb-6" style={{ color: "#cccccc" }}>
          <li>Review onboarding applications</li>
          <li>View audits &amp; statuses</li>
          {/* Add admin tools here */}
        </ul>
        <PrimaryButton
          onClick={() => {
            logout();
            nav("/login");
          }}
        >
          Logout
        </PrimaryButton>
      </FormCard>
    </FormLayout>
  );
}
