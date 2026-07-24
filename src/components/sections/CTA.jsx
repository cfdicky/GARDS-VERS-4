import { useState } from 'react';

export default function CTA() {
  const [selectedService, setSelectedService] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const services = ['Photography', 'Videography', 'Logo', 'Branding', 'Social'];

  return (
    <section id="contact" className="section" style={{ background: 'var(--c-bg)' }}>
      <div className="container-main">
        <div className="contact-grid">
          <div>
            <span style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--c-text-muted)', display: 'block', marginBottom: '1rem' }}>
              Get In Touch
            </span>
            <h2 className="section-title" style={{ marginBottom: '2rem' }}>
              Got a project<br />in mind?<br />
              <span className="accent">Let's talk.</span>
            </h2>
            <p style={{ color: 'var(--c-text-dim)', fontSize: '1.125rem', marginBottom: '3rem', lineHeight: 1.7 }}>
              Drop us a line. We'll get back to you within 24 hours.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <span className="form-label">Email</span>
                <a href="mailto:gardscreatif@gmail.com" style={{ color: 'var(--c-text)', fontSize: '1.125rem', textDecoration: 'none' }}>
                  gardscreatif@gmail.com
                </a>
              </div>
              <div>
                <span className="form-label">WhatsApp</span>
                <a href="https://wa.me/6285710720912" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--c-text)', fontSize: '1.125rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  +62 857-1072-0912
                </a>
              </div>
              <div>
                <span className="form-label">Instagram</span>
                <a href="https://www.instagram.com/gards.creative" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--c-text)', fontSize: '1.125rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  @gards.creative
                </a>
              </div>
            </div>
          </div>

          <div>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input type="text" className="form-input" placeholder="Jane Doe"
                  value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" placeholder="jane@company.com"
                  value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">What do you need?</label>
                <div className="service-options">
                  {services.map((s) => (
                    <button key={s} type="button"
                      className={`service-option ${selectedService === s ? 'selected' : ''}`}
                      onClick={() => setSelectedService(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Tell us about it</label>
                <textarea className="form-input form-textarea" rows={4} placeholder="Brief description..."
                  value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
              </div>
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
