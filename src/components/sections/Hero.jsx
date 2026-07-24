import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { projects, marqueeText } from '../../tokens/design-system';

function generateStars(count) {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() < 0.08 ? 2.5 + Math.random() * 1.5 : Math.random() < 0.3 ? 1.5 + Math.random() : 1 + Math.random() * 0.5,
      opacity: 0.3 + Math.random() * 0.7,
      duration: 2 + Math.random() * 5,
      delay: Math.random() * 6,
    });
  }
  return stars;
}

const cardPositions = [
  { x: -300, y: -80, z: 40, rotZ: -1, width: 300, delay: 0 },
  { x: 0, y: -75, z: 50, rotZ: 0.5, width: 300, delay: 0.1 },
  { x: 300, y: -80, z: 45, rotZ: -0.5, width: 300, delay: 0.2 },
  { x: -300, y: 70, z: 55, rotZ: 0.8, width: 300, delay: 0.3 },
  { x: 0, y: 75, z: 60, rotZ: -0.8, width: 300, delay: 0.4 },
  { x: 300, y: 70, z: 48, rotZ: 1, width: 300, delay: 0.5 },
];

const mobilePositions = [
  { x: -80, y: -55, z: 20, rotZ: -2, width: 132, delay: 0 },
  { x: 80, y: -50, z: 30, rotZ: 1.5, width: 128, delay: 0.1 },
  { x: -80, y: 25, z: 25, rotZ: 1, width: 134, delay: 0.2 },
  { x: 80, y: 30, z: 35, rotZ: -1.5, width: 130, delay: 0.3 },
  { x: -80, y: 105, z: 40, rotZ: -1, width: 126, delay: 0.4 },
  { x: 80, y: 110, z: 22, rotZ: 2, width: 133, delay: 0.5 },
];

const heroProjects = projects.slice(0, 6);

const desktopTextShadow = [
  '1px 1px 0 rgba(255,255,255,0.9)',
  '2px 2px 0 rgba(245,245,250,0.85)',
  '3px 3px 0 rgba(235,235,245,0.8)',
  '4px 4px 0 rgba(225,225,240,0.75)',
  '5px 5px 0 rgba(215,215,235,0.7)',
  '6px 6px 0 rgba(205,205,230,0.65)',
  '7px 7px 0 rgba(195,195,225,0.6)',
  '8px 8px 0 rgba(185,185,220,0.55)',
  '9px 9px 0 rgba(175,175,215,0.5)',
  '10px 10px 0 rgba(165,165,210,0.45)',
  '11px 11px 0 rgba(155,155,205,0.4)',
  '12px 12px 0 rgba(145,145,200,0.35)',
  '13px 13px 0 rgba(135,135,195,0.3)',
  '14px 14px 0 rgba(125,125,190,0.25)',
  '15px 15px 0 rgba(115,115,185,0.2)',
  '16px 16px 0 rgba(105,105,180,0.15)',
  '17px 17px 0 rgba(95,95,175,0.12)',
  '18px 18px 12px rgba(0,0,0,0.25)',
  '20px 20px 15px rgba(0,0,0,0.2)',
  '25px 25px 20px rgba(0,0,0,0.15)',
].join(', ');

const mobileTextShadow = [
  '1px 1px 0 rgba(255,255,255,0.9)',
  '2px 2px 0 rgba(245,245,250,0.85)',
  '3px 3px 0 rgba(235,235,245,0.8)',
  '4px 4px 0 rgba(225,225,240,0.7)',
  '5px 5px 0 rgba(215,215,235,0.65)',
  '6px 6px 0 rgba(205,205,230,0.6)',
  '7px 7px 0 rgba(195,195,225,0.5)',
  '8px 8px 0 rgba(185,185,220,0.4)',
  '9px 9px 0 rgba(175,175,215,0.3)',
  '10px 10px 8px rgba(0,0,0,0.2)',
].join(', ');

