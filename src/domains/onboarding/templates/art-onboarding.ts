import type { OnboardingConfig } from '../types/config';
import type { OnboardingScreen } from '../types/screens';
import { withDefaultDemo, defaultDemoResult } from './TemplateDemoFallback';

/**
 * Art category — demo-driven, 3–5 screens.
 * Show value fast: by the end of step 3 the user has produced a real artifact.
 *
 * The demo screen ships with a working palette-preview fallback so the template
 * is runnable out of the box. Replace `screens[2].demo.component` to plug in
 * the consumer's own demo.
 */

const baseScreens: OnboardingScreen[] = [
  {
    id: 'welcome',
    type: 'welcome',
    title: 'Make something beautiful in 60 seconds',
    subtitle: 'No design skills. No learning curve. Just create.',
    cta: 'Try the demo',
    heroIconName: 'Sparkles',
    highlight: 'Live demo',
  },
  {
    id: 'style',
    type: 'goal-question',
    question: 'Pick a style that feels like you',
    multiSelect: true,
    options: [
      { id: 'minimal', label: 'Minimal', iconName: 'Square' },
      { id: 'bold', label: 'Bold colors', iconName: 'Zap' },
      { id: 'retro', label: 'Retro', iconName: 'Rewind' },
      { id: 'playful', label: 'Playful', iconName: 'Smile' },
    ],
    onChange: () => undefined,
    cta: 'Continue',
  },
  {
    id: 'demo',
    type: 'app-demo',
    title: 'Your turn — pick a palette',
    demo: {
      // `withDefaultDemo` below replaces this no-op with the built-in fallback.
      component: () => null,
      onSave: () => undefined,
    },
  },
  {
    id: 'value',
    type: 'value-delivery',
    title: 'You made this!',
    result: defaultDemoResult(),
  },
  {
    id: 'paywall',
    type: 'paywall',
    title: 'Keep creating',
    subtitle: 'Unlimited generations, all styles, no watermarks.',
    price: '$4.99 / week',
    trialDays: 3,
    cta: 'Start free trial',
    secondaryCta: 'Not now',
    features: [
      { iconName: 'Infinity', text: 'Unlimited creations', highlighted: true },
      { iconName: 'Palette', text: 'All styles unlocked' },
      { iconName: 'Download', text: 'High-res export' },
      { iconName: 'Share2', text: 'Share anywhere' },
    ],
    onSecondaryCta: () => undefined,
    onAccept: async () => ({ accepted: true, trialStarted: true }),
  },
];

const screens = baseScreens.map((s) => withDefaultDemo(s));

export const artOnboardingTemplate: OnboardingConfig = {
  category: 'art',
  screens,
  onSkip: () => undefined,
  onComplete: () => undefined,
};
