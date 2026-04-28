import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, FileText, Download, Crown, Search, Users, Calendar, Building2, Lock, ArrowLeft, Loader } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const premiumData = {
  fighters: [
    { id: "f1", title: "Bhagat Singh's Prison Diary", author: "National Archives", type: "Document", size: "4.2 MB", desc: "Digital scan of the original diary kept during his imprisonment." },
    { id: "f2", title: "Subhas Chandra Bose: Declassified Files", author: "Govt of India", type: "Dossier", size: "15.8 MB", desc: "Top secret files detailing the mysterious disappearance." },
    { id: "f3", title: "Letters of Sardar Patel", author: "Ministry of Information", type: "Letters", size: "8.5 MB", desc: "Unpublished correspondence during the integration of princely states." },
    { id: "f4", title: "Rani Lakshmibai's Military Strategies", author: "British India Archives", type: "Military Log", size: "5.1 MB", desc: "Translated intercepted documents detailing Jhansi's defense." }
  ],
  events: [
    { id: "e1", title: "Jallianwala Bagh Massacre Report", author: "Hunter Commission", type: "Report", size: "8.1 MB", desc: "The official British inquiry report from 1920." },
    { id: "e2", title: "Dandi March Route Map & Logistics", author: "INC Archives", type: "Map/Document", size: "5.5 MB", desc: "Detailed maps and letters planning the Salt Satyagraha." },
    { id: "e3", title: "Quit India Movement Underground Network", author: "Home Dept, 1942", type: "Police Files", size: "11.2 MB", desc: "British intelligence files on the secret radio broadcasts." },
    { id: "e4", title: "Naval Mutiny of 1946 Logs", author: "Royal Indian Navy", type: "Logbook", size: "6.8 MB", desc: "Daily logs of the ships that revolted in Bombay." }
  ],
  organizations: [
    { id: "o1", title: "HSRA Manifesto: The Philosophy of the Bomb", author: "Bhagwati Charan Vohra", type: "Manifesto", size: "2.1 MB", desc: "The foundational text of the Hindustan Socialist Republican Association." },
    { id: "o2", title: "Early Resolutions of the Indian National Congress", author: "INC Archives", type: "Journal", size: "6.7 MB", desc: "Minutes from the first sessions (1885-1900)." },
    { id: "o3", title: "Ghadar Party Publications", author: "Lala Har Dayal", type: "Newspaper Scans", size: "14.5 MB", desc: "High-res scans of the Hindustan Ghadar weekly." },
    { id: "o4", title: "Azad Hind Fauj (INA) Recruitment Posters", author: "INA Archives", type: "Visual Media", size: "22.3 MB", desc: "Collection of original propaganda and recruitment posters." }
  ],
  books: [
    { id: "b1", title: "The Economic History of India", author: "Romesh Chunder Dutt", type: "eBook", size: "12.4 MB", desc: "Classic text exposing the economic drain of India." },
    { id: "b2", title: "India Wins Freedom (Unabridged)", author: "Maulana Abul Kalam Azad", type: "eBook", size: "9.3 MB", desc: "The complete, uncensored version of his memoir." },
    { id: "b3", title: "Discovery of India (Annotated Edition)", author: "Jawaharlal Nehru", type: "eBook", size: "18.2 MB", desc: "Includes Nehru's handwritten margin notes from prison." },
    { id: "b4", title: "Annihilation of Caste", author: "B.R. Ambedkar", type: "eBook", size: "7.6 MB", desc: "Original 1936 self-published edition with prologue." }
  ]
};

