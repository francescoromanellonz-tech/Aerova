import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

/**
 * Wraps page content in a fade-in transition on route change.
 * Exit is instant (browser removes old content); enter is a smooth
 * opacity + slight-upward drift, matching the brand's "fog lifting" motion.
 */
function PageTransition({ children }) {
  const ref = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      gsap.set(el, { opacity: 1 });
      return;
    }

    gsap.fromTo(
      el,
      { opacity: 0, y: 12, filter: 'blur(4px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.55,
        ease: 'power3.out',
        clearProps: 'filter,transform',
      }
    );
  }, [location.pathname]);

  return <div ref={ref}>{children}</div>;
}

export default PageTransition;
