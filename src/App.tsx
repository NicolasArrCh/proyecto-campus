import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import LoadingScreen from './components/LoadingScreen';
import FormationsList from './components/FormationsList';
import InteractiveBackground from './components/InteractiveBackground';
import { OrbitLienzo } from './components/OrbitLienzo';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('inicio');
  const [history, setHistory] = useState(['inicio']);
  const [isMascotLoaded, setIsMascotLoaded] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate loading of initial assets or data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 7000); // 7 seconds of simulated load for the demo

    return () => clearTimeout(timer);
  }, []);

  const navigateTo = (page: string) => {
    setHistory(prev => [...prev, page]);
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);
      setCurrentPage(newHistory[newHistory.length - 1]);
      window.scrollTo(0, 0);
    }
  };

  // Variant for scroll animations
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const renderBackButton = () => (
    <div className="back-btn-container relative z-10">
      <button onClick={goBack} className="btn-back">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Regresar
      </button>
    </div>
  );

  return (
    <>
      <LoadingScreen isVisible={isLoading} />
      
      {/* Main Content Area - hidden until loading is finished */}
      <main className={`app-content ${!isLoading ? 'visible' : ''}`}>
        
        {/* Spectacular Interactive Background Network */}
        <InteractiveBackground />

        {/* Header Section (fixed top) */}
        <header className="main-navbar">
          <div className="nav-brand">CAMPUSLANDS</div>
        </header>

        {currentPage === 'inicio' && (
        <>
          {/* Hero Section */}
          <motion.section 
            className="hero-section overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUpVariant}
          >
            {/* Animated Background Orbs for this section */}
            <div className="section-bg-orb orb-primary" />
            <div className="section-bg-orb orb-secondary" />

            <div className="hero-content relative z-10">
              <h1 className="hero-title">Bienvenidos</h1>
              <p className="hero-description">
                Bienvenido a nuestro campus, el ecosistema de formación tecnológica líder diseñado para potenciar tus habilidades y conectarte con el futuro en la industria del desarrollo de software. Descubre una metodología inmersiva y 100% práctica simulando entornos empresariales reales.
              </p>
              <div className="hero-buttons">
                <button className="btn-primary" onClick={() => navigateTo('programas')}>Ver Programas</button>
                <button className="btn-secondary" onClick={() => navigateTo('campus')}>Nuestro Campus</button>
              </div>
            </div>
            <div className="hero-mascot-placeholder relative z-10" style={{ position: 'relative', width: '100%', maxWidth: '500px', aspectRatio: '1/1' }}>
              {!isMascotLoaded && (
                <div className="mascot-box" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                  <span>Cargando Mascota...</span>
                </div>
              )}
              
              <OrbitLienzo 
                alCargar={() => setIsMascotLoaded(true)} 
                referenciaBurbuja={bubbleRef} 
              />
              
              <div 
                ref={bubbleRef} 
                className="mascot-bubble" 
                style={{ opacity: isMascotLoaded ? 1 : 0, pointerEvents: 'none' }}
              >
                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.4rem', 
                  background: 'rgba(37, 211, 102, 0.9)', color: 'white', 
                  padding: '0.5rem 1rem', borderRadius: '20px', 
                  fontWeight: 'bold', boxShadow: '0 4px 15px rgba(37, 211, 102, 0.4)',
                  animation: 'bounceBubble 2s infinite ease-in-out',
                  backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.2)',
                  fontSize: '0.85rem'
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                  Toca la mascota para hablar
                </div>
              </div>
            </div>
          </motion.section>


        </>
        )}

        {currentPage === 'programas' && (
        <>
          {renderBackButton()}
          <motion.section 
            className="formacion-section overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUpVariant}
          >
            {/* Animated Background Orbs for this section */}
            <div className="section-bg-orb orb-secondary" style={{ top: '10%', left: '-10%' }} />
            <div className="section-bg-orb orb-primary" style={{ bottom: '-10%', right: '10%' }} />

            <div className="relative z-10">
              <h2 className="section-title">Programas y Formación</h2>
              <p className="section-description">
                Explora las rutas de especialización diseñadas para convertirte en un talento de alto rendimiento técnico. 
                Nuestros horarios están pensados para adaptarse a tus necesidades y potenciar tu aprendizaje sin interrupciones, 
                brindándote inmersión total en las tecnologías de punta de la industria.
              </p>

              <div className="jornada-options-grid" style={{ marginBottom: '4rem' }}>
                <div className="jornada-card">
                  <div className="jornada-icon">☀️</div>
                  <h3>Jornada Diurna</h3>
                  <p><strong>Horario:</strong> 6:00 AM - 2:00 PM</p>
                  <p>Ideal para madrugadores que buscan concentración total, acceso ilimitado a laboratorios y tutorías matutinas focalizadas.</p>
                </div>
                <div className="jornada-card">
                  <div className="jornada-icon">🌙</div>
                  <h3>Jornada Nocturna</h3>
                  <p><strong>Horario:</strong> 2:00 PM - 10:00 PM</p>
                  <p>Perfecto si buscas optimizar tu tiempo, con ambientes inmersivos nocturnos enfocados en proyectos intensivos y colaboración grupal.</p>
                </div>
              </div>

              <div className="formations-list-container">
                 <FormationsList />
              </div>
            </div>
          </motion.section>
        </>
        )}

        {currentPage === 'campus' && (
        <>
          {renderBackButton()}
          {/* Campus Section */}
          <motion.section 
            className="campus-section overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUpVariant}
          >
            {/* Animated Background Orbs for this section */}
            <div className="section-bg-orb orb-secondary" style={{ top: '10%', left: '-10%' }} />
            <div className="section-bg-orb orb-primary" style={{ bottom: '-20%', right: '0%' }} />

            <div className="relative z-10">
              <h2 className="section-title">Nuestro Campus</h2>
              <div className="campus-info">
                <p className="campus-description">
                  Un entorno corporativo de primer nivel diseñado exclusivamente para el máximo rendimiento. Todo el espacio simula una empresa IT real, preparándote desde el día uno para la industria.
                </p>
                <ul className="campus-features">
                  <motion.li variants={fadeUpVariant}><strong>💻 Aulas de Informática:</strong> Equipos de última generación y conectividad robusta para cada estudiante interconectado.</motion.li>
                  <motion.li variants={fadeUpVariant}><strong>🤝 Salas de Trabajo:</strong> Áreas de co-working estratégicas para la planificación y desarrollo de proyectos ágiles.</motion.li>
                  <motion.li variants={fadeUpVariant}><strong>🗣️ Áreas de Inglés:</strong> Espacios de inmersión total para formar profesionales competitivos y bilingües.</motion.li>
                  <motion.li variants={fadeUpVariant}><strong>🧠 Áreas Soft Skills:</strong> Ambientes propicios para realizar dinámicas de liderazgo, comunicación asertiva y resolución de problemas.</motion.li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* CTA Footer Section move to inside campus */}
          <motion.footer 
            className="cta-footer overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUpVariant}
          >
            <div className="cta-content relative z-10" style={{ padding: '3rem 2rem' }}>
              <h2 className="cta-title">¿Listo para dar el siguiente paso?</h2>
              <p className="cta-description" style={{ marginBottom: 0 }}>
                Inicia tu transformación digital hoy mismo. Únete a nuestra comunidad de desarrolladores élite y prepárate para el mercado de la industria tecnológica.
              </p>
            </div>
          </motion.footer>
        </>
        )}

      </main>
    </>
  );
}

export default App;
