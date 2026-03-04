// src/pages/UserDashboard.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSession } from "../services/auth";
import axios from "axios";
import "../styles/dashboard.css";

export default function UserDashboard() {
    const session = getSession();
    const nav = useNavigate();
    const [audits, setAudits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAudits();
    }, []);

    const fetchAudits = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/audits?role=user&userId=${session.userId}`);
            setAudits(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const startNewAudit = async () => {
        try {
            const res = await axios.post("http://localhost:3000/api/audits", { userId: session.userId });
            nav(`/audit/checklist/${res.data.auditId}`);
        } catch (err) {
            console.error(err);
        }
    };

    const statusCounts = {
        total: audits.length,
        draft: audits.filter(a => a.status === "draft").length,
        submitted: audits.filter(a => ["submitted", "under_review"].includes(a.status)).length,
        approved: audits.filter(a => a.status === "approved").length,
    };

    return (
        <div>
            <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                    <h2>Welcome, {session?.name}</h2>
                    <p>{session?.organization || "AUA/KUA Entity"} — Compliance Dashboard</p>
                </div>
                <button className="btn btn-primary" onClick={startNewAudit}>
                    + Start New Audit
                </button>
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
                    <div className="stat-icon" style={{ background: "#fef3c7" }}>✏️</div>
                    <div className="stat-info">
                        <h3>{statusCounts.draft}</h3>
                        <p>In Draft</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: "#dbeafe" }}>📤</div>
                    <div className="stat-info">
                        <h3>{statusCounts.submitted}</h3>
                        <p>Submitted</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: "#d1fae5" }}>✅</div>
                    <div className="stat-info">
                        <h3>{statusCounts.approved}</h3>
                        <p>Approved</p>
                    </div>
                </div>
            </div>

            <div className="card">
                <h3 style={{ margin: "0 0 1rem", fontWeight: 700 }}>Your Audits</h3>

                {loading ? (
                    <p style={{ color: "#94a3b8" }}>Loading...</p>
                ) : audits.length === 0 ? (
                    <div className="empty-state">
                        <div className="emoji">📝</div>
                        <h3>No audits yet</h3>
                        <p>Start your first compliance audit to begin the certification process.</p>
                        <button className="btn btn-primary" onClick={startNewAudit} style={{ marginTop: "1rem" }}>
                            Start New Audit
                        </button>
                    </div>
                ) : (
                    <div className="table-wrap">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Audit ID</th>
                                    <th>Status</th>
                                    <th>Auditor</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {audits.map((a) => (
                                    <tr key={a.auditId}>
                                        <td style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>
                                            {a.auditId.slice(0, 8)}...
                                        </td>
                                        <td>
                                            <span className={`badge badge-${a.status}`}>
                                                {a.status.replace(/_/g, " ")}
                                            </span>
                                        </td>
                                        <td>{a.auditorName || "—"}</td>
                                        <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <Link to={`/audit/checklist/${a.auditId}`} className="btn btn-outline btn-sm">
                                                {a.status === "draft" || a.status === "in_progress" ? "Continue" : "View"}
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
