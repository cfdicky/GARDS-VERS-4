import { useState, useEffect, useRef } from 'react';

export default function Navbar({ loaded }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const btnRef = useRef(null);

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
        {/* Centered Gards logo */}
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

        {/* Links dropdown */}
        <div
          ref={menuRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            maxHeight: menuOpen ? '60px' : '0',
            opacity: menuOpen ? 1 : 0,
            overflow: 'hidden',
            transition: 'all 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
            marginTop: menuOpen ? '1rem' : '0',
          }}
        >
          <ul className="nav-links" style={{ margin: 0 }}>
            <li><a href="#work" onClick={() => setMenuOpen(false)}>Work</a></li>
            <li><a href="#services" onClick={() => setMenuOpen(false)}>Services</a></li>
            <li><a href="#about" onClick={() => setMenuOpen(false)}>About</a></li>
            <li><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a></li>
          </ul>
          <a href="#contact" className="nav-cta" onClick={() => setMenuOpen(false)}>Let's Talk</a>
        </div>
      </div>
    </nav>
  );
}
