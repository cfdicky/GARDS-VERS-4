import { lazy, Suspense } from 'react';
import Hero from '../sections/Hero';
import Portfolio from '../sections/Portfolio';

const Services = lazy(() => import('../sections/Services'));
const Testimonials = lazy(() => import('../sections/Testimonials'));
const CTA = lazy(() => import('../sections/CTA'));

export default function Home({ loaded }) {
  return (
    <>
      <Hero loaded={loaded} />
      <Portfolio />
      <Suspense fallback={null}>
        <Services />
        <Testimonials />
        <CTA />
      </Suspense>
    </>
  );
}
