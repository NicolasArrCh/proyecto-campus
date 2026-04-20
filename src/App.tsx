import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import LoadingScreen from './components/LoadingScreen';
import InteractiveBackground from './components/InteractiveBackground';

const FormationsList = lazy(() => import('./components/FormationsList'));
const SkillsTabs = lazy(() => import('./components/SkillsTabs'));

const OrbitLienzo = lazy(() => import('./components/OrbitLienzo').then(module => ({ default: module.OrbitLienzo })));

function App() {
  const [isLoading, setIsLoading]       = useState(true);
  const [currentPage, setCurrentPage]   = useState('inicio');
  const [history, setHistory]           = useState(['inicio']);
  const [isMascotLoaded, setIsMascotLoaded] = useState(false);
  const [navVisible, setNavVisible]     = useState(true);
  const [load3D, setLoad3D]             = useState(false);

  const bubbleRef        = useRef<HTMLDivElement>(null);
  const lastScrollRef    = useRef(0);
  const scrollUpAccumRef = useRef(0);
  const hideTimerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Loading timer ──────────────────────────────────────────── */
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    // Empezar a decodificar modelo pesado y cargar dependencias ThreeJS 500ms después de liberar la UI general
    const d3Timer = setTimeout(() => setLoad3D(true), 2500); 
    return () => {
      clearTimeout(timer);
      clearTimeout(d3Timer);
    };
  }, []);

  /* ── Navbar scroll behaviour ────────────────────────────────────
     • scrollY ≤ 10        → always shown, cancel any pending timer
     • Scrolling down      → hide immediately
     • Scrolling up ≥ 80px → show; start 2s auto-hide timer
     • Scrolling up < 80px → accumulate, wait
  ─────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const TOP_THRESHOLD = 10;
    const SHOW_DELTA    = 80;
    const AUTO_HIDE_MS  = 2000;

    const onScroll = () => {
      const y     = window.scrollY;
      const delta = lastScrollRef.current - y; // + = scrolling up, − = down

      if (y <= TOP_THRESHOLD) {
        // At the very top — always visible
        scrollUpAccumRef.current = 0;
        if (hideTimerRef.current) { clearTimeout(hideTimerRef.current); hideTimerRef.current = null; }
        setNavVisible(true);

      } else if (delta < 0) {
        // Scrolling down — hide immediately
        scrollUpAccumRef.current = 0;
        if (hideTimerRef.current) { clearTimeout(hideTimerRef.current); hideTimerRef.current = null; }
        setNavVisible(false);

      } else if (delta > 0) {
        // Scrolling up — accumulate until threshold reached
        scrollUpAccumRef.current += delta;
        if (scrollUpAccumRef.current >= SHOW_DELTA) {
          scrollUpAccumRef.current = 0;
          setNavVisible(true);
          // Start 2s auto-hide (only if not at top)
          if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
          hideTimerRef.current = setTimeout(() => {
            if (window.scrollY > TOP_THRESHOLD) setNavVisible(false);
            hideTimerRef.current = null;
          }, AUTO_HIDE_MS);
        }
      }

      lastScrollRef.current = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  /* ── Navigation ─────────────────────────────────────────────── */
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

  const fadeUp = {
    hidden:  { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] as const } },
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

      <main className={`app-content ${!isLoading ? 'visible' : ''}`}>
        <InteractiveBackground />

        {/* ── Navbar — hide/show on scroll via Framer Motion ── */}
        <motion.header
          className="main-navbar"
          animate={{ y: navVisible ? 0 : '-100%' }}
          transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="nav-brand">CAMPUSLANDS</div>
        </motion.header>

        {/* ══════════════════════════════════════════════════
            INICIO — display:none/block (nunca unmounts)
            OrbitLienzo vive aquí siempre → sin clon 2D
        ══════════════════════════════════════════════════ */}
        <div style={{ display: currentPage === 'inicio' ? 'block' : 'none' }}>

          {/* Hero */}
          <section className="hero-section overflow-hidden">
            <div className="section-bg-orb orb-primary" />
            <div className="section-bg-orb orb-secondary" />

            <div className="hero-content relative z-10">
              <h1 className="hero-title">Bienvenidos</h1>
              <p className="hero-description">
                Bienvenido a nuestro campus, el ecosistema de formación tecnológica líder diseñado para
                potenciar tus habilidades y conectarte con el futuro en la industria del desarrollo de
                software. Descubre una metodología inmersiva y 100% práctica simulando entornos empresariales.
              </p>
            </div>

            {/* Mascota */}
            <div
              className="hero-mascot-placeholder relative z-10"
              style={{ position: 'relative', width: '100%', maxWidth: '500px', aspectRatio: '1/1' }}
            >
              {load3D ? (
                <Suspense fallback={<div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#66ccff' }}>Configurando visor interactivo...</div>}>
                  <OrbitLienzo
                    alCargar={() => setIsMascotLoaded(true)}
                    referenciaBurbuja={bubbleRef}
                  />
                </Suspense>
              ) : null}

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
                  backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)',
                  fontSize: '0.85rem', whiteSpace: 'nowrap',
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                  </svg>
                  Interactua con Orbit
                </div>
              </div>
            </div>
          </section>

          {/* Visión & Misión */}
          <motion.section
            className="vision-mision-section overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeUp}
          >
            <div className="section-bg-orb orb-secondary" style={{ top: '10%', left: '-10%' }} />
            <div className="section-bg-orb orb-primary"   style={{ bottom: '-10%', right: '10%' }} />

            <div className="relative z-10">
              <h2 className="section-title">Programas y Formación</h2>
              <p className="section-description">
                Explora las rutas de especialización diseñadas para convertirte en un talento de alto rendimiento técnico.
                Brindándote inmersión total en las tecnologías de punta de la industria.
              </p>

              <div className="jornada-options-grid" style={{ marginBottom: '2.5rem' }}>

                <div className="vm-card-wrapper wrapper-vision">
                  <div className="vm-card-inner">
                    <div className="jornada-icon">🌟</div>
                    <h3>Visión</h3>
                    <p>Ser el ecosistema líder en Latinoamérica en la formación de talento tecnológico de clase mundial, transformando vidas a través de la educación intensiva y de alta calidad.</p>
                  </div>
                </div>

                <div className="vm-card-wrapper wrapper-mision">
                  <div className="vm-card-inner">
                    <div className="jornada-icon">🎯</div>
                    <h3>Misión</h3>
                    <p>Formar desarrolladores de software altamente competitivos, integrando habilidades técnicas profundas con competencias blandas esenciales para el éxito profesional global.</p>
                  </div>
                </div>

              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button className="btn-primary" onClick={() => navigateTo('programas')}>Ver Programas</button>
              </div>
            </div>
          </motion.section>
        </div>

        {/* ══════════════════════════════════════════════════
            PROGRAMAS
            Orden: CTA → FormationsList → SkillsTabs → Campus
        ══════════════════════════════════════════════════ */}
        {currentPage === 'programas' && (
          <>
            {renderBackButton()}
            <motion.section
              className="formacion-section overflow-hidden"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.08 }}
              variants={fadeUp}
            >
              <div className="section-bg-orb orb-primary"   style={{ top: '-5%',   left: '-15%' }} />
              <div className="section-bg-orb orb-secondary" style={{ bottom: '-5%', right: '-10%' }} />

              <div className="relative z-10">

                {/* CTA */}
                <div className="cta-plain">
                  <h2 className="cta-plain-title">¿Listo para dar el siguiente paso?</h2>
                  <p className="cta-plain-desc">
                    Inicia tu transformación digital hoy mismo. Únete a nuestra comunidad de
                    desarrolladores élite y prepárate para el mercado de la industria tecnológica.
                  </p>
                </div>

                {/* Rutas (Lazy Loaded) */}
                <Suspense fallback={<div style={{ textAlign: 'center', padding: '3rem', color: '#61dafb' }}>Cargando contenido...</div>}>
                  <div className="formations-list-container">
                    <FormationsList />
                  </div>

                  <SkillsTabs />
                </Suspense>

                {/* Campus features */}
                <div style={{ marginTop: '3rem' }}>
                  <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Nuestro Campus</h2>
                  <div className="campus-features-grid">

                    <motion.div className="campus-feat-card feat-blue" whileHover={{ y: -10, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                      <span className="feat-icon">💻</span>
                      <strong className="feat-title">Aulas de Informática</strong>
                      <p className="feat-desc">Equipos de última generación y conectividad robusta para cada estudiante. Entornos optimizados para el máximo rendimiento técnico.</p>
                    </motion.div>

                    <motion.div className="campus-feat-card feat-emerald" whileHover={{ y: -10, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                      <span className="feat-icon">🗣️</span>
                      <strong className="feat-title">Áreas de Inglés</strong>
                      <p className="feat-desc">Espacios de inmersión total para formar profesionales competitivos y bilingües, listos para el mercado global de tecnología.</p>
                    </motion.div>

                    <motion.div className="campus-feat-card feat-violet" whileHover={{ y: -10, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                      <span className="feat-icon">🧠</span>
                      <strong className="feat-title">Áreas Soft Skills</strong>
                      <p className="feat-desc">Ambientes propicios para dinámicas de liderazgo, comunicación asertiva y resolución de problemas en entornos colaborativos.</p>
                    </motion.div>

                  </div>
                </div>

              </div>
            </motion.section>
          </>
        )}

      </main>
    </>
  );
}

export default App;
