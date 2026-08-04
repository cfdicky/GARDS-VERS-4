import { useState } from 'react';
import { testimonials } from '../../tokens/design-system';

export default function Testimonials() {
  const [active, setActive] = useState(0);

  return (
    <section id="testimonials" className="section" style={{ background: 'var(--c-bg)' }}>
      <div className="container-main">
        <div className="section-header">
          <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--c-text-muted)' }}>
            Kind Words
          </span>
          <h2 className="section-title">
            People we've<br />
            <span className="dim">worked with.</span>
          </h2>
        </div>

        <div className="testimonial-layout">
          <div className="testimonial-nav">
            {testimonials.map((t, index) => (
              <button
                key={t.id}
                className={`testimonial-btn ${active === index ? 'active' : ''}`}
                onClick={() => setActive(index)}
              >
                <div className="testimonial-author-name">{t.name}</div>
                <div className="testimonial-author-role">{t.role}</div>
              </button>
            ))}
          </div>

          <div className="testimonial-quote-area">
            <blockquote className="testimonial-quote">
              {testimonials[active].quote}
            </blockquote>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'var(--c-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: '1.125rem',
                color: 'var(--c-bg)',
              }}>
                {testimonials[active].name.charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--c-text)' }}>
                  {testimonials[active].name}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--c-text-muted)' }}>
                  {testimonials[active].role}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '2rem' }}>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  style={{
                    height: '3px',
                    width: active === i ? '2rem' : '0.75rem',
                    background: active === i ? 'var(--c-accent)' : 'var(--c-border)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    borderRadius: '2px',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
