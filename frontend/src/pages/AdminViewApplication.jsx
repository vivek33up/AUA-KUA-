// src/pages/AdminViewApplication.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getToken } from "../services/auth";
import AdminViewApplicationLayout from "../layouts/AdminViewApplicationLayout";

export default function AdminViewApplication() {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    async function fetchApp() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/admin/applications/${id}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
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
    <AdminViewApplicationLayout
      app={app}
      loading={loading}
      onBack={() => nav("/admin")}
    />
  );
}