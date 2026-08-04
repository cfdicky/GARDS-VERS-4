import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { projects } from '../../tokens/design-system';

const categories = ['All', ...new Set(projects.map((p) => p.category))];

function getSrcSet(src) {
  if (typeof src !== 'string' || !src.includes('images.unsplash.com')) return undefined;
  const base = src.split('?')[0];
  return `${base}?w=480&q=75 480w, ${base}?w=960&q=75 960w, ${base}?w=1600&q=75 1600w`;
}

const imgSizes = '(max-width: 768px) 50vw, 33vw';

export default function Portfolio() {
  const [activeProject, setActiveProject] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleIds, setVisibleIds] = useState(new Set());
  const [tabsVisible, setTabsVisible] = useState(false);
  const gridRef = useRef(null);
  const animTimer = useRef(null);

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
        openProjectRef.current(project);
      }
    };
    window.addEventListener('openProject', handleOpen);
    return () => window.removeEventListener('openProject', handleOpen);
  }, []);

  const openProject = (project) => {
    setActiveProject(project);
    setActiveImage(0);
  };

  const openProjectRef = useRef(openProject);
  openProjectRef.current = openProject;

  const closeProject = () => {
    setActiveProject(null);
    setActiveImage(0);
  };

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const initialProjects = projects.slice(0, 6);
  const displayProjects = expanded ? filteredProjects : initialProjects;

  const categoryCount = useMemo(() => {
    const counts = { All: projects.length };
    projects.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  const showCards = useCallback((list) => {
    if (animTimer.current) animTimer.current.forEach(clearTimeout);
    animTimer.current = [];
    list.forEach((p, i) => {
      const t = setTimeout(() => {
        setVisibleIds((prev) => new Set([...prev, p.id]));
      }, i * 50);
      animTimer.current.push(t);
    });
  }, []);

  const hideAllCards = useCallback(() => {
    return new Promise((resolve) => {
      setVisibleIds(new Set());
      setTimeout(resolve, 50);
    });
  }, []);

  const handleToggle = useCallback(async () => {
    if (expanded) {
      setTabsVisible(false);
      await hideAllCards();
      setExpanded(false);
      setActiveCategory('All');
      setTimeout(() => {
        showCards(initialProjects);
      }, 200);
      document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setExpanded(true);
      setVisibleIds(new Set());
      setTimeout(() => {
        setTabsVisible(true);
        setTimeout(() => showCards(filteredProjects), 150);
      }, 100);
      setTimeout(() => {
        gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }, [expanded, filteredProjects, initialProjects, showCards, hideAllCards]);

  const handleCategoryChange = useCallback((cat) => {
    setActiveCategory(cat);
    const list = cat === 'All' ? projects : projects.filter((p) => p.category === cat);
    setVisibleIds(new Set());
    setTimeout(() => showCards(list), 80);
  }, [showCards]);

  useEffect(() => {
    const t = setTimeout(() => showCards(initialProjects), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
    <section id="work" className="section" style={{ background: 'var(--c-bg)' }}>
      <div className="container-main">
        <div className="section-header" style={{ alignItems: 'center', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--c-text-muted)' }}>
            Selected Work
          </span>
          <h2 className="section-title">
            Things we've <span className="accent">made happen.</span>
          </h2>
          <p style={{ color: 'var(--c-text-dim)', maxWidth: '450px', margin: '0 auto' }}>
            Click a card to view project details.
          </p>
        </div>

        {/* Category Tabs */}
        <div style={{
          overflow: 'hidden',
          maxHeight: tabsVisible ? '100px' : '0px',
          opacity: tabsVisible ? 1 : 0,
          transition: 'max-height 0.5s cubic-bezier(0.34, 1.2, 0.64, 1), opacity 0.4s ease, margin 0.4s ease',
          marginBottom: tabsVisible ? '2.5rem' : '0rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.5rem', paddingBottom: '0.5rem' }}>
            {categories.map((cat, i) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                style={{
                  padding: '0.75rem 1.25rem', borderRadius: '50px',
                  border: activeCategory === cat ? '1px solid var(--c-accent)' : '1px solid rgba(255,255,255,0.1)',
                  background: activeCategory === cat ? 'var(--c-accent)' : 'transparent',
                  color: activeCategory === cat ? '#000' : 'var(--c-text-dim)',
                  fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em',
                  textTransform: 'uppercase', cursor: 'pointer',
                  minHeight: '48px',
                  transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                  fontFamily: "'Space Grotesk', sans-serif",
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  transform: tabsVisible ? 'translateY(0)' : 'translateY(-10px)',
                  opacity: tabsVisible ? 1 : 0,
                  transitionDelay: tabsVisible ? `${i * 50}ms` : '0ms',
                }}
                onMouseEnter={(e) => {
                  if (activeCategory !== cat) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = 'var(--c-text)'; }
                }}
                onMouseLeave={(e) => {
                  if (activeCategory !== cat) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--c-text-dim)'; }
                }}
              >
                {cat}
                <span style={{ fontSize: '0.6rem', opacity: 0.6, fontWeight: 500 }}>{categoryCount[cat] || 0}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        <div ref={gridRef} className="card-grid" style={{
          gridTemplateColumns: expanded ? 'repeat(auto-fill, minmax(280px, 1fr))' : undefined,
        }}>
          {displayProjects.map((project) => {
            const isVis = visibleIds.has(project.id);
            return (
              <div
                key={project.id}
                className="portfolio-card"
                onClick={() => openProject(project)}
                style={{
                  opacity: isVis ? 1 : 0,
                  transform: isVis ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
                  transition: 'opacity 0.45s cubic-bezier(0.25,1,0.5,1), transform 0.45s cubic-bezier(0.34,1.2,0.64,1)',
                  willChange: 'transform, opacity',
                }}
              >
                <img
                  src={project.image}
                  srcSet={getSrcSet(project.image)}
                  sizes={imgSizes}
                  alt={project.title}
                  width="800"
                  height="600"
                  loading="lazy"
                  decoding="async"
                />
                <div className="portfolio-card-overlay">
                  <div style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--c-accent)', marginBottom: '0.25rem' }}>
                    {project.category}
                  </div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.125rem', color: 'var(--c-text)', marginBottom: '0.375rem' }}>
                    {project.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--c-text-dim)', lineHeight: 1.5 }}>
                    {project.description}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: '0.75rem' }}>
                    {project.tags.map((tag, i) => (
                      <span key={i} style={{ fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', padding: '0.25rem 0.625rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50px', color: 'var(--c-text-dim)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Projects Button */}
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <button className="nav-cta" onClick={handleToggle} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            {expanded ? 'Show Less' : 'View All Projects'}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transition: 'transform 0.4s cubic-bezier(0.34,1.2,0.64,1)', transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      </section>

      {/* Project Modal - outside section to avoid content-visibility:auto */}
      {activeProject && (
        <div className="project-modal" onClick={closeProject}>
          <div className="project-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeProject}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <div className="modal-gallery">
              <div className="modal-main-image">
                <img
                  src={activeProject.images[activeImage]}
                  srcSet={getSrcSet(activeProject.images[activeImage])}
                  sizes="(max-width: 768px) 100vw, 900px"
                  alt={activeProject.title}
                  width="1200"
                  height="900"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="modal-thumbnails">
                {activeProject.images.map((img, i) => (
                  <div key={i} className={`modal-thumb ${i === activeImage ? 'active' : ''}`} onClick={() => setActiveImage(i)}>
                    <img
                      src={img}
                      srcSet={getSrcSet(img)}
                      sizes="72px"
                      alt={`${activeProject.title} ${i + 1}`}
                      width="72"
                      height="48"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ))}
              </div>
            </div>
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
    </>
  );
}
