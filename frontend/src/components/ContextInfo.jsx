import React from 'react';
import { Route, Lock, Zap, ShieldCheck } from 'lucide-react';

export function ContextInfo() {
  return (
    <div className="glass-panel context-row">
      <div className="context-body">
        <h2 style={{ fontSize: '2rem', marginTop: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#f8fafc' }}>
          <ShieldCheck size={36} color="var(--ver-accent)" /> 
          What are we simulating?
        </h2>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-dim)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          Imagine two computers talking. Computer A (<strong>Observer</strong>) has secretly found a safe path through a dangerous maze full of hidden traps. Computer B (<strong>Verifier</strong>) needs to make sure Computer A actually found a safe path, but <em>Computer A refuses to show the maze or the path!</em>
        </p>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
          How do we prove something is true without revealing the secret itself? We use a <strong>Zero-Knowledge Proof (ZKP)</strong>. In this demo, we use Cryptographic Hashes replacing complex math. We "Commit" to the hidden path, accept a random "Challenge", and respond with a cryptographic "Proof" that checks out mathematically.
        </p>
      </div>
      <div className="context-highlight">
        <h3><Zap size={24} /> Objectives</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: '1.5rem 0 0 0', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-dim)' }}>
           <li style={{display:'flex', gap:'0.75rem'}}><Lock size={20} color="var(--net-accent)"/> <strong>Privacy:</strong> Verify task completion without seeing the map data.</li>
           <li style={{display:'flex', gap:'0.75rem'}}><Route size={20} color="var(--net-accent)"/> <strong>Integrity:</strong> Disallow cheating by mathematically binding paths to hashes.</li>
           <li style={{display:'flex', gap:'0.75rem'}}><ShieldCheck size={20} color="var(--net-accent)"/> <strong>Security:</strong> Protect the connection using Challenge/Response tokens.</li>
        </ul>
      </div>
    </div>
  );
}
