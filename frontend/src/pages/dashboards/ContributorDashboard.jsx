import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Clock, CheckCircle, XCircle, Award, Star } from "lucide-react";

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

export default function ContributorDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We will implement this backend route next
    api.get("/contributions/my-stats")
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Contributor Dashboard</h1>
          <p className="page-subtitle">Track your historical contributions</p>
        </div>
        <div className="badge badge-yellow">Contributor</div>
      </div>

      <section className="mb-6">
        <div style={{background: 'var(--accent-dim)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--accent)', display: 'flex', alignItems: 'center', gap: '16px'}}>
          <Award size={48} className="text-accent" />
          <div>
            <h2 style={{fontSize: '20px', fontWeight: 'bold', color: 'var(--accent)', marginBottom: '8px'}}>Top Contributor Status</h2>
            <p style={{color: 'var(--text-primary)'}}>
              Thank you for helping preserve the legacy of our freedom fighters. 
              {stats?.approved > 5 ? " You are a Top Contributor! Keep up the great work." : " Submit more entries to earn special mentions!"}
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="section-title">
          <Star size={18} /> My Contributions
        </h2>
        <div className="stats-grid">
          <StatCard icon={Clock}       label="Pending Review" value={stats?.pending}  color="yellow" loading={loading} />
          <StatCard icon={CheckCircle} label="Approved"       value={stats?.approved} color="green"  loading={loading} />
          <StatCard icon={XCircle}     label="Rejected"       value={stats?.rejected} color="red"    loading={loading} />
        </div>
      </section>
    </div>
  );
}
