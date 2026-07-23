import { navLinks, socialLinks } from '../../tokens/design-system';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" style={{ background: 'var(--c-bg)' }}>
      <div className="container-main">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#" className="nav-logo" style={{ display: 'inline-block' }}>
              Gards<span>.</span>
            </a>

          </div>
          <div>
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-links">
              {navLinks.map((link) => (
                <li key={link.label}><a href={link.href}>{link.label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="footer-heading">Connect</h4>
            <ul className="footer-links">
              {socialLinks.map((social) => (
                <li key={social.name}><a href={social.href}>{social.name}</a></li>
              ))}
            </ul>
            <div style={{ marginTop: '1.5rem' }}>
              <h4 className="footer-heading">Email</h4>
              <a href="mailto:hello@gards.studio" style={{ color: 'var(--c-text)', textDecoration: 'none' }}>
                hello@gards.studio
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {year} Gards Studio. All rights reserved.</p>
          <p>Built with care in Jakarta</p>
        </div>
      </div>
    </footer>
  );
}
