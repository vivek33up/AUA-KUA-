// src/pages/AuditorDashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSession } from "../services/auth";
import axios from "axios";
import "../styles/dashboard.css";

export default function AuditorDashboard() {
    const session = getSession();
    const [audits, setAudits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAudits();
    }, []);

    const fetchAudits = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/audits?role=auditor&userId=${session.userId}`);
            setAudits(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const statusCounts = {
        total: audits.length,
        pending: audits.filter(a => a.status === "under_review").length,
        completed: audits.filter(a => ["approved", "rejected"].includes(a.status)).length,
    };

    return (
        <div>
            <div className="page-header">
                <h2>Auditor Dashboard</h2>
                <p>Welcome, {session?.name} — CERT-In Empanelled Auditor</p>
            </div>

            <div className="stat-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: "#eff6ff" }}>📋</div>
                    <div className="stat-info">
                        <h3>{statusCounts.total}</h3>
                        <p>Assigned Audits</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: "#fef3c7" }}>🔍</div>
                    <div className="stat-info">
                        <h3>{statusCounts.pending}</h3>
                        <p>Pending Review</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: "#d1fae5" }}>✅</div>
                    <div className="stat-info">
                        <h3>{statusCounts.completed}</h3>
                        <p>Completed</p>
                    </div>
                </div>
            </div>

            <div className="card">
                <h3 style={{ margin: "0 0 1rem", fontWeight: 700 }}>Assigned Audits</h3>

                {loading ? (
                    <p style={{ color: "#94a3b8" }}>Loading...</p>
                ) : audits.length === 0 ? (
                    <div className="empty-state">
                        <div className="emoji">🔍</div>
                        <h3>No audits assigned yet</h3>
                        <p>You will see audits here once the UIDAI admin assigns them to you.</p>
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
                                    <th>Submitted</th>
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
                                        <td>{a.submittedAt ? new Date(a.submittedAt).toLocaleDateString() : "—"}</td>
                                        <td>
                                            <Link to={`/audit/checklist/${a.auditId}`} className="btn btn-outline btn-sm">
                                                {a.status === "under_review" ? "Review" : "View"}
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
