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
                <a href="mailto:hello@gards.studio" style={{ color: 'var(--c-text)', fontSize: '1.125rem', textDecoration: 'none' }}>
                  hello@gards.studio
                </a>
              </div>
              <div>
                <span className="form-label">Phone</span>
                <span style={{ color: 'var(--c-text)', fontSize: '1.125rem' }}>+62 812 3456 7890</span>
              </div>
              <div>
                <span className="form-label">Location</span>
                <span style={{ color: 'var(--c-text)', fontSize: '1.125rem' }}>Jakarta, Indonesia</span>
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
