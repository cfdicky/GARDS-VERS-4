import { useState } from 'react';
import { Mail, Phone, AtSign } from 'lucide-react';
import ContactCard from '../ui/ContactCard';

export default function CTA() {
  const [selectedService, setSelectedService] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const services = ['Photography', 'Videography', 'Logo', 'Branding', 'Social'];

  return (
    <section id="contact" className="section" style={{ background: 'var(--c-bg)' }}>
      <div className="container-main">
        <div className="section-header">
          <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--c-text-muted)' }}>
            Get In Touch
          </span>
          <h2 className="section-title">
            Got a project<br />in mind?<br />
            <span className="accent">Let's talk.</span>
          </h2>
        </div>

        <ContactCard
          title="Contact With Us"
          description="If you have any questions regarding our Services or need help, please fill out the form here. We do our best to respond within 1 business day."
          contactInfo={[
            {
              icon: Mail,
              label: 'Email',
              value: 'gardscreatif@gmail.com',
              href: 'mailto:gardscreatif@gmail.com',
              className: 'lg:col-span-2',
            },
            {
              icon: Phone,
              label: 'WhatsApp',
              value: '+62 857-1072-0912',
              href: 'https://wa.me/6285710720912',
            },
            {
              icon: AtSign,
              label: 'Instagram',
              value: '@gards.creative',
              href: 'https://www.instagram.com/gards.creative',
            },
          ]}
        >
          <form onSubmit={(e) => e.preventDefault()} className="w-full space-y-4">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ color: 'var(--c-text)', fontSize: '0.9375rem' }}>Your Name</label>
              <input type="text" className="form-input" placeholder="Jane Doe"
                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ color: 'var(--c-text)', fontSize: '0.9375rem' }}>Email</label>
              <input type="email" className="form-input" placeholder="jane@company.com"
                value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ color: 'var(--c-text)', fontSize: '0.9375rem' }}>What do you need?</label>
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
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ color: 'var(--c-text)', fontSize: '0.9375rem' }}>Tell us about it</label>
              <textarea className="form-input form-textarea" rows={4} placeholder="Brief description..."
                value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
            </div>
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </ContactCard>
      </div>
    </section>
  );
}
