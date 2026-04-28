import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { Shield, User, Mail, Award, Key, Clock, CheckCircle, XCircle, History, Edit2, Camera, X, Check, Loader } from "lucide-react";
import "./Home.css";

export default function Profile() {
  const { user, fetchMe } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", avatar: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const { data } = await api.get("/contributions/my-suggestions");
        setSuggestions(data);
      } catch (err) {
        console.error("Failed to fetch suggestions", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchSuggestions();
      setEditForm({ name: user.name || "", avatar: user.avatar || "" });
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/users/profile", editForm);
      await fetchMe();
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin": return <span className="badge badge-admin">Administrator</span>;
      case "contributor": return <span className="badge badge-pending">Contributor</span>;
      case "premium": return <span className="badge badge-approved">Premium Member</span>;
      default: return <span className="badge badge-yellow">Citizen</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved": return <span className="badge badge-approved" style={{ gap: '4px' }}><CheckCircle size={12} /> Approved</span>;
      case "rejected": return <span className="badge badge-rejected" style={{ gap: '4px' }}><XCircle size={12} /> Rejected</span>;
      default: return <span className="badge badge-pending" style={{ gap: '4px' }}><Clock size={12} /> Pending</span>;
    }
  };

  return (
    <div className="page fade-in" style={{ paddingBottom: "60px" }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Your personal identity and history in Glimpses of Bharat</p>
        </div>
      </div>

      <div className="profile-container" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "30px", alignItems: "start" }}>
        {/* Profile Card */}
        <div className="profile-card" style={{ position: "sticky", top: "100px", overflow: 'visible' }}>
          <div className="profile-header-banner" style={{ height: "100px", background: 'linear-gradient(135deg, var(--accent), var(--accent-dim))', borderRadius: '16px 16px 0 0' }}></div>

          <div className="profile-avatar-container" style={{ marginTop: "-50px", position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div className="profile-avatar-large" style={{ 
              width: "100px", 
              height: "100px", 
              fontSize: "32px", 
              border: "4px solid var(--bg-card)",
              borderRadius: '50%',
              overflow: 'hidden',
              background: 'var(--bg-3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                user?.name?.charAt(0).toUpperCase() || "B"
              )}
            </div>
            <button 
              onClick={() => setIsEditing(true)}
              style={{
                position: 'absolute',
                bottom: '0',
                right: 'calc(50% - 50px)',
                background: 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
            >
              <Camera size={16} />
            </button>
          </div>

          <div className="profile-info" style={{ padding: "20px", textAlign: 'center' }}>
            <h2 className="profile-name" style={{ fontSize: "22px", fontWeight: '700' }}>{user?.name || "Bharat Vasi"}</h2>
            <div className="profile-role-badge" style={{ marginBottom: "20px", display: 'flex', justifyContent: 'center' }}>
              {getRoleBadge(user?.role)}
            </div>

            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-2)', padding: '16px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' }}>
                <Mail size={18} className="text-accent" />
                <span style={{ color: 'var(--text-secondary)' }}>{user?.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' }}>
                <Award size={18} className="text-accent" />
                <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>{user?.isPremium ? "Premium Access Active" : "Standard Membership"}</span>
              </div>
              <button 
                onClick={() => setIsEditing(true)}
                className="btn btn-ghost btn-sm"
                style={{ width: '100%', marginTop: '8px' }}
              >
                <Edit2 size={14} style={{ marginRight: '8px' }} /> Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Right Section: Tabs or Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Edit Profile Section (Conditional) */}
          {isEditing && (
            <div className="fade-in" style={{ 
              background: 'var(--bg-card)', 
              padding: '24px', 
              borderRadius: '16px', 
              border: '2px solid var(--accent)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Edit Profile Information</h2>
                <button onClick={() => setIsEditing(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '13px', marginBottom: '6px', display: 'block' }}>Display Name</label>
                  <input 
                    type="text" 
                    value={editForm.name} 
                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-2)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '13px', marginBottom: '6px', display: 'block' }}>Avatar URL</label>
                  <input 
                    type="text" 
                    placeholder="https://example.com/photo.jpg"
                    value={editForm.avatar} 
                    onChange={e => setEditForm({...editForm, avatar: e.target.value})}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-2)', color: 'var(--text-primary)' }}
                  />
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Provide a direct link to an image (JPEG, PNG, SVG).</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 1 }}>
                    {saving ? <Loader size={18} className="spin" /> : <><Check size={18} style={{marginRight: '8px'}}/> Save Changes</>}
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Suggestions History */}
          <div className="suggestions-history">
            <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
              <History size={20} className="text-accent" />
              My Contribution History
            </h2>

            {loading ? (
              <div className="loading-state">
                <div className="spinner" />
              </div>
            ) : suggestions.length === 0 ? (
              <div className="empty-state" style={{ padding: "40px", textAlign: "center", background: "var(--bg-card)", borderRadius: "16px", border: "1px solid var(--border)" }}>
                <p style={{ color: "var(--text-secondary)" }}>You haven't made any contributions yet.</p>
                <Link to="/explore" className="btn btn-ghost btn-sm" style={{ marginTop: "16px" }}>Discover Heroes</Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {suggestions.map((s) => (
                  <div key={s._id} style={{
                    background: "var(--bg-card)",
                    padding: "20px",
                    borderRadius: "16px",
                    border: "1px solid var(--border)",
                    transition: "all 0.2s"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--bg-3)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                          {s.fighter?.image ? <img src={s.fighter.image} alt={s.fighter.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Shield size={16} />}
                        </div>
                        <h3 style={{ fontSize: "16px", fontWeight: "600" }}>{s.fighter?.name}</h3>
                      </div>
                      {getStatusBadge(s.status)}
                    </div>
                    <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontStyle: "italic", marginBottom: "12px" }}>
                      "{s.suggestion}"
                    </p>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", display: "flex", justifyContent: "space-between" }}>
                      <span>Suggested on {new Date(s.createdAt).toLocaleDateString()}</span>
                      {s.adminFeedback && (
                        <span style={{ color: 'var(--accent)', fontWeight: 500 }}>
                          Feedback: {s.adminFeedback}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

