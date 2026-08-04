import * as React from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/cn';
import useEmblaCarousel from 'embla-carousel-react';

const CarouselContext = React.createContext(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }
  return context;
}

const Carousel = React.forwardRef(
  ({ orientation = 'horizontal', opts, setApi, plugins, className, children, ...props }, ref) => {
    const [carouselRef, api] = useEmblaCarousel(
      { ...opts, axis: orientation === 'horizontal' ? 'x' : 'y' },
      plugins
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const onSelect = React.useCallback((api) => {
      if (!api) return;
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
      (event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext]
    );

    React.useEffect(() => {
      if (!api || !setApi) return;
      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) return;
      onSelect(api);
      api.on('reInit', onSelect);
      api.on('select', onSelect);
      return () => {
        api?.off('select', onSelect);
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api,
          opts,
          orientation,
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn('relative', className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = 'Carousel';

const CarouselContent = React.forwardRef(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();
  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          'flex',
          orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col',
          className
        )}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = 'CarouselContent';

const CarouselItem = React.forwardRef(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        'min-w-0 shrink-0 grow-0 basis-full',
        orientation === 'horizontal' ? 'pl-4' : 'pt-4',
        className
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = 'CarouselItem';

const CarouselNext = React.forwardRef(({ className, ...props }, ref) => {
  const { scrollNext, canScrollNext } = useCarousel();
  return (
    <button
      ref={ref}
      className={cn(
        'absolute right-2 top-1/2 h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full',
        'border border-[var(--c-border)] bg-[rgba(255,255,255,0.06)] text-[var(--c-text)]',
        'transition-all duration-300 hover:bg-[var(--c-accent)] hover:border-[var(--c-accent)] hover:text-[var(--c-bg)]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-accent)]',
        'disabled:pointer-events-none disabled:opacity-30',
        'hidden md:flex',
        className
      )}
      onClick={scrollNext}
      disabled={!canScrollNext}
      {...props}
    >
      <ArrowRight className="h-5 w-5" />
      <span className="sr-only">Next slide</span>
    </button>
  );
});
CarouselNext.displayName = 'CarouselNext';

const ServiceCard = ({ service, index }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.1 },
    },
  };

  const Icon = service.icon;

  return (
    <motion.div
      variants={cardVariants}
      className={cn(
        'relative flex h-[420px] w-full flex-col justify-between overflow-hidden rounded-3xl p-8 bg-gradient-to-br border border-[var(--c-border)]',
        service.gradient
      )}
    >
      <div className="z-10 flex flex-col items-start text-left">
        <span className="mb-8 font-mono text-sm text-[var(--c-text-muted)]">
          ( {service.number} )
        </span>
        <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--c-border)] bg-[rgba(255,255,255,0.04)] text-[var(--c-accent)]">
          <Icon className="h-6 w-6" />
        </span>
      </div>
      <div className="z-10">
        <h3 className="mb-2 text-lg font-semibold uppercase tracking-wider text-[var(--c-text)]">
          {service.title}
        </h3>
        <p className="text-sm text-[var(--c-text-dim)]">{service.description}</p>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[var(--c-bg)]/30 to-transparent" />
    </motion.div>
  );
};

export const ServiceCarousel = ({ services }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [api, setApi] = React.useState(undefined);
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };
    setCount(api.scrollSnapList().length);
    onSelect();
    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      <Carousel ref={ref} opts={{ align: 'start', loop: true }} setApi={setApi} className="relative">
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          transition={{ staggerChildren: 0.1 }}
        >
          <CarouselContent>
            {services.map((service, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <ServiceCard service={service} index={index} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </motion.div>
        <CarouselNext />
      </Carousel>

      <div className="mt-6 flex items-center justify-between md:hidden">
        <span className="font-mono text-[0.625rem] font-semibold uppercase tracking-widest text-[var(--c-text-muted)]">
          Swipe to explore
        </span>
        <div className="flex items-center gap-2">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => api?.scrollTo(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: current === i ? '1.5rem' : '0.5rem',
                height: '0.375rem',
                background: current === i ? 'var(--c-accent)' : 'var(--c-border)',
                cursor: 'pointer',
                border: 'none',
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
