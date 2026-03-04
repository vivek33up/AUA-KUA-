// src/pages/AuditChecklist.jsx
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSession } from "../services/auth";
import axios from "axios";
import "../styles/dashboard.css";

const STATUS_OPTIONS = ["", "Compliant", "Non-compliant", "Not applicable"];

export default function AuditChecklist() {
    const { auditId } = useParams();
    const session = getSession();
    const nav = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null);
    const [responses, setResponses] = useState({});
    const [saveMsg, setSaveMsg] = useState("");

    useEffect(() => {
        fetchAudit();
    }, [auditId]);

    const fetchAudit = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/audits/${auditId}`);
            setData(res.data);
            // Build responses map
            const rMap = {};
            for (const cat of res.data.categories) {
                for (const ctrl of cat.controls) {
                    if (ctrl.response) {
                        rMap[ctrl.controlId] = {
                            complianceStatus: ctrl.response.complianceStatus || "",
                            auditorObservation: ctrl.response.auditorObservation || "",
                            managementComments: ctrl.response.managementComments || "",
                        };
                    }
                }
            }
            setResponses(rMap);
            if (res.data.categories.length > 0) setActiveCategory(res.data.categories[0].categoryId);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateResponse = (controlId, field, value) => {
        setResponses(prev => ({
            ...prev,
            [controlId]: { ...prev[controlId], [field]: value },
        }));
    };

    const saveProgress = async () => {
        setSaving(true);
        setSaveMsg("");
        try {
            const respList = Object.entries(responses).map(([controlId, r]) => ({
                controlId: parseInt(controlId),
                complianceStatus: r.complianceStatus || null,
                auditorObservation: r.auditorObservation || null,
                managementComments: r.managementComments || null,
            }));
            await axios.put(`http://localhost:3000/api/audits/${auditId}/responses`, { responses: respList });
            await axios.put(`http://localhost:3000/api/audits/${auditId}/status`, { status: "in_progress" });
            setSaveMsg("Progress saved!");
            setTimeout(() => setSaveMsg(""), 3000);
        } catch (err) {
            console.error(err);
            setSaveMsg("Error saving.");
        } finally {
            setSaving(false);
        }
    };

    const submitAudit = async () => {
        if (!window.confirm("Are you sure you want to submit this audit? You won't be able to edit it afterwards.")) return;
        setSaving(true);
        try {
            const respList = Object.entries(responses).map(([controlId, r]) => ({
                controlId: parseInt(controlId),
                complianceStatus: r.complianceStatus || null,
                auditorObservation: r.auditorObservation || null,
                managementComments: r.managementComments || null,
            }));
            await axios.put(`http://localhost:3000/api/audits/${auditId}/responses`, { responses: respList });
            await axios.put(`http://localhost:3000/api/audits/${auditId}/status`, { status: "submitted" });
            nav("/dashboard");
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ padding: "2rem", color: "#94a3b8" }}>Loading checklist...</div>;
    if (!data) return <div style={{ padding: "2rem", color: "#ef4444" }}>Audit not found.</div>;

    const isEditable = session?.role === "user" && ["draft", "in_progress"].includes(data.audit.status);
    const isAuditor = session?.role === "auditor";

    // Calculate progress
    const totalControls = data.categories.reduce((sum, cat) => sum + cat.controls.length, 0);
    const filledControls = Object.values(responses).filter(r => r.complianceStatus).length;
    const progressPct = totalControls > 0 ? Math.round((filledControls / totalControls) * 100) : 0;

    return (
        <div>
            {/* Header */}
            <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                    <h2>Compliance Checklist</h2>
                    <p>Version 2.0 — {data.categories.reduce((s, c) => s + c.controls.length, 0)} Controls across {data.categories.length} Categories</p>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    {saveMsg && <span style={{ fontSize: "0.85rem", color: "#10b981", fontWeight: 600 }}>{saveMsg}</span>}
                    {isEditable && (
                        <>
                            <button className="btn btn-outline" onClick={saveProgress} disabled={saving}>
                                {saving ? "Saving..." : "💾 Save Draft"}
                            </button>
                            <button className="btn btn-primary" onClick={submitAudit} disabled={saving}>
                                📤 Submit for Review
                            </button>
                        </>
                    )}
                    {isAuditor && ["under_review"].includes(data.audit.status) && (
                        <button className="btn btn-outline" onClick={saveProgress} disabled={saving}>
                            {saving ? "Saving..." : "💾 Save Observations"}
                        </button>
                    )}
                </div>
            </div>

            {/* Progress */}
            <div className="card" style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#334155" }}>
                        Compliance Progress
                    </span>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#2563eb" }}>
                        {filledControls}/{totalControls} ({progressPct}%)
                    </span>
                </div>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progressPct}%` }}></div>
                </div>
                <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.75rem", fontSize: "0.8rem" }}>
                    <span style={{ color: "#10b981" }}>
                        ✅ {Object.values(responses).filter(r => r.complianceStatus === "Compliant").length} Compliant
                    </span>
                    <span style={{ color: "#ef4444" }}>
                        ❌ {Object.values(responses).filter(r => r.complianceStatus === "Non-compliant").length} Non-compliant
                    </span>
                    <span style={{ color: "#64748b" }}>
                        ➖ {Object.values(responses).filter(r => r.complianceStatus === "Not applicable").length} N/A
                    </span>
                </div>
            </div>

            {/* Category Tabs */}
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                {data.categories.map(cat => {
                    const isActive = activeCategory === cat.categoryId;
                    const catFilled = cat.controls.filter(c => responses[c.controlId]?.complianceStatus).length;
                    return (
                        <button
                            key={cat.categoryId}
                            onClick={() => setActiveCategory(cat.categoryId)}
                            className={`btn btn-sm ${isActive ? "" : "btn-outline"}`}
                            style={isActive ? { background: "linear-gradient(135deg, #2563eb, #7c3aed)", color: "#fff" } : {}}
                        >
                            {cat.code} ({catFilled}/{cat.controls.length})
                        </button>
                    );
                })}
            </div>

            {/* Controls */}
            {data.categories
                .filter(cat => cat.categoryId === activeCategory)
                .map(cat => (
                    <div key={cat.categoryId}>
                        <div className="category-header">
                            <div className="category-code">{cat.code}</div>
                            <h3>{cat.title}</h3>
                        </div>

                        {cat.controls.map(ctrl => {
                            const r = responses[ctrl.controlId] || {};
                            return (
                                <div key={ctrl.controlId} className="control-card">
                                    <div className="control-header">
                                        <div className="control-no">{ctrl.controlNo}</div>
                                        <div className="control-title">{ctrl.shortTitle}</div>
                                    </div>
                                    <div className="control-desc">{ctrl.description}</div>
                                    <div className="control-fields">
                                        <div>
                                            <label>Compliance Status</label>
                                            <select
                                                value={r.complianceStatus || ""}
                                                onChange={(e) => updateResponse(ctrl.controlId, "complianceStatus", e.target.value)}
                                                disabled={!isEditable && !isAuditor}
                                            >
                                                {STATUS_OPTIONS.map(opt => (
                                                    <option key={opt} value={opt}>{opt || "— Select —"}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label>Auditor's Observation</label>
                                            <textarea
                                                rows={2}
                                                value={r.auditorObservation || ""}
                                                onChange={(e) => updateResponse(ctrl.controlId, "auditorObservation", e.target.value)}
                                                disabled={!isAuditor}
                                                placeholder={isAuditor ? "Enter observation..." : "Auditor will fill"}
                                            />
                                        </div>
                                        <div>
                                            <label>Management Comments</label>
                                            <textarea
                                                rows={2}
                                                value={r.managementComments || ""}
                                                onChange={(e) => updateResponse(ctrl.controlId, "managementComments", e.target.value)}
                                                disabled={!isEditable}
                                                placeholder={isEditable ? "Enter comments..." : "Read only"}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
        </div>
    );
}
