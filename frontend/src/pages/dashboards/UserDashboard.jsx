import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Crown, Loader, ArrowRight } from "lucide-react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function UserDashboard() {
  const { user, fetchMe } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async () => {
    // Open the official Stripe Payment Link in a new tab
    const stripeLink = import.meta.env.VITE_STRIPE_BUY_LINK || "https://buy.stripe.com/test_8x24gyeTl1jj3X3gOCebu00";
    window.open(stripeLink, "_blank");

    // Since we don't have Stripe webhooks configured locally, 
    // we use a confirm dialog to simulate the webhook verification after they pay.
    setTimeout(async () => {
      const isPaid = window.confirm("Did you successfully complete the payment on Stripe?");
      if (isPaid) {
        setLoading(true);
        try {
          const verifyRes = await api.post("/payment/verify", {
            session_id: "mock_session_" + Date.now(),
            is_mock_payment: true
          });

          if (verifyRes.data.token) {
            localStorage.setItem("token", verifyRes.data.token);
          }
          alert("Payment verified! " + verifyRes.data.message);
          await fetchMe();
        } catch (err) {
          console.error(err);
          alert("Failed to verify payment.");
        } finally {
          setLoading(false);
        }
      }
    }, 1000);
  };

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

        {user?.role !== "premium" ? (
          <div style={{background: 'linear-gradient(135deg, var(--bg-card), var(--accent-dim))', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--accent)'}}>
            <Crown size={32} style={{color: 'var(--yellow)', marginBottom: '16px'}}/>
            <h2 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '8px'}}>Upgrade to Premium</h2>
            <p style={{color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.5'}}>
              Get exclusive access to premium content, research journals, and advanced materials about India's freedom struggle.
            </p>
            <button 
              className="btn" 
              style={{background: 'var(--yellow)', color: '#000', fontWeight: 'bold'}}
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? <><Loader size={16} className="spin" /> Processing...</> : "Get Premium Access (₹499)"}
            </button>
          </div>
        ) : (
          <div style={{background: 'linear-gradient(135deg, var(--bg-card), var(--yellow-dim))', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--yellow)'}}>
            <Crown size={32} style={{color: 'var(--yellow)', marginBottom: '16px'}}/>
            <h2 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '8px'}}>Premium Access Active</h2>
            <p style={{color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.5'}}>
              You have full access to our exclusive research portal and materials.
            </p>
            <Link to="/subscription" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center' }}>
              Manage Subscription & Share <ArrowRight size={16} style={{ marginLeft: '8px' }} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
