import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// React 18 testing-library contract: let `act` warnings be raised correctly.
(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

// jsdom has no matchMedia. Provide a mock that reports reduced motion:
// jsdom also lacks animation frames, so framer-motion's AnimatePresence can
// never complete an exit animation here — the instant-transition path is the
// only one that can be exercised in CI (and it is the a11y-correct path,
// TEST_SCENARIOS.md §1.10).
if (typeof window !== 'undefined')
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string): MediaQueryList =>
    ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated API — kept for older libraries
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }) as unknown as MediaQueryList,
});

afterEach(() => {
  cleanup();
});
