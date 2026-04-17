import { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  SiJavascript, SiTypescript, SiPython, SiHtml5, SiCss,
  SiMysql, SiPostgresql, SiMongodb,
  SiNodedotjs, SiLaravel, SiSpringboot,
  SiGithub, SiGoogledrive, SiDiscord, SiJira, SiOpenai,
  SiPhp, SiDotnet
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import { DiDotnet } from 'react-icons/di';        // C# via .NET icon
import { VscCode } from 'react-icons/vsc';         // VS Code icon (vsc set)
import {
  Heart, Lightbulb, Crown, MessageCircle,
  Users, RefreshCw, Target, Clock, Brain,
} from 'lucide-react';
import './SkillsTabs.css';

type Tab = 'tecnicas' | 'herramientas' | 'blandas';
type IconComponent = React.ComponentType<{ size?: number; color?: string; className?: string }>;

/* ── Languages ────────────────────────────────────────────────── */
const languages: { name: string; Icon: IconComponent; color: string; bg: string }[] = [
  { name: 'JavaScript', Icon: SiJavascript, color: '#f7df1e', bg: 'rgba(247,223,30,0.10)'  },
  { name: 'TypeScript', Icon: SiTypescript, color: '#3178c6', bg: 'rgba(49,120,198,0.10)'  },
  { name: 'Python',     Icon: SiPython,     color: '#3776ab', bg: 'rgba(55,118,171,0.10)'  },
  { name: 'Java',       Icon: FaJava,       color: '#e76f00', bg: 'rgba(231,111,0,0.10)'   },
  { name: 'C#',         Icon: DiDotnet,     color: '#9b4f96', bg: 'rgba(155,79,150,0.12)'  },
  { name: 'PHP',        Icon: SiPhp,        color: '#777bb4', bg: 'rgba(119,123,180,0.10)' },
  { name: 'Node.js',    Icon: SiNodedotjs,  color: '#3c873a', bg: 'rgba(60,135,58,0.10)'   },
  { name: 'HTML5',      Icon: SiHtml5,      color: '#e34c26', bg: 'rgba(227,76,38,0.10)'   },
  { name: 'CSS3',       Icon: SiCss,        color: '#264de4', bg: 'rgba(38,77,228,0.10)'   },
];

/* ── Databases ────────────────────────────────────────────────── */
const databases: { name: string; Icon: IconComponent; color: string; bg: string }[] = [
  { name: 'MySQL',       Icon: SiMysql,        color: '#00618a', bg: 'rgba(0,97,138,0.12)'   },
  { name: 'PostgreSQL',  Icon: SiPostgresql,   color: '#336791', bg: 'rgba(51,103,145,0.12)' },
  { name: 'MongoDB',     Icon: SiMongodb,      color: '#13aa52', bg: 'rgba(19,170,82,0.10)'  },
];

/* ── Rutas y Frameworks ───────────────────────────────────────── */
const rutasLenguajes: { name: string; Icon: IconComponent; color: string; bg: string }[] = [
  { name: 'PHP',        Icon: SiPhp,        color: '#777bb4', bg: 'rgba(119,123,180,0.10)' },
  { name: 'Java',       Icon: FaJava,       color: '#e76f00', bg: 'rgba(231,111,0,0.10)' },
  { name: 'C#',         Icon: DiDotnet,     color: '#9b4f96', bg: 'rgba(155,79,150,0.12)' },
];

const rutasFrameworks: { name: string; Icon: IconComponent; color: string; bg: string }[] = [
  { name: 'Laravel',   Icon: SiLaravel,    color: '#ff2d20', bg: 'rgba(255,45,32,0.10)' },
  { name: 'Spring Boot',Icon: SiSpringboot, color: '#6db33f', bg: 'rgba(109,179,63,0.10)' },
  { name: '.NET',      Icon: SiDotnet,     color: '#512bd4', bg: 'rgba(81,43,212,0.10)' },
];

/* ── Tools ────────────────────────────────────────────────────── */
const tools: { name: string; Icon: IconComponent; color: string; bg: string }[] = [
  { name: 'GitHub',  Icon: SiGithub,       color: '#e6edf3', bg: 'rgba(230,237,243,0.06)' },
  { name: 'Drive',   Icon: SiGoogledrive,  color: '#4285f4', bg: 'rgba(66,133,244,0.10)'  },
  { name: 'Discord', Icon: SiDiscord,      color: '#5865f2', bg: 'rgba(88,101,242,0.12)'  },
  { name: 'Jira',    Icon: SiJira,         color: '#0052cc', bg: 'rgba(0,82,204,0.12)'    },
  { name: 'ChatGPT', Icon: SiOpenai,       color: '#10a37f', bg: 'rgba(16,163,127,0.10)'  },
  { name: 'VS Code', Icon: VscCode,        color: '#007acc', bg: 'rgba(0,122,204,0.12)'   },
];

/* ── Soft Skills ──────────────────────────────────────────────── */
const softSkills = [
  { name: 'EMPATÍA',             Icon: Heart,         color: '#ec4899' },
  { name: 'CREATIVIDAD',         Icon: Lightbulb,     color: '#f59e0b' },
  { name: 'LIDERAZGO',           Icon: Crown,         color: '#eab308' },
  { name: 'COMUNICACIÓN',        Icon: MessageCircle, color: '#3b82f6' },
  { name: 'TRABAJO EN EQUIPO',   Icon: Users,         color: '#8b5cf6' },
  { name: 'ADAPTABILIDAD',       Icon: RefreshCw,     color: '#10b981' },
  { name: 'RESOLUCIÓN',          Icon: Target,        color: '#ef4444' },
  { name: 'GESTIÓN TIEMPO',      Icon: Clock,         color: '#f97316' },
  { name: 'PENS. CRÍTICO',       Icon: Brain,         color: '#a855f7' },
];

/* ── Tech icon tile ───────────────────────────────────────────── */
const TechTile = ({
  name, Icon, color, bg, large = false,
}: { name: string; Icon: IconComponent; color: string; bg: string; large?: boolean }) => (
  <motion.div
    className={`skill-icon-tile${large ? ' tile-large' : ''}`}
    style={{ background: bg }}
    whileHover={{ scale: 1.13, y: -5 }}
    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
    title={name}
  >
    <Icon size={large ? 30 : 26} color={color} />
    <span className="tile-label" style={{ color }}>{name}</span>
  </motion.div>
);

/* ── Main component ───────────────────────────────────────────── */
const SkillsTabs = () => {
  const [activeTab, setActiveTab] = useState<Tab>('tecnicas');

  const tabVariants: Variants = {
    hidden: { opacity: 0, y: 14  },
    show:   { opacity: 1, y: 0,  transition: { duration: 0.32, ease: [0.4, 0, 0.2, 1] } },
    exit:   { opacity: 0, y: -8, transition: { duration: 0.2 } },
  };

  const tabLabels: Record<Tab, string> = {
    tecnicas:     'Técnicas',
    herramientas: 'Herramientas',
    blandas:      'Habilidades Blandas',
  };

  return (
    <div className="skills-container">

      {/* ── Enfoques title ──────────────────────── */}
      <div className="enfoques-header">
        <h2 className="section-title">Enfoques</h2>
        <p className="enfoques-subtitle">Las habilidades que adquieres en cada ruta de especialización.</p>
        <div className="title-underline" style={{ margin: '0 auto' }}></div>
      </div>

      {/* ── Tab bar ─────────────────────────────────── */}
      <div className="skills-tab-bar">
        {(['tecnicas', 'herramientas', 'blandas'] as Tab[]).map((tab) => (
          <button
            key={tab}
            className={`skills-tab-btn${activeTab === tab ? ' active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      {/* ── Tab content ─────────────────────────────── */}
      <AnimatePresence mode="wait">

        {/* ── TÉCNICAS ── */}
        {activeTab === 'tecnicas' && (
          <motion.div key="tec" className="tab-panel tecnicas-panel" variants={tabVariants} initial="hidden" animate="show" exit="exit">

            <div className="tech-cat-card cat-lenguajes">
              <div className="tech-cat-header">
                <span className="tech-cat-symbol">&lt;/&gt;</span>
                <h3>Lenguajes</h3>
              </div>
              <div className="icon-grid">
                {languages.map(item => <TechTile key={item.name} {...item} />)}
              </div>
            </div>

            <div className="tech-cat-card cat-bases">
              <div className="tech-cat-header">
                <span className="tech-cat-symbol">🗄</span>
                <h3>Bases de datos</h3>
              </div>
              <div className="icon-grid cols-2">
                {databases.map(item => {
                  if (item.name === 'MongoDB') {
                    return (
                      <div key={item.name} style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center' }}>
                        <div style={{ width: 'calc(50% - 0.275rem)' }}>
                          <TechTile {...item} large />
                        </div>
                      </div>
                    );
                  }
                  return <TechTile key={item.name} {...item} large />;
                })}
              </div>
            </div>

            <div className="tech-cat-card cat-rutas">
              <div className="tech-cat-header">
                <span className="tech-cat-symbol">🛣️</span>
                <h3>Rutas</h3>
              </div>
              <div className="icon-grid">
                {rutasLenguajes.map(item => <TechTile key={item.name} {...item} />)}
              </div>
            </div>

            <div className="tech-cat-card cat-frameworks">
              <div className="tech-cat-header">
                <span className="tech-cat-symbol">⚡</span>
                <h3>Frameworks</h3>
              </div>
              <div className="icon-grid">
                {rutasFrameworks.map(item => <TechTile key={item.name} {...item} />)}
              </div>
            </div>

          </motion.div>
        )}

        {/* ── HERRAMIENTAS ── */}
        {activeTab === 'herramientas' && (
          <motion.div key="her" className="tab-panel" variants={tabVariants} initial="hidden" animate="show" exit="exit">
            <div className="tools-grid">
              {tools.map(({ name, Icon, color, bg }) => (
                <motion.div
                  key={name}
                  className="tool-tile"
                  whileHover={{ scale: 1.05, y: -7 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="tool-icon-wrap" style={{ background: bg, border: `1px solid ${color}33` }}>
                    <Icon size={38} color={color} />
                  </div>
                  <span className="tool-label" style={{ color }}>{name}</span>
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
                  whileHover={{ scale: 1.06, y: -7 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="blanda-icon-wrap" style={{
                    background: `${color}18`,
                    border: `1px solid ${color}35`,
                    boxShadow: `0 0 18px ${color}20`,
                  }}>
                    <Icon size={32} color={color} />
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
