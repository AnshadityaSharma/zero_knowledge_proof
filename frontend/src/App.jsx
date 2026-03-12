import React, { useState } from 'react';
import axios from 'axios';
import { ContextInfo } from './components/ContextInfo';
import { ObserverAgent } from './components/ObserverAgent';
import { VerifierAgent } from './components/VerifierAgent';
import { NetworkChannel } from './components/NetworkChannel';
import { LogsPanel } from './components/LogsPanel';
import { RotateCcw } from 'lucide-react';
import './index.css';

const API_URL = "http://localhost:5000/api";

function App() {
  const [cryptoData, setCryptoData] = useState({
    commitment: '',
    nonce: '',
    challenge: '',
    proof: '',
    verified: null,
    details: ''
  });
  const [mapData, setMapData] = useState(null);
  const [step, setStep] = useState(0);
  const [logs, setLogs] = useState([]);

  const addLog = (msg, highlight = false) => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric", second: "numeric" }), msg, highlight }]);
  };

  const handleGenerateTask = async () => {
    try {
      const { data } = await axios.post(`${API_URL}/generate-task`);
      setMapData(data.environment);
      setCryptoData(prev => ({ ...prev, commitment: data.commitment, nonce: data.nonce, verified: null, details: '' }));
      addLog("Observer solved constraints secretly. Generated Nonce and SHA256 Hash Commitment.");
      addLog(`Sending Commitment to Verifier: ${data.commitment}`, true);
      setStep(1);
    } catch (err) {
      console.error("Backend Error:", err);
      addLog("Failed to reach simulation engine. Is Backend running on Port 5000?");
    }
  };

  const handleRequestChallenge = async () => {
    try {
      const { data } = await axios.post(`${API_URL}/challenge`);
      setCryptoData(prev => ({ ...prev, challenge: data.challenge }));
      addLog("Verifier received Commitment. Enforcing non-interactive ZKP via Fiat-Shamir.");
      addLog(`Verifier computing random 64-bit Challenge query: ${data.challenge}`, true);
      addLog("Challenge sent to Observer.");
      setStep(2);
    } catch (err) {
      console.error(err);
      addLog("Failed to generate Challenge vector.");
    }
  };

  const handleGenerateProof = async () => {
    try {
      const { data } = await axios.post(`${API_URL}/proof`);
      setCryptoData(prev => ({ ...prev, proof: data.proof }));
      addLog("Observer received Challenge. Re-routing through HMAC-SHA256 with hidden mapping data.");
      addLog(`Observer generated HMAC Proof ZKP Response without data disclosure.`, true);
      addLog("Proof submitted to network channel.");
      setStep(3);
    } catch (err) {
      console.error(err);
      addLog("Failed to produce cryptographic proof.");
    }
  };

  const handleVerify = async () => {
    try {
      const { data } = await axios.post(`${API_URL}/verify`, { proof: cryptoData.proof });
      setCryptoData(prev => ({ ...prev, verified: data.verified, details: data.details }));
      addLog("Verifier received Proof from channel. Auditing signature...", true);
      addLog(`Verdict: ${data.verified ? 'ACCEPT' : 'REJECT'} | Constraints successfully computed via HMAC.`);
      setStep(4);
    } catch (err) {
      console.error(err);
      addLog("Failed to run verification logic.");
    }
  };
  
  const handleRestart = () => {
    setStep(0);
    setMapData(null);
    setCryptoData({ commitment: '', nonce: '', challenge: '', proof: '', verified: null, details: '' });
    setLogs([]);
    addLog("Demo reset. Ready for new protocol sequence.");
  };

  return (
    <div className="app-wrapper">
      <header>
        <h1>Zero-Knowledge Task Verification</h1>
        <p>Interactive Cryptographic Protocol Simulator</p>
      </header>
      
      <ContextInfo />

      <div className="agents-grid">
        <ObserverAgent 
           step={step} 
           mapData={mapData} 
           cryptoData={cryptoData} 
           onGenerateTask={handleGenerateTask} 
           onGenerateProof={handleGenerateProof} 
        />
        
        <NetworkChannel step={step} cryptoData={cryptoData} />

        <VerifierAgent 
           step={step} 
           mapData={mapData} 
           cryptoData={cryptoData} 
           onRequestChallenge={handleRequestChallenge} 
           onVerify={handleVerify} 
        />
      </div>

      <LogsPanel logs={logs} />
      
      <div style={{textAlign: 'center', marginTop: '3rem'}}>
         <button onClick={handleRestart} style={{background:'rgba(255,255,255,0.05)', color: 'var(--text-dim)', border:'1px solid var(--card-border)', padding:'0.75rem 2rem', borderRadius:'30px', cursor:'pointer', fontWeight:500, transition:'all 0.2s ease', display: 'inline-flex', alignItems: 'center', gap: '0.5rem'}} onMouseOver={(e)=>e.currentTarget.style.color='var(--text-main)'} onMouseOut={(e)=>e.currentTarget.style.color='var(--text-dim)'}>
            <RotateCcw size={16}/> Reset Simulation Protocol
         </button>
      </div>
    </div>
  );
}

export default App;
