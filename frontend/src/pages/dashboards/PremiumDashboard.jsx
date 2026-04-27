import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, Bookmark, ThumbsUp, MessageSquare, TrendingUp, Search, Crown, CheckCircle2, User, Eye, ArrowRight, ShieldAlert, XCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import FighterModal from "../../components/FighterModal";
import api from "../../api/axios";

export default function PremiumDashboard() {
  const { user } = useAuth();
  const [concernMsg, setConcernMsg] = useState("");
  const [concernSent, setConcernSent] = useState(false);
  const [selectedFighter, setSelectedFighter] = useState(null);
  const [myConcerns, setMyConcerns] = useState([]);
  const [concernError, setConcernError] = useState("");

  const [history, setHistory] = useState([]);
  const [watchLater, setWatchLater] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    fetchMyConcerns();
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get("/users/premium-dashboard");
      setHistory(res.data.history);
      setWatchLater(res.data.watchLater);
      setRecommended(res.data.recommended);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchMyConcerns = async () => {
    try {
      const res = await api.get("/concerns/my");
      setMyConcerns(res.data);
    } catch (err) {
      console.error("Failed to fetch concerns", err);
    }
  };

  const toggleLike = async (id) => {
    try {
      const res = await api.post(`/fighters/${id}/like`);
      // Update local state by re-fetching
      fetchDashboardData();
    } catch (err) {
      console.error("Failed to like", err);
    }
  };

  const toggleWatchLater = async (id) => {
    try {
      await api.post(`/fighters/${id}/watch-later`);
      fetchDashboardData();
    } catch (err) {
      console.error("Failed to add to watch later", err);
    }
  };

  const handleRead = async (fighter) => {
    setSelectedFighter(fighter);
    try {
      await api.post(`/fighters/${fighter._id}/read`);
      fetchDashboardData(); // Refresh to update view counts
    } catch (err) {
      console.error("Failed to record read", err);
    }
  };

  const handleSendConcern = async (e) => {
    e.preventDefault();
    if (!concernMsg.trim()) return;
    setConcernError("");
    
    try {
      await api.post("/concerns", { message: concernMsg });
      setConcernSent(true);
      setConcernMsg("");
      fetchMyConcerns();
      setTimeout(() => setConcernSent(false), 5000);
    } catch (err) {
      setConcernError("Failed to submit concern. Please try again.");
    }
  };

  const renderCard = (item) => {
    const isLiked = item.likes?.includes(user?._id);
    const inWatchLater = watchLater.some(w => w._id === item._id);

    return (
      <div key={item._id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div 
          style={{ height: '140px', background: 'var(--bg-2)', position: 'relative', cursor: 'pointer' }}
          onClick={() => handleRead(item)}
        >
          {item.image ? (
            <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', color: 'var(--text-muted)' }}>
              {item.name.charAt(0)}
            </div>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); toggleWatchLater(item._id); }}
            style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.7)', color: inWatchLater ? 'var(--accent)' : 'white', border: 'none', padding: '6px', borderRadius: '4px', display: 'flex', cursor: 'pointer' }}
            title={inWatchLater ? "Remove from Watch Later" : "Add to Watch Later"}
          >
            <Bookmark size={14} fill={inWatchLater ? 'currentColor' : 'none'} />
          </button>
        </div>
        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', flex: 1 }}>{item.name}</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {item.description}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>
            <span style={{ display: 'flex', alignItems: 'center' }}><Eye size={14} style={{ marginRight: '4px' }}/> {item.views || 0} readers</span>
            <span style={{ display: 'flex', alignItems: 'center' }}><ThumbsUp size={14} style={{ marginRight: '4px' }}/> {item.likes?.length || 0} likes</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            <button 
              onClick={() => toggleLike(item._id)}
              style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: isLiked ? 'var(--accent)' : 'var(--text-secondary)' }}
            >
              <ThumbsUp size={18} fill={isLiked ? 'currentColor' : 'none'} style={{ marginRight: '6px' }} />
              {isLiked ? "Liked" : "Like"}
            </button>
            <button className="btn btn-ghost" style={{ padding: '4px 12px', fontSize: '13px' }} onClick={() => handleRead(item)}>
              <ArrowRight size={16} /> Read
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loadingData) {
    return <div className="page" style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}><div className="loading-spinner"/></div>;
  }

  return (
    <div className="page" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            Welcome back, {user?.name} <Crown size={24} className="text-accent" style={{ marginLeft: '12px' }} />
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Your personalized historical research workspace.</p>
        </div>
        <Link to="/subscription" className="btn btn-secondary">
          Manage Subscription
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        
        {/* Recommended For You */}
        <div style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <TrendingUp size={20} className="text-accent" style={{ marginRight: '8px' }} />
            <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Recommended For Your Usecase</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {recommended.length > 0 ? recommended.map(renderCard) : <p style={{ color: 'var(--text-secondary)' }}>No recommendations right now.</p>}
          </div>
        </div>

        {/* Watch History */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Clock size={20} className="text-accent" style={{ marginRight: '8px' }} />
              <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Study History</h2>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {history.length > 0 ? history.map(renderCard) : <p style={{ color: 'var(--text-secondary)' }}>You haven't read any documents yet.</p>}
          </div>
        </div>

        {/* Watch Later */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <Bookmark size={20} className="text-accent" style={{ marginRight: '8px' }} />
            <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Watch Later</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {watchLater.length > 0 ? watchLater.map(renderCard) : <p style={{ color: 'var(--text-secondary)' }}>Your watch later list is empty.</p>}
          </div>
        </div>

      </div>

      {/* Admin Contact / Raise Concern */}
      <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', marginTop: '40px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <ShieldAlert size={24} className="text-accent" style={{ marginRight: '8px' }} /> Contact Administration
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Did you find a historical inaccuracy, or do you have a concern regarding a document? Leave a direct comment for our verification team.
        </p>

        {concernSent ? (
          <div style={{ background: 'var(--green-dim)', color: 'var(--green)', padding: '16px', borderRadius: '8px', border: '1px solid var(--green)', display: 'flex', alignItems: 'center' }}>
            <CheckCircle2 size={20} style={{ marginRight: '8px' }} />
            Your concern has been forwarded to the administration. Thank you for maintaining our history!
          </div>
        ) : (
          <form onSubmit={handleSendConcern}>
            <textarea 
              value={concernMsg}
              onChange={e => setConcernMsg(e.target.value)}
              placeholder="Detail your concern or question here..."
              style={{
                width: '100%',
                background: 'var(--bg-2)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '16px',
                color: 'var(--text-primary)',
                minHeight: '120px',
                marginBottom: '16px',
                resize: 'vertical',
                outline: 'none'
              }}
              required
            />
            <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center' }}>
              <MessageSquare size={16} style={{ marginRight: '8px' }} /> Submit Concern
            </button>
            {concernError && <div style={{ color: 'var(--red)', marginTop: '8px', fontSize: '14px' }}>{concernError}</div>}
          </form>
        )}

        {/* Display Previous Concerns */}
        {myConcerns.length > 0 && (
          <div style={{ marginTop: '32px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Your Concern History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {myConcerns.map(c => (
                <div key={c._id} style={{ background: 'var(--bg-2)', padding: '16px', borderRadius: '8px', borderLeft: `4px solid ${c.status === 'addressed' ? 'var(--green)' : 'var(--yellow)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{new Date(c.createdAt).toLocaleDateString()}</span>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: c.status === 'addressed' ? 'var(--green)' : 'var(--yellow)' }}>{c.status}</span>
                  </div>
                  <p style={{ color: 'var(--text-primary)', marginBottom: c.response ? '12px' : '0' }}>{c.message}</p>
                  
                  {c.response && (
                    <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                      <span style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: 'var(--accent)', marginBottom: '4px' }}>Admin Response:</span>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{c.response}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <FighterModal 
        fighter={selectedFighter} 
        onClose={() => setSelectedFighter(null)} 
      />
    </div>
  );
}
