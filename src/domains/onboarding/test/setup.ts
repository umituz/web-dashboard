import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

if (typeof window !== 'undefined')
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string): MediaQueryList =>
    ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: vi.fn(),       removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }) as unknown as MediaQueryList,
});

afterEach(() => {
  cleanup();
});
