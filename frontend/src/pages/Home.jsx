import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { Shield, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

export default function Home() {
  const [fighters, setFighters] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    api.get("/fighters")
      .then(res => setFighters(res.data.slice(0, 6))) // Show top 6
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="container header-container">
          <div className="logo">
            <Shield size={32} className="text-accent" />
            <span>The Glimpses of Bharat</span>
          </div>
          <nav className="home-nav">
            {user ? (
              <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">Login</Link>
                <Link to="/signup" className="btn btn-primary">Sign Up</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <section className="hero-section">
        <div className="container hero-content">
          <h1 className="hero-title">
            Discover the Unsung Heroes of <span className="text-accent">Bharat</span>
          </h1>
          <p className="hero-subtitle">
            Explore the rich history of India's freedom struggle. Learn about the brave souls who sacrificed everything for our independence, and contribute to preserving their legacy.
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="btn btn-primary btn-lg">Join the Movement <ArrowRight size={18} /></Link>
            <Link to="/explore" className="btn btn-secondary btn-lg">Explore All Heroes</Link>
          </div>
        </div>
      </section>

      <section id="fighters" className="fighters-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Freedom Fighters</h2>
            <p>A glimpse into the lives of those who shaped our nation.</p>
          </div>

          {loading ? (
            <div className="loading-spinner" />
          ) : (
            <div className="fighters-grid">
              {fighters.map(fighter => (
                <div key={fighter._id} className="fighter-card">
                  {fighter.image ? (
                    <div className="fighter-image-wrapper" style={{height: '160px', overflow: 'hidden'}}>
                      <img src={fighter.image} alt={fighter.name} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top'}} />
                    </div>
                  ) : (
                    <div className="fighter-image-placeholder">
                      {fighter.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="fighter-info">
                    <h3>{fighter.name}</h3>
                    <p className="fighter-years">{fighter.birthYear} - {fighter.deathYear}</p>
                    <p className="fighter-desc">{fighter.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      <footer className="home-footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} The Glimpses of Bharat. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
