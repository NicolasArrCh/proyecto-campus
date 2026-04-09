import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LoadingScreen from './components/LoadingScreen';
import FormationsList from './components/FormationsList';
import InteractiveBackground from './components/InteractiveBackground';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading of initial assets or data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 7000); // 7 seconds of simulated load for the demo

    return () => clearTimeout(timer);
  }, []);

  // Variant for scroll animations
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <>
      <LoadingScreen isVisible={isLoading} />
      
      {/* Main Content Area - hidden until loading is finished */}
      <main className={`app-content ${!isLoading ? 'visible' : ''}`}>
        
        {/* Spectacular Interactive Background Network */}
        <InteractiveBackground />

        {/* Header Section (fixed top) */}
        <header className="main-navbar">
          <button className="btn-primary nav-btn">MÁS INFORMACIÓN</button>
          <div className="nav-brand">CAMPUSLANDS</div>
        </header>

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
            <h1 className="hero-title">Inicio</h1>
            <p className="hero-description">
              Bienvenido a nuestro campus, el ecosistema de formación tecnológica líder diseñado para potenciar tus habilidades y conectarte con el futuro en la industria del desarrollo de software. Descubre una metodología inmersiva y 100% práctica simulando entornos empresariales reales.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary">Ver Programas</button>
              <button className="btn-secondary">Solicitar Información</button>
            </div>
          </div>
          <div className="hero-mascot-placeholder relative z-10">
            <div className="mascot-box">
              <span>[Espacio Reservado para Mascota 3D]</span>
            </div>
          </div>
        </motion.section>

        {/* Programs Section */}
        <motion.section 
          className="programs-section overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUpVariant}
        >
          {/* Animated Background Orbs for this section */}
          <div className="section-bg-orb orb-secondary" style={{ top: '10%', left: '-10%' }} />
          <div className="section-bg-orb orb-primary" style={{ bottom: '-10%', right: '10%' }} />

          <div className="relative z-10">
            <h2 className="section-title">Nuestros Programas</h2>
            <p className="section-description">
              Explora las rutas de especialización diseñadas para convertirte en un talento de alto rendimiento técnico.
            </p>
            <div className="programs-grid">
              <div className="program-card">
                <h3>Desarrollo Web Full-Stack</h3>
                <p>Domina las tecnologías clave del frontend y backend para construir aplicaciones escalables e interactivas adaptadas al mercado global.</p>
              </div>
              <div className="program-card">
                <h3>Ingeniería de Datos e IA</h3>
                <p>Prepárate para manejar grandes volúmenes de datos, analizar tendencias y crear modelos predictivos que transformen el negocio.</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Jornadas Section */}
        <motion.section 
          className="jornadas-section overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUpVariant}
        >
          {/* Animated Background Orbs for this section */}
          <div className="section-bg-orb orb-primary" style={{ top: '20%', right: '-20%' }} />

          <div className="relative z-10">
            <h2 className="section-title">Elige tu Jornada</h2>
            <p className="section-description">
              Nuestros horarios están pensados para adaptarse a tus necesidades y potenciar tu aprendizaje sin interrupciones.
            </p>
            <div className="jornada-options-grid">
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

        {/* CTA Footer Section */}
        <motion.footer 
          className="cta-footer relative overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUpVariant}
        >
          {/* Animated Background Orbs for footer */}
          <div className="section-bg-orb orb-primary" style={{ top: '-50%', left: '20%' }} />

          <div className="relative z-10">
            <h2 className="cta-title">¿Listo para dar el siguiente paso?</h2>
            <p className="cta-description">Inicia tu transformación digital hoy mismo y únete a nuestra comunidad de desarrolladores élite.</p>
            <div className="cta-buttons">
              <button className="btn-contact btn-whatsapp">WhatsApp</button>
              <button className="btn-contact btn-direct">Línea Directa</button>
              <button className="btn-contact btn-email">Correo Electrónico</button>
            </div>
          </div>
        </motion.footer>

      </main>
    </>
  );
}

export default App;
