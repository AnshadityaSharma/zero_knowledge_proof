import React from 'react';
import { Map } from './Map';
import { Eye, KeyRound, CheckCircle } from 'lucide-react';

export function VerifierAgent({ step, mapData, cryptoData, onRequestChallenge, onVerify }) {
  return (
    <div className="agent-col">
      <div className="agent-header verifier-head">Verifier Agent</div>
      
      <div className="module full">
        <h4><Eye size={16} color="var(--teal)"/> Public Spec (Blind)</h4>
        <div style={{ fontSize:'0.82rem', color:'var(--text-muted)', marginBottom:'0.75rem' }}>
          Knows grid dimensions & goals. Trap locations hidden.
        </div>
        <Map mapData={mapData} isVerifierView={true} />
      </div>
      
      <div className="module full">
        <h4><KeyRound size={16} color="var(--teal)"/> Validation Checks</h4>
        
        <div style={{fontSize:'0.78rem', color:'var(--text-muted)', marginBottom:'0.4rem'}}>Random Query</div>
        <div className={`data-display ${cryptoData.challenge ? 'active-ver' : ''}`}>
           {cryptoData.challenge || "Awaiting query..."}
        </div>
        
        <div style={{fontSize:'0.78rem', color:'var(--text-muted)', marginBottom:'0.4rem'}}>Status</div>
        <div style={{ 
          padding: '0.75rem 1rem', 
          background: 'var(--surface-2)', 
          borderRadius: '8px', 
          fontSize: '0.78rem', 
          color: 'var(--text-muted)',
          fontFamily: "'JetBrains Mono', monospace",
          lineHeight: 1.8
        }}>
           ✓ HMAC Verifier Ready<br/>
           ✓ Replay protection active<br/>
           {step >= 4 ? (cryptoData.verified ? '✓ Proof validated' : '✗ Proof rejected') : '○ Proof pending'}
        </div>
      </div>

      <div className="module full">
        <h4><CheckCircle size={16} color="var(--teal)"/> Protocol Action</h4>
        
        <div style={{ marginBottom: '0.75rem' }}>
           <div style={{fontSize:'0.78rem', fontWeight:'600', marginBottom:'0.4rem', color:'var(--text)'}}>Phase 2: CHALLENGE</div>
           <button className={`btn btn-ver ${step === 1 ? 'active' : ''}`} onClick={onRequestChallenge} disabled={step !== 1}>
             <KeyRound size={16}/> Issue Query
           </button>
        </div>
        
        <div>
           <div style={{fontSize:'0.78rem', fontWeight:'600', marginBottom:'0.4rem', color:'var(--text)'}}>Phase 4: VERIFY</div>
           <button className={`btn btn-ver ${step === 3 ? 'active' : ''}`} onClick={onVerify} disabled={step !== 3}>
             <CheckCircle size={16}/> Audit Proof
           </button>
        </div>
      </div>
    </div>
  );
}
