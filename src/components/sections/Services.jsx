import { Camera, Video, PenTool, Palette, Share2 } from 'lucide-react';
import { services } from '../../tokens/design-system';
import { ServiceCarousel } from '../ui/ServiceCarousel';

const serviceIcons = {
  photography: Camera,
  videography: Video,
  logo: PenTool,
  branding: Palette,
  social: Share2,
};

const serviceGradients = {
  photography: 'from-purple-950/90 via-purple-900/40 to-transparent',
  videography: 'from-blue-950/90 via-blue-900/40 to-transparent',
  logo: 'from-amber-950/90 via-amber-900/40 to-transparent',
  branding: 'from-lime-950/90 via-lime-900/40 to-transparent',
  social: 'from-rose-950/90 via-rose-900/40 to-transparent',
};

export default function Services() {
  const carouselServices = services.map((service) => ({
    number: service.number,
    title: service.title,
    description: service.description,
    icon: serviceIcons[service.id] || Palette,
    gradient: serviceGradients[service.id] || serviceGradients.branding,
  }));

  return (
    <section id="services" className="section" style={{ background: 'var(--c-bg)' }}>
      <div className="container-main">
        <div className="section-header">
          <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--c-text-muted)' }}>
            What We Do
          </span>
          <h2 className="section-title">
            Five services.<br />
            <span className="dim">One goal: your brand.</span>
          </h2>
        </div>

        <ServiceCarousel services={carouselServices} />
      </div>
    </section>
  );
}
