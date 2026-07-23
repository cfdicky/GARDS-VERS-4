import { useState, useEffect, useRef, useMemo } from 'react';
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

export default function Hero({ loaded }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [dragOffsets, setDragOffsets] = useState({});
  const [dragging, setDragging] = useState(null);
  const [didDrag, setDidDrag] = useState(false);
  const [bouncing, setBouncing] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const dragStartRef = useRef(null);
  const sectionRef = useRef(null);
  const cardRefs = useRef({});

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const isMobileInit = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
  const stars = useMemo(() => generateStars(isMobileInit ? 40 : 120), []);

  const mousePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let rafId;
    const handleMouseMove = (e) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      mousePosRef.current = { x, y };
      if (!isMobile) {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => setMousePos({ x, y }));
      }
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [isMobile]);

  const timeRef = useRef(0);
  const bouncingRef = useRef({});
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    bouncingRef.current = bouncing;
  }, [bouncing]);

  const handleBounceEnd = (id) => {
    const el = cardRefs.current[id];
    const idx = projects.findIndex((p) => p.id === id);
    const pos = (isMobile ? mobilePositions : cardPositions)[idx];
    if (el && pos) {
      const mpX = mousePosRef.current.x;
      const mpY = mousePosRef.current.y;
      const isLeft = pos.x < 0;
      const parallaxX = isMobile ? mpX * 3 : (isLeft ? mpX * 15 : mpX * -15);
      const parallaxY = isMobile ? mpY * 2 : mpY * 5;
      const floatY = Math.sin(timeRef.current + pos.delay * 5) * 6;
      const rz = pos.rotZ + mpX * 2;
      const sc = selectedCard === id ? 1.4 : 1 - pos.z * 0.0005;
      el.style.transition = 'none';
      el.style.transform = `translate3d(${pos.x + parallaxX}px, ${pos.y + floatY + parallaxY}px, 0) rotate(${rz}deg) scale(${sc})`;
      el.offsetHeight;
    }
    setBouncing((b) => ({ ...b, [id]: false }));
  };

  useEffect(() => {
    let frame;
    let lastUpdate = 0;
    const targetFPS = isMobile ? 30 : 60;
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
          if (bouncingRef.current[id]) continue;
          const idx = projects.findIndex((p) => p.id === id);
          if (idx === -1) continue;
          const pos = activePos[idx];
          const isDraggingCard = dragging === id;
          const floatY = isDraggingCard ? 0 : Math.sin(timeRef.current + pos.delay * 5) * 6;
          const off = dragOffsets[id] || { x: 0, y: 0 };
          const mpX = mousePosRef.current.x;
          const mpY = mousePosRef.current.y;
          const isLeft = pos.x < 0;
          const parallaxX = isMobile ? mpX * 3 : (isLeft ? mpX * 15 : mpX * -15);
          const parallaxY = isMobile ? mpY * 2 : mpY * 5;
          const tx = pos.x + off.x + parallaxX;
          const ty = pos.y + off.y + floatY + parallaxY;
          const rz = pos.rotZ + mpX * 2;
          const sc = isDraggingCard ? 1.1 : (selectedCard === id ? 1.4 : 1 - pos.z * 0.0005);
          el.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${rz}deg) scale(${sc})`;
        }

        forceUpdate((n) => n + 1);
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isMobile, dragging, dragOffsets, selectedCard]);

  const handleDragStart = (e, projectId) => {
    e.preventDefault();
    e.stopPropagation();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragStartRef.current = { x: clientX, y: clientY, id: projectId };
    setDidDrag(false);
    setDragging(projectId);
  };

  useEffect(() => {
    if (!dragging) return;

    const handleMove = (e) => {
      if (!dragStartRef.current) return;
      e.preventDefault();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const dx = clientX - dragStartRef.current.x;
      const dy = clientY - dragStartRef.current.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        setDidDrag(true);
      }
      setDragOffsets((prev) => ({
        ...prev,
        [dragging]: {
          x: (prev[dragging]?.x || 0) + dx,
          y: (prev[dragging]?.y || 0) + dy,
        },
      }));
      dragStartRef.current.x = clientX;
      dragStartRef.current.y = clientY;
    };

    const handleEnd = () => {
      const id = dragStartRef.current?.id;
      dragStartRef.current = null;
      setDragging(null);

      if (id) {
        const idx = projects.findIndex((p) => p.id === id);
        const pos = activePositions[idx];
        setDragOffsets((prev) => {
          const off = prev[id] || { x: 0, y: 0 };
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          const cardCenterX = vw / 2 + pos.x + off.x;
          const cardCenterY = vh / 2 + pos.y + off.y;
          const margin = 50;

          if (cardCenterX < margin || cardCenterX > vw - margin ||
              cardCenterY < margin || cardCenterY > vh - margin) {
            setBouncing((b) => ({ ...b, [id]: true }));
            const el = cardRefs.current[id];
            if (el) {
              const isLeft = pos.x < 0;
              const mpX = mousePosRef.current.x;
              const mpY = mousePosRef.current.y;
              const parallaxX = isMobile ? mpX * 3 : (isLeft ? mpX * 15 : mpX * -15);
              const parallaxY = isMobile ? mpY * 2 : mpY * 5;
              const floatY = Math.sin(timeRef.current + pos.delay * 5) * 6;
              el.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
              el.style.transform = `translate3d(${pos.x + parallaxX}px, ${pos.y + floatY + parallaxY}px, 0) rotate(${pos.rotZ + mpX * 2}deg) scale(1)`;
            }
            setTimeout(() => {
              handleBounceEnd(id);
            }, 600);
            return { ...prev, [id]: { x: 0, y: 0 } };
          }
          return prev;
        });
      }
    };

    window.addEventListener('mousemove', handleMove, { passive: false });
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [dragging]);

  // Card positions around the center in 3D space
  const cardPositions = [
    { x: -360, y: -85, z: 40, rotY: 25, rotX: 5, rotZ: -3, width: 240, height: 155, delay: 0 },
    { x: -230, y: 65, z: 80, rotY: 20, rotX: -8, rotZ: 2, width: 230, height: 150, delay: 0.1 },
    { x: -80, y: -130, z: 60, rotY: 10, rotX: 10, rotZ: -1, width: 250, height: 160, delay: 0.2 },
    { x: 80, y: -110, z: 70, rotY: -12, rotX: 8, rotZ: 2, width: 240, height: 155, delay: 0.3 },
    { x: 230, y: 55, z: 90, rotY: -22, rotX: -6, rotZ: -2, width: 235, height: 152, delay: 0.4 },
    { x: 360, y: -65, z: 50, rotY: -28, rotX: 4, rotZ: 3, width: 245, height: 158, delay: 0.5 },
  ];

  const mobilePositions = [
    { x: -120, y: -50, z: 20, rotY: 0, rotX: 0, rotZ: -2, width: 150, height: 100, delay: 0 },
    { x: -50, y: 55, z: 40, rotY: 0, rotX: 0, rotZ: 1, width: 145, height: 97, delay: 0.1 },
    { x: 30, y: -80, z: 30, rotY: 0, rotX: 0, rotZ: -1, width: 155, height: 103, delay: 0.2 },
    { x: 110, y: -60, z: 35, rotY: 0, rotX: 0, rotZ: 1, width: 150, height: 100, delay: 0.3 },
    { x: -80, y: 140, z: 45, rotY: 0, rotX: 0, rotZ: -1, width: 148, height: 98, delay: 0.4 },
    { x: 40, y: 130, z: 25, rotY: 0, rotX: 0, rotZ: 2, width: 152, height: 101, delay: 0.5 },
  ];

  const activePositions = isMobile ? mobilePositions : cardPositions;

  return (
    <>
      <section
        ref={sectionRef}
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '6rem 1rem 2rem' : '8rem 2rem 4rem',
          overflow: 'hidden',
        }}
      >
        {/* Cosmic background — nebula, stars, deep space */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          overflow: 'hidden',
          backgroundColor: '#030308',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 1s ease',
        }}>
        {/* Stars — individually twinkling */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          {stars.map((s) => (
            <div
              key={s.id}
              className="star"
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
                  ? `0 0 ${s.size * 3}px ${s.size}px rgba(255,255,255,0.4), 0 0 ${s.size * 6}px ${s.size * 2}px rgba(200,220,255,0.15)`
                  : `0 0 ${s.size * 2}px ${s.size * 0.5}px rgba(255,255,255,0.3)`,
                opacity: s.opacity,
                animation: `starTwinkle ${s.duration}s ease-in-out ${s.delay}s infinite alternate`,
              }}
            />
          ))}
        </div>

        {/* Meteors */}
        <div className="meteor meteor-1" />
        <div className="meteor meteor-2" />
        <div className="meteor meteor-3" />
        <div className="meteor meteor-4" />
        <div className="meteor meteor-5" />

        {/* Nebula cloud 1 — deep blue/indigo, top-left */}
        <div style={{
          position: 'absolute',
          top: '-15%',
          left: '-10%',
          width: '70%',
          height: '70%',
          background: 'radial-gradient(ellipse at 40% 50%, rgba(30,20,80,0.6) 0%, rgba(15,10,60,0.3) 40%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'nebulaDrift1 40s ease-in-out infinite, nebulaHue1 25s ease-in-out infinite',
        }} />

        {/* Nebula cloud 2 — purple/magenta, center-right */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '-5%',
          width: '60%',
          height: '60%',
          background: 'radial-gradient(ellipse at 60% 40%, rgba(80,20,100,0.4) 0%, rgba(50,10,80,0.2) 45%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'nebulaDrift2 55s ease-in-out infinite, nebulaHue2 30s ease-in-out infinite',
        }} />

        {/* Nebula cloud 3 — cyan/teal accent, bottom-left */}
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          left: '5%',
          width: '55%',
          height: '55%',
          background: 'radial-gradient(ellipse at 50% 60%, rgba(10,60,80,0.35) 0%, rgba(5,30,50,0.15) 45%, transparent 70%)',
          filter: 'blur(70px)',
          animation: 'nebulaDrift3 50s ease-in-out infinite, nebulaHue3 20s ease-in-out infinite',
        }} />

        {/* Nebula cloud 4 — deep violet, top-right */}
        <div style={{
          position: 'absolute',
          top: '-5%',
          right: '15%',
          width: '50%',
          height: '50%',
          background: 'radial-gradient(ellipse at 55% 45%, rgba(60,10,90,0.3) 0%, rgba(30,5,60,0.15) 40%, transparent 65%)',
          filter: 'blur(90px)',
          animation: 'nebulaDrift4 60s ease-in-out infinite, nebulaHue4 35s ease-in-out infinite',
        }} />

        {/* Central glow — pulsing color shift */}
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '35%',
          width: '30%',
          height: '40%',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(100,60,120,0.12) 0%, transparent 60%)',
          filter: 'blur(50px)',
          animation: 'nebulaGlow 8s ease-in-out infinite, nebulaHueCentral 18s ease-in-out infinite',
        }} />

        </div>

      {/* Section content */}
      {/* 3D Scene */}
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '900px',
          height: '480px',
          zIndex: 1,
        }}>
          {/* Central 3D Text — Liquid Glass, Auto-Rotate */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            marginLeft: '-300px',
            marginTop: '-80px',
            width: '600px',
            height: '160px',
            transformStyle: 'preserve-3d',
            animation: 'gardsSpin 8s ease-in-out infinite',
            zIndex: 50,
            pointerEvents: 'none',
          }}>
            <div style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              transformStyle: 'preserve-3d',
              transform: `rotateX(${mousePos.y * -8}deg) rotateY(${mousePos.x * 10}deg)`,
              transition: 'transform 0.15s ease-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}>
              {/* 3D depth — text-shadow layers */}
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: isMobile ? '3rem' : '7.5rem',
                letterSpacing: '-0.05em',
                color: '#ffffff',
                opacity: loaded ? 1 : undefined,
                animation: loaded ? undefined : 'gardsPulse 1.5s ease-in-out infinite',
                textShadow: [
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
                ].join(', '),
                whiteSpace: 'nowrap',
                userSelect: 'none',
              }}>
                Gards
              </div>
            </div>

            {/* Glow behind — white */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '500px',
              height: '180px',
              marginLeft: '-250px',
              marginTop: '-90px',
              background: 'radial-gradient(ellipse, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.04) 50%, transparent 75%)',
              filter: 'blur(50px)',
              pointerEvents: 'none',
              animation: 'glowPulse 4s ease-in-out infinite',
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.8s ease 0.3s',
            }} />

            {/* Floating glass particles */}
            <div style={{
              position: 'absolute', top: '-20px', right: '-30px',
              width: '10px', height: '10px', borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0.3))',
              boxShadow: '0 0 15px rgba(255,255,255,0.5)',
              animation: 'floatParticle 3s ease-in-out infinite',
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.6s ease 0.5s',
            }} />
            <div style={{
              position: 'absolute', bottom: '-25px', left: '-40px',
              width: '8px', height: '8px', borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(255,255,255,0.2))',
              boxShadow: '0 0 12px rgba(255,255,255,0.4)',
              animation: 'floatParticle 4s ease-in-out infinite reverse',
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.6s ease 0.6s',
            }} />
            <div style={{
              position: 'absolute', top: '20px', left: '-50px',
              width: '6px', height: '6px', borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, #ffffff, rgba(255,255,255,0.4))',
              boxShadow: '0 0 10px rgba(255,255,255,0.4)',
              animation: 'floatParticle 3.5s ease-in-out infinite 0.5s',
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.6s ease 0.7s',
            }} />
            <div style={{
              position: 'absolute', top: '-15px', left: '40px',
              width: '5px', height: '5px', borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0.3))',
              boxShadow: '0 0 8px rgba(255,255,255,0.3)',
              animation: 'floatParticle 2.8s ease-in-out infinite 1s',
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.6s ease 0.8s',
            }} />
          </div>

          {/* Loading bar — only visible before loaded */}
          {!loaded && (
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '62%',
              transform: 'translateX(-50%)',
              width: '120px',
              height: '2px',
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '2px',
              overflow: 'hidden',
              zIndex: 60,
            }}>
              <div style={{
                height: '100%',
                background: 'var(--c-accent)',
                borderRadius: '2px',
                animation: 'loadingBarFill 0.8s cubic-bezier(0.25,1,0.5,1) forwards',
              }} />
            </div>
          )}

          {/* Floating UI Cards */}
          {projects.map((project, index) => {
            const pos = activePositions[index];
            const isSelected = selectedCard === project.id;
            const isDraggingCard = dragging === project.id;
            const isBouncing = bouncing[project.id];
            const off = dragOffsets[project.id] || { x: 0, y: 0 };
            const isLeft = pos.x < 0;

            return (
              <div
                key={project.id}
                ref={(el) => { cardRefs.current[project.id] = el; }}
                onMouseDown={(e) => handleDragStart(e, project.id)}
                onTouchStart={(e) => handleDragStart(e, project.id)}
                onClick={() => {
                  if (!didDrag) {
                    setSelectedCard(isSelected ? null : project.id);
                  }
                }}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: `${pos.width}px`,
                  marginLeft: `-${pos.width / 2}px`,
                  marginTop: '-65px',
                  transform: loaded
                    ? `translate3d(${pos.x + off.x + (isMobile ? mousePos.x * 3 : (isLeft ? mousePos.x * 15 : mousePos.x * -15))}px, ${pos.y + off.y + Math.sin(timeRef.current + pos.delay * 5) * 6 + (isMobile ? mousePos.y * 2 : mousePos.y * 5)}px, 0) rotate(${pos.rotZ + mousePos.x * 2}deg) scale(${isDraggingCard ? 1.1 : isSelected ? 1.4 : 1 - pos.z * 0.0005})`
                    : `translate3d(0px, 40px, 0) rotate(0deg) scale(0.8)`,
                  opacity: loaded ? 1 : 0,
                  transition: isBouncing
                    ? 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease'
                    : loaded ? 'opacity 0.6s ease' : 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease',
                  transitionDelay: loaded ? '0s' : `${pos.delay}s`,
                  zIndex: isDraggingCard ? 300 : isSelected ? 200 : 20 + index,
                  cursor: isDraggingCard ? 'grabbing' : 'grab',
                  animationDelay: `${pos.delay}s`,
                  willChange: 'transform',
                  touchAction: 'none',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
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
                  transform: 'translateZ(0)',
                }}>
                  {/* Card header bar */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ff5f57' }} />
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ffbd2e' }} />
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#28c840' }} />
                    <span style={{
                      marginLeft: '8px',
                      fontSize: '0.55rem',
                      color: 'rgba(255,255,255,0.3)',
                      fontWeight: 500,
                    }}>
                      {project.category}
                    </span>
                  </div>

                  {/* Card content — table/dashboard style */}
                  <div style={{ padding: '10px 12px' }}>
                    {/* Row 1 */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 0',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          flexShrink: 0,
                        }}>
                          <img src={project.image} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div>
                          <div style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            color: '#f0ece4',
                            lineHeight: 1.2,
                          }}>
                            {project.title}
                          </div>
                          <div style={{
                            fontSize: '0.5rem',
                            color: 'rgba(255,255,255,0.3)',
                          }}>
                            {project.year}
                          </div>
                        </div>
                      </div>
                      <div style={{
                        fontSize: '0.5rem',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: 'rgba(40,200,64,0.12)',
                        color: '#28c840',
                        fontWeight: 600,
                      }}>
                        Done
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 0',
                    }}>
                      <div style={{
                        fontSize: '0.55rem',
                        color: 'rgba(255,255,255,0.25)',
                      }}>
                        {project.year} — {project.category}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded detail panel on select */}
                {isSelected && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: 'absolute',
                      bottom: '-8px',
                      left: '50%',
                      transform: 'translateX(-50%) translateY(100%)',
                      width: isMobile ? '220px' : '260px',
                      background: 'rgba(18, 18, 28, 0.98)',
                      border: '1px solid rgba(200,255,0,0.2)',
                      borderRadius: '12px',
                      padding: '1rem',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                    }}
                  >
                    <div style={{
                      fontSize: '0.5rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'rgba(200,255,0,0.7)',
                      marginBottom: '0.375rem',
                    }}>
                      {project.category}
                    </div>
                    <div style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      color: '#f0ece4',
                      lineHeight: 1.2,
                      marginBottom: '0.5rem',
                    }}>
                      {project.title}
                    </div>
                    <div style={{
                      fontSize: '0.7rem',
                      lineHeight: 1.5,
                      color: 'rgba(255,255,255,0.5)',
                      marginBottom: '0.75rem',
                    }}>
                      {project.description}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {project.tags.map((tag, i) => (
                        <span key={i} style={{
                          fontSize: '0.45rem',
                          fontWeight: 600,
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                          padding: '0.2rem 0.5rem',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '50px',
                          color: 'rgba(255,255,255,0.5)',
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.dispatchEvent(new CustomEvent('openProject', { detail: { projectId: project.id } }));
                      }}
                      style={{
                        marginTop: '0.75rem',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        padding: '0.5rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(200,255,0,0.3)',
                        background: 'rgba(200,255,0,0.05)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(200,255,0,0.12)'; e.currentTarget.style.borderColor = 'rgba(200,255,0,0.5)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(200,255,0,0.05)'; e.currentTarget.style.borderColor = 'rgba(200,255,0,0.3)'; }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c8ff00" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span style={{ fontSize: '0.6rem', fontWeight: 600, color: '#c8ff00', letterSpacing: '0.05em' }}>
                        View Project
                      </span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Instruction */}
        <div style={{
          textAlign: 'center',
          marginTop: isMobile ? '0.5rem' : '1rem',
          padding: isMobile ? '0 1rem' : undefined,
          color: 'rgba(255,255,255,0.25)',
          fontSize: isMobile ? '0.6rem' : '0.6875rem',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          zIndex: 10,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.6s ease 0.8s',
        }}>
          {selectedCard ? 'Click another card or ✕ to close' : 'Click a card to view details'}
        </div>

        {/* Tagline & Description */}
        <div style={{
          textAlign: 'center',
          maxWidth: '600px',
          marginTop: isMobile ? '1.5rem' : '2.5rem',
          padding: isMobile ? '0 1rem' : undefined,
          zIndex: 10,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.6s ease 1s',
        }}>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
            color: '#ffffff',
            lineHeight: 1.3,
            marginBottom: '1rem',
          }}>
            We Build<br />Creative Experiences.
          </h2>
          <p style={{
            fontSize: 'clamp(0.8rem, 1.2vw, 0.95rem)',
            color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.8,
            maxWidth: '520px',
            margin: '0 auto',
          }}>
            Gards Creative adalah studio kreatif yang membantu bisnis membangun identitas digital melalui brand identity, logo design, photography, videography, dan social media management.
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex',
          gap: isMobile ? '2rem' : '4rem',
          marginTop: isMobile ? '2rem' : '3rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          zIndex: 10,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.6s ease 1.2s',
        }}>
          {[
            { value: '120+', label: 'Projects' },
            { value: '40+', label: 'Clients' },
            { value: '8y', label: 'Running' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: '2rem',
                color: '#f0ece4',
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '0.625rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)',
                marginTop: '0.25rem',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Marquee */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.35)',
        borderBottom: '1px solid rgba(255,255,255,0.35)',
        padding: '1rem 0',
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.02)',
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

        /* Meteors — top-left to bottom-right */
        .meteor {
          position: absolute;
          width: 3px;
          height: 3px;
          background: white;
          border-radius: 50%;
          box-shadow:
            0 0 8px 3px rgba(255,255,255,1),
            0 0 20px 6px rgba(255,255,255,0.6),
            0 0 40px 12px rgba(200,220,255,0.3),
            0 0 60px 20px rgba(180,200,255,0.1);
          opacity: 0;
          pointer-events: none;
          transform: rotate(35deg);
        }

        .meteor::before {
          content: '';
          position: absolute;
          top: 50%;
          right: 50%;
          width: 180px;
          height: 2px;
          transform: translateY(-50%);
          background: linear-gradient(to left,
            rgba(255,255,255,1) 0%,
            rgba(255,255,255,0.8) 15%,
            rgba(200,220,255,0.5) 40%,
            rgba(150,180,255,0.2) 70%,
            transparent 100%);
          border-radius: 100px;
        }

        .meteor::after {
          content: '';
          position: absolute;
          top: 50%;
          right: 50%;
          width: 80px;
          height: 6px;
          transform: translateY(-50%);
          background: linear-gradient(to left,
            rgba(255,255,255,0.3) 0%,
            rgba(200,220,255,0.1) 50%,
            transparent 100%);
          border-radius: 100px;
          filter: blur(2px);
        }

        .meteor-1 {
          top: 5%;
          left: 5%;
          animation: meteorShoot 8s linear infinite 2s;
        }

        .meteor-2 {
          top: 15%;
          left: 25%;
          animation: meteorShoot 11s linear infinite 6s;
        }

        .meteor-3 {
          top: 2%;
          left: 45%;
          animation: meteorShoot 13s linear infinite 10s;
        }

        .meteor-4 {
          top: 20%;
          left: 10%;
          animation: meteorShoot 9s linear infinite 15s;
        }

        .meteor-5 {
          top: 8%;
          left: 35%;
          animation: meteorShoot 12s linear infinite 22s;
        }

        @keyframes meteorShoot {
          0% {
            opacity: 0;
            transform: rotate(35deg) translate(0, 0);
          }
          1% {
            opacity: 0;
            transform: rotate(35deg) translate(0, 0);
          }
          2.5% {
            opacity: 1;
          }
          15% {
            opacity: 0.85;
            transform: rotate(35deg) translate(350px, 245px);
          }
          20% {
            opacity: 0;
            transform: rotate(35deg) translate(440px, 308px);
          }
          100% {
            opacity: 0;
            transform: rotate(35deg) translate(440px, 308px);
          }
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

        @keyframes nebulaHue4 {
          0%, 100% { filter: blur(90px) hue-rotate(0deg) brightness(1); }
          40% { filter: blur(95px) hue-rotate(35deg) brightness(1.1); }
          70% { filter: blur(85px) hue-rotate(-25deg) brightness(0.9); }
        }

        @keyframes nebulaHueCentral {
          0%, 100% { filter: blur(50px) hue-rotate(0deg) brightness(1); }
          25% { filter: blur(55px) hue-rotate(60deg) brightness(1.3); }
          50% { filter: blur(48px) hue-rotate(-40deg) brightness(0.8); }
          75% { filter: blur(52px) hue-rotate(20deg) brightness(1.2); }
        }

        @keyframes gardsSpin {
          0% { transform: rotateY(0deg) rotateX(0deg); }
          25% { transform: rotateY(15deg) rotateX(5deg); }
          50% { transform: rotateY(0deg) rotateX(0deg); }
          75% { transform: rotateY(-15deg) rotateX(-5deg); }
          100% { transform: rotateY(0deg) rotateX(0deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
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
