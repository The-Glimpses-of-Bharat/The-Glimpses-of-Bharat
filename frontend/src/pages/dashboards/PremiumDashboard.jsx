import React from "react";
import { BookOpen, FileText, Download, Crown } from "lucide-react";

export default function PremiumDashboard() {
  const premiumJournals = [
    { id: 1, title: "The Economic Impact of British Rule", author: "Dr. A. Sharma", date: "Oct 1947", size: "2.4 MB" },
    { id: 2, title: "Declassified Letters of Subhash Chandra Bose", author: "National Archives", date: "Jan 1942", size: "5.1 MB" },
    { id: 3, title: "Women in the 1857 Rebellion", author: "Prof. K. Verma", date: "May 1858", size: "3.8 MB" }
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Premium Research Portal</h1>
          <p className="page-subtitle">Exclusive journals and materials for your research</p>
        </div>
        <div className="badge badge-admin" style={{background: 'var(--yellow-dim)', color: 'var(--yellow)'}}>
          <Crown size={12} style={{marginRight: '4px'}}/> Premium Access
        </div>
      </div>

      <section>
        <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px'}}>
          <BookOpen size={24} className="text-accent" />
          <h2 style={{fontSize: '24px', fontWeight: 'bold'}}>Research Journals & Materials</h2>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '16px'}}>
          {premiumJournals.map(journal => (
            <div key={journal.id} style={{
              background: 'var(--bg-card)', 
              border: '1px solid var(--border)', 
              borderRadius: 'var(--radius)', 
              padding: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'all 0.2s ease'
            }} className="journal-card">
              <div style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
                <div style={{width: '48px', height: '48px', borderRadius: '8px', background: 'var(--bg-3)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <FileText size={24} color="var(--text-secondary)" />
                </div>
                <div>
                  <h3 style={{fontSize: '16px', fontWeight: 'bold', marginBottom: '4px'}}>{journal.title}</h3>
                  <p style={{fontSize: '13px', color: 'var(--text-secondary)'}}>{journal.author} • {journal.date}</p>
                </div>
              </div>
              <button className="btn btn-secondary">
                <Download size={16} /> Download PDF
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
