import React from 'react';
import { Route, Lock, Zap, ShieldCheck } from 'lucide-react';

export function ContextInfo() {
  return (
    <div className="context-section">
      <div className="context-row">
        <div className="context-body">
          <h2>
            <ShieldCheck size={24} color="var(--teal)" /> 
            What are we simulating?
          </h2>
          <p>
            Two agents communicate over a network. The <strong style={{color:'var(--pink)'}}>Observer</strong> has secretly found a safe path through a maze of hidden traps. The <strong style={{color:'var(--teal)'}}>Verifier</strong> must confirm the Observer truly solved the maze — but the Observer refuses to reveal the path or trap locations.
          </p>
          <p style={{color:'var(--text-muted)', fontSize:'0.9rem'}}>
            We solve this with a <strong style={{color:'var(--text-bright)'}}>Zero-Knowledge Proof</strong> — commit to a hidden answer, respond to a random challenge, and produce a cryptographic proof that validates mathematically without exposing the underlying data.
          </p>
          <div className="context-credit">
            Radhika Agrawal (23BCE5021) · Anshaditya Sharma (23BRS1204)
          </div>
        </div>
        <div className="context-highlight">
          <h3><Zap size={18} /> Objectives</h3>
          <ul className="objective-list">
            <li>
              <div className="obj-icon"><Lock size={15} color="var(--teal)"/></div>
              <div><strong>Privacy</strong> — Verify task completion without seeing the underlying data.</div>
            </li>
            <li>
              <div className="obj-icon"><Route size={15} color="var(--teal)"/></div>
              <div><strong>Integrity</strong> — Prevent cheating by binding paths to cryptographic hashes.</div>
            </li>
            <li>
              <div className="obj-icon"><ShieldCheck size={15} color="var(--teal)"/></div>
              <div><strong>Security</strong> — Protect connections with Challenge/Response nonce tokens.</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
