// src/pages/AdminViewApplication.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getToken } from "../services/auth";
import {
  FormLayout,
  FormCard,
  Title,
  PrimaryButton,
} from "../layouts/LoginLayout";

export default function AdminViewApplication() {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    async function fetchApp() {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/admin/applications/${id}`,
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );
        const data = await res.json();
        setApp(data && !data.error ? data : null);
      } catch (e) {
        setApp(null);
      }
      setLoading(false);
    }
    fetchApp();
  }, [id]);

  return (
    <FormLayout>
      <FormCard>
        <Title>Application Details</Title>
        {loading ? (
          <p>Loading…</p>
        ) : !app ? (
          <p>Application not found.</p>
        ) : (
          <div style={{ color: "#cccccc" }}>
            <p><b>Username:</b> {app.username}</p>
            <p><b>Application ID:</b> {app.applicationId}</p>
            <p><b>Status:</b> {app.status}</p>
            <p><b>Created At:</b> {new Date(app.createdAt).toLocaleString()}</p>
            {/* Section-wise questions and answers */}
            {app.sections && app.sections.length > 0 ? (
              app.sections.map((section, idx) => (
                <div key={idx} style={{ marginTop: 24 }}>
                  <h4 style={{ color: '#fff', marginBottom: 8 }}>{section.sectionTitle}</h4>
                  {section.questions.map((q) => {
                    const ans = app.answers.find(a => a.questionId === q.questionId);
                    return (
                      <div key={q.questionId} style={{ marginBottom: 12 }}>
                        <div style={{ fontWeight: 500 }}>{q.questionText}</div>
                        <div style={{ color: '#ffe066', marginLeft: 8 }}>{ans ? ans.answer : <i>No response</i>}</div>
                      </div>
                    );
                  })}
                </div>
              ))
            ) : (
              <p>No form structure found.</p>
            )}
          </div>
        )}
        <PrimaryButton style={{ marginTop: 24 }} onClick={() => nav(-1)}>
          Back
        </PrimaryButton>
      </FormCard>
    </FormLayout>
  );
}
