import React from 'react';
import { Map } from './Map';
import { Database, Lock, Send, Key } from 'lucide-react';

export function ObserverAgent({ step, mapData, cryptoData, onGenerateTask, onGenerateProof }) {
  return (
    <div className="agent-col glass-panel">
      <div className="agent-header observer-head">OBSERVER AGENT</div>
      
      <div className="module full">
        <h4><Database size={18} color="var(--obs-accent)"/> Data Storage (Secret)</h4>
        <div style={{ display:'flex', gap:'1rem', marginBottom:'1rem', fontSize:'0.85rem' }}>
          <div style={{ flex: 1, color:'var(--text-dim)' }}>Holds hidden map traps and highly confidential path data.</div>
        </div>
        <Map mapData={mapData} isVerifierView={false} />
      </div>
      
      <div className="module full">
        <h4><Lock size={18} color="var(--obs-accent)"/> Crypto Computations</h4>
        
        <div style={{fontSize:'0.85rem', color:'var(--text-dim)', marginBottom:'0.5rem'}}>Commitment Function (SHA256)</div>
        <div className={`data-display ${cryptoData.commitment ? 'active-obs' : ''}`}>
           {cryptoData.commitment ? cryptoData.commitment.substring(0,25) + "..." : "Awaiting computation..."}
        </div>
        
        <div style={{fontSize:'0.85rem', color:'var(--text-dim)', marginBottom:'0.5rem'}}>Hidden Nonce (CSPRNG)</div>
        <div className={`data-display ${cryptoData.nonce ? 'active-obs' : ''}`}>
           {cryptoData.nonce || "Waiting for task..."}
        </div>
      </div>

      <div className="module full">
        <h4><Send size={18} color="var(--obs-accent)"/> Protocol Action</h4>
        
        <div style={{ marginBottom: '1rem' }}>
           <div style={{fontSize:'0.85rem', fontWeight:'600', marginBottom:'0.5rem', color:'var(--text-main)'}}>Phase 1: COMMIT</div>
           <button className={`btn btn-obs ${step === 0 ? 'active' : ''}`} onClick={onGenerateTask} disabled={step !== 0}>
             <Send size={18}/> 1. GENERATE & COMMIT
           </button>
        </div>
        
        <div>
           <div style={{fontSize:'0.85rem', fontWeight:'600', marginBottom:'0.5rem', color:'var(--text-main)'}}>Phase 3: RESPOND</div>
           <button className={`btn btn-obs ${step === 2 ? 'active' : ''}`} onClick={onGenerateProof} disabled={step !== 2}>
             <Key size={18}/> 3. COMPUTE MAC ZKP
           </button>
        </div>
      </div>
      
    </div>
  );
}
