import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const InteractiveBackground = () => {
  const [init, setInit] = useState(false);

  // this should be run only once per application lifetime
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) {
    return null;
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -2, pointerEvents: 'auto' }}>
      <Particles
        id="tsparticles"
        options={{
          background: {
            color: {
              value: "transparent",
            },
          },
          fpsLimit: 60,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "grab", // Solo hover de tracción
              },
              resize: {
                 enable: true
              }
            },
            modes: {
              push: {
                quantity: 1, // Reducir spam de clicks
              },
              grab: {
                distance: 200,
                links: {
                  opacity: 0.6,
                  color: "#e2c070" 
                }
              },
            },
          },
          particles: {
            color: {
              value: "#3b82f6", 
            },
            links: {
              color: "#a0a8ba", 
              distance: 120, // Menos distancia = muchos menos cálculos
              enable: true,
              opacity: 0.2,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "out",
              },
              random: true,
              speed: 0.5, // Movimiento sutil para no desorientar
              straight: false,
            },
            number: {
              density: {
                enable: true,
                width: 800,
                height: 800
              },
              value: window.innerWidth <= 768 ? 15 : 40, // 40 es el balance perfecto para verse profesional sin laggear
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1.5, max: 3.5 },
            },
          },
          detectRetina: false, // CLAVE PARA RENDIMIENTO, evita cuadriplicar nodos en pantallas High-DPI
        }}
      />
    </div>
  );
};

export default InteractiveBackground;
