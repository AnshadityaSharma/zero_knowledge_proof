import React from 'react';
import { ArrowRight, ArrowLeft, Network } from 'lucide-react';

export function NetworkChannel({ step, cryptoData }) {
  let activePacket = false;
  let direction = 'right';
  let packetLabel = '';
  let packetValue = '';

  if (step === 1) { 
    activePacket = true; direction = 'right'; packetLabel = 'COMMIT Message'; packetValue = `{ C: ${cryptoData.commitment.substring(0,8)}... }`;
  } else if (step === 2) {
    activePacket = true; direction = 'left'; packetLabel = 'CHALLENGE Query'; packetValue = `{ Ch: ${cryptoData.challenge} }`;
  } else if (step === 3) {
    activePacket = true; direction = 'right'; packetLabel = 'RESPONSE Proof'; packetValue = `HMAC(${cryptoData.proof.substring(0,10)}...)`;
  }

  return (
    <div className="network-lane">
      <div className="network-title">Secure Channel</div>
      
      {activePacket ? (
        <div className="network-packet">
          <div style={{display:'flex', justifyContent:'center', alignItems:'center', gap:'0.5rem', color:'var(--net-accent)', fontWeight:'700', fontSize:'0.85rem'}}>
            {direction === 'left' && <ArrowLeft size={16}/>}
            <span>{packetLabel}</span>
            {direction === 'right' && <ArrowRight size={16}/>}
          </div>
          <div className="mono" style={{marginTop:'0.75rem', color:'var(--text-main)', fontSize:'0.85rem'}}>
            {packetValue}
          </div>
        </div>
      ) : (
        <div style={{zIndex:2, opacity: 0.5, fontStyle:'italic', color:'var(--text-dim)', background: 'rgba(0,0,0,0.5)', padding:'0.5rem 1rem', borderRadius:'20px'}}>
          Idle
        </div>
      )}

      {step === 4 && (
        <div className={`verdict-box ${cryptoData.verified ? 'accept' : 'reject'}`} style={{zIndex:2, width:'90%', position:'absolute', bottom:'2rem'}}>
           <div style={{fontWeight: 700, fontSize:'1.25rem', letterSpacing:'1px', marginBottom:'0.25rem'}}>
               {cryptoData.verified ? 'VERDICT: ACCEPT' : 'VERDICT: REJECT'}
           </div>
           <p style={{fontSize:'0.8rem', color:'currentColor', margin:0, opacity:0.9}}>
               {cryptoData.details}
           </p>
        </div>
      )}
    </div>
  );
}
