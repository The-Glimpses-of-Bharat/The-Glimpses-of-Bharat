import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Plus, Pencil, Trash2, RefreshCw, X, Save } from "lucide-react";

const emptyForm = { name: "", description: "", birthYear: "", deathYear: "", contributions: "", image: "" };

export default function Fighters() {
  const [fighters, setFighters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null); // null | { mode: 'create'|'edit', data: {} }
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchFighters = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/admin/fighters");
      setFighters(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load fighters");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFighters(); }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setModal({ mode: "create" });
  };

  const openEdit = (fighter) => {
    setForm({
      name: fighter.name || "",
      description: fighter.description || "",
      birthYear: fighter.birthYear || "",
      deathYear: fighter.deathYear || "",
      contributions: fighter.contributions || "",
      image: fighter.image || "",
    });
    setModal({ mode: "edit", id: fighter._id });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal.mode === "create") {
        const { data } = await api.post("/admin/fighters", form);
        setFighters((prev) => [data, ...prev]);
        showToast("Fighter created successfully!");
      } else {
        const { data } = await api.put(`/admin/fighters/${modal.id}`, form);
        setFighters((prev) => prev.map((f) => (f._id === modal.id ? data : f)));
        showToast("Fighter updated successfully!");
      }
      setModal(null);
    } catch (err) {
      showToast(err.response?.data?.message || "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/fighters/${id}`);
      setFighters((prev) => prev.filter((f) => f._id !== id));
      showToast("Fighter deleted.", "warning");
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed", "error");
    }
  };

  const filtered = fighters.filter((f) =>
    f.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      {toast && <div className={`toast toast--${toast.type}`}>{toast.msg}</div>}

      <div className="page-header">
        <div>
          <h1 className="page-title">Freedom Fighters</h1>
          <p className="page-subtitle">Full CRUD management for all entries</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={fetchFighters} disabled={loading}>
            <RefreshCw size={16} className={loading ? "spin" : ""} />
          </button>
          <button className="btn btn-primary" onClick={openCreate} id="create-fighter-btn">
            <Plus size={16} /> Add Fighter
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search fighters..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          id="fighter-search"
        />
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading fighters...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <p>{search ? "No fighters match your search." : "No fighters found."}</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Years</th>
                <th>Status</th>
                <th>Added By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f._id}>
                  <td>
                    <div className="fighter-cell">
                      <div className="fighter-avatar">{f.name?.charAt(0)?.toUpperCase()}</div>
                      <span className="fighter-name">{f.name}</span>
                    </div>
                  </td>
                  <td><span className="text-clamp">{f.description || "—"}</span></td>
                  <td>{f.birthYear || "?"} – {f.deathYear || "?"}</td>
                  <td><span className={`badge badge-${f.status}`}>{f.status}</span></td>
                  <td>{f.createdBy?.name || "Admin"}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => openEdit(f)}
                        id={`edit-fighter-${f._id}`}
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(f._id, f.name)}
                        id={`delete-fighter-${f._id}`}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <div className="modal-header">
              <h2>{modal.mode === "create" ? "Add Freedom Fighter" : "Edit Freedom Fighter"}</h2>
              <button className="modal-close" onClick={() => setModal(null)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    placeholder="e.g. Bhagat Singh"
                  />
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="form-group">
                  <label>Birth Year</label>
                  <input
                    type="number"
                    value={form.birthYear}
                    onChange={(e) => setForm({ ...form, birthYear: e.target.value })}
                    placeholder="1907"
                  />
                </div>
                <div className="form-group">
                  <label>Death Year</label>
                  <input
                    type="number"
                    value={form.deathYear}
                    onChange={(e) => setForm({ ...form, deathYear: e.target.value })}
                    placeholder="1931"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  placeholder="Brief biography..."
                />
              </div>
              <div className="form-group">
                <label>Contributions</label>
                <textarea
                  value={form.contributions}
                  onChange={(e) => setForm({ ...form, contributions: e.target.value })}
                  rows={3}
                  placeholder="Key contributions to the independence movement..."
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <Save size={16} /> {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
