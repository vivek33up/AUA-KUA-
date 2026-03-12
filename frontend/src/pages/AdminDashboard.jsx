// src/pages/AdminDashboard.jsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getSession, logout } from "../services/auth";
import {
  AdminShell,
  DataCard,
  Table,
  ViewButton,
  LogoutButton,
  StatusBadge,       
} from "../layouts/AdminDashboardLayout";

export default function AdminDashboard() {
  const nav = useNavigate();
  const session = getSession();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:3000/admin/applications";

  const fetchApplications = useCallback(async () => {
    if (!session?.token) {
      console.warn("No token available yet.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`Status: ${response.status}`);

      const data = await response.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setLoading(false);
    }
  }, [session?.token]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  const columns = [
    { key: "username", title: "Username", width: "25%" },
    { key: "applicationId", title: "Application ID", width: "25%" },
    { key: "status", title: "Form Status", width: "25%" },
    { key: "actions", title: "View Form", width: "25%" },
  ];

  // Build the actions section that will sit on the right side of the white card header
  const headerActions = (
    <div className="flex items-center gap-3">
      <div className="px-3 py-1.5 rounded-full bg-[#F3F4F6] border border-[#E5E7EB] text-sm text-[#374151]">
        Hello <span className="font-semibold">{session?.userId ? session.userId.substring(0, 6) : "Admin"}</span>
      </div>
      <LogoutButton onClick={handleLogout} />
    </div>
  );

  return (
    <AdminShell>
      <DataCard
        title="DASHBOARD"
        actions={headerActions}
      >
        <Table columns={columns}>
          {loading ? (
            <tr>
              <td colSpan={4} className="text-center py-16 text-[#374151]">
                Loading applications…
              </td>
            </tr>
          ) : applications.length > 0 ? (
            applications.map((app) => (
              <tr key={app.applicationId} className="hover:bg-[#F9FAFB]">
                <td className="align-middle text-[#111827]" style={{ padding: "15px" }}>
                  {app.username || "N/A"}
                </td>
                <td className="align-middle text-[#111827]" style={{ padding: "15px" }}>
                  {app.applicationId || "N/A"}
                </td>
                <td className="align-middle" style={{ padding: "15px" }}>
                  {/* Use StatusBadge for correct color mapping:
                      - "Submitted" -> light green (your custom 'submitted' tone)
                      - "Completed" -> success (emerald light green)
                      - others map as defined
                  */}
                  <StatusBadge value={app.status} />
                </td>
                <td className="align-middle" style={{ padding: "15px" }}>
                  <div className="w-full flex items-center justify-start">
                    <ViewButton
                      onClick={() => nav(`/admin/applications/${app.applicationId}`)}
                    />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-16 text-[#6B7280]">
                No applications found.
              </td>
            </tr>
          )}
        </Table>
      </DataCard>
    </AdminShell>
  );
}
