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
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Left side: hamburger (mobile) + Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Hamburger - mobile only */}
          <button
            ref={btnRef}
            onClick={() => setMenuOpen(!menuOpen)}
            className="nav-hamburger"
            aria-label="Menu"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '5px',
              width: '28px',
              height: '28px',
            }}
          >
            <span style={{
              display: 'block',
              width: '100%',
              height: '2px',
              background: 'var(--c-text)',
              borderRadius: '2px',
              transition: 'all 0.3s ease',
              transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none',
            }} />
            <span style={{
              display: 'block',
              width: '100%',
              height: '2px',
              background: 'var(--c-text)',
              borderRadius: '2px',
              transition: 'all 0.3s ease',
              opacity: menuOpen ? 0 : 1,
            }} />
            <span style={{
              display: 'block',
              width: '100%',
              height: '2px',
              background: 'var(--c-text)',
              borderRadius: '2px',
              transition: 'all 0.3s ease',
              transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none',
            }} />
          </button>

          {/* Logo */}
          <a href="#hero" style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: '2rem',
            color: 'var(--c-text)',
            letterSpacing: '-0.02em',
            textDecoration: 'none',
            flexShrink: 0,
          }}>
            Gards<span style={{ color: 'var(--c-accent)' }}>.</span>
          </a>
        </div>

        {/* Desktop nav links */}
        <ul className="nav-links" style={{ margin: 0 }}>
          <li><a href="#hero">Home</a></li>
          <li><a href="#work">Work</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
        </ul>

        {/* Let's Talk */}
        <a href="#contact" className="nav-cta" onClick={() => setMenuOpen(false)}>Let's Talk</a>
      </div>

      {/* Mobile dropdown menu */}
      <div
        ref={menuRef}
        className="nav-mobile-menu"
        style={{
          maxHeight: menuOpen ? '300px' : '0',
          opacity: menuOpen ? 1 : 0,
          overflow: 'hidden',
          transition: 'all 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      >
        <ul style={{
          listStyle: 'none',
          margin: 0,
          padding: '1rem 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}>
          {[
            { href: '#hero', label: 'Home' },
            { href: '#work', label: 'Work' },
            { href: '#about', label: 'About' },
            { href: '#services', label: 'Services' },
          ].map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'block',
                  padding: '0.6rem 0',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--c-text-dim)',
                  textDecoration: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  transition: 'color 0.2s',
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        @media (min-width: 769px) {
          .nav-hamburger { display: none !important; }
          .nav-mobile-menu { display: none !important; }
        }
        @media (max-width: 768px) {
          .nav-hamburger { display: flex !important; }
          .nav-mobile-menu {
            max-width: 1400px;
            margin: 0 auto;
            width: 100%;
          }
        }
      `}</style>
    </nav>
  );
}
