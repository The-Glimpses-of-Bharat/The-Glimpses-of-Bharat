import React, { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Clock, CheckCircle, XCircle, RefreshCw, User, Calendar,
  MessageSquare, History, Trash2, ArrowRight, ShieldCheck, Search
} from "lucide-react";
import "./Home.css";

const statusBadge = (status) => (
  <span className={`badge badge-${status}`}>{status}</span>
);

export default function Contributions() {
  const [activeTab, setActiveTab] = useState("proposals"); // "proposals" | "suggestions" | "archive"
  const [proposals, setProposals] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [archive, setArchive] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [pRes, sRes, aRes] = await Promise.all([
        api.get("/admin/pending-contributions"),
        api.get("/contributions/suggestions"),
        api.get("/admin/fighters")
      ]);
      setProposals(pRes.data);
      setSuggestions(sRes.data);
      setArchive(aRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load management data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Proposal Actions
  const handleApproveProposal = async (id) => {
    setActionId(id);
    try {
      await api.post(`/admin/approve/${id}`);
      showToast("Proposal approved and published!", "success");
      setProposals((prev) => prev.filter((c) => c._id !== id));
      fetchData(); // Refresh archive too
    } catch (err) {
      showToast("Failed to approve", "error");
    } finally {
      setActionId(null);
    }
  };

  const handleRejectProposal = async (id) => {
    if (!window.confirm("Reject and delete this proposal?")) return;
    setActionId(id);
    try {
      await api.delete(`/admin/reject/${id}`);
      showToast("Proposal rejected and removed.", "warning");
      setProposals((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      showToast("Failed to reject", "error");
    } finally {
      setActionId(null);
    }
  };

  // Archive Actions
  const handleDeleteFighter = async (id, name) => {
    if (!window.confirm(`Permanently delete "${name}" from the history archive?`)) return;
    setActionId(id);
    try {
      await api.delete(`/admin/fighters/${id}`);
      showToast("Fighter deleted from archive.", "warning");
      setArchive((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      showToast("Failed to delete", "error");
    } finally {
      setActionId(null);
    }
  };

  // Suggestion Actions
  const handleUpdateSuggestion = async (id, status) => {
    const feedback = status === "rejected" ? window.prompt("Reason for rejection:") : null;
    setActionId(id);
    try {
      await api.patch(`/contributions/suggestions/${id}/status`, {
        status,
        adminFeedback: feedback
      });
      showToast(`Suggestion ${status} successfully!`, "success");
      setSuggestions((prev) => prev.map(s => s._id === id ? { ...s, status } : s));
    } catch (err) {
      showToast("Failed to update status", "error");
    } finally {
      setActionId(null);
    }
  };

  const handleDeleteSuggestion = async (id) => {
    if (!window.confirm("Delete this suggestion record?")) return;
    setActionId(id);
    try {
      await api.delete(`/contributions/suggestions/${id}`);
      showToast("Record deleted.", "warning");
      setSuggestions((prev) => prev.filter(s => s._id !== id));
    } catch (err) {
      showToast("Failed to delete", "error");
    } finally {
      setActionId(null);
    }
  };

  const filteredArchive = archive.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page fade-in">
      {toast && <div className={`toast toast--${toast.type}`}>{toast.msg}</div>}

      <div className="page-header">
        <div>
          <h1 className="page-title">Master Contribution Manager</h1>
          <p className="page-subtitle">Full command over hero profiles, user proposals, and edit suggestions</p>
        </div>
        <button className="btn btn-secondary" onClick={fetchData} disabled={loading}>
          <RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh
        </button>
      </div>

      {/* Admin Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveTab("proposals")} className={`cp-stat-pill ${activeTab === 'proposals' ? 'cp-stat-pill--active cp-stat-pill--blue' : ''}`}>
          <History size={16} /> New Proposals ({proposals.length})
        </button>
        <button onClick={() => setActiveTab("suggestions")} className={`cp-stat-pill ${activeTab === 'suggestions' ? 'cp-stat-pill--active cp-stat-pill--yellow' : ''}`}>
          <MessageSquare size={16} /> Edit Suggestions ({suggestions.filter(s => s.status === 'pending').length})
        </button>
        <button onClick={() => setActiveTab("archive")} className={`cp-stat-pill ${activeTab === 'archive' ? 'cp-stat-pill--active cp-stat-pill--green' : ''}`}>
          <ShieldCheck size={16} /> Published Archive ({archive.length})
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
        </div>
      ) : activeTab === "proposals" ? (
        // --- PROPOSALS ---
        proposals.length === 0 ? <div className="empty-state"><h3>All Proposals Reviewed!</h3></div> : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead><tr><th>Hero</th><th>User</th><th>Actions</th></tr></thead>
              <tbody>
                {proposals.map(p => (
                  <tr key={p._id}>
                    <td><div className="fighter-cell"><div className="fighter-avatar">{p.name[0]}</div><span className="fighter-name">{p.name}</span></div></td>
                    <td>{p.createdBy?.name || "Guest"}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-success btn-sm" onClick={() => handleApproveProposal(p._id)} disabled={actionId === p._id}><CheckCircle size={14} /> Approve</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleRejectProposal(p._id)} disabled={actionId === p._id}><XCircle size={14} /> Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : activeTab === "suggestions" ? (
        // --- SUGGESTIONS ---
        suggestions.length === 0 ? <div className="empty-state"><h3>No Edit Suggestions</h3></div> : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead><tr><th>Target</th><th>Suggestion</th><th>Status</th><th>Review</th></tr></thead>
              <tbody>
                {suggestions.map(s => (
                  <tr key={s._id}>
                    <td style={{ fontWeight: 600 }}>{s.fighter?.name}</td>
                    <td><div style={{ fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic' }}>"{s.suggestion}"</div></td>
                    <td>{statusBadge(s.status)}</td>
                    <td>
                      {s.status === 'pending' ? (
                        <div className="action-buttons">
                          <button className="btn btn-primary btn-sm" onClick={() => handleUpdateSuggestion(s._id, 'approved')}><CheckCircle size={14} /></button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleUpdateSuggestion(s._id, 'rejected')}><XCircle size={14} /></button>
                        </div>
                      ) : <button className="btn btn-ghost btn-sm" onClick={() => handleDeleteSuggestion(s._id)}><Trash2 size={14} /></button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        // --- ARCHIVE ---
        <>
          <div className="search-bar" style={{ marginBottom: 20 }}>
            <input type="text" placeholder="Search archive..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead><tr><th>Hero</th><th>Description</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredArchive.map(f => (
                  <tr key={f._id}>
                    <td><div className="fighter-cell"><div className="fighter-avatar">{f.name[0]}</div><span className="fighter-name">{f.name}</span></div></td>
                    <td><span className="text-clamp">{f.description}</span></td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteFighter(f._id, f.name)} disabled={actionId === f._id}>
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
