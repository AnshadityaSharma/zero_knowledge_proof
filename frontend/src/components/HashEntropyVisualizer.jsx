import { useRef, useEffect, useState } from 'react';

/**
 * HashEntropyVisualizer — Renders hash data as a real-time animated particle field.
 * Each byte of the SHA-256 hash is mapped to a particle with unique orbital radius,
 * speed, color, and behavior. When verification succeeds, particles converge into
 * a glowing lock/shield shape.
 */
export function HashEntropyVisualizer({ hashValue, isVerified, step }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });

  const COLORS = {
    idle: ['#1e293b', '#334155', '#475569'],
    active: ['#f472b6', '#a855f7', '#38bdf8', '#818cf8', '#c084fc'],
    success: ['#34d399', '#6ee7b7', '#a7f3d0', '#10b981'],
    fail: ['#f87171', '#ef4444', '#fca5a5'],
  };

  // Build particles from hash bytes
  const buildParticles = (hash, w, h) => {
    if (!hash || hash.length < 8) {
      // Default idle particles
      const p = [];
      for (let i = 0; i < 64; i++) {
        p.push({
          x: w / 2, y: h / 2,
          angle: (Math.PI * 2 / 64) * i,
          radius: 20 + Math.random() * 40,
          speed: 0.003 + Math.random() * 0.005,
          size: 1.5 + Math.random() * 1.5,
          color: COLORS.idle[i % COLORS.idle.length],
          alpha: 0.15 + Math.random() * 0.2,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.03,
        });
      }
      return p;
    }

    const bytes = [];
    for (let i = 0; i < hash.length; i += 2) {
      bytes.push(parseInt(hash.substring(i, i + 2), 16));
    }

    const colors = step === 4
      ? (isVerified ? COLORS.success : COLORS.fail)
      : COLORS.active;

    return bytes.map((b, i) => ({
      x: w / 2,
      y: h / 2,
      angle: (Math.PI * 2 / bytes.length) * i + (b / 255) * Math.PI,
      radius: 15 + (b / 255) * 55,
      speed: 0.005 + (b / 512) * 0.015,
      size: 1.5 + (b / 255) * 3,
      color: colors[i % colors.length],
      alpha: 0.4 + (b / 255) * 0.6,
      pulse: (b / 255) * Math.PI * 2,
      pulseSpeed: 0.01 + (b / 255) * 0.04,
    }));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    canvas.width = w * (window.devicePixelRatio || 1);
    canvas.height = h * (window.devicePixelRatio || 1);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    setDimensions({ w, h });

    particlesRef.current = buildParticles(hashValue, w, h);

    const ctx = canvas.getContext('2d');
    ctx.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0);

    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      // Draw subtle orbital rings
      const ringCount = 4;
      for (let r = 0; r < ringCount; r++) {
        const ringRadius = 20 + r * 18;
        ctx.beginPath();
        ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(148, 163, 184, ${0.04 - r * 0.008})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Converge effect when verified
      const converge = step === 4 && isVerified;

      particlesRef.current.forEach((p, i) => {
        p.angle += p.speed;
        p.pulse += p.pulseSpeed;
        time += 0.00001;

        let targetRadius = p.radius;
        if (converge) {
          // Converge into a tight circle
          targetRadius = 8 + (i % 8) * 3;
        }
        const currentRadius = p.radius + (targetRadius - p.radius) * 0.02;
        p.radius = currentRadius;

        const px = cx + Math.cos(p.angle) * currentRadius;
        const py = cy + Math.sin(p.angle) * currentRadius;

        const pulseFactor = 0.5 + 0.5 * Math.sin(p.pulse);
        const size = p.size * (0.7 + pulseFactor * 0.6);
        const alpha = p.alpha * (0.6 + pulseFactor * 0.4);

        // Glow
        ctx.beginPath();
        ctx.arc(px, py, size * 3, 0, Math.PI * 2);
        const glow = ctx.createRadialGradient(px, py, 0, px, py, size * 3);
        glow.addColorStop(0, p.color + Math.round(alpha * 80).toString(16).padStart(2, '0'));
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Connection lines to nearby particles
        if (i < particlesRef.current.length - 1) {
          const next = particlesRef.current[i + 1];
          const nx = cx + Math.cos(next.angle) * next.radius;
          const ny = cy + Math.sin(next.angle) * next.radius;
          const dist = Math.hypot(px - nx, py - ny);
          if (dist < 50) {
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(nx, ny);
            ctx.strokeStyle = `rgba(148, 163, 184, ${0.08 * (1 - dist / 50)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      // Center glow
      if (hashValue) {
        const centerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30);
        const glowColor = converge ? '#34d399' : '#a855f7';
        centerGlow.addColorStop(0, glowColor + '30');
        centerGlow.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(cx, cy, 30, 0, Math.PI * 2);
        ctx.fillStyle = centerGlow;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [hashValue, isVerified, step]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '160px' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%', borderRadius: '12px' }} />
      <div style={{
        position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)',
        fontSize: '0.7rem', color: 'rgba(148, 163, 184, 0.6)', fontFamily: "'JetBrains Mono', monospace",
        textAlign: 'center', pointerEvents: 'none', letterSpacing: '1px',
      }}>
        {!hashValue ? 'ENTROPY FIELD ■ IDLE' : step === 4 ? (isVerified ? '■ CONVERGENCE VERIFIED' : '■ ENTROPY DISRUPTED') : '■ HASH ENTROPY ACTIVE'}
      </div>
    </div>
  );
}
