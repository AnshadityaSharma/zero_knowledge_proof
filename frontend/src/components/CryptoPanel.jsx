import React from 'react';
import { Database } from 'lucide-react';

export function CryptoPanel({ data }) {
  const { commitment, nonce, challenge, proof, verified, details } = data;

  return (
    <div className="glass-card">
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6ee7b7' }}>
        <Database size={24} /> Cryptographic Data Showroom
      </h2>

      {commitment && (
        <>
          <span className="crypto-label">SHA-256 Commitment (Sent to Verifier)</span>
          <div className="crypto-data">{commitment}</div>
          
          <span className="crypto-label">Cryptographic Nonce (Kept Secret by Observer)</span>
          <div className="crypto-data" style={{ color: '#fca5a5', borderLeftColor: '#ef4444' }}>
            {nonce}
          </div>
        </>
      )}

      {challenge && (
        <>
          <span className="crypto-label">Challenge Data (From Verifier)</span>
          <div className="crypto-data" style={{ color: '#93c5fd', borderLeftColor: '#3b82f6' }}>
            {challenge}
          </div>
        </>
      )}

      {proof && (
        <>
          <span className="crypto-label">Zero-Knowledge Proof (HMAC Response)</span>
          <div className="crypto-data" style={{ color: '#fde047', borderLeftColor: '#eab308' }}>
            {proof}
          </div>
        </>
      )}

      {verified !== null && (
        <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '8px', background: verified ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', border: `1px solid ${verified ? '#10b981' : '#ef4444'}` }}>
          <h3 style={{ color: verified ? '#34d399' : '#f87171', marginBottom: '0.25rem' }}>
            {verified ? 'Proof Verified' : 'Verification Failed'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {details}
          </p>
        </div>
      )}

      {!commitment && (
        <div style={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic', marginTop: '1rem' }}>
          No data simulated yet...
        </div>
      )}
    </div>
  );
}
