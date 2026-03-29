import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import LetterGlitch from './components/LetterGlitch';
import { ContextInfo } from './components/ContextInfo';
import { ObserverAgent } from './components/ObserverAgent';
import { VerifierAgent } from './components/VerifierAgent';
import { NetworkChannel } from './components/NetworkChannel';
import { LogsPanel } from './components/LogsPanel';
import { HashEntropyVisualizer } from './components/HashEntropyVisualizer';
import { TrapConfigurator } from './components/TrapConfigurator';
import { RotateCcw } from 'lucide-react';
import './index.css';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
  const [customTraps, setCustomTraps] = useState(null);
  const [heroBlur, setHeroBlur] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY;
      const heroH = heroRef.current.offsetHeight;
      const progress = Math.min(scrollY / (heroH * 0.6), 1);
      setHeroBlur(progress * 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addLog = (msg, highlight = false) => {
    setLogs(prev => [...prev, { 
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric", second: "numeric" }), 
      msg, highlight 
    }]);
  };

  const handleConfigureTraps = (traps) => {
    setCustomTraps(traps);
    addLog(`Traps configured: ${traps.length} positions → [${traps.map(t => `(${t.x},${t.y})`).join(', ')}]`, true);
  };

  const handleGenerateTask = async () => {
    try {
      const payload = customTraps ? { customTraps } : {};
      const { data } = await axios.post(`${API_URL}/generate-task`, payload);
      setMapData(data.environment);
      setCryptoData(prev => ({ ...prev, commitment: data.commitment, nonce: data.nonce, verified: null, details: '' }));
      addLog("Observer solved constraints. Generated SHA256 Commitment.");
      addLog(`Path: ${data.pathLength} steps. Commitment: ${data.commitment.substring(0, 20)}...`, true);
      setStep(1);
    } catch (err) {
      const errMsg = err.response?.data?.error || "Backend unreachable. Is server running on port 5000?";
      addLog(errMsg);
    }
  };

  const handleRequestChallenge = async () => {
    try {
      const { data } = await axios.post(`${API_URL}/challenge`);
      setCryptoData(prev => ({ ...prev, challenge: data.challenge }));
      addLog("Verifier issued 64-bit challenge via Fiat-Shamir heuristic.");
      addLog(`Challenge: ${data.challenge}`, true);
      setStep(2);
    } catch (err) {
      addLog("Failed to generate challenge.");
    }
  };

  const handleGenerateProof = async () => {
    try {
      const { data } = await axios.post(`${API_URL}/proof`);
      setCryptoData(prev => ({ ...prev, proof: data.proof }));
      addLog("Observer computed HMAC-SHA256 proof without data disclosure.");
      addLog(`Proof: ${data.proof.substring(0, 24)}...`, true);
      setStep(3);
    } catch (err) {
      addLog("Failed to produce proof.");
    }
  };

  const handleVerify = async () => {
    try {
      const { data } = await axios.post(`${API_URL}/verify`, { proof: cryptoData.proof });
      setCryptoData(prev => ({ ...prev, verified: data.verified, details: data.details }));
      addLog(`Verdict: ${data.verified ? 'ACCEPT' : 'REJECT'}`, true);
      setStep(4);
    } catch (err) {
      addLog("Verification failed.");
    }
  };
  
  const handleRestart = () => {
    setStep(0);
    setMapData(null);
    setCryptoData({ commitment: '', nonce: '', challenge: '', proof: '', verified: null, details: '' });
    setLogs([]);
    addLog("Protocol reset.");
  };

  const activeHash = cryptoData.proof || cryptoData.commitment || '';

  return (
    <>
      {/* HERO */}
      <div className="hero-section" ref={heroRef}>
        <div className="hero-glitch-bg" style={{ filter: `blur(${heroBlur}px)`, transition: 'filter 0.1s linear' }}>
          <LetterGlitch 
            glitchColors={['#0a0a0f', '#e879a8', '#5eead4', '#a78bfa', '#111118']}
            glitchSpeed={50}
            centerVignette={false}
            outerVignette={true}
            smooth={true}
            characters="SHA256HMACZKPROOFNONCE01AF"
          />
        </div>
        <div className="hero-fade-bottom" />
        <div className="hero-content" style={{ filter: `blur(${heroBlur * 0.4}px)`, opacity: Math.max(0, 1 - heroBlur / 6) }}>
          <h1>
            <span className="hero-gradient">Zero-Knowledge</span><br/>
            Task Verification
          </h1>
          <p className="hero-subtitle">Interactive Cryptographic Protocol Simulator</p>
          <div className="hero-contributors">
            Built by <strong>Radhika Agrawal (23BCE5021)</strong> &amp; <strong>Anshaditya Sharma (23BRS1204)</strong>
          </div>
        </div>
        <div className="hero-scroll-hint">
          <span>Scroll</span>
          <div className="scroll-arrow" />
        </div>
      </div>

      {/* DASHBOARD */}
      <div className="app-wrapper">
        
        <ContextInfo />

        {/* Entropy Visualizer */}
        <div className="entropy-section">
          <div className="section-inner">
            <div className="entropy-label">
              <span className="entropy-dot" />
              Live Hash Entropy Field
            </div>
            <HashEntropyVisualizer hashValue={activeHash} isVerified={cryptoData.verified} step={step} />
          </div>
        </div>

        {/* Trap Configurator */}
        <TrapConfigurator onConfigureTraps={handleConfigureTraps} disabled={step !== 0} />

        {/* Agents */}
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
          <button onClick={handleRestart} className="reset-btn">
            <RotateCcw size={15}/> Reset Protocol
          </button>
        </div>

        <div className="footer-section">
          <p className="footer-names">Radhika Agrawal (23BCE5021) · Anshaditya Sharma (23BRS1204)</p>
          <p style={{fontSize: '0.75rem', marginTop: '0.5rem'}}>Cryptography & Network Security</p>
        </div>
      </div>
    </>
  );
}

export default App;
