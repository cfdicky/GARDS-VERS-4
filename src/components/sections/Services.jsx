import { useState } from 'react';
import { services } from '../../tokens/design-system';

export default function Services() {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <section id="services" className="section" style={{ background: 'var(--c-bg)' }}>
      <div className="container-main">
        <div className="section-header">
          <span style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--c-text-muted)' }}>
            What We Do
          </span>
          <h2 className="section-title">
            Five services.<br />
            <span className="dim">One goal: your brand.</span>
          </h2>
        </div>

        <div>
          {services.map((service) => (
            <div
              key={service.id}
              className={`service-row ${expandedId === service.id ? 'expanded' : ''}`}
              onClick={() => setExpandedId(expandedId === service.id ? null : service.id)}
            >
              <span className="service-num">{service.number}</span>
              <h3 className="service-name">{service.title}</h3>
              <div className="service-tags">
                {service.capabilities.map((cap) => (
                  <span key={cap} className="service-tag">{cap}</span>
                ))}
              </div>
              <div className="service-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
              <div className="service-desc">
                {service.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
