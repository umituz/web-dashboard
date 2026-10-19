import { useEffect, useState } from 'react';

/**
 * Detects the user's `prefers-reduced-motion` setting.
 * Single responsibility: surface the OS-level preference to consumers so
 * motion-heavy UI (Framer Motion, transitions) can opt out for accessibility.
 */
export function useReducedMotion(): boolean {
  const getInitial = (): boolean => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };
  const [reduced, setReduced] = useState<boolean>(getInitial);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return reduced;
}