export default function ResearchPortal() {
  const { user, fetchMe } = useAuth();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const navigate = useNavigate();

  const isPremium = user?.role === "premium" || user?.role === "admin"; // Admins get free access too

  const handlePayment = async () => {
    // Open the official Stripe Payment Link in a new tab
    const stripeLink = import.meta.env.VITE_STRIPE_BUY_LINK || "https://buy.stripe.com/test_8x24gyeTl1jj3X3gOCebu00";
    window.open(stripeLink, "_blank");

    // Since we don't have Stripe webhooks configured locally, 
    // we use a confirm dialog to simulate the webhook verification after they pay.
    setTimeout(async () => {
      const isPaid = window.confirm("Did you successfully complete the payment on Stripe?");
      if (isPaid) {
        setPaymentLoading(true);
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
          setPaymentLoading(false);
        }
      }
    }, 1000);
  };

  const filterItems = (items) => {
    return items.filter(item => 
      item.title.toLowerCase().includes(search.toLowerCase()) || 
      item.desc.toLowerCase().includes(search.toLowerCase()) ||
      item.author.toLowerCase().includes(search.toLowerCase())
    );
  };

  const renderCard = (item) => (
    <div key={item.id} style={{
      background: 'var(--bg-card)', 
      border: '1px solid var(--border)', 
      borderRadius: 'var(--radius-lg)', 
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transition: 'all 0.2s ease',
      position: 'relative',
      overflow: 'hidden'
    }} className="premium-card">
      <div style={{position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: isPremium ? 'var(--yellow)' : 'var(--text-muted)'}} />
      <div style={{marginBottom: '16px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px'}}>
          <span style={{fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: isPremium ? 'var(--yellow)' : 'var(--text-muted)', letterSpacing: '0.5px'}}>{item.type}</span>
          <span style={{fontSize: '12px', color: 'var(--text-muted)'}}>{item.size}</span>
        </div>
        <h3 style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', lineHeight: '1.3'}}>{item.title}</h3>
        <p style={{
          fontSize: '14px', 
          color: 'var(--text-secondary)', 
          marginBottom: '8px',
          filter: isPremium ? 'none' : 'blur(3px)',
          userSelect: isPremium ? 'auto' : 'none',
          transition: 'all 0.3s ease'
        }}>{item.desc}</p>
        <p style={{fontSize: '13px', color: 'var(--text-muted)'}}>By {item.author}</p>
      </div>
      
      {isPremium ? (
        <button className="btn" style={{background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-primary)', width: '100%', justifyContent: 'center'}}>
          <Download size={16} style={{marginRight: '8px'}} /> Download (Free)
        </button>
      ) : (
        <button 
          className="btn" 
          style={{background: 'var(--yellow-dim)', border: '1px solid var(--yellow)', color: 'var(--yellow)', width: '100%', justifyContent: 'center'}}
          onClick={handlePayment}
          disabled={paymentLoading}
        >
          {paymentLoading ? <Loader size={16} className="spin" /> : <Lock size={16} style={{marginRight: '8px'}} />} 
          {paymentLoading ? "Processing..." : "Be a Premium Member to Access"}
        </button>
      )}
    </div>
  );

  return (
    <div className="page">
      <div className="page-header" style={{borderBottom: 'none', paddingBottom: 0}}>
        <div>
          <h1 className="page-title">Research Portal</h1>
          <p className="page-subtitle">Exclusive archives, journals, and classified materials</p>
        </div>
        <div style={{display: 'flex', gap: '12px'}}>
          <Link to="/" className="btn btn-ghost" style={{fontSize: '14px'}}>
            <ArrowLeft size={16} style={{marginRight: '6px'}}/> Home Page
          </Link>
          <div className="badge badge-admin" style={{background: isPremium ? 'var(--yellow-dim)' : 'var(--bg-3)', color: isPremium ? 'var(--yellow)' : 'var(--text-muted)', padding: '8px 16px', fontSize: '14px'}}>
            {isPremium ? <Crown size={16} style={{marginRight: '6px'}}/> : <Lock size={16} style={{marginRight: '6px'}}/>} 
            {isPremium ? "Premium Member" : "Standard User"}
          </div>
        </div>
      </div>

      {!isPremium && (
        <div style={{background: 'linear-gradient(135deg, var(--bg-card), var(--accent-dim))', padding: '20px 24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--accent)', margin: '24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
            <div style={{background: 'var(--yellow-dim)', padding: '12px', borderRadius: '12px'}}>
              <Crown size={32} style={{color: 'var(--yellow)'}}/>
            </div>
            <div>
              <h2 style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '4px'}}>Unlock Full Archives</h2>
              <p style={{color: 'var(--text-secondary)', fontSize: '14px'}}>Get premium access to download these unredacted historical documents.</p>
            </div>
          </div>
          <button 
            className="btn" 
            style={{background: 'var(--yellow)', color: '#000', fontWeight: 'bold', whiteSpace: 'nowrap', padding: '10px 24px'}}
            onClick={handlePayment}
            disabled={paymentLoading}
          >
            {paymentLoading ? <Loader size={16} className="spin" /> : "Get Premium Access"}
          </button>
        </div>
      )}

      <div style={{ opacity: isPremium ? 1 : 0.85 }}>
        <section style={{margin: '24px 0'}}>
        <div style={{position: 'relative', maxWidth: '100%'}}>
          <Search size={20} style={{position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)'}}/>
          <input 
            type="text" 
            placeholder="Search premium archives by title, author, or keyword..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '16px 24px 16px 48px',
              fontSize: '16px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              outline: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}
          />
        </div>
      </section>

      <section style={{marginBottom: '32px'}}>
        <div style={{display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none'}}>
          {[
            { id: 'all', label: 'All Archives', icon: BookOpen },
            { id: 'fighters', label: 'Freedom Fighters', icon: Users },
            { id: 'events', label: 'Historical Events', icon: Calendar },
            { id: 'organizations', label: 'Organizations', icon: Building2 },
            { id: 'books', label: 'Books & Journals', icon: FileText }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', borderRadius: '99px',
                fontWeight: '600', fontSize: '14px',
                background: activeTab === tab.id ? (isPremium ? 'var(--yellow)' : 'var(--text-primary)') : 'var(--bg-card)',
                color: activeTab === tab.id ? '#000' : 'var(--text-primary)',
                border: activeTab === tab.id ? (isPremium ? '1px solid var(--yellow)' : '1px solid var(--text-primary)') : '1px solid var(--border)',
                cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s'
              }}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>
      </section>

      <div style={{display: 'flex', flexDirection: 'column', gap: '32px'}}>
        {(activeTab === 'all' || activeTab === 'fighters') && filterItems(premiumData.fighters).length > 0 && (
          <section>
            <h2 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
              <Users size={20} className="text-accent" /> Freedom Fighters Archives
            </h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px'}}>
              {filterItems(premiumData.fighters).map(renderCard)}
            </div>
          </section>
        )}

        {(activeTab === 'all' || activeTab === 'events') && filterItems(premiumData.events).length > 0 && (
          <section>
            <h2 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
              <Calendar size={20} className="text-accent" /> Historical Events
            </h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px'}}>
              {filterItems(premiumData.events).map(renderCard)}
            </div>
          </section>
        )}

        {(activeTab === 'all' || activeTab === 'organizations') && filterItems(premiumData.organizations).length > 0 && (
          <section>
            <h2 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
              <Building2 size={20} className="text-accent" /> Organizations & Movements
            </h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px'}}>
              {filterItems(premiumData.organizations).map(renderCard)}
            </div>
          </section>
        )}

        {(activeTab === 'all' || activeTab === 'books') && filterItems(premiumData.books).length > 0 && (
          <section>
            <h2 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
              <BookOpen size={20} className="text-accent" /> Books & Journals
            </h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px'}}>
              {filterItems(premiumData.books).map(renderCard)}
            </div>
          </section>
        )}

        {/* Empty State */}
        {['fighters', 'events', 'organizations', 'books'].every(category => filterItems(premiumData[category]).length === 0) && (
          <div style={{textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)'}}>
            <Search size={48} style={{margin: '0 auto 16px', opacity: 0.2}} />
            <h3>No premium archives found</h3>
            <p>Try adjusting your search terms.</p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
