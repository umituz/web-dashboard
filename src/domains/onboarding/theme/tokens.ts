/**
 * Design Tokens - Single Source of Truth
 * All visual values MUST be sourced from here.
 * Per project rules: no hardcoded colors, spacing, or font sizes anywhere else.
 */

export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
} as const;

export const radius = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  '3xl': '2rem',
  full: '9999px',
} as const;

export const typography = {
  fontFamily: {
    sans: 'var(--uob-font-sans, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1.15' }],
    '6xl': ['3.75rem', { lineHeight: '1.1' }],
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

export const zIndex = {
  hide: -1,
  base: 0,
  raised: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  toast: 50,
} as const;

export const motion = {
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '400ms',
    slower: '600ms',
  },
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

export const breakpoint = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

/**
 * Semantic color tokens — referenced via CSS custom properties.
 * Consumers override --uob-primary-500 etc. on `.uob-flow` to rebrand
 * without code changes. Values are space-separated RGB triplets so they
 * compose with `rgb(var(--x) / <alpha>)`.
 */
export const colorCssVar = {
  primary50: 'var(--uob-primary-50, 238 242 255)',
  primary100: 'var(--uob-primary-100, 224 231 255)',
  primary500: 'var(--uob-primary-500, 99 102 241)',
  primary600: 'var(--uob-primary-600, 79 70 229)',
  primary700: 'var(--uob-primary-700, 67 56 202)',
  surface: 'var(--uob-surface, 255 255 255)',
  surfaceMuted: 'var(--uob-surface-muted, 249 250 251)',
  textPrimary: 'var(--uob-text-primary, 17 24 39)',
  textMuted: 'var(--uob-text-muted, 107 114 128)',
  border: 'var(--uob-border, 229 231 235)',
  success: 'var(--uob-success, 16 185 129)',
  warning: 'var(--uob-warning, 245 158 11)',
  error: 'var(--uob-error, 239 68 68)',
} as const;

export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof radius;
export type FontSizeToken = keyof typeof typography.fontSize;
