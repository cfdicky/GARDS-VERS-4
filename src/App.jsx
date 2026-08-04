import { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/sections/Navbar';
import Hero from './components/sections/Hero';
import Portfolio from './components/sections/Portfolio';

const About = lazy(() => import('./components/sections/About'));
const Services = lazy(() => import('./components/sections/Services'));
const CTA = lazy(() => import('./components/sections/CTA'));
const Footer = lazy(() => import('./components/sections/Footer'));

function LoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    const start = Date.now();
    const duration = 2000;
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setExiting(true);
          setTimeout(() => {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            requestAnimationFrame(() => {
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              onDone();
            });
          }, 300);
        }, 200);
      }
    };
    requestAnimationFrame(tick);

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [onDone]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: '#030308',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: exiting ? 0 : 1,
      transition: 'opacity 0.5s ease',
      pointerEvents: exiting ? 'none' : 'auto',
    }}>
      <div style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700,
        fontSize: '3rem',
        color: '#ffffff',
        letterSpacing: '-0.05em',
        marginBottom: '3rem',
        opacity: 0.9,
      }}>
        Gards<span style={{ color: '#c8ff00' }}>.</span>
      </div>
      <div style={{
        width: '200px',
        height: '2px',
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '2px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          background: '#c8ff00',
          borderRadius: '2px',
          width: `${progress * 100}%`,
          transition: 'width 0.1s linear',
        }} />
      </div>
      <div style={{
        marginTop: '1rem',
        fontSize: '0.625rem',
        fontWeight: 600,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.25)',
      }}>
        Loading
      </div>
    </div>
  );
}

function App() {
  const [loaded, setLoaded] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const done = () => {
      if (!cancelled) setFontsReady(true);
    };
    const fallback = setTimeout(done, 2500);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(done).catch(done);
    } else {
      done();
    }
    return () => {
      cancelled = true;
      clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    if (loaded) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [loaded]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--c-bg)', position: 'relative', zIndex: 1 }}>
      {fontsReady && !loaded && <LoadingScreen onDone={() => setLoaded(true)} />}
      <Navbar loaded={loaded} />
      <main>
        <Hero loaded={loaded} />
        <Portfolio />
        <Suspense fallback={null}>
          <About />
          <Services />
          <CTA />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}

export default App;
