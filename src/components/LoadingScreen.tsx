import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './LoadingScreen.css';
import logoImage from '../assets/logo.png';

interface LoadingScreenProps {
  isVisible: boolean;
}

/* ─── Animated Canvas Background ─────────────────────────────────── */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
}

const PARTICLE_COLORS = [
  'rgba(59, 130, 246,',   // blue
  'rgba(226, 192, 112,',  // gold
  'rgba(255, 255, 255,',  // white
];

function createParticles(w: number, h: number, count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    radius: Math.random() * 2.5 + 0.5,
    alpha: Math.random() * 0.6 + 0.2,
    color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
  }));
}

const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particlesRef.current = createParticles(canvas.width, canvas.height, 90);
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      // Draw connection lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = `rgba(59, 130, 246, ${(1 - dist / 120) * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // Draw and update particles
      particles.forEach((p) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `${p.color}0.6)`;
        ctx.fill();
        ctx.restore();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      frameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="loading-particle-canvas" />;
};

/* ─── Floating glowing orbs (Framer Motion) ──────────────────────── */
const floatingOrbs = [
  { size: 320, x: '10%',  y: '15%',  color: 'rgba(59,130,246,0.18)',  delay: 0,   dur: 8  },
  { size: 260, x: '75%',  y: '60%',  color: 'rgba(226,192,112,0.13)', delay: 1.5, dur: 11 },
  { size: 180, x: '50%',  y: '80%',  color: 'rgba(59,130,246,0.10)',  delay: 0.8, dur: 9  },
  { size: 140, x: '85%',  y: '10%',  color: 'rgba(226,192,112,0.10)', delay: 2,   dur: 13 },
];

/* ─── Main Component ──────────────────────────────────────────────── */
const LoadingScreen: React.FC<LoadingScreenProps> = ({ isVisible }) => {
  const [done, setDone] = useState(false);

  // Once isVisible turns false, we wait for exit animation to complete
  useEffect(() => {
    if (!isVisible) {
      const t = setTimeout(() => setDone(true), 900);
      return () => clearTimeout(t);
    }
  }, [isVisible]);

  if (done) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="loading-overlay"
          className="loading-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* ── Animated particle canvas background ── */}
          <ParticleCanvas />

          {/* ── Soft ambient orbs (non-interactive) ── */}
          {floatingOrbs.map((orb, i) => (
            <motion.div
              key={i}
              className="loading-ambient-orb"
              style={{ width: orb.size, height: orb.size, left: orb.x, top: orb.y, background: orb.color }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: orb.dur, delay: orb.delay, ease: 'easeInOut' }}
            />
          ))}

          {/* ── Central content ── */}
          <div className="loading-content">

            {/* Logo with glowing pulse instead of rings */}
            <motion.div
              className="loading-logo-wrapper"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 160, damping: 18, duration: 0.9 }}
            >
              {/* Pulsing glow behind logo */}
              <motion.div
                className="loading-logo-glow"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.9, 0.5] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              />

              {/* Rotating dashed ring (subtle, single) */}
              <motion.div
                className="loading-dashed-ring"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
              />

              {/* Logo image with gentle float */}
              <motion.img
                src={logoImage}
                alt="Campuslands Logo"
                className="loading-logo-img"
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
              />
            </motion.div>

            {/* Brand name — CAMPUSLANDS with nav-brand gradient */}
            <motion.div
              className="loading-text-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7, ease: 'easeOut' }}
            >
              <h2 className="loading-brand-title">CAMPUSLANDS</h2>

              {/* Animated progress bar */}
              <div className="loading-bar-track">
                <motion.div
                  className="loading-bar-fill"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.6, ease: [0.25, 1, 0.5, 1] }}
                />
              </div>

              <motion.p
                className="loading-tagline"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.7, 1] }}
                transition={{ delay: 0.7, duration: 1.2 }}
              >
                Iniciando plataforma...
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
