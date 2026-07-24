import { useState, useEffect, useRef } from 'react';

function Reveal({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(40px)',
      transition: `opacity 0.7s cubic-bezier(0.25,1,0.5,1) ${delay}s, transform 0.7s cubic-bezier(0.25,1,0.5,1) ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}



const timeline = [
  { year: '2016', title: 'The Beginning', desc: 'Gards Creative was founded from a simple belief: creativity should solve problems, not just decorate them.' },
  { year: '2018', title: 'Growing Together', desc: 'We expanded our services to include videography, brand strategy, and social media management.' },
  { year: '2021', title: 'Digital Innovation', desc: 'Embracing new technologies, we began offering full digital experience design and web development.' },
  { year: '2024', title: 'Trusted Partner', desc: 'Today, we continue to grow alongside our clients, turning ambitious ideas into memorable brand experiences.' },
];

const missions = [
  'Deliver creative solutions that create measurable business impact.',
  'Build authentic brands with strong visual identities.',
  'Create digital experiences that connect people with businesses.',
  'Continuously innovate by embracing new technologies and creative trends.',
  'Build long-term partnerships based on trust, collaboration, and excellence.',
];

const values = [
  { icon: '\u{1F4A1}', title: 'Innovation', desc: 'We constantly challenge ourselves to explore new ideas, technologies, and creative possibilities.' },
  { icon: '\u{1F91D}', title: 'Integrity', desc: 'Honesty, transparency, and professionalism define every relationship we build.' },
  { icon: '\u{1F465}', title: 'Collaboration', desc: 'Great ideas emerge through teamwork, open communication, and mutual trust.' },
  { icon: '\u2B50', title: 'Excellence', desc: 'Every detail matters because excellence is found in consistency, craftsmanship, and passion.' },
];

const differentiators = [
  { title: 'Creative Thinking', desc: 'Every project starts with strategy before design.' },
  { title: 'Visual Excellence', desc: 'Premium photography, videography, and branding that elevate your business.' },
  { title: 'Business-Oriented', desc: 'Every design decision supports your business goals.' },
  { title: 'Long-Term Partnership', desc: 'We become an extension of your team, not just another vendor.' },
];

const approach = [
  { num: '01', title: 'Discover', desc: 'Understanding your business, audience, and goals.' },
  { num: '02', title: 'Strategy', desc: 'Developing creative direction and brand positioning.' },
  { num: '03', title: 'Create', desc: 'Designing memorable visual experiences.' },
  { num: '04', title: 'Launch', desc: 'Delivering high-quality creative solutions with measurable impact.' },
];

function Label({ text }) {
  return (
    <span style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--c-accent)' }}>
      {text}
    </span>
  );
}

function Title({ children }) {
  return (
    <h2 style={{
      fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
      fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.1,
      letterSpacing: '-0.03em', color: 'var(--c-text)', marginTop: '0.75rem',
    }}>
      {children}
    </h2>
  );
}

const hoverCard = {
  onEnter: (e) => {
    e.currentTarget.style.borderColor = 'rgba(200,255,0,0.25)';
    e.currentTarget.style.transform = 'translateY(-4px)';
    e.currentTarget.style.boxShadow = '0 12px 40px rgba(200,255,0,0.05)';
  },
  onLeave: (e) => {
    e.currentTarget.style.borderColor = 'var(--c-border)';
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = 'none';
  },
};

export default function About() {
  const [activeTimeline, setActiveTimeline] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTimeline((prev) => (prev + 1) % timeline.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* ===== WHO WE ARE ===== */}
      <section id="about" className="section" style={{ background: 'var(--c-bg)' }}>
        <div className="container-main">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <Reveal>
              <Label text="Who We Are" />
              <Title>A multidisciplinary creative studio.</Title>
            </Reveal>
            <Reveal delay={0.1}>
              <p style={{ fontSize: 'clamp(1rem, 1.3vw, 1.125rem)', lineHeight: 1.8, color: 'var(--c-text-dim)', marginTop: '2rem' }}>
                Gards Creative Agency is a multidisciplinary creative studio dedicated to helping businesses build impactful brands through creativity, strategy, and technology.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p style={{ fontSize: 'clamp(1rem, 1.3vw, 1.125rem)', lineHeight: 1.8, color: 'var(--c-text-dim)', marginTop: '1.25rem' }}>
                We collaborate with startups, local businesses, corporate companies, and personal brands to create visual identities, digital experiences, and marketing strategies that leave lasting impressions.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <p style={{ fontSize: 'clamp(1rem, 1.3vw, 1.125rem)', lineHeight: 1.8, color: 'var(--c-text-dim)', marginTop: '1.25rem' }}>
                Our approach combines design thinking, storytelling, photography, videography, and digital innovation to create work that is not only visually beautiful but also strategically effective.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== OUR STORY ===== */}
      <section className="section" style={{ background: 'var(--c-bg-alt)', borderTop: '1px solid var(--c-border)', borderBottom: '1px solid var(--c-border)' }}>
        <div className="container-main">
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <Reveal>
              <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <Label text="Our Story" />
                <Title>Our Journey</Title>
              </div>
            </Reveal>

            <div className="about-timeline-wrap" style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px',
                background: 'linear-gradient(to bottom, transparent, var(--c-border) 10%, var(--c-border) 90%, transparent)',
                transform: 'translateX(-50%)',
              }} />

              {timeline.map((item, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <Reveal key={i} delay={i * 0.1}>
                    <div className="about-tl-item" style={{
                      display: 'flex',
                      justifyContent: isLeft ? 'flex-end' : 'flex-start',
                      paddingLeft: isLeft ? 0 : '52%',
                      paddingRight: isLeft ? '52%' : 0,
                      marginBottom: '3rem',
                      position: 'relative',
                    }}>
                      <div style={{
                        position: 'absolute', left: '50%', top: '0.5rem',
                        width: '12px', height: '12px', borderRadius: '50%',
                        background: i === activeTimeline ? 'var(--c-accent)' : 'var(--c-surface)',
                        border: '2px solid var(--c-accent)',
                        transform: 'translateX(-50%)',
                        transition: 'all 0.3s ease', zIndex: 2,
                      }} />
                      <div style={{
                        padding: '1.5rem', borderRadius: '12px',
                        border: '1px solid var(--c-border)', background: 'var(--c-surface)',
                        maxWidth: '380px', width: '100%',
                        textAlign: isLeft ? 'right' : 'left',
                        transition: 'all 0.3s ease',
                        borderColor: i === activeTimeline ? 'rgba(200,255,0,0.2)' : 'var(--c-border)',
                      }}>
                        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.875rem', color: 'var(--c-accent)', marginBottom: '0.375rem' }}>
                          {item.year}
                        </div>
                        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.125rem', color: 'var(--c-text)', marginBottom: '0.5rem' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--c-text-dim)', lineHeight: 1.6 }}>
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== VISION ===== */}
      <section className="section" style={{ background: 'var(--c-bg)' }}>
        <div className="container-main">
          <div style={{
            maxWidth: '800px', margin: '0 auto', textAlign: 'center',
            padding: '4rem 2rem', borderRadius: '20px',
            border: '1px solid var(--c-border)',
            background: 'linear-gradient(135deg, rgba(200,255,0,0.02) 0%, rgba(14,14,24,0.5) 50%, rgba(200,255,0,0.02) 100%)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(ellipse at 50% 50%, rgba(200,255,0,0.03) 0%, transparent 60%)', pointerEvents: 'none' }} />
            <Reveal>
              <Label text="Vision" />
              <Title>Our Vision</Title>
              <p style={{ fontSize: 'clamp(1.1rem, 1.5vw, 1.25rem)', lineHeight: 1.8, color: 'var(--c-text-dim)', marginTop: '1.5rem', position: 'relative' }}>
                To become one of Indonesia's most trusted creative agencies by delivering meaningful branding, innovative digital experiences, and world-class visual storytelling that empower businesses to grow confidently in the digital era.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== MISSION ===== */}
      <section className="section" style={{ background: 'var(--c-bg-alt)', borderTop: '1px solid var(--c-border)', borderBottom: '1px solid var(--c-border)' }}>
        <div className="container-main">
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <Reveal>
              <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                <Label text="Mission" />
                <Title>Our Mission</Title>
              </div>
            </Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {missions.map((m, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div style={{
                    padding: '1.75rem', borderRadius: '14px',
                    border: '1px solid var(--c-border)', background: 'var(--c-surface)',
                    transition: 'all 0.35s cubic-bezier(0.25,1,0.5,1)',
                  }}
                    onMouseEnter={hoverCard.onEnter} onMouseLeave={hoverCard.onLeave}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: 'rgba(200,255,0,0.08)', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                        fontSize: '0.8rem', color: 'var(--c-accent)',
                      }}>
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <div style={{ fontSize: '0.9375rem', color: 'var(--c-text-dim)', lineHeight: 1.6 }}>
                        {m}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== VALUES ===== */}
      <section className="section" style={{ background: 'var(--c-bg)' }}>
        <div className="container-main">
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <Reveal>
              <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                <Label text="Our Values" />
                <Title>Our Core Values</Title>
              </div>
            </Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              {values.map((v, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div style={{
                    padding: '2rem', borderRadius: '14px',
                    border: '1px solid var(--c-border)', background: 'var(--c-surface)',
                    textAlign: 'center', transition: 'all 0.35s cubic-bezier(0.25,1,0.5,1)',
                  }}
                    onMouseEnter={hoverCard.onEnter} onMouseLeave={hoverCard.onLeave}
                  >
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{v.icon}</div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.125rem', color: 'var(--c-text)', marginBottom: '0.75rem' }}>
                      {v.title}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--c-text-dim)', lineHeight: 1.6 }}>
                      {v.desc}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHAT MAKES US DIFFERENT ===== */}
      <section className="section" style={{ background: 'var(--c-bg-alt)', borderTop: '1px solid var(--c-border)', borderBottom: '1px solid var(--c-border)' }}>
        <div className="container-main">
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <Reveal>
              <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                <Label text="What Makes Us Different" />
                <Title>Why Gards Creative</Title>
              </div>
            </Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              {differentiators.map((d, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div style={{
                    padding: '2rem', borderRadius: '14px',
                    border: '1px solid var(--c-border)', background: 'var(--c-surface)',
                    transition: 'all 0.35s cubic-bezier(0.25,1,0.5,1)',
                    position: 'relative', overflow: 'hidden',
                  }}
                    onMouseEnter={hoverCard.onEnter} onMouseLeave={hoverCard.onLeave}
                  >
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, var(--c-accent), transparent)', opacity: 0.3 }} />
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.75rem', color: 'var(--c-accent)', marginBottom: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.125rem', color: 'var(--c-text)', marginBottom: '0.5rem' }}>
                      {d.title}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--c-text-dim)', lineHeight: 1.6 }}>
                      {d.desc}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== OUR APPROACH ===== */}
      <section className="section" style={{ background: 'var(--c-bg)' }}>
        <div className="container-main">
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <Reveal>
              <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <Label text="Our Approach" />
                <Title>How we work</Title>
              </div>
            </Reveal>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '32px', left: '10%', right: '10%', height: '2px', background: 'linear-gradient(90deg, var(--c-border), rgba(200,255,0,0.2), var(--c-border))' }} />
              <div className="about-approach-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', position: 'relative' }}>
                {approach.map((a, i) => (
                  <Reveal key={i} delay={i * 0.12}>
                    <div style={{ textAlign: 'center', position: 'relative' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'var(--c-accent)', margin: '24px auto 1.5rem', boxShadow: '0 0 20px rgba(200,255,0,0.3)', position: 'relative', zIndex: 2 }} />
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '2rem', color: 'rgba(200,255,0,0.15)', marginBottom: '0.5rem' }}>{a.num}</div>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.125rem', color: 'var(--c-text)', marginBottom: '0.5rem' }}>{a.title}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--c-text-dim)', lineHeight: 1.6 }}>{a.desc}</div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile styles */}
      <style>{`
        @media (max-width: 768px) {
          .about-timeline-wrap > div:first-child { left: 16px !important; transform: none !important; }
          .about-tl-item {
            justify-content: flex-start !important;
            padding-left: 40px !important;
            padding-right: 0 !important;
          }
          .about-tl-item > div:first-child { left: 16px !important; transform: none !important; }
          .about-approach-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .about-approach-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
