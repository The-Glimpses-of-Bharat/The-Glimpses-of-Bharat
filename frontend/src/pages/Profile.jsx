import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { Shield, User, Mail, Award, Key, Clock, CheckCircle, XCircle, History } from "lucide-react";
import "./Home.css";

export default function Profile() {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

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
    if (user) fetchSuggestions();
  }, [user]);

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
        <div className="profile-card" style={{ position: "sticky", top: "100px" }}>
          <div className="profile-header-banner" style={{ height: "100px" }}></div>

          <div className="profile-avatar-container" style={{ marginTop: "-40px" }}>
            <div className="profile-avatar-large" style={{ width: "80px", height: "80px", fontSize: "32px", border: "4px solid var(--bg-card)" }}>
              {user?.name?.charAt(0).toUpperCase() || "B"}
            </div>
          </div>

          <div className="profile-info" style={{ padding: "20px" }}>
            <h2 className="profile-name" style={{ fontSize: "20px" }}>{user?.name || "Bharat Vasi"}</h2>
            <div className="profile-role-badge" style={{ marginBottom: "20px" }}>
              {getRoleBadge(user?.role)}
            </div>

            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                <Mail size={16} className="text-accent" />
                <span style={{ color: 'var(--text-secondary)' }}>{user?.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                <Award size={16} className="text-accent" />
                <span style={{ color: 'var(--text-secondary)' }}>{user?.isPremium ? "Premium" : "Standard"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Suggestions/History Section */}
        <div className="suggestions-history">
          <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
            <History size={20} className="text-accent" />
            My Information Suggestions
          </h2>

          {loading ? (
            <div className="loading-state">
              <div className="spinner" />
            </div>
          ) : suggestions.length === 0 ? (
            <div className="empty-state" style={{ padding: "40px", textAlign: "center", background: "var(--bg-card)", borderRadius: "16px", border: "1px solid var(--border)" }}>
              <p style={{ color: "var(--text-secondary)" }}>You haven't suggested any edits yet.</p>
              <Link to="/explore" className="btn btn-ghost btn-sm" style={{ marginTop: "16px" }}>Explore Heroes</Link>
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
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--bg-3)", display: "flex", alignItems: "center", justifyCenter: "center", overflow: "hidden" }}>
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
  );
}
