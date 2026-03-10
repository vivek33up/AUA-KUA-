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
        <div className="mb-6" style={{ color: "#cccccc" }}>
          <PrimaryButton
            style={{ marginBottom: 12, width: "100%" }}
            onClick={() => nav("/admin/applications")}
          >
            Review onboarding applications
          </PrimaryButton>
          <div style={{ marginTop: 8, opacity: 0.7 }}>
            <span>View audits &amp; statuses</span>
          </div>
        </div>
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
