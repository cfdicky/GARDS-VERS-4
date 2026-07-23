import { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/sections/Navbar';
import Hero from './components/sections/Hero';
import Portfolio from './components/sections/Portfolio';

const Services = lazy(() => import('./components/sections/Services'));
const Testimonials = lazy(() => import('./components/sections/Testimonials'));
const CTA = lazy(() => import('./components/sections/CTA'));
const Footer = lazy(() => import('./components/sections/Footer'));

function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'var(--c-bg)', position: 'relative', zIndex: 1 }}>
      <Navbar loaded={loaded} />
      <main>
        <Hero loaded={loaded} />
        <Portfolio />
        <Suspense fallback={null}>
          <Services />
          <Testimonials />
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
