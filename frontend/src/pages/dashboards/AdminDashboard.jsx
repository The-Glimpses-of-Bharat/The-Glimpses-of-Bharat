import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Users, Clock, CheckCircle, XCircle, Sword, TrendingUp, MessageSquare } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, color, loading }) => (
  <div className={`stat-card stat-card--${color}`}>
    <div className="stat-icon">
      <Icon size={22} />
    </div>
    <div className="stat-body">
      <p className="stat-label">{label}</p>
      <h2 className="stat-value">{loading ? "—" : value ?? 0}</h2>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [concerns, setConcerns] = useState([]);
  const [concernsLoading, setConcernsLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/stats")
      .then(({ data }) => setStats(data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load stats"))
      .finally(() => setLoading(false));

    fetchConcerns();
  }, []);

  const fetchConcerns = async () => {
    try {
      const res = await api.get("/concerns");
      setConcerns(res.data);
    } catch (err) {
      console.error("Failed to load concerns", err);
    } finally {
      setConcernsLoading(false);
    }
  };

  const handleAddressConcern = async (id, responseText) => {
    try {
      await api.put(`/concerns/${id}/address`, { response: responseText });
      fetchConcerns(); // Reload concerns to show updated status
    } catch (err) {
      console.error("Failed to address concern", err);
      alert("Failed to send response");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Overview of your platform activity</p>
        </div>
        <div className="badge badge-admin">Admin View</div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <section>
        <h2 className="section-title">
          <Users size={18} /> User Statistics
        </h2>
        <div className="stats-grid">
          <StatCard icon={Users}       label="Total Users"   value={stats?.totalUsers}   color="blue"   loading={loading} />
          <StatCard icon={TrendingUp}  label="Contributors"  value={stats?.contributors}  color="violet" loading={loading} />
          <StatCard icon={Users}       label="Admins"        value={stats?.admins}        color="amber"  loading={loading} />
        </div>
      </section>

      <section className="mt-lg">
        <h2 className="section-title">
          <Sword size={18} /> Contribution Pipeline
        </h2>
        <div className="stats-grid">
          <StatCard icon={Clock}       label="Pending Review"    value={stats?.pendingFighters}  color="yellow"  loading={loading} />
          <StatCard icon={CheckCircle} label="Approved Fighters"  value={stats?.approvedFighters} color="green"   loading={loading} />
          <StatCard icon={XCircle}     label="Rejected"           value={stats?.rejectedFighters} color="red"     loading={loading} />
        </div>
      </section>

      {stats && (
        <section className="mt-lg">
          <h2 className="section-title">Approval Rate</h2>
          <div className="progress-card">
            {(() => {
              const total = (stats.approvedFighters || 0) + (stats.rejectedFighters || 0);
              const rate = total ? Math.round((stats.approvedFighters / total) * 100) : 0;
              return (
                <>
                  <div className="progress-meta">
                    <span>Approved vs Rejected</span>
                    <span className="progress-pct">{rate}%</span>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${rate}%` }} />
                  </div>
                </>
              );
            })()}
          </div>
        </section>
      )}

      <section className="mt-lg">
        <h2 className="section-title">
          <MessageSquare size={18} /> User Concerns
        </h2>
        {concernsLoading ? (
          <div className="loading-spinner" />
        ) : concerns.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No concerns reported.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {concerns.map(c => (
              <div key={c._id} style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: 'var(--radius-lg)', borderLeft: `4px solid ${c.status === 'addressed' ? 'var(--green)' : 'var(--yellow)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold' }}>From: {c.user?.name || "Unknown User"}</span>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: c.status === 'addressed' ? 'var(--green)' : 'var(--yellow)' }}>{c.status}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '14px' }}>{new Date(c.createdAt).toLocaleString()}</p>
                <p style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>{c.message}</p>

                {c.status === 'pending' ? (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddressConcern(c._id, e.target.response.value);
                    }}
                    style={{ display: 'flex', gap: '12px' }}
                  >
                    <input 
                      name="response" 
                      placeholder="Type your response to the user..." 
                      required 
                      style={{ flex: 1, padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--bg-2)', color: 'var(--text-primary)' }}
                    />
                    <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px' }}>Address</button>
                  </form>
                ) : (
                  <div style={{ background: 'var(--bg-2)', padding: '12px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                    <span style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: 'var(--accent)', marginBottom: '4px' }}>Your Response:</span>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{c.response}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
