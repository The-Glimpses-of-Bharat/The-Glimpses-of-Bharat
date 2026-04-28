import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Crown, Share2, CreditCard, MessageCircle, Send, ArrowRight, ShieldCheck, Download, Loader, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

export default function SubscriptionDetails() {
  const { user, fetchMe } = useAuth();
  const [loading, setLoading] = useState(false);

  const isPremium = user?.role === "premium" || user?.role === "admin" || user?.isPremium === true;

  const handleShare = (platform) => {
    const text = "I just upgraded to Premium on The Glimpses of Bharat to access exclusive historical archives! Join me in exploring our rich history. #GlimpsesOfBharat #History";
    const url = window.location.origin;
    
    if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
    } else if (platform === "instagram") {
      navigator.clipboard.writeText(text + " " + url);
      alert("Caption copied to clipboard! Open Instagram to paste and share.");
      window.open("https://instagram.com", "_blank");
    }
  };

  const handlePayment = async () => {
    // Open the official Stripe Payment Link in a new tab
    const stripeLink = "https://buy.stripe.com/test_8x24gyeTl1jj3X3gOCebu00";
    window.open(stripeLink, "_blank");

    // Since we don't have Stripe webhooks configured locally, 
    // we use a confirm dialog to simulate the webhook verification after they pay.
    setTimeout(async () => {
      const isPaid = window.confirm("TEST MODE: Did you successfully complete the payment on Stripe? (Click OK to instantly upgrade to Premium for free)");
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
          <h1 className="page-title">Premium Subscription</h1>
          <p className="page-subtitle">Manage your account and historical access level</p>
        </div>
        <div className={`badge ${isPremium ? 'badge-admin' : ''}`} style={{background: isPremium ? 'var(--yellow-dim)' : 'var(--bg-3)', color: isPremium ? 'var(--yellow)' : 'var(--text-muted)'}}>
          {isPremium ? <Crown size={16} style={{marginRight: '6px'}}/> : <Lock size={16} style={{marginRight: '6px'}}/>} 
          {isPremium ? "Premium Active" : "Standard Membership"}
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: isPremium ? '2fr 1fr' : '1fr', gap: '24px'}}>
        
        {!isPremium ? (
          <div style={{background: 'linear-gradient(135deg, var(--bg-card), var(--accent-dim))', padding: '60px 40px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--accent)', textAlign: 'center'}}>
            <Crown size={64} style={{color: 'var(--yellow)', margin: '0 auto 24px'}}/>
            <h2 style={{fontSize: '32px', fontWeight: 'bold', marginBottom: '16px'}}>Unlock Full Historical Access</h2>
            <p style={{color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '18px', maxWidth: '700px', margin: '0 auto 40px', lineHeight: '1.6'}}>
              Become a Premium Member today to unlock the Research Portal, download exclusive archives, and access the restricted dossiers of India's freedom struggle.
            </p>
            <button 
              className="btn" 
              style={{background: 'var(--yellow)', color: '#000', fontWeight: 'bold', fontSize: '20px', padding: '16px 48px', margin: '0 auto'}}
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? <><Loader size={20} className="spin" style={{marginRight: '12px'}}/> Upgrading...</> : "Get Premium Lifetime Access (₹499)"}
            </button>
            <p style={{marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)'}}>One-time payment for lifetime access to all future archives.</p>
          </div>
        ) : (
          <>
            <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
              <div style={{background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)'}}>
                <h2 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center'}}>
                  <ShieldCheck size={24} className="text-accent" style={{marginRight: '8px'}} /> Premium Benefits
                </h2>
                <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-primary)'}}>
                  <li style={{display: 'flex', alignItems: 'center'}}><Crown size={16} className="text-accent" style={{marginRight: '12px'}} /> Access to highly classified declassified dossiers.</li>
                  <li style={{display: 'flex', alignItems: 'center'}}><Crown size={16} className="text-accent" style={{marginRight: '12px'}} /> Read personal diaries of legendary freedom fighters.</li>
                  <li style={{display: 'flex', alignItems: 'center'}}><Crown size={16} className="text-accent" style={{marginRight: '12px'}} /> Download unabridged high-resolution historical books.</li>
                  <li style={{display: 'flex', alignItems: 'center'}}><Crown size={16} className="text-accent" style={{marginRight: '12px'}} /> Support the continuous digitization of India's archives.</li>
                </ul>
                <div style={{marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border)'}}>
                  <Link to="/research" className="btn" style={{background: 'var(--yellow)', color: '#000', fontWeight: 'bold', width: '100%', justifyContent: 'center'}}>
                    Access Research Portal Now <ArrowRight size={16} style={{marginLeft: '8px'}} />
                  </Link>
                </div>
              </div>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
              <div style={{background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)'}}>
                <h2 style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center'}}>
                  <CreditCard size={20} className="text-accent" style={{marginRight: '8px'}} /> Payment History
                </h2>
                <div style={{background: 'var(--bg-2)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '16px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                    <span style={{color: 'var(--text-secondary)'}}>Plan</span>
                    <span style={{fontWeight: 'bold'}}>Lifetime Access</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span style={{color: 'var(--text-secondary)'}}>Status</span>
                    <span style={{color: 'var(--green)', fontWeight: 'bold'}}>Verified ✓</span>
                  </div>
                </div>
                <button className="btn btn-ghost" style={{width: '100%', justifyContent: 'center'}}>
                  <Download size={16} style={{marginRight: '8px'}} /> View Invoice
                </button>
              </div>

              <div style={{background: 'linear-gradient(135deg, var(--bg-card), var(--accent-dim))', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--accent)'}}>
                <h2 style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center'}}>
                  <Share2 size={20} className="text-accent" style={{marginRight: '8px'}} /> Share Status
                </h2>
                <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                  <button onClick={() => handleShare('twitter')} className="btn" style={{background: '#1DA1F2', color: 'white', width: '100%', justifyContent: 'center', border: 'none'}}>
                    <MessageCircle size={18} style={{marginRight: '8px'}} /> Twitter
                  </button>
                  <button onClick={() => handleShare('instagram')} className="btn" style={{background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', color: 'white', width: '100%', justifyContent: 'center', border: 'none'}}>
                    <Send size={18} style={{marginRight: '8px'}} /> Instagram
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
