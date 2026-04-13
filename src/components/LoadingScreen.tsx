import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './LoadingScreen.css';
import logoImage from '../assets/logo.png';

interface LoadingScreenProps {
  isVisible: boolean;
}

const steps = [
  "Iniciando plataforma...",
  "Cargando formaciones académicas...",
  "Preparando tu entorno...",
  "Bienvenido."
];

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isVisible }) => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    
    // Cycle through loading steps to make the screen feel alive
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1500); // Slower text cycle (every 1.5s)

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <div className={`loading-overlay ${isVisible ? 'active' : 'hidden'}`}>
      <div className="loading-content">
        
        {/* Modern Framer Motion Logo */}
        <div className="logo-wrapper">
          {/* Orbital Rings - Statics on X/Y axis but rotating on Z */}
          <motion.div 
            className="orbital-ring ring-1"
            initial={{ rotateX: 70, rotateY: 30, rotateZ: 0 }}
            animate={{ rotateX: 70, rotateY: 30, rotateZ: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          />
          <motion.div 
            className="orbital-ring ring-2"
            initial={{ rotateX: 65, rotateY: -45, rotateZ: 0 }}
            animate={{ rotateX: 65, rotateY: -45, rotateZ: -360 }}
            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
          />
          
          {/* Main Floating Logo Image */}
          <motion.img 
            src={logoImage} 
            alt="Campuslands Logo" 
            className="main-logo-img"
            initial={{ scale: 0, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: [0, -10, 0] }}
            transition={{ 
              y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
              scale: { type: "spring", stiffness: 180, damping: 15, duration: 1.5 },
              opacity: { duration: 1 }
            }}
          />
        </div>
        
        {/* Modern Typography */}
        <div className="text-container">
          <h2 className="brand-title">Lumina <span className="gold-text">Academy</span></h2>
          <p className="status-text">{steps[stepIndex]}</p>
        </div>
        


      </div>
      
      {/* Background ambient glows */}
      <div className="ambient-glow glow-top"></div>
      <div className="ambient-glow glow-bottom"></div>
    </div>
  );
};

export default LoadingScreen;
