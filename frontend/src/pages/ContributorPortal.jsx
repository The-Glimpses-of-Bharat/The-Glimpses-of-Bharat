import React, { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import {
    Plus, X, Edit2, Send, Clock, CheckCircle, XCircle,
    RefreshCw, Calendar, FileText, Trash2, History, Shield, MessageSquarePlus
} from "lucide-react";

/* ── helpers ─────────────────────────────────────────── */
const EMPTY_FORM = {
    name: "", description: "", birthYear: "", deathYear: "",
    image: "", contributions: "",
};

const statusMeta = {
    pending: { color: "yellow", Icon: Clock, label: "Pending Review" },
    approved: { color: "green", Icon: CheckCircle, label: "Approved" },
    rejected: { color: "red", Icon: XCircle, label: "Rejected" },
};

function StatusBadge({ status }) {
    const m = statusMeta[status] || statusMeta.pending;
    return (
        <span className={`badge badge-${m.color}`}>
            <m.Icon size={11} /> {m.label}
        </span>
    );
}

function timeAgo(dateStr) {
    if (!dateStr) return null;
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function validate(form) {
    const errors = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (form.birthYear && isNaN(Number(form.birthYear))) errors.birthYear = "Must be a number";
    if (form.deathYear && isNaN(Number(form.deathYear))) errors.deathYear = "Must be a number";
    if (
        form.birthYear && form.deathYear &&
        Number(form.deathYear) < Number(form.birthYear)
    ) errors.deathYear = "Death year must be after birth year";
    return errors;
}

/* ── Modal form ──────────────────────────────────────── */
function ContributionModal({ entry, onClose, onSaved }) {
    const isEdit = Boolean(entry);
    const [form, setForm] = useState(isEdit ? {
        name: entry.name || "",
        description: entry.description || "",
        birthYear: entry.birthYear ?? "",
        deathYear: entry.deathYear ?? "",
        image: entry.image || "",
        contributions: entry.contributions || "",
    } : { ...EMPTY_FORM });
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [serverError, setServerError] = useState("");

    const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate(form);
        setErrors(errs);
        if (Object.keys(errs).length) return;

        setSaving(true);
        setServerError("");
        try {
            const payload = {
                name: form.name.trim(),
                description: form.description,
                birthYear: form.birthYear || undefined,
                deathYear: form.deathYear || undefined,
                image: form.image,
                contributions: form.contributions,
            };
            if (isEdit) {
                const { data } = await api.put(`/contributions/${entry._id}`, payload);
                onSaved(data, "edit");
            } else {
                const { data } = await api.post("/contributions", payload);
                onSaved(data, "create");
            }
            onClose();
        } catch (err) {
            setServerError(err.response?.data?.message || "Failed to save. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const Field = ({ label, id, field, type = "text", placeholder }) => (
        <div className="form-group">
            <label htmlFor={id}>{label}</label>
            <input
                id={id}
                type={type}
                value={form[field]}
                onChange={set(field)}
                placeholder={placeholder}
            />
            {errors[field] && <span className="cp-field-error">{errors[field]}</span>}
        </div>
    );

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal" style={{ maxWidth: 620 }}>
                <div className="modal-header">
                    <h2 id="modal-title">
                        {isEdit ? "✏️  Edit Submission" : "🕊️  Propose a Freedom Fighter"}
                    </h2>
                    <button className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
                </div>

                <form className="modal-form" onSubmit={handleSubmit} noValidate>
                    {serverError && <div className="alert alert-error">{serverError}</div>}

                    <Field label="Full Name *" id="cp-name" field="name" placeholder="e.g. Bhagat Singh" />

                    <div className="form-grid">
                        <Field label="Birth Year" id="cp-birth" field="birthYear" type="number" placeholder="e.g. 1907" />
                        <Field label="Death / Active Until" id="cp-death" field="deathYear" type="number" placeholder="e.g. 1931" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="cp-desc">Description</label>
                        <textarea
                            id="cp-desc"
                            rows={3}
                            value={form.description}
                            onChange={set("description")}
                            placeholder="Brief biography or historical context…"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="cp-contrib">Key Contributions</label>
                        <textarea
                            id="cp-contrib"
                            rows={3}
                            value={form.contributions}
                            onChange={set("contributions")}
                            placeholder="Notable achievements, movements, or acts of courage…"
                        />
                    </div>

                    <Field label="Image URL (optional)" id="cp-image" field="image" placeholder="https://…" />

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" id="cp-submit-btn" disabled={saving}>
                            {saving
                                ? <><RefreshCw size={14} className="spin" /> Saving…</>
                                : isEdit
                                    ? <><Edit2 size={14} /> Update</>
                                    : <><Send size={14} /> Submit</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ── Main page ───────────────────────────────────────── */
export default function ContributorPortal() {
    const [submissions, setSubmissions] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("entries"); // "entries" | "suggestions"
    const [error, setError] = useState("");
    const [modalEntry, setModalEntry] = useState(undefined); // undefined=closed, null=new, object=editing
    const [toast, setToast] = useState(null);
    const [filter, setFilter] = useState("all");
    const [deletingId, setDeletingId] = useState(null);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3200);
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const [entriesRes, suggestionsRes] = await Promise.all([
                api.get("/contributions/my"),
                api.get("/contributions/my-suggestions")
            ]);
            setSubmissions(entriesRes.data);
            setSuggestions(suggestionsRes.data);

            // Auto-switch to suggestions tab if entries are empty but suggestions exist
            if (entriesRes.data.length === 0 && suggestionsRes.data.length > 0) {
                setActiveTab("suggestions");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load contribution data.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleSaved = (savedEntry, mode) => {
        if (mode === "create") {
            setSubmissions((prev) => [savedEntry, ...prev]);
        } else {
            setSubmissions((prev) => prev.map((e) => e._id === savedEntry._id ? savedEntry : e));
        }
    };

    const handleDelete = async (entry) => {
        if (!window.confirm(`Withdraw "${entry.name}"? This cannot be undone.`)) return;
        setDeletingId(entry._id);
        try {
            await api.delete(`/contributions/${entry._id}`);
            setSubmissions((prev) => prev.filter((s) => s._id !== entry._id));
        } catch (err) {
            console.error(err);
        } finally {
            setDeletingId(null);
        }
    };

    const filteredEntries = filter === "all" ? submissions : submissions.filter((s) => s.status === filter);
    const filteredSuggestions = filter === "all" ? suggestions : suggestions.filter((s) => s.status === filter);

    const getCounts = (data) => data.reduce((acc, s) => {
        acc[s.status] = (acc[s.status] || 0) + 1;
        return acc;
    }, {});

    const currentCounts = activeTab === "entries" ? getCounts(submissions) : getCounts(suggestions);
    const currentListSize = activeTab === "entries" ? submissions.length : suggestions.length;

    return (
        <div className="page" style={{ paddingBottom: "60px" }}>
            {toast && <div className={`toast toast--${toast.type}`}>{toast.msg}</div>}

            <div className="page-header">
                <div>
                    <h1 className="page-title">Suggestion Portal</h1>
                    <p className="page-subtitle">Track your entries and suggestions for Freedom Fighters</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary" onClick={fetchData} disabled={loading}>
                        <RefreshCw size={15} className={loading ? "spin" : ""} /> Refresh
                    </button>
                    <button className="btn btn-primary" onClick={() => setModalEntry(null)}>
                        <Plus size={15} /> New Entry
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', borderBottom: '1px solid var(--border)' }}>
                <button
                    onClick={() => setActiveTab("entries")}
                    style={{
                        padding: '12px 20px',
                        background: 'none',
                        border: 'none',
                        color: activeTab === 'entries' ? 'var(--accent)' : 'var(--text-secondary)',
                        borderBottom: activeTab === 'entries' ? '2px solid var(--accent)' : '2px solid transparent',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}
                >
                    Proposed Entries ({submissions.length})
                </button>
                <button
                    onClick={() => setActiveTab("suggestions")}
                    style={{
                        padding: '12px 20px',
                        background: 'none',
                        border: 'none',
                        color: activeTab === 'suggestions' ? 'var(--accent)' : 'var(--text-secondary)',
                        borderBottom: activeTab === 'suggestions' ? '2px solid var(--accent)' : '2px solid transparent',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}
                >
                    Edit Suggestions ({suggestions.length})
                </button>
            </div>

            {/* Stats filter strip */}
            <div className="cp-stats-strip">
                {[
                    { key: "all", label: "Total", count: currentListSize, color: "blue" },
                    { key: "pending", label: "Pending", count: currentCounts.pending || 0, color: "yellow" },
                    { key: "approved", label: "Approved", count: currentCounts.approved || 0, color: "green" },
                    { key: "rejected", label: "Rejected", count: currentCounts.rejected || 0, color: "red" },
                ].map(({ key, label, count, color }) => (
                    <button
                        key={key}
                        className={`cp-stat-pill ${filter === key ? "cp-stat-pill--active cp-stat-pill--" + color : ""}`}
                        onClick={() => setFilter(key)}
                    >
                        <span className={`cp-stat-num cp-stat-num--${color}`}>{count}</span>
                        <span className="cp-stat-label">{label}</span>
                    </button>
                ))}
            </div>

            {/* Error alerts removed as requested */}

            {loading ? (
                <div className="loading-state">
                    <div className="spinner" />
                    <p>Loading...</p>
                </div>
            ) : (activeTab === "entries" ? filteredEntries : filteredSuggestions).length === 0 ? (
                <div className="empty-state">
                    <FileText size={48} />
                    <h3>No items found</h3>
                    <p>You haven't made any {filter === 'all' ? '' : filter} {activeTab === 'entries' ? 'entries' : 'suggestions'} yet.</p>
                </div>
            ) : (
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            {activeTab === "entries" ? (
                                <tr>
                                    <th>Freedom Fighter</th>
                                    <th>Years</th>
                                    <th>Description</th>
                                    <th>Submitted</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            ) : (
                                <tr>
                                    <th>Fighter</th>
                                    <th>Your Suggestion</th>
                                    <th>Submitted</th>
                                    <th>Status / Feedback</th>
                                </tr>
                            )}
                        </thead>
                        <tbody>
                            {activeTab === "entries" ? (
                                filteredEntries.map((entry) => (
                                    <tr key={entry._id}>
                                        <td>
                                            <div className="fighter-cell">
                                                <div className="fighter-avatar">{entry.name?.charAt(0)?.toUpperCase()}</div>
                                                <span className="fighter-name">{entry.name}</span>
                                            </div>
                                        </td>
                                        <td>{entry.birthYear || "?"} – {entry.deathYear || "?"}</td>
                                        <td><span className="text-clamp">{entry.description || "—"}</span></td>
                                        <td>{timeAgo(entry.createdAt)}</td>
                                        <td><StatusBadge status={entry.status} /></td>
                                        <td>
                                            <div className="action-buttons">
                                                {entry.status === "pending" && (
                                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(entry)}>
                                                        <Trash2 size={13} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                filteredSuggestions.map((s) => (
                                    <tr key={s._id}>
                                        <td>
                                            <div className="fighter-cell">
                                                <div className="fighter-avatar">
                                                    {s.fighter?.image ? <img src={s.fighter.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : s.fighter?.name?.charAt(0)}
                                                </div>
                                                <span className="fighter-name">{s.fighter?.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ maxWidth: '300px' }}>
                                            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                                "{s.suggestion}"
                                            </div>
                                        </td>
                                        <td>{timeAgo(s.createdAt)}</td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <StatusBadge status={s.status} />
                                                {s.adminFeedback && (
                                                    <span style={{ fontSize: '11px', color: 'var(--accent)' }}>
                                                        {s.adminFeedback}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {modalEntry !== undefined && (
                <ContributionModal
                    entry={modalEntry}
                    onClose={() => setModalEntry(undefined)}
                    onSaved={handleSaved}
                />
            )}
        </div>
    );
}
