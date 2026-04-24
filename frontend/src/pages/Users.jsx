import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Users, Shield, RefreshCw, Trash2, ChevronDown } from "lucide-react";

const ROLES = ["user", "contributor", "admin", "premium"];

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      const { data } = await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: data.user.role } : u)));
      showToast(`Role updated to "${newRole}"`);
    } catch (err) {
      showToast(err.response?.data?.message || "Role update failed", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      showToast("User deleted.", "warning");
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed", "error");
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      {toast && <div className={`toast toast--${toast.type}`}>{toast.msg}</div>}

      <div className="page-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">Manage roles and access for all platform users</p>
        </div>
        <button className="btn btn-secondary" onClick={fetchUsers} disabled={loading}>
          <RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          id="user-search"
        />
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading users...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <Users size={48} />
          <p>No users found.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div className="fighter-cell">
                      <div className="fighter-avatar">
                        {u.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <span className="fighter-name">{u.name}</span>
                    </div>
                  </td>
                  <td className="text-muted">{u.email}</td>
                  <td>
                    <div className="role-select-wrap">
                      <select
                        className="role-select"
                        value={u.role}
                        disabled={updatingId === u._id}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        id={`role-select-${u._id}`}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="select-arrow" />
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(u._id, u.name)}
                      id={`delete-user-${u._id}`}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
