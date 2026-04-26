import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Users, Clock, CheckCircle, XCircle, Sword, TrendingUp } from "lucide-react";

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

  useEffect(() => {
    api
      .get("/admin/stats")
      .then(({ data }) => setStats(data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load stats"))
      .finally(() => setLoading(false));
  }, []);

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
    </div>
  );
}
