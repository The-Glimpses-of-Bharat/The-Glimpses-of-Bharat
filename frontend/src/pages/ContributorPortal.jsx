import React, { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import {
    Plus, X, Edit2, Send, Clock, CheckCircle, XCircle,
    RefreshCw, User, Calendar, FileText, ChevronDown,
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
                            {saving ? <><RefreshCw size={14} className="spin" /> Saving…</> : isEdit ? <><Edit2 size={14} /> Update</> : <><Send size={14} /> Submit</>}
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalEntry, setModalEntry] = useState(undefined); // undefined = closed, null = new, object = editing
    const [toast, setToast] = useState(null);
    const [filter, setFilter] = useState("all");

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3200);
    };

    const fetchSubmissions = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const { data } = await api.get("/contributions/my");
            setSubmissions(data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load your submissions.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchSubmissions(); }, [fetchSubmissions]);

    const handleSaved = (savedEntry, mode) => {
        if (mode === "create") {
            setSubmissions((prev) => [savedEntry, ...prev]);
            showToast("Submission received! It will be reviewed by an admin.", "success");
        } else {
            setSubmissions((prev) => prev.map((e) => e._id === savedEntry._id ? savedEntry : e));
            showToast("Submission updated successfully.", "success");
        }
    };

    const filtered = filter === "all" ? submissions : submissions.filter((s) => s.status === filter);

    const counts = submissions.reduce((acc, s) => {
        acc[s.status] = (acc[s.status] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="page">
            {/* Toast */}
            {toast && <div className={`toast toast--${toast.type}`}>{toast.msg}</div>}

            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Contributor Portal</h1>
                    <p className="page-subtitle">Propose and manage your Freedom Fighter entries</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary" onClick={fetchSubmissions} disabled={loading} id="cp-refresh-btn">
                        <RefreshCw size={15} className={loading ? "spin" : ""} /> Refresh
                    </button>
                    <button className="btn btn-primary" onClick={() => setModalEntry(null)} id="cp-new-btn">
                        <Plus size={15} /> Propose Entry
                    </button>
                </div>
            </div>

            {/* Stats strip */}
            <div className="cp-stats-strip">
                {[
                    { key: "all", label: "Total", count: submissions.length, color: "blue" },
                    { key: "pending", label: "Pending", count: counts.pending || 0, color: "yellow" },
                    { key: "approved", label: "Approved", count: counts.approved || 0, color: "green" },
                    { key: "rejected", label: "Rejected", count: counts.rejected || 0, color: "red" },
                ].map(({ key, label, count, color }) => (
                    <button
                        key={key}
                        className={`cp-stat-pill ${filter === key ? "cp-stat-pill--active cp-stat-pill--" + color : ""}`}
                        onClick={() => setFilter(key)}
                        id={`cp-filter-${key}`}
                    >
                        <span className={`cp-stat-num cp-stat-num--${color}`}>{count}</span>
                        <span className="cp-stat-label">{label}</span>
                    </button>
                ))}
            </div>

            {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

            {/* Content */}
            {loading ? (
                <div className="loading-state">
                    <div className="spinner" />
                    <p>Loading your submissions…</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="empty-state" style={{ marginTop: 48 }}>
                    <FileText size={48} />
                    <h3>{filter === "all" ? "No submissions yet" : `No ${filter} submissions`}</h3>
                    <p>
                        {filter === "all"
                            ? "Click \"Propose Entry\" to contribute a Freedom Fighter to the archive."
                            : `You have no ${filter} entries right now.`}
                    </p>
                    {filter === "all" && (
                        <button className="btn btn-primary" onClick={() => setModalEntry(null)} style={{ marginTop: 16 }}>
                            <Plus size={15} /> Propose your first entry
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <div className="table-meta">
                        <span className="badge badge-yellow">{filtered.length} {filter === "all" ? "total" : filter}</span>
                    </div>
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Freedom Fighter</th>
                                    <th>Years</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((entry) => (
                                    <tr key={entry._id}>
                                        <td>
                                            <div className="fighter-cell">
                                                <div className="fighter-avatar">
                                                    {entry.name?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <span className="fighter-name">{entry.name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="years-cell">
                                                <Calendar size={13} />
                                                {entry.birthYear || "?"} – {entry.deathYear || "?"}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="text-clamp">{entry.description || "—"}</span>
                                        </td>
                                        <td><StatusBadge status={entry.status} /></td>
                                        <td>
                                            <div className="action-buttons">
                                                {entry.status === "pending" ? (
                                                    <button
                                                        className="btn btn-secondary btn-sm"
                                                        onClick={() => setModalEntry(entry)}
                                                        id={`cp-edit-${entry._id}`}
                                                    >
                                                        <Edit2 size={13} /> Edit
                                                    </button>
                                                ) : (
                                                    <span className="text-muted" style={{ fontSize: 12 }}>
                                                        {entry.status === "approved" ? "✅ Published" : "❌ Cannot edit"}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* Modal */}
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
