import React from 'react';
import { Map } from './Map';
import { Eye, ShieldX, KeyRound, CheckCircle } from 'lucide-react';

export function VerifierAgent({ step, mapData, cryptoData, onRequestChallenge, onVerify }) {
  return (
    <div className="agent-col glass-panel">
      <div className="agent-header verifier-head">VERIFIER AGENT</div>
      
      <div className="module full">
        <h4><Eye size={18} color="var(--ver-accent)"/> Public Spec (Blind)</h4>
        <div style={{ display:'flex', gap:'1rem', marginBottom:'1rem', fontSize:'0.85rem' }}>
          <div style={{ flex: 1, color:'var(--text-dim)' }}>Knows grid dimensions & task goals. Trap locations strictly hidden.</div>
        </div>
        <Map mapData={mapData} isVerifierView={true} />
      </div>
      
      <div className="module full">
        <h4><KeyRound size={18} color="var(--ver-accent)"/> Validation Checks</h4>
        
        <div style={{fontSize:'0.85rem', color:'var(--text-dim)', marginBottom:'0.5rem'}}>Random Query Generator</div>
        <div className={`data-display ${cryptoData.challenge ? 'active-ver' : ''}`}>
           {cryptoData.challenge || "Awaiting issue query..."}
        </div>
        
        <div style={{fontSize:'0.85rem', color:'var(--text-dim)', marginBottom:'0.5rem'}}>Verification Logs</div>
        <div style={{ padding: '1rem', background: 'rgba(56,189,248,0.05)', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--ver-accent)' }}>
           ✓ HMAC Verifier Initialized<br/>
           ✓ Replay protection active<br/>
           ✗ Proof validation pending
        </div>
      </div>

      <div className="module full">
        <h4><CheckCircle size={18} color="var(--ver-accent)"/> Protocol Action</h4>
        
        <div style={{ marginBottom: '1rem' }}>
           <div style={{fontSize:'0.85rem', fontWeight:'600', marginBottom:'0.5rem', color:'var(--text-main)'}}>Phase 2: CHALLENGE</div>
           <button className={`btn btn-ver ${step === 1 ? 'active' : ''}`} onClick={onRequestChallenge} disabled={step !== 1}>
             <KeyRound size={18}/> 2. ISSUE QUERY
           </button>
        </div>
        
        <div>
           <div style={{fontSize:'0.85rem', fontWeight:'600', marginBottom:'0.5rem', color:'var(--text-main)'}}>Phase 4: VERIFY</div>
           <button className={`btn btn-ver ${step === 3 ? 'active' : ''}`} onClick={onVerify} disabled={step !== 3}>
             <CheckCircle size={18}/> 4. AUDIT PROOF
           </button>
        </div>
      </div>
      
    </div>
  );
}
