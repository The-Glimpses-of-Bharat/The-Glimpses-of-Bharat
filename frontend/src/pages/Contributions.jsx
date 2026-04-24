import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Clock, CheckCircle, XCircle, RefreshCw, User, Calendar } from "lucide-react";

const statusBadge = (status) => (
  <span className={`badge badge-${status}`}>{status}</span>
);

export default function Contributions() {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchContributions = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/admin/pending-contributions");
      setContributions(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load contributions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContributions(); }, []);

  const handleApprove = async (id) => {
    setActionId(id);
    try {
      await api.post(`/admin/approve/${id}`);
      showToast("Contribution approved successfully!", "success");
      setContributions((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to approve", "error");
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this contribution?")) return;
    setActionId(id);
    try {
      await api.delete(`/admin/reject/${id}`);
      showToast("Contribution rejected.", "warning");
      setContributions((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to reject", "error");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="page">
      {toast && <div className={`toast toast--${toast.type}`}>{toast.msg}</div>}

      <div className="page-header">
        <div>
          <h1 className="page-title">Pending Contributions</h1>
          <p className="page-subtitle">Review and action submitted Freedom Fighter entries</p>
        </div>
        <button className="btn btn-secondary" onClick={fetchContributions} disabled={loading}>
          <RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading contributions...</p>
        </div>
      ) : contributions.length === 0 ? (
        <div className="empty-state">
          <CheckCircle size={48} />
          <h3>All Clear!</h3>
          <p>No pending contributions to review.</p>
        </div>
      ) : (
        <>
          <div className="table-meta">
            <span className="badge badge-yellow">{contributions.length} pending</span>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Freedom Fighter</th>
                  <th>Description</th>
                  <th>Submitted By</th>
                  <th>Years</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contributions.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <div className="fighter-cell">
                        <div className="fighter-avatar">
                          {c.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <span className="fighter-name">{c.name}</span>
                          {c.isDuplicate && (
                            <span className="badge badge-red badge-sm">Duplicate</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-clamp">{c.description || "—"}</span>
                    </td>
                    <td>
                      <div className="contributor-cell">
                        <User size={14} />
                        <span>{c.createdBy?.name || "Unknown"}</span>
                      </div>
                    </td>
                    <td>
                      <div className="years-cell">
                        <Calendar size={14} />
                        {c.birthYear || "?"} – {c.deathYear || "?"}
                      </div>
                    </td>
                    <td>{statusBadge(c.status)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleApprove(c._id)}
                          disabled={actionId === c._id}
                          id={`approve-${c._id}`}
                        >
                          <CheckCircle size={14} />
                          Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleReject(c._id)}
                          disabled={actionId === c._id}
                          id={`reject-${c._id}`}
                        >
                          <XCircle size={14} />
                          Reject
                        </button>
                      </div>
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
