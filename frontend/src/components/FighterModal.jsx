import React from "react";
import { X, Calendar, MapPin, Award, BookOpen } from "lucide-react";

export default function FighterModal({ fighter, onClose }) {
  if (!fighter) return null;

  return (
    <div 
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
        background: 'rgba(0,0,0,0.7)', zIndex: 9999, 
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px', backdropFilter: 'blur(5px)'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: 'var(--bg-card)', 
          width: '100%', maxWidth: '800px', 
          maxHeight: '90vh', overflowY: 'auto', 
          borderRadius: 'var(--radius-lg)', 
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          position: 'relative',
          border: '1px solid var(--border)'
        }}
        onClick={e => e.stopPropagation()} // Prevent click from closing modal
      >
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px', 
            background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', 
            width: '36px', height: '36px', borderRadius: '50%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            cursor: 'pointer', zIndex: 10
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {fighter.image ? (
            <div style={{ height: '300px', width: '100%', overflow: 'hidden' }}>
              <img src={fighter.image} alt={fighter.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
            </div>
          ) : (
            <div style={{ height: '150px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '48px', fontWeight: 'bold' }}>
              {fighter.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>
              {fighter.name}
            </h2>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)', background: 'var(--bg-2)', padding: '6px 12px', borderRadius: '99px', fontSize: '14px' }}>
                <Calendar size={16} style={{ marginRight: '6px' }} />
                {fighter.birthYear || '?'} - {fighter.deathYear || '?'}
              </div>
              {fighter.state && (
                <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)', background: 'var(--bg-2)', padding: '6px 12px', borderRadius: '99px', fontSize: '14px' }}>
                  <MapPin size={16} style={{ marginRight: '6px' }} />
                  {fighter.state}
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gap: '24px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--accent)', display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <BookOpen size={20} style={{ marginRight: '8px' }} /> Biography & History
                </h3>
                <p style={{ color: 'var(--text-primary)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                  {fighter.description}
                </p>
              </div>

              {fighter.contributions && (
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--accent)', display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    <Award size={20} style={{ marginRight: '8px' }} /> Key Contributions
                  </h3>
                  <div style={{ background: 'var(--bg-2)', padding: '20px', borderRadius: '8px', borderLeft: '4px solid var(--accent)' }}>
                    <p style={{ color: 'var(--text-primary)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                      {fighter.contributions}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
