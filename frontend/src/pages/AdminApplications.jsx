// src/pages/AdminApplications.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../services/auth";
import {
  FormLayout,
  FormCard,
  Title,
  PrimaryButton,
} from "../layouts/LoginLayout";

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    async function fetchApplications() {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/admin/applications`,
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );
        const data = await res.json();
        setApplications(Array.isArray(data) ? data : []);
      } catch (e) {
        setApplications([]);
      }
      setLoading(false);
    }
    fetchApplications();
  }, []);

  return (
    <FormLayout>
      <FormCard>
        <Title>Applications List</Title>
        {/* Remove 'Sign in to continue' */}
        {loading ? (
          <p>Loading…</p>
        ) : applications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          <table style={{ width: "100%", color: "#cccccc", marginTop: 16 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Username</th>
                <th style={{ textAlign: "left" }}>Application ID</th>
                <th style={{ textAlign: "left" }}>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.applicationId}>
                  <td>{app.username}</td>
                  <td>{app.applicationId}</td>
                  <td>{app.status}</td>
                  <td>
                    <PrimaryButton
                      style={{ padding: "2px 12px", fontSize: 14 }}
                      onClick={() => nav(`/admin/applications/${app.applicationId}`)}
                    >
                      View Application
                    </PrimaryButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </FormCard>
    </FormLayout>
  );
}
