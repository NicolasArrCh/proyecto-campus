import { motion } from 'framer-motion';
import { Clock, Calendar, BookOpen, ChevronRight, Sun, Moon } from 'lucide-react';
import './FormationsList.css';

const formations = [
  {
    id: 'diurna',
    type: 'Jornada Diurna',
    icon: <Sun size={28} className="formation-icon" />,
    schedules: [
      '6:00 a.m. a 2:00 p.m.',
      '2:00 p.m. a 7:00 p.m.',
      '10:00 a.m. a 5:00 p.m.'
    ],
    duration: '10 meses',
    courses: [
      'Desarrollo de software (programación e inteligencia artificial aplicada)',
      'Inglés',
      'Habilidades adaptativas'
    ],
    themeColor: 'blue'
  },
  {
    id: 'nocturna',
    type: 'Jornada Nocturna',
    icon: <Moon size={28} className="formation-icon" />,
    schedules: [
      '6:30 p.m. a 10:00 p.m.'
    ],
    duration: '13 meses',
    courses: [
      'Desarrollo de software (programación e inteligencia artificial aplicada)',
      'Habilidades adaptativas'
    ],
    themeColor: 'purple'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const cardVariants = {
  hidden: { y: 40, opacity: 0 },
  show: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 15 }
  }
};

const FormationsList = () => {
  return (
    <div className="formations-section">
      <div className="section-header">
        <h2 className="section-title">Programas y Formaciones</h2>
        <div className="title-underline"></div>
      </div>

      <motion.div 
        className="formations-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
      >
        {formations.map((formation) => (
          <motion.div 
            key={formation.id} 
            className={`formation-card theme-${formation.themeColor}`}
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
          >
            <div className="card-glass-panel">
              <div className="card-header">
                <div className="icon-wrapper">
                  {formation.icon}
                </div>
                <h3>{formation.type}</h3>
              </div>

              <div className="card-body">
                <div className="info-block">
                  <div className="info-header">
                    <Clock size={16} /> <span>Horarios Disponibles</span>
                  </div>
                  <ul className="pill-list">
                    {formation.schedules.map((schedule, i) => (
                      <li key={i} className="pill">{schedule}</li>
                    ))}
                  </ul>
                </div>

                <div className="info-block">
                  <div className="info-header">
                    <Calendar size={16} /> <span>Duración del Programa</span>
                  </div>
                  <p className="highlight-text">{formation.duration}</p>
                </div>

                <div className="info-block">
                  <div className="info-header">
                    <BookOpen size={16} /> <span>Cursos Incluidos</span>
                  </div>
                  <ul className="bullet-list">
                    {formation.courses.map((course, i) => (
                      <li key={i}><ChevronRight size={14} className="bullet-icon"/> {course}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="card-footer">
                <button className="inscribe-btn">Me interesa</button>
              </div>
              
              {/* Background Glow */}
              <div className="card-glow"></div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default FormationsList;
