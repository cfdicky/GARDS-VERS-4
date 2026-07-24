import { useState, useEffect, useRef } from 'react';

export default function Navbar({ loaded }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) &&
          btnRef.current && !btnRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  return (
    <nav className={`nav-fixed ${scrolled ? 'scrolled' : ''}`} style={{
      opacity: loaded ? 1 : 0,
      transition: 'opacity 0.6s ease',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <button
              ref={btnRef}
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: '2rem',
                color: 'var(--c-text)',
                letterSpacing: '-0.02em',
                transition: 'color 0.2s',
              }}
            >
              Gards<span style={{ color: 'var(--c-accent)' }}>.</span>
            </button>
            <ul className="nav-links" style={{
              margin: 0,
              display: menuOpen ? 'flex' : 'none',
              gap: '2rem',
              alignItems: 'center',
            }}>
              <li><a href="#hero" onClick={() => setMenuOpen(false)}>Home</a></li>
              <li><a href="#work" onClick={() => setMenuOpen(false)}>Work</a></li>
              <li><a href="#about" onClick={() => setMenuOpen(false)}>About</a></li>
              <li><a href="#services" onClick={() => setMenuOpen(false)}>Services</a></li>
            </ul>
          </div>
          <a href="#contact" className="nav-cta" onClick={() => setMenuOpen(false)}>Let's Talk</a>
        </div>
      </div>
    </nav>
  );
}
