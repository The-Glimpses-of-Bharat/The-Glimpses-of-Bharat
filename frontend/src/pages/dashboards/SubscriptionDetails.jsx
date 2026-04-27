import React from "react";
import { Link } from "react-router-dom";
import { Crown, Share2, CreditCard, MessageCircle, Send, ArrowRight, ShieldCheck, Download } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function SubscriptionDetails() {
  const { user } = useAuth();

  const handleShare = (platform) => {
    const text = "I just upgraded to Premium on The Glimpses of Bharat to access exclusive historical archives! Join me in exploring our rich history. #GlimpsesOfBharat #History";
    const url = "http://localhost:5175";
    
    if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
    } else if (platform === "instagram") {
      // Instagram doesn't have a direct share intent URL like Twitter, so we usually just copy to clipboard or open instagram.
      navigator.clipboard.writeText(text + " " + url);
      alert("Caption copied to clipboard! Open Instagram to paste and share.");
      window.open("https://instagram.com", "_blank");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Premium Subscription</h1>
          <p className="page-subtitle">Manage your account and share your historical journey</p>
        </div>
        <div className="badge badge-admin" style={{background: 'var(--yellow-dim)', color: 'var(--yellow)'}}>
          <Crown size={16} style={{marginRight: '6px'}}/> Active
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px'}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
          
          {/* Subscription Benefits */}
          <div style={{background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)'}}>
            <h2 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center'}}>
              <ShieldCheck size={24} className="text-accent" style={{marginRight: '8px'}} /> What You Get
            </h2>
            <p style={{color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.6'}}>
              Thank you for becoming a Premium Member, {user?.name}! Your contribution helps preserve our nation's history. Here is what you are using your subscription for:
            </p>
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
          
          {/* Payment Method */}
          <div style={{background: 'var(--bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)'}}>
            <h2 style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center'}}>
              <CreditCard size={20} className="text-accent" style={{marginRight: '8px'}} /> Payment Details
            </h2>
            <div style={{background: 'var(--bg-2)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '16px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                <span style={{color: 'var(--text-secondary)'}}>Plan</span>
                <span style={{fontWeight: 'bold'}}>Lifetime Access</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                <span style={{color: 'var(--text-secondary)'}}>Amount Paid</span>
                <span style={{fontWeight: 'bold'}}>₹499.00</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span style={{color: 'var(--text-secondary)'}}>Status</span>
                <span style={{color: 'var(--green)', fontWeight: 'bold'}}>Verified ✓</span>
              </div>
            </div>
            <button className="btn btn-ghost" style={{width: '100%', justifyContent: 'center'}}>
              <Download size={16} style={{marginRight: '8px'}} /> Download Invoice
            </button>
          </div>

          {/* Social Sharing */}
          <div style={{background: 'linear-gradient(135deg, var(--bg-card), var(--accent-dim))', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--accent)'}}>
            <h2 style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center'}}>
              <Share2 size={20} className="text-accent" style={{marginRight: '8px'}} /> Spread the Word
            </h2>
            <p style={{color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '14px', lineHeight: '1.5'}}>
              Proud of supporting Indian history? Let your friends know!
            </p>
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              <button 
                onClick={() => handleShare('twitter')}
                className="btn" 
                style={{background: '#1DA1F2', color: 'white', width: '100%', justifyContent: 'center', border: 'none'}}
              >
                <MessageCircle size={18} style={{marginRight: '8px'}} /> Share on Twitter
              </button>
              <button 
                onClick={() => handleShare('instagram')}
                className="btn" 
                style={{background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', color: 'white', width: '100%', justifyContent: 'center', border: 'none'}}
              >
                <Send size={18} style={{marginRight: '8px'}} /> Share on Instagram
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
