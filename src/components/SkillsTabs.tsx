import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Lightbulb, Crown, MessageCircle,
  Users, RefreshCw, Target, Clock, Brain
} from 'lucide-react';
import './SkillsTabs.css';

type Tab = 'tecnicas' | 'herramientas' | 'blandas';

/* ── Tech data ────────────────────────────────────────────────── */
const languages = [
  { abbr: 'JS',  bg: '#f7df1e', color: '#1a1a1a', name: 'JavaScript' },
  { abbr: 'TS',  bg: '#3178c6', color: '#fff',    name: 'TypeScript' },
  { abbr: 'PY',  bg: '#306998', color: '#ffd43b', name: 'Python' },
  { abbr: 'JV',  bg: '#e76f00', color: '#fff',    name: 'Java' },
  { abbr: 'C#',  bg: '#68217a', color: '#fff',    name: 'C#' },
  { abbr: 'HTM', bg: '#e34c26', color: '#fff',    name: 'HTML5' },
  { abbr: 'CSS', bg: '#264de4', color: '#fff',    name: 'CSS3' },
];
const databases = [
  { abbr: '🐬', bg: '#00618a', color: '#fff', name: 'MySQL' },
  { abbr: '🐘', bg: '#336791', color: '#fff', name: 'PostgreSQL' },
  { abbr: '🍃', bg: '#13aa52', color: '#fff', name: 'MongoDB' },
  { abbr: '🔥', bg: '#dd4814', color: '#fff', name: 'CodeIgniter' },
];
const frameworks = [
  { abbr: 'N▲',  bg: '#111',    color: '#fff',    name: 'Next.js' },
  { abbr: 'NOD', bg: '#3c873a', color: '#fff',    name: 'Node.js' },
  { abbr: 'LAR', bg: '#ff2d20', color: '#fff',    name: 'Laravel' },
  { abbr: '🌿',  bg: '#6db33f', color: '#fff',    name: 'Spring' },
];

const tools = [
  { name: 'GITHUB',  abbr: '⑂',  bg: '#161b22', color: '#fff' },
  { name: 'DRIVE',   abbr: '▲',  bg: '#1a237e', color: '#fff' },
  { name: 'DISCORD', abbr: '⊕',  bg: '#5865f2', color: '#fff' },
  { name: 'JIRA',    abbr: '▶',  bg: '#0052cc', color: '#fff' },
  { name: 'CHATGPT', abbr: '◉',  bg: '#0d9e7e', color: '#fff' },
  { name: 'VS CODE', abbr: '⊞',  bg: '#007acc', color: '#fff' },
];

const softSkills = [
  { name: 'EMPATÍA',             Icon: Heart,          color: '#ec4899' },
  { name: 'CREATIVIDAD',         Icon: Lightbulb,      color: '#f59e0b' },
  { name: 'LIDERAZGO',           Icon: Crown,          color: '#eab308' },
  { name: 'COMUNICACIÓN',        Icon: MessageCircle,  color: '#3b82f6' },
  { name: 'TRABAJO EN EQUIPO',   Icon: Users,          color: '#8b5cf6' },
  { name: 'ADAPTABILIDAD',       Icon: RefreshCw,      color: '#10b981' },
  { name: 'RESOLUCIÓN',          Icon: Target,         color: '#ef4444' },
  { name: 'GESTIÓN TIEMPO',      Icon: Clock,          color: '#f97316' },
  { name: 'PENSAMIENTO CRÍTICO', Icon: Brain,          color: '#a855f7' },
];

/* ── Tech icon tile ───────────────────────────────────────────── */
const IconTile = ({ abbr, bg, color, name }: { abbr: string; bg: string; color: string; name: string }) => (
  <motion.div
    className="skill-icon-tile"
    style={{ background: bg }}
    whileHover={{ scale: 1.12, y: -4 }}
    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    title={name}
  >
    <span style={{ color, fontWeight: 800, fontSize: abbr.length > 2 ? '1.1rem' : '1rem' }}>
      {abbr}
    </span>
  </motion.div>
);

/* ── Main component ───────────────────────────────────────────── */
const SkillsTabs = () => {
  const [activeTab, setActiveTab] = useState<Tab>('tecnicas');

  const tabVariants = {
    hidden: { opacity: 0, y: 16 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
    exit:   { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <div className="skills-container">
      {/* ── Tab bar ───────────────────────────────────── */}
      <div className="skills-tab-bar">
        {(['tecnicas', 'herramientas', 'blandas'] as Tab[]).map((tab) => {
          const labels: Record<Tab, string> = {
            tecnicas:     'Técnicas',
            herramientas: 'Herramientas',
            blandas:      'Habilidades Blandas',
          };
          return (
            <button
              key={tab}
              className={`skills-tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* ── Tab content ────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {/* ── TÉCNICAS ── */}
        {activeTab === 'tecnicas' && (
          <motion.div key="tec" className="tab-panel tecnicas-panel" variants={tabVariants} initial="hidden" animate="show" exit="exit">
            {/* Lenguajes */}
            <div className="tech-cat-card cat-lenguajes">
              <div className="tech-cat-header">
                <span className="tech-cat-symbol">&lt;/&gt;</span>
                <h3>Lenguajes</h3>
              </div>
              <div className="icon-grid">
                {languages.map(l => <IconTile key={l.name} {...l} />)}
              </div>
            </div>

            {/* Bases de datos */}
            <div className="tech-cat-card cat-bases">
              <div className="tech-cat-header">
                <span className="tech-cat-symbol">🗄</span>
                <h3>Bases de datos</h3>
              </div>
              <div className="icon-grid cols-2">
                {databases.map(d => <IconTile key={d.name} {...d} />)}
              </div>
            </div>

            {/* Frameworks */}
            <div className="tech-cat-card cat-frameworks">
              <div className="tech-cat-header">
                <span className="tech-cat-symbol">⚡</span>
                <h3>Frameworks</h3>
              </div>
              <div className="icon-grid cols-2">
                {frameworks.map(f => <IconTile key={f.name} {...f} />)}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── HERRAMIENTAS ── */}
        {activeTab === 'herramientas' && (
          <motion.div key="her" className="tab-panel" variants={tabVariants} initial="hidden" animate="show" exit="exit">
            <div className="tools-grid">
              {tools.map((t) => (
                <motion.div
                  key={t.name}
                  className="tool-tile"
                  whileHover={{ scale: 1.05, y: -6 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="tool-icon-wrap" style={{ background: t.bg }}>
                    <span style={{ color: t.color, fontSize: '1.6rem' }}>{t.abbr}</span>
                  </div>
                  <span className="tool-label">{t.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── HABILIDADES BLANDAS ── */}
        {activeTab === 'blandas' && (
          <motion.div key="bla" className="tab-panel" variants={tabVariants} initial="hidden" animate="show" exit="exit">
            <div className="blandas-grid">
              {softSkills.map(({ name, Icon, color }) => (
                <motion.div
                  key={name}
                  className="blanda-tile"
                  whileHover={{ scale: 1.06, y: -6 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="blanda-icon-wrap" style={{ color }}>
                    <Icon size={30} />
                  </div>
                  <span className="blanda-label">{name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillsTabs;
