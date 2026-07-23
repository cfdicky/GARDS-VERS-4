import { useState, useEffect } from 'react';
import { projects } from '../../tokens/design-system';

export default function Portfolio() {
  const [activeProject, setActiveProject] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (activeProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [activeProject]);

  useEffect(() => {
    const handleOpen = (e) => {
      const project = projects.find((p) => p.id === e.detail.projectId);
      if (project) {
        openProject(project);
        setTimeout(() => {
          document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      }
    };
    window.addEventListener('openProject', handleOpen);
    return () => window.removeEventListener('openProject', handleOpen);
  }, []);

  const openProject = (project) => {
    setActiveProject(project);
    setActiveImage(0);
  };

  const closeProject = () => {
    setActiveProject(null);
    setActiveImage(0);
  };

  return (
    <section id="work" className="section" style={{ background: 'var(--c-bg)' }}>
      <div className="container-main">
        <div className="section-header" style={{ alignItems: 'center', textAlign: 'center' }}>
          <span style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--c-text-muted)' }}>
            Selected Work
          </span>
          <h2 className="section-title">
            Things we've <span className="accent">made happen.</span>
          </h2>
          <p style={{ color: 'var(--c-text-dim)', maxWidth: '450px', margin: '0 auto' }}>
            Click a card to view project details.
          </p>
        </div>

        <div className="card-grid">
          {projects.map((project) => (
            <div key={project.id} className="portfolio-card" onClick={() => openProject(project)}>
              <img src={project.image} alt={project.title} loading="lazy" />
              <div className="portfolio-card-overlay">
                <div style={{
                  fontSize: '0.55rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--c-accent)',
                  marginBottom: '0.25rem',
                }}>
                  {project.category}
                </div>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: '1.125rem',
                  color: 'var(--c-text)',
                  marginBottom: '0.375rem',
                }}>
                  {project.title}
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  color: 'var(--c-text-dim)',
                  lineHeight: 1.5,
                }}>
                  {project.description}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: '0.75rem' }}>
                  {project.tags.map((tag, i) => (
                    <span key={i} style={{
                      fontSize: '0.55rem',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      padding: '0.25rem 0.625rem',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '50px',
                      color: 'var(--c-text-dim)',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <a href="#" className="nav-cta" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            View All Projects
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      {/* Project Modal */}
      {activeProject && (
        <div className="project-modal" onClick={closeProject}>
          <div className="project-modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button className="modal-close" onClick={closeProject}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Image gallery */}
            <div className="modal-gallery">
              <div className="modal-main-image">
                <img src={activeProject.images[activeImage]} alt={activeProject.title} loading="lazy" />
              </div>
              <div className="modal-thumbnails">
                {activeProject.images.map((img, i) => (
                  <div
                    key={i}
                    className={`modal-thumb ${i === activeImage ? 'active' : ''}`}
                    onClick={() => setActiveImage(i)}
                  >
                    <img src={img} alt={`${activeProject.title} ${i + 1}`} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>

            {/* Project details */}
            <div className="modal-details">
              <div className="modal-details-header">
                <span className="modal-category">{activeProject.category}</span>
                <span className="modal-year">{activeProject.year}</span>
              </div>
              <h2 className="modal-title">{activeProject.title}</h2>
              <p className="modal-description">{activeProject.details}</p>

              <div className="modal-meta">
                <div className="modal-meta-item">
                  <span className="modal-meta-label">Client</span>
                  <span className="modal-meta-value">{activeProject.client}</span>
                </div>
                <div className="modal-meta-item">
                  <span className="modal-meta-label">Duration</span>
                  <span className="modal-meta-value">{activeProject.duration}</span>
                </div>
                <div className="modal-meta-item">
                  <span className="modal-meta-label">Category</span>
                  <span className="modal-meta-value">{activeProject.category}</span>
                </div>
              </div>

              <div className="modal-tags">
                {activeProject.tags.map((tag, i) => (
                  <span key={i} className="modal-tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
