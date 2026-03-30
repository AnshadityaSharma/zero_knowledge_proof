import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export function NetworkChannel({ step, cryptoData }) {
  const packets = [];

  if (step >= 1 && cryptoData.commitment) { 
    packets.push({ id: 1, direction: 'right', label: 'COMMIT Message', value: `{ C: ${cryptoData.commitment.substring(0,8)}... }` });
  }
  if (step >= 2 && cryptoData.challenge) {
    packets.push({ id: 2, direction: 'left', label: 'CHALLENGE Query', value: `{ Ch: ${cryptoData.challenge} }` });
  }
  if (step >= 3 && cryptoData.proof) {
    packets.push({ id: 3, direction: 'right', label: 'RESPONSE Proof', value: `HMAC(${cryptoData.proof.substring(0,10)}...)` });
  }

  return (
    <div className="network-lane" style={{ justifyContent: packets.length > 0 ? 'flex-start' : 'center', paddingTop: '4rem', gap: '0.75rem' }}>
      <div className="network-title" style={{ top: '1.25rem' }}>Secure Channel</div>
      
      {packets.length > 0 ? (
        packets.map((pkt) => (
          <div key={pkt.id} className="network-packet" style={{ animation: 'none', zIndex: 2 }}>
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', gap:'0.5rem', color:'var(--purple)', fontWeight:'700', fontSize:'0.85rem'}}>
              {pkt.direction === 'left' && <ArrowLeft size={16}/>}
              <span>{pkt.label}</span>
              {pkt.direction === 'right' && <ArrowRight size={16}/>}
            </div>
            <div className="mono" style={{marginTop:'0.75rem', color:'var(--text)', fontSize:'0.85rem'}}>
              {pkt.value}
            </div>
          </div>
        ))
      ) : (
        <div style={{zIndex:2, opacity: 0.5, fontStyle:'italic', color:'var(--text-muted)', background: 'var(--surface-2)', padding:'0.5rem 1rem', borderRadius:'20px'}}>
          Idle
        </div>
      )}

      {step === 4 && (
        <div className={`verdict-box ${cryptoData.verified ? 'accept' : 'reject'}`} style={{zIndex:2, width:'90%', position:'absolute', bottom:'1rem', marginTop: 0}}>
           <div style={{fontWeight: 700, fontSize:'1.1rem', letterSpacing:'1px', marginBottom:'0.25rem'}}>
               {cryptoData.verified ? 'VERDICT: ACCEPT' : 'VERDICT: REJECT'}
           </div>
           <p style={{fontSize:'0.75rem', color:'currentColor', margin:0, opacity:0.9}}>
               {cryptoData.details}
           </p>
        </div>
      )}
    </div>
  );
}
