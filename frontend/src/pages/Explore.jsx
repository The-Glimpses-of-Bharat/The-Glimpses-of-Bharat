import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { Shield, Search, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Home.css"; // Reuse home styles

export default function Explore() {
  const [fighters, setFighters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    api.get("/fighters")
      .then(res => setFighters(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredFighters = fighters.filter(f => {
    const term = search.toLowerCase();
    return (
      f.name?.toLowerCase().includes(term) ||
      f.description?.toLowerCase().includes(term) ||
      f.contributions?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="home-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="home-header">
        <div className="container header-container">
          <div className="logo">
            <Shield size={32} className="text-accent" />
            <span>The Glimpses of Bharat</span>
          </div>
          <nav className="home-nav">
            <Link to="/" className="btn btn-ghost"><ArrowLeft size={16} /> Back to Landing</Link>
            {user ? (
              <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">Login</Link>
                <Link to="/signup" className="btn btn-primary">Sign Up</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <section style={{ padding: '60px 0', background: 'var(--bg-2)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '16px' }}>Explore All Freedom Fighters</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '18px' }}>
            Search through our entire database by name, history, or specific contributions.
          </p>
          <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
            <Search size={24} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by name, state, event, or contribution..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 24px 16px 56px',
                fontSize: '18px',
                borderRadius: '99px',
                border: '2px solid var(--border)',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
        </div>
      </section>

      <section className="fighters-section" style={{ paddingTop: '60px', flex: 1 }}>
        <div className="container">
          {loading ? (
            <div className="loading-spinner" style={{ margin: '0 auto' }} />
          ) : filteredFighters.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
              <h2>No freedom fighters found matching "{search}"</h2>
              <p style={{ marginTop: '12px' }}>Try a different search term or ask the AI Chatbot!</p>
            </div>
          ) : (
            <div className="fighters-grid">
              {filteredFighters.map(fighter => (
                <Link to={`/fighter/${fighter._id}`} key={fighter._id} className="fighter-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                  {fighter.image ? (
                    <div className="fighter-image-wrapper" style={{ height: '160px', overflow: 'hidden' }}>
                      <img src={fighter.image} alt={fighter.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                    </div>
                  ) : (
                    <div className="fighter-image-placeholder">
                      {fighter.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="fighter-info">
                    <h3>{fighter.name}</h3>
                    <p className="fighter-years">{fighter.birthYear || '?'} - {fighter.deathYear || '?'}</p>
                    <p className="fighter-desc" style={{ WebkitLineClamp: search ? 'unset' : '3', display: search ? 'block' : '-webkit-box' }}>{fighter.description}</p>
                    {search && fighter.contributions && (
                      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                        <h4 style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Contributions</h4>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{fighter.contributions}</p>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
