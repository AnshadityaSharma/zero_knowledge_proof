import React from 'react';
import { Play, Send, KeyRound, Unlock, CheckCircle } from 'lucide-react';

export function ProtocolSimulator({
  step,
  onGenerateTask,
  onSendCommitment,
  onRequestChallenge,
  onGenerateProof,
  onVerify
}) {
  return (
    <div className="glass-card">
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Play size={24} color="var(--accent-color)" /> Protocol Interface
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Execute the Zero-Knowledge Task Verification step-by-step.
      </p>

      <button className="btn btn-primary" onClick={onGenerateTask} disabled={step > 0}>
        <Play size={18} /> 1. Generate Task (Observer)
      </button>
      
      <button className="btn" onClick={onSendCommitment} disabled={step !== 1}>
        <Send size={18} /> 2. Send Commitment (Observer → Verifier)
      </button>

      <button className="btn" onClick={onRequestChallenge} disabled={step !== 2}>
        <KeyRound size={18} /> 3. Generate Challenge (Verifier)
      </button>

      <button className="btn" onClick={onGenerateProof} disabled={step !== 3}>
        <Unlock size={18} /> 4. Produce ZKP Proof (Observer)
      </button>

      <button className={`btn ${step === 4 ? 'btn-success' : ''}`} onClick={onVerify} disabled={step !== 4}>
        <CheckCircle size={18} /> 5. Verify Cryptographic Proof (Verifier)
      </button>
    </div>
  );
}
