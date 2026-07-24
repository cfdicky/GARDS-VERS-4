import { useState, useEffect } from 'react';
import { useReveal, useCountUp } from '../../lib/hooks';

function Reveal({ children, delay = 0, className = '', style = {} }) {
  const [ref, visible] = useReveal(0.1);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.7s cubic-bezier(0.25,1,0.5,1) ${delay}s, transform 0.7s cubic-bezier(0.25,1,0.5,1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ text }) {
  return (
    <span style={{
      fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.12em',
      textTransform: 'uppercase', color: 'var(--c-accent)',
    }}>
      {text}
    </span>
  );
}

function SectionTitle({ children }) {
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

function StatCard({ number, label, suffix = '' }) {
  const [ref, count] = useCountUp(parseInt(number), 2000, true);
  return (
    <div ref={ref} style={{
      textAlign: 'center', padding: '2.5rem 1.5rem',
      border: '1px solid var(--c-border)', borderRadius: '16px',
      background: 'rgba(14,14,24,0.5)',
      transition: 'all 0.3s ease',
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(200,255,0,0.2)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--c-border)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
        fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--c-accent)',
        lineHeight: 1,
      }}>
        {number > 99 ? `${Math.floor(count / 10)}0` : count}{suffix}
      </div>
      <div style={{
        fontSize: '0.875rem', color: 'var(--c-text-dim)',
        marginTop: '0.5rem', fontWeight: 500,
      }}>
        {label}
      </div>
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
  { icon: '💡', title: 'Innovation', desc: 'We constantly challenge ourselves to explore new ideas, technologies, and creative possibilities.' },
  { icon: '🤝', title: 'Integrity', desc: 'Honesty, transparency, and professionalism define every relationship we build.' },
  { icon: '👥', title: 'Collaboration', desc: 'Great ideas emerge through teamwork, open communication, and mutual trust.' },
  { icon: '⭐', title: 'Excellence', desc: 'Every detail matters because excellence is found in consistency, craftsmanship, and passion.' },
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

const stats = [
  { value: '50', suffix: '+', label: 'Projects Completed' },
  { value: '25', suffix: '+', label: 'Happy Clients' },
  { value: '5', suffix: '+', label: 'Creative Services' },
  { value: '100', suffix: '%', label: 'Commitment to Quality' },
];

export default function About() {
  const [activeTimeline, setActiveTimeline] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTimeline((prev) => (prev + 1) % timeline.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ paddingTop: '6rem' }}>
      {/* ============ WHO WE ARE ============ */}
      <section className="section" style={{ paddingBottom: '4rem' }}>
        <div className="container-main">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <Reveal>
              <SectionLabel text="Who We Are" />
              <SectionTitle>A multidisciplinary creative studio.</SectionTitle>
            </Reveal>
            <Reveal delay={0.15}>
              <p style={{
                fontSize: 'clamp(1rem, 1.3vw, 1.125rem)', lineHeight: 1.8,
                color: 'var(--c-text-dim)', marginTop: '2rem',
              }}>
                Gards Creative Agency is a multidisciplinary creative studio dedicated to helping businesses build impactful brands through creativity, strategy, and technology.
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <p style={{
                fontSize: 'clamp(1rem, 1.3vw, 1.125rem)', lineHeight: 1.8,
                color: 'var(--c-text-dim)', marginTop: '1.25rem',
              }}>
                We collaborate with startups, local businesses, corporate companies, and personal brands to create visual identities, digital experiences, and marketing strategies that leave lasting impressions.
              </p>
            </Reveal>
            <Reveal delay={0.35}>
              <p style={{
                fontSize: 'clamp(1rem, 1.3vw, 1.125rem)', lineHeight: 1.8,
                color: 'var(--c-text-dim)', marginTop: '1.25rem',
              }}>
                Our approach combines design thinking, storytelling, photography, videography, and digital innovation to create work that is not only visually beautiful but also strategically effective.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ OUR STORY / TIMELINE ============ */}
      <section className="section" style={{ background: 'var(--c-bg-alt)', borderTop: '1px solid var(--c-border)', borderBottom: '1px solid var(--c-border)' }}>
        <div className="container-main">
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <Reveal>
              <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <SectionLabel text="Our Story" />
                <SectionTitle>Our Journey</SectionTitle>
              </div>
            </Reveal>

            {/* Editorial Timeline */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px',
                background: 'linear-gradient(to bottom, transparent, var(--c-border) 10%, var(--c-border) 90%, transparent)',
                transform: 'translateX(-50%)',
              }} />

              {/* Mobile: left line */}
              <div className="about-mobile-line" style={{
                position: 'absolute', left: '16px', top: 0, bottom: 0, width: '1px',
                background: 'linear-gradient(to bottom, transparent, var(--c-border) 10%, var(--c-border) 90%, transparent)',
                display: 'none',
              }} />

              {timeline.map((item, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <Reveal key={i} delay={i * 0.1}>
                    <div
                      className="about-timeline-item"
                      style={{
                        display: 'flex',
                        justifyContent: isLeft ? 'flex-end' : 'flex-start',
                        paddingLeft: isLeft ? 0 : '52%',
                        paddingRight: isLeft ? '52%' : 0,
                        marginBottom: '3rem',
                        position: 'relative',
                      }}
                    >
                      {/* Dot on timeline */}
                      <div className="about-timeline-dot" style={{
                        position: 'absolute', left: '50%', top: '0.5rem',
                        width: '12px', height: '12px', borderRadius: '50%',
                        background: i === activeTimeline ? 'var(--c-accent)' : 'var(--c-surface)',
                        border: '2px solid var(--c-accent)',
                        transform: 'translateX(-50%)',
                        transition: 'all 0.3s ease',
                        zIndex: 2,
                      }} />
                      <div style={{
                        padding: '1.5rem',
                        borderRadius: '12px',
                        border: '1px solid var(--c-border)',
                        background: 'var(--c-surface)',
                        maxWidth: '380px',
                        width: '100%',
                        textAlign: isLeft ? 'right' : 'left',
                        transition: 'all 0.3s ease',
                        borderColor: i === activeTimeline ? 'rgba(200,255,0,0.2)' : 'var(--c-border)',
                      }}>
                        <div style={{
                          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                          fontSize: '0.875rem', color: 'var(--c-accent)',
                          marginBottom: '0.375rem',
                        }}>
                          {item.year}
                        </div>
                        <div style={{
                          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                          fontSize: '1.125rem', color: 'var(--c-text)',
                          marginBottom: '0.5rem',
                        }}>
                          {item.title}
                        </div>
                        <div style={{
                          fontSize: '0.875rem', color: 'var(--c-text-dim)', lineHeight: 1.6,
                        }}>
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

      {/* ============ VISION ============ */}
      <section className="section">
        <div className="container-main">
          <div style={{
            maxWidth: '800px', margin: '0 auto', textAlign: 'center',
            padding: '4rem 2rem',
            borderRadius: '20px',
            border: '1px solid var(--c-border)',
            background: 'linear-gradient(135deg, rgba(200,255,0,0.02) 0%, rgba(14,14,24,0.5) 50%, rgba(200,255,0,0.02) 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
              background: 'radial-gradient(ellipse at 50% 50%, rgba(200,255,0,0.03) 0%, transparent 60%)',
              pointerEvents: 'none',
            }} />
            <Reveal>
              <SectionLabel text="Vision" />
              <SectionTitle>Our Vision</SectionTitle>
              <p style={{
                fontSize: 'clamp(1.1rem, 1.5vw, 1.25rem)', lineHeight: 1.8,
                color: 'var(--c-text-dim)', marginTop: '1.5rem',
                position: 'relative',
              }}>
                To become one of Indonesia's most trusted creative agencies by delivering meaningful branding, innovative digital experiences, and world-class visual storytelling that empower businesses to grow confidently in the digital era.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ MISSION ============ */}
      <section className="section" style={{ background: 'var(--c-bg-alt)', borderTop: '1px solid var(--c-border)', borderBottom: '1px solid var(--c-border)' }}>
        <div className="container-main">
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <Reveal>
              <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                <SectionLabel text="Mission" />
                <SectionTitle>Our Mission</SectionTitle>
              </div>
            </Reveal>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem',
            }}>
              {missions.map((m, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div style={{
                    padding: '1.75rem', borderRadius: '14px',
                    border: '1px solid var(--c-border)',
                    background: 'var(--c-surface)',
                    cursor: 'default',
                    transition: 'all 0.35s cubic-bezier(0.25,1,0.5,1)',
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(200,255,0,0.25)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(200,255,0,0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--c-border)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{
                      display: 'flex', alignItems: 'flex-start', gap: '1rem',
                    }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: 'rgba(200,255,0,0.08)', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                        fontSize: '0.8rem', color: 'var(--c-accent)',
                      }}>
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <div style={{
                        fontSize: '0.9375rem', color: 'var(--c-text-dim)', lineHeight: 1.6,
                      }}>
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

      {/* ============ VALUES ============ */}
      <section className="section">
        <div className="container-main">
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <Reveal>
              <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                <SectionLabel text="Our Values" />
                <SectionTitle>Our Core Values</SectionTitle>
              </div>
            </Reveal>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.25rem',
            }}>
              {values.map((v, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div style={{
                    padding: '2rem', borderRadius: '14px',
                    border: '1px solid var(--c-border)',
                    background: 'var(--c-surface)',
                    textAlign: 'center',
                    transition: 'all 0.35s cubic-bezier(0.25,1,0.5,1)',
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(200,255,0,0.25)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(200,255,0,0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--c-border)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{v.icon}</div>
                    <div style={{
                      fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                      fontSize: '1.125rem', color: 'var(--c-text)', marginBottom: '0.75rem',
                    }}>
                      {v.title}
                    </div>
                    <div style={{
                      fontSize: '0.875rem', color: 'var(--c-text-dim)', lineHeight: 1.6,
                    }}>
                      {v.desc}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ WHAT MAKES US DIFFERENT ============ */}
      <section className="section" style={{ background: 'var(--c-bg-alt)', borderTop: '1px solid var(--c-border)', borderBottom: '1px solid var(--c-border)' }}>
        <div className="container-main">
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <Reveal>
              <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                <SectionLabel text="What Makes Us Different" />
                <SectionTitle>Why Gards Creative</SectionTitle>
              </div>
            </Reveal>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.25rem',
            }}>
              {differentiators.map((d, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div style={{
                    padding: '2rem', borderRadius: '14px',
                    border: '1px solid var(--c-border)',
                    background: 'var(--c-surface)',
                    transition: 'all 0.35s cubic-bezier(0.25,1,0.5,1)',
                    position: 'relative', overflow: 'hidden',
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(200,255,0,0.25)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--c-border)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                      background: 'linear-gradient(90deg, transparent, var(--c-accent), transparent)',
                      opacity: 0.3,
                    }} />
                    <div style={{
                      fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                      fontSize: '0.75rem', color: 'var(--c-accent)', marginBottom: '0.75rem',
                      letterSpacing: '0.05em', textTransform: 'uppercase',
                    }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div style={{
                      fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                      fontSize: '1.125rem', color: 'var(--c-text)', marginBottom: '0.5rem',
                    }}>
                      {d.title}
                    </div>
                    <div style={{
                      fontSize: '0.875rem', color: 'var(--c-text-dim)', lineHeight: 1.6,
                    }}>
                      {d.desc}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ OUR APPROACH ============ */}
      <section className="section">
        <div className="container-main">
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <Reveal>
              <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <SectionLabel text="Our Approach" />
                <SectionTitle>How we work</SectionTitle>
              </div>
            </Reveal>

            {/* Horizontal Process Timeline */}
            <div style={{ position: 'relative' }}>
              {/* Line */}
              <div style={{
                position: 'absolute', top: '32px', left: '10%', right: '10%', height: '2px',
                background: 'linear-gradient(90deg, var(--c-border), rgba(200,255,0,0.2), var(--c-border))',
              }} />

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1.5rem',
                position: 'relative',
              }}>
                {approach.map((a, i) => (
                  <Reveal key={i} delay={i * 0.12}>
                    <div style={{ textAlign: 'center', position: 'relative' }}>
                      {/* Dot */}
                      <div style={{
                        width: '16px', height: '16px', borderRadius: '50%',
                        background: 'var(--c-accent)', margin: '24px auto 1.5rem',
                        boxShadow: '0 0 20px rgba(200,255,0,0.3)',
                        position: 'relative', zIndex: 2,
                      }} />
                      <div style={{
                        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                        fontSize: '2rem', color: 'rgba(200,255,0,0.15)',
                        marginBottom: '0.5rem',
                      }}>
                        {a.num}
                      </div>
                      <div style={{
                        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                        fontSize: '1.125rem', color: 'var(--c-text)', marginBottom: '0.5rem',
                      }}>
                        {a.title}
                      </div>
                      <div style={{
                        fontSize: '0.875rem', color: 'var(--c-text-dim)', lineHeight: 1.6,
                      }}>
                        {a.desc}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATISTICS ============ */}
      <section className="section" style={{ background: 'var(--c-bg-alt)', borderTop: '1px solid var(--c-border)', borderBottom: '1px solid var(--c-border)' }}>
        <div className="container-main">
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <Reveal>
              <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                <SectionLabel text="Company Statistics" />
                <SectionTitle>Numbers speak for themselves</SectionTitle>
              </div>
            </Reveal>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.25rem',
            }}>
              {stats.map((s, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <StatCard number={s.value} suffix={s.suffix} label={s.label} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ CLOSING CTA ============ */}
      <section className="section">
        <div className="container-main">
          <div style={{
            maxWidth: '900px', margin: '0 auto', textAlign: 'center',
            padding: '5rem 2rem',
          }}>
            <Reveal>
              <h2 style={{
                fontFamily: "'Playfair Display', serif", fontWeight: 600,
                fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.2,
                color: 'var(--c-text)', marginBottom: '2rem',
              }}>
                Every Brand Has a Story.<br />
                <span style={{ color: 'var(--c-accent)' }}>Let's Tell Yours Beautifully.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p style={{
                fontSize: 'clamp(1rem, 1.3vw, 1.125rem)', lineHeight: 1.8,
                color: 'var(--c-text-dim)', maxWidth: '600px', margin: '0 auto 2.5rem',
              }}>
                Whether you're building a new brand or transforming an existing one, Gards Creative Agency is ready to help you create meaningful experiences that inspire, engage, and grow your business.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <a
                href="#contact"
                className="nav-cta"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.875rem 2.5rem', fontSize: '0.8125rem',
                }}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Let's Work Together
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mobile timeline override */}
      <style>{`
        @media (max-width: 768px) {
          .about-timeline-line { display: none !important; }
          .about-mobile-line { display: block !important; }
          .about-timeline-item {
            justify-content: flex-start !important;
            padding-left: 40px !important;
            padding-right: 0 !important;
          }
          .about-timeline-dot {
            left: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}
