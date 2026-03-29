import React from 'react';
import { Map } from './Map';
import { Database, Lock, Send, Key } from 'lucide-react';

export function ObserverAgent({ step, mapData, cryptoData, onGenerateTask, onGenerateProof }) {
  return (
    <div className="agent-col">
      <div className="agent-header observer-head">Observer Agent</div>
      
      <div className="module full">
        <h4><Database size={16} color="var(--pink)"/> Data Storage (Secret)</h4>
        <div style={{ fontSize:'0.82rem', color:'var(--text-muted)', marginBottom:'0.75rem' }}>
          Holds hidden map traps and confidential path data.
        </div>
        <Map mapData={mapData} isVerifierView={false} />
      </div>
      
      <div className="module full">
        <h4><Lock size={16} color="var(--pink)"/> Crypto Computations</h4>
        
        <div style={{fontSize:'0.78rem', color:'var(--text-muted)', marginBottom:'0.4rem'}}>Commitment (SHA256)</div>
        <div className={`data-display ${cryptoData.commitment ? 'active-obs' : ''}`}>
           {cryptoData.commitment ? cryptoData.commitment.substring(0,25) + "..." : "Awaiting computation..."}
        </div>
        
        <div style={{fontSize:'0.78rem', color:'var(--text-muted)', marginBottom:'0.4rem'}}>Nonce (CSPRNG)</div>
        <div className={`data-display ${cryptoData.nonce ? 'active-obs' : ''}`}>
           {cryptoData.nonce || "Waiting..."}
        </div>
      </div>

      <div className="module full">
        <h4><Send size={16} color="var(--pink)"/> Protocol Action</h4>
        
        <div style={{ marginBottom: '0.75rem' }}>
           <div style={{fontSize:'0.78rem', fontWeight:'600', marginBottom:'0.4rem', color:'var(--text)'}}>Phase 1: COMMIT</div>
           <button className={`btn btn-obs ${step === 0 ? 'active' : ''}`} onClick={onGenerateTask} disabled={step !== 0}>
             <Send size={16}/> Generate & Commit
           </button>
        </div>
        
        <div>
           <div style={{fontSize:'0.78rem', fontWeight:'600', marginBottom:'0.4rem', color:'var(--text)'}}>Phase 3: RESPOND</div>
           <button className={`btn btn-obs ${step === 2 ? 'active' : ''}`} onClick={onGenerateProof} disabled={step !== 2}>
             <Key size={16}/> Compute MAC ZKP
           </button>
        </div>
      </div>
    </div>
  );
}