export default function Hero({ loaded }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);
  const cardRefs = useRef({});
  const mousePosRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const projectIndexMap = useMemo(() => {
    const map = {};
    heroProjects.forEach((p, i) => { map[p.id] = i; });
    return map;
  }, []);

  const stars = useMemo(() => {
    const isMobileInit = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
    return generateStars(isMobileInit ? 20 : 100);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      mousePosRef.current = {
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
      };
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let frame;
    let lastUpdate = 0;
    const targetFPS = isMobile ? 24 : 60;
    const interval = 1000 / targetFPS;

    const animate = (timestamp) => {
      if (timestamp - lastUpdate >= interval) {
        timeRef.current += 0.008;
        lastUpdate = timestamp;

        const cards = cardRefs.current;
        const activePos = isMobile ? mobilePositions : cardPositions;
        for (const id in cards) {
          const el = cards[id];
          if (!el) continue;
          const idx = projectIndexMap[id];
          if (idx === undefined) continue;
          const pos = activePos[idx];
          const floatY = Math.sin(timeRef.current + pos.delay * 5) * (isMobile ? 8 : 6);
          const mpX = mousePosRef.current.x;
          const mpY = mousePosRef.current.y;
          const parallaxX = isMobile ? mpX * 3 : (pos.x < 0 ? mpX * 12 : mpX * -12);
          const parallaxY = isMobile ? mpY * 2 : mpY * 4;
          el.style.transform = `translate3d(${pos.x + parallaxX}px, ${pos.y + floatY + parallaxY}px, 0) rotate(${pos.rotZ + mpX * 1.5}deg) scale(${1 - pos.z * 0.0005})`;
        }
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isMobile, projectIndexMap]);

  const activePositions = isMobile ? mobilePositions : cardPositions;

  return (
    <>
      <section
        id="hero"
        ref={sectionRef}
        style={{
          position: 'relative',
          minHeight: '130vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '5.5rem 1rem 4rem' : '8rem 2rem 6rem',
          overflow: 'hidden',
        }}
      >
        {/* Cosmic background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          overflow: 'hidden',
          backgroundColor: '#030308',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 1s ease',
          contain: 'strict',
        }}>
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            {stars.map((s) => (
              <div
                key={s.id}
                style={{
                  position: 'absolute',
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  width: `${s.size}px`,
                  height: `${s.size}px`,
                  borderRadius: '50%',
                  background: s.size > 2.5
                    ? 'radial-gradient(circle, #fff 0%, rgba(200,220,255,0.8) 50%, transparent 100%)'
                    : 'white',
                  boxShadow: s.size > 2.5
                    ? `0 0 ${s.size * 3}px ${s.size}px rgba(255,255,255,0.4)`
                    : 'none',
                  opacity: s.opacity,
                  animation: `starTwinkle ${s.duration}s ease-in-out ${s.delay}s infinite alternate`,
                  willChange: 'transform, opacity',
                }}
              />
            ))}
          </div>

          {isMobile ? (
            <>
              <div className="meteor meteor-1" />
              <div className="meteor meteor-2" />
            </>
          ) : (
            <>
              <div className="meteor meteor-1" />
              <div className="meteor meteor-2" />
              <div className="meteor meteor-3" />
              <div className="meteor meteor-4" />
              <div className="meteor meteor-5" />
            </>
          )}

          <div style={{
            position: 'absolute', top: '-15%', left: '-10%', width: '70%', height: '70%',
            background: 'radial-gradient(ellipse at 40% 50%, rgba(30,20,80,0.6) 0%, rgba(15,10,60,0.3) 40%, transparent 70%)',
            filter: isMobile ? 'blur(40px)' : 'blur(60px)',
            animation: isMobile
              ? 'nebulaDrift1 50s ease-in-out infinite, nebulaHue1Mobile 35s ease-in-out infinite'
              : 'nebulaDrift1 40s ease-in-out infinite, nebulaHue1 25s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', top: '10%', right: '-5%', width: '60%', height: '60%',
            background: 'radial-gradient(ellipse at 60% 40%, rgba(80,20,100,0.4) 0%, rgba(50,10,80,0.2) 45%, transparent 70%)',
            filter: isMobile ? 'blur(50px)' : 'blur(80px)',
            animation: isMobile
              ? 'nebulaDrift2 65s ease-in-out infinite, nebulaHue2Mobile 40s ease-in-out infinite'
              : 'nebulaDrift2 55s ease-in-out infinite, nebulaHue2 30s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', bottom: '-10%', left: '5%', width: '55%', height: '55%',
            background: 'radial-gradient(ellipse at 50% 60%, rgba(10,60,80,0.35) 0%, rgba(5,30,50,0.15) 45%, transparent 70%)',
            filter: isMobile ? 'blur(45px)' : 'blur(70px)',
            animation: isMobile
              ? 'nebulaDrift3 60s ease-in-out infinite, nebulaHue3Mobile 30s ease-in-out infinite'
              : 'nebulaDrift3 50s ease-in-out infinite, nebulaHue3 20s ease-in-out infinite',
          }} />
          {!isMobile && (
            <>
              <div style={{
                position: 'absolute', top: '-5%', right: '15%', width: '50%', height: '50%',
                background: 'radial-gradient(ellipse at 55% 45%, rgba(60,10,90,0.3) 0%, rgba(30,5,60,0.15) 40%, transparent 65%)',
                filter: 'blur(90px)',
                animation: 'nebulaDrift4 60s ease-in-out infinite',
              }} />
              <div style={{
                position: 'absolute', top: '30%', left: '35%', width: '30%', height: '40%',
                background: 'radial-gradient(ellipse at 50% 50%, rgba(100,60,120,0.12) 0%, transparent 60%)',
                filter: 'blur(50px)',
                animation: 'nebulaGlow 8s ease-in-out infinite',
              }} />
            </>
          )}
        </div>

        {/* Blur overlay saat kartu dipilih */}
        {selectedCard && (
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 15,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            background: 'rgba(3, 3, 8, 0.4)',
            transition: 'all 0.4s ease',
            pointerEvents: 'none',
          }} />
        )}

        {/* 3D Scene */}
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1200px',
          height: isMobile ? '580px' : '750px',
          zIndex: 20,
        }}>
          {/* Central 3D Text */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: isMobile ? '18%' : '8%',
            marginLeft: isMobile ? '-160px' : '-400px',
            marginTop: isMobile ? '-55px' : '-110px',
            width: isMobile ? '320px' : '800px',
            height: isMobile ? '110px' : '220px',
            transformStyle: 'preserve-3d',
            animation: 'gardsSpin 6s ease-in-out infinite',
            zIndex: 50,
            pointerEvents: 'none',
            willChange: 'transform',
          }}>
            <div style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              transformStyle: 'preserve-3d',
              transform: `rotateX(${mousePosRef.current.y * -12}deg) rotateY(${mousePosRef.current.x * 15}deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: isMobile ? '4.5rem' : '11rem',
                letterSpacing: '-0.05em',
                color: '#ffffff',
                opacity: loaded ? 1 : undefined,
                animation: loaded ? undefined : 'gardsPulse 1.5s ease-in-out infinite',
                textShadow: isMobile ? mobileTextShadow : desktopTextShadow,
                whiteSpace: 'nowrap',
                userSelect: 'none',
              }}>
                Gards
              </div>
            </div>

            <div style={{
              position: 'absolute', top: '30%', left: '50%',
              width: isMobile ? '280px' : '700px', height: isMobile ? '140px' : '260px',
              marginLeft: isMobile ? '-140px' : '-350px', marginTop: isMobile ? '-70px' : '-130px',
              background: 'radial-gradient(ellipse, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.04) 50%, transparent 75%)',
              filter: 'blur(50px)', pointerEvents: 'none',
              animation: 'glowPulse 4s ease-in-out infinite',
              opacity: loaded ? 1 : 0, transition: 'opacity 0.8s ease 0.3s',
            }} />

            <div style={{
              position: 'absolute', top: '-20px', right: '-30px', width: isMobile ? '7px' : '10px', height: isMobile ? '7px' : '10px', borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0.3))',
              boxShadow: isMobile ? '0 0 10px rgba(255,255,255,0.3)' : '0 0 15px rgba(255,255,255,0.5)',
              animation: 'floatParticle 3s ease-in-out infinite',
              opacity: loaded ? 1 : 0, transition: 'opacity 0.6s ease 0.5s',
            }} />
            <div style={{
              position: 'absolute', bottom: '-25px', left: '-40px', width: isMobile ? '6px' : '8px', height: isMobile ? '6px' : '8px', borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(255,255,255,0.2))',
              boxShadow: isMobile ? '0 0 8px rgba(255,255,255,0.2)' : '0 0 12px rgba(255,255,255,0.4)',
              animation: 'floatParticle 4s ease-in-out infinite reverse',
              opacity: loaded ? 1 : 0, transition: 'opacity 0.6s ease 0.6s',
            }} />
            {!isMobile && (
              <>
                <div style={{
                  position: 'absolute', top: '20px', left: '-50px', width: '6px', height: '6px', borderRadius: '50%',
                  background: 'radial-gradient(circle at 30% 30%, #ffffff, rgba(255,255,255,0.4))',
                  boxShadow: '0 0 10px rgba(255,255,255,0.4)',
                  animation: 'floatParticle 3.5s ease-in-out infinite 0.5s',
                  opacity: loaded ? 1 : 0, transition: 'opacity 0.6s ease 0.7s',
                }} />
                <div style={{
                  position: 'absolute', top: '-15px', left: '40px', width: '5px', height: '5px', borderRadius: '50%',
                  background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0.3))',
                  boxShadow: '0 0 8px rgba(255,255,255,0.3)',
                  animation: 'floatParticle 2.8s ease-in-out infinite 1s',
                  opacity: loaded ? 1 : 0, transition: 'opacity 0.6s ease 0.8s',
                }} />
              </>
            )}
          </div>

          {/* Floating UI Cards */}
          {heroProjects.map((project, index) => {
            const pos = activePositions[index];
            const isSelected = selectedCard === project.id;

            return (
              <div
                key={project.id}
                ref={(el) => { cardRefs.current[project.id] = el; }}
                onClick={() => setSelectedCard(isSelected ? null : project.id)}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: isMobile ? '62%' : '52%',
                  width: `${pos.width}px`,
                  marginLeft: `-${pos.width / 2}px`,
                  marginTop: isMobile ? '-40px' : '-55px',
                  opacity: loaded ? 1 : 0,
                  transition: 'opacity 0.6s ease',
                  transitionDelay: loaded ? '0s' : `${pos.delay}s`,
                  zIndex: isSelected ? 200 : 20 + index,
                  cursor: 'pointer',
                  willChange: 'transform',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                {/* Selection scale wrapper */}
                <div style={{
                  transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                  transition: 'transform 0.4s cubic-bezier(0.34, 1.2, 0.64, 1)',
                }}>
                {/* Card */}
                <div style={{
                  background: 'rgba(18, 18, 28, 0.95)',
                  border: isSelected
                    ? '1px solid rgba(200,255,0,0.4)'
                    : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: isSelected
                    ? '0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(200,255,0,0.1)'
                    : '0 8px 32px rgba(0,0,0,0.3)',
                  transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ff5f57' }} />
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ffbd2e' }} />
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#28c840' }} />
                    <span style={{
                      marginLeft: '8px', fontSize: '0.55rem',
                      color: 'rgba(255,255,255,0.3)', fontWeight: 500,
                    }}>
                      {project.category}
                    </span>
                  </div>

                  <div style={{ padding: '10px 12px' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '24px', height: '24px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0,
                        }}>
                          <img src={project.image} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div>
                          <div style={{
                            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600,
                            fontSize: '0.7rem', color: '#f0ece4', lineHeight: 1.2,
                          }}>
                            {project.title}
                          </div>
                          <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.3)' }}>
                            {project.year}
                          </div>
                        </div>
                      </div>
                      <div style={{
                        fontSize: '0.5rem', padding: '2px 6px', borderRadius: '4px',
                        background: 'rgba(40,200,64,0.12)', color: '#28c840', fontWeight: 600,
                      }}>
                        Done
                      </div>
                    </div>

                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0',
                    }}>
                      <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.25)' }}>
                        {project.year} — {project.category}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded detail panel */}
                {isSelected && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: 'absolute', bottom: '-8px', left: '50%',
                      transform: 'translateX(-50%) translateY(100%)',
                      width: isMobile ? '200px' : '240px',
                      background: 'rgba(18, 18, 28, 0.98)',
                      border: '1px solid rgba(200,255,0,0.2)',
                      borderRadius: '12px', padding: '0.875rem',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                      animation: 'panelSlideUp 0.3s cubic-bezier(0.34, 1.2, 0.64, 1)',
                    }}
                  >
                    <div style={{
                      fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.1em',
                      textTransform: 'uppercase', color: 'rgba(200,255,0,0.7)', marginBottom: '0.3rem',
                    }}>
                      {project.category}
                    </div>
                    <div style={{
                      fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                      fontSize: '0.875rem', color: '#f0ece4', lineHeight: 1.2, marginBottom: '0.4rem',
                    }}>
                      {project.title}
                    </div>
                    <div style={{
                      fontSize: '0.65rem', lineHeight: 1.5, color: 'rgba(255,255,255,0.5)', marginBottom: '0.6rem',
                    }}>
                      {project.description}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {project.tags.map((tag, i) => (
                        <span key={i} style={{
                          fontSize: '0.4rem', fontWeight: 600, letterSpacing: '0.05em',
                          textTransform: 'uppercase', padding: '0.15rem 0.4rem',
                          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50px',
                          color: 'rgba(255,255,255,0.5)',
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.dispatchEvent(new CustomEvent('openProject', { detail: { projectId: project.id } }));
                      }}
                      style={{
                        marginTop: '0.6rem', width: '100%', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                        padding: '0.45rem', borderRadius: '8px',
                        border: '1px solid rgba(200,255,0,0.3)',
                        background: 'rgba(200,255,0,0.05)', cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(200,255,0,0.12)'; e.currentTarget.style.borderColor = 'rgba(200,255,0,0.5)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(200,255,0,0.05)'; e.currentTarget.style.borderColor = 'rgba(200,255,0,0.3)'; }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c8ff00" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span style={{ fontSize: '0.55rem', fontWeight: 600, color: '#c8ff00', letterSpacing: '0.05em' }}>
                        View Project
                      </span>
                    </button>
                  </div>
                )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Instruction */}
        <div style={{
          textAlign: 'center', marginTop: isMobile ? '2rem' : '3rem',
          padding: isMobile ? '0 1rem' : undefined,
          color: 'rgba(255,255,255,0.25)', fontSize: isMobile ? '0.6rem' : '0.6875rem',
          fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
          zIndex: 10, opacity: loaded ? 1 : 0, transition: 'opacity 0.8s ease 1.2s',
        }}>
          {selectedCard ? 'Click another card or ✕ to close' : 'Click a card to view details'}
        </div>

        {/* Tagline & Description */}
        <div style={{
          textAlign: 'center', maxWidth: '600px',
          marginTop: isMobile ? '6rem' : '8rem',
          padding: isMobile ? '0 1rem' : undefined,
          zIndex: 10, opacity: loaded ? 1 : 0, transition: 'opacity 0.8s ease 1.5s',
        }}>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
            fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', color: '#ffffff',
            lineHeight: 1.3, marginBottom: '1rem',
          }}>
            We Build<br />Creative Experiences.
          </h2>
          <p style={{
            fontSize: 'clamp(0.8rem, 1.2vw, 0.95rem)', color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.8, maxWidth: '520px', margin: '0 auto',
          }}>
            Gards Creative adalah studio kreatif yang membantu bisnis membangun identitas digital melalui brand identity, logo design, photography, videography, dan social media management.
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex', gap: isMobile ? '2rem' : '4rem',
          marginTop: isMobile ? '3rem' : '4rem', paddingTop: '2rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          zIndex: 10, opacity: loaded ? 1 : 0, transition: 'opacity 0.8s ease 1.8s',
        }}>
          {[
            { value: '120+', label: 'Projects' },
            { value: '40+', label: 'Clients' },
            { value: '8y', label: 'Running' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                fontSize: '2rem', color: '#f0ece4',
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginTop: '0.25rem',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Marquee */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.35)', borderBottom: '1px solid rgba(255,255,255,0.35)',
        padding: '1rem 0', overflow: 'hidden', background: 'rgba(255,255,255,0.02)',
      }}>
        <div className="marquee-track">
          <div className="marquee-content">
            {[...marqueeText, ...marqueeText, ...marqueeText].map((item, i) => (
              <span key={i} className={`marquee-item ${item === '•' ? 'dot' : ''}`}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes panelSlideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(calc(100% + 8px)) scale(0.95); }
          to { opacity: 1; transform: translateX(-50%) translateY(100%) scale(1); }
        }

        @keyframes starTwinkle {
          0% { opacity: 0.15; transform: scale(0.6); }
          50% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0.2; transform: scale(0.7); }
        }

        @keyframes loadingBarFill {
          0% { width: 0%; }
          60% { width: 70%; }
          100% { width: 100%; }
        }

        @keyframes gardsPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .meteor {
          position: absolute; width: 3px; height: 3px;
          background: white; border-radius: 50%;
          box-shadow:
            0 0 8px 3px rgba(255,255,255,1),
            0 0 20px 6px rgba(255,255,255,0.6),
            0 0 40px 12px rgba(200,220,255,0.3);
          opacity: 0; pointer-events: none; transform: rotate(35deg);
          will-change: transform, opacity;
        }

        .meteor::before {
          content: ''; position: absolute; top: 50%; right: 50%;
          width: 180px; height: 2px; transform: translateY(-50%);
          background: linear-gradient(to left,
            rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 15%,
            rgba(200,220,255,0.5) 40%, rgba(150,180,255,0.2) 70%, transparent 100%);
          border-radius: 100px;
        }

        .meteor::after {
          content: ''; position: absolute; top: 50%; right: 50%;
          width: 80px; height: 6px; transform: translateY(-50%);
          background: linear-gradient(to left,
            rgba(255,255,255,0.3) 0%, rgba(200,220,255,0.1) 50%, transparent 100%);
          border-radius: 100px; filter: blur(2px);
        }

        .meteor-1 { top: 5%; left: 5%; animation: meteorShoot 8s linear infinite 2s; }
        .meteor-2 { top: 15%; left: 25%; animation: meteorShoot 11s linear infinite 6s; }
        .meteor-3 { top: 2%; left: 45%; animation: meteorShoot 13s linear infinite 10s; }
        .meteor-4 { top: 20%; left: 10%; animation: meteorShoot 9s linear infinite 15s; }
        .meteor-5 { top: 8%; left: 35%; animation: meteorShoot 12s linear infinite 22s; }

        @keyframes meteorShoot {
          0% { opacity: 0; transform: rotate(35deg) translate(0, 0); }
          1% { opacity: 0; transform: rotate(35deg) translate(0, 0); }
          2.5% { opacity: 1; }
          15% { opacity: 0.85; transform: rotate(35deg) translate(350px, 245px); }
          20% { opacity: 0; transform: rotate(35deg) translate(440px, 308px); }
          100% { opacity: 0; transform: rotate(35deg) translate(440px, 308px); }
        }

        @keyframes nebulaDrift1 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(3%, 2%) scale(1.03); }
          66% { transform: translate(-2%, -1%) scale(0.98); }
          100% { transform: translate(0, 0) scale(1); }
        }

        @keyframes nebulaDrift2 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-2%, 3%) scale(1.02); }
          66% { transform: translate(2%, -2%) scale(0.97); }
          100% { transform: translate(0, 0) scale(1); }
        }

        @keyframes nebulaDrift3 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(4%, -1%) scale(1.04); }
          66% { transform: translate(-3%, 2%) scale(0.96); }
          100% { transform: translate(0, 0) scale(1); }
        }

        @keyframes nebulaDrift4 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-1%, -3%) scale(1.01); }
          66% { transform: translate(3%, 1%) scale(0.99); }
          100% { transform: translate(0, 0) scale(1); }
        }

        @keyframes nebulaGlow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }

        @keyframes nebulaHue1 {
          0%, 100% { filter: blur(60px) hue-rotate(0deg) brightness(1); }
          25% { filter: blur(65px) hue-rotate(30deg) brightness(1.15); }
          50% { filter: blur(55px) hue-rotate(-20deg) brightness(0.9); }
          75% { filter: blur(62px) hue-rotate(15deg) brightness(1.1); }
        }

        @keyframes nebulaHue2 {
          0%, 100% { filter: blur(80px) hue-rotate(0deg) brightness(1); }
          30% { filter: blur(85px) hue-rotate(-40deg) brightness(1.2); }
          60% { filter: blur(75px) hue-rotate(25deg) brightness(0.85); }
          80% { filter: blur(82px) hue-rotate(-10deg) brightness(1.1); }
        }

        @keyframes nebulaHue3 {
          0%, 100% { filter: blur(70px) hue-rotate(0deg) brightness(1); }
          35% { filter: blur(73px) hue-rotate(50deg) brightness(1.15); }
          65% { filter: blur(68px) hue-rotate(-30deg) brightness(0.95); }
          90% { filter: blur(71px) hue-rotate(10deg) brightness(1.05); }
        }

        @keyframes nebulaHue1Mobile {
          0%, 100% { opacity: 0.7; filter: blur(40px) hue-rotate(0deg); }
          50% { opacity: 1; filter: blur(40px) hue-rotate(25deg); }
        }

        @keyframes nebulaHue2Mobile {
          0%, 100% { opacity: 0.6; filter: blur(50px) hue-rotate(0deg); }
          50% { opacity: 0.9; filter: blur(50px) hue-rotate(-20deg); }
        }

        @keyframes nebulaHue3Mobile {
          0%, 100% { opacity: 0.5; filter: blur(45px) hue-rotate(0deg); }
          50% { opacity: 0.8; filter: blur(45px) hue-rotate(15deg); }
        }

        @keyframes gardsSpin {
          0% { transform: rotateY(0deg) rotateX(0deg) scale(1); }
          20% { transform: rotateY(20deg) rotateX(8deg) scale(1.05); }
          40% { transform: rotateY(-15deg) rotateX(-5deg) scale(0.95); }
          60% { transform: rotateY(10deg) rotateX(-10deg) scale(1.02); }
          80% { transform: rotateY(-20deg) rotateX(5deg) scale(0.98); }
          100% { transform: rotateY(0deg) rotateX(0deg) scale(1); }
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        @keyframes floatParticle {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(5px, -8px); }
          66% { transform: translate(-3px, 5px); }
        }
      `}</style>
    </>
  );
}
