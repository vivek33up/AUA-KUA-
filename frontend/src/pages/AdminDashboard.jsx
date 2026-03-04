// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSession } from "../services/auth";
import axios from "axios";
import "../styles/dashboard.css";

export default function AdminDashboard() {
  const session = getSession();
  const [audits, setAudits] = useState([]);
  const [auditors, setAuditors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignModal, setAssignModal] = useState(null);
  const [selectedAuditor, setSelectedAuditor] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [auditsRes, auditorsRes] = await Promise.all([
        axios.get("http://localhost:3000/api/audits?role=admin"),
        axios.get("http://localhost:3000/api/auditors"),
      ]);
      setAudits(auditsRes.data);
      setAuditors(auditorsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const assignAuditor = async () => {
    if (!selectedAuditor || !assignModal) return;
    try {
      await axios.post(`http://localhost:3000/api/audits/${assignModal}/assign`, { auditorId: selectedAuditor });
      setAssignModal(null);
      setSelectedAuditor("");
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (auditId, status) => {
    const msg = status === "approved"
      ? "Approve this audit? This certifies the entity as compliant."
      : "Reject this audit? The entity will need to address the issues.";
    if (!window.confirm(msg)) return;
    try {
      await axios.put(`http://localhost:3000/api/audits/${auditId}/status`, { status });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const statusCounts = {
    total: audits.length,
    submitted: audits.filter(a => a.status === "submitted").length,
    underReview: audits.filter(a => a.status === "under_review").length,
    approved: audits.filter(a => a.status === "approved").length,
    rejected: audits.filter(a => a.status === "rejected").length,
  };

  return (
    <div>
      <div className="page-header">
        <h2>Admin Dashboard</h2>
        <p>UIDAI Compliance Management — {session?.name}</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#eff6ff" }}>📋</div>
          <div className="stat-info">
            <h3>{statusCounts.total}</h3>
            <p>Total Audits</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#dbeafe" }}>📤</div>
          <div className="stat-info">
            <h3>{statusCounts.submitted}</h3>
            <p>Awaiting Assignment</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#e0e7ff" }}>🔍</div>
          <div className="stat-info">
            <h3>{statusCounts.underReview}</h3>
            <p>Under Review</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#d1fae5" }}>✅</div>
          <div className="stat-info">
            <h3>{statusCounts.approved}</h3>
            <p>Approved</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#fee2e2" }}>❌</div>
          <div className="stat-info">
            <h3>{statusCounts.rejected}</h3>
            <p>Rejected</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ margin: 0, fontWeight: 700 }}>All Audit Sessions</h3>
          <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{auditors.length} registered auditors</span>
        </div>

        {loading ? (
          <p style={{ color: "#94a3b8" }}>Loading...</p>
        ) : audits.length === 0 ? (
          <div className="empty-state">
            <div className="emoji">📊</div>
            <h3>No audit sessions yet</h3>
            <p>Audit sessions will appear here when AUA/KUA entities create them.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Audit ID</th>
                  <th>Entity</th>
                  <th>Organization</th>
                  <th>Status</th>
                  <th>Auditor</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {audits.map((a) => (
                  <tr key={a.auditId}>
                    <td style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>{a.auditId.slice(0, 8)}...</td>
                    <td>{a.userName || "—"}</td>
                    <td>{a.userOrganization || "—"}</td>
                    <td><span className={`badge badge-${a.status}`}>{a.status.replace(/_/g, " ")}</span></td>
                    <td>{a.auditorName || "—"}</td>
                    <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                        <Link to={`/audit/checklist/${a.auditId}`} className="btn btn-outline btn-sm">
                          View
                        </Link>
                        {a.status === "submitted" && (
                          <button className="btn btn-primary btn-sm" onClick={() => { setAssignModal(a.auditId); setSelectedAuditor(""); }}>
                            Assign
                          </button>
                        )}
                        {a.status === "under_review" && (
                          <>
                            <button className="btn btn-success btn-sm" onClick={() => updateStatus(a.auditId, "approved")}>
                              Approve
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => updateStatus(a.auditId, "rejected")}>
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assign Auditor Modal */}
      {assignModal && (
        <div className="modal-backdrop" onClick={() => setAssignModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Assign Auditor</h3>
            <p style={{ color: "#64748b", fontSize: "0.9rem", margin: "0.25rem 0 1rem" }}>
              Select a CERT-In empanelled auditor for this audit session.
            </p>
            {auditors.length === 0 ? (
              <p style={{ color: "#ef4444", fontSize: "0.85rem" }}>
                No auditors registered yet. An auditor must sign up first.
              </p>
            ) : (
              <select className="form-select" value={selectedAuditor} onChange={e => setSelectedAuditor(e.target.value)}>
                <option value="">— Select Auditor —</option>
                {auditors.map(a => (
                  <option key={a.userId} value={a.userId}>{a.name} ({a.email})</option>
                ))}
              </select>
            )}
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setAssignModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={assignAuditor} disabled={!selectedAuditor}>
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
