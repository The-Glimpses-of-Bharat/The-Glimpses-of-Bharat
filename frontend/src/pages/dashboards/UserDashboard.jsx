import React from "react";
import { Link } from "react-router-dom";
import { User, Shield, Search, Crown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function UserDashboard() {
  const { user } = useAuth();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome, {user?.name}!</h1>
          <p className="page-subtitle">Your personal portal for The Glimpses of Bharat</p>
        </div>
        <div className="badge">Standard User</div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px'}}>
        <div style={{background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)'}}>
          <Search size={32} className="text-accent" style={{marginBottom: '16px'}}/>
          <h2 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '8px'}}>Explore History</h2>
          <p style={{color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.5'}}>
            Dive into our database of freedom fighters. Use the chatbot to ask questions or browse the main page to learn more.
          </p>
          <Link to="/explore" className="btn btn-primary">Go to Explore</Link>
        </div>

        <div style={{background: 'linear-gradient(135deg, var(--bg-card), var(--accent-dim))', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--accent)'}}>
          <Crown size={32} style={{color: 'var(--yellow)', marginBottom: '16px'}}/>
          <h2 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '8px'}}>Upgrade to Premium</h2>
          <p style={{color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.5'}}>
            Get exclusive access to premium content, research journals, and advanced materials about India's freedom struggle.
          </p>
          {/* We can link to a checkout page or payment modal here */}
          <button className="btn" style={{background: 'var(--yellow)', color: '#000', fontWeight: 'bold'}}>Get Premium Access</button>
        </div>
      </div>
    </div>
  );
}
