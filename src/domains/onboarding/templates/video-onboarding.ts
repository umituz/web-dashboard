import type { OnboardingConfig } from '../types/config';
import type { OnboardingScreen } from '../types/screens';

/**
 * Video category — personalization-led, 6–8 screens.
 * Goal: tune the recommendation engine early.
 */

const screens: OnboardingScreen[] = [
  {
    id: 'welcome',
    type: 'welcome',
    title: 'Watch what you actually love',
    subtitle: 'A few quick questions and we’ll never recommend junk again.',
    cta: 'Let’s go',
    heroIconName: 'Play',
  },
  {
    id: 'genres',
    type: 'goal-question',
    question: 'Which genres do you enjoy?',
    multiSelect: true,
    options: [
      { id: 'comedy', label: 'Comedy', iconName: 'Smile' },
      { id: 'drama', label: 'Drama', iconName: 'Theater' },
      { id: 'documentary', label: 'Documentary', iconName: 'BookOpen' },
      { id: 'thriller', label: 'Thriller', iconName: 'AlertTriangle' },
      { id: 'sci-fi', label: 'Sci-fi', iconName: 'Rocket' },
    ],
    onChange: () => undefined,
    cta: 'Continue',
  },
  {
    id: 'mood',
    type: 'tinder-cards',
    title: 'Swipe on what feels right',
    statements: [
      { id: 's1', text: 'I want to learn something new today.', category: 'Curious' },
      { id: 's2', text: 'I want pure entertainment.', category: 'Fun' },
      { id: 's3', text: 'I want something to cry to.', category: 'Emotional' },
      { id: 's4', text: 'I want background noise while I work.', category: 'Casual' },
    ],
    onChange: () => undefined,
    cta: 'Continue',
  },
  {
    id: 'length',
    type: 'preferences',
    title: 'How long should a video be?',
    preferences: [
      {
        id: 'length',
        label: 'Preferred length',
        type: 'slider',
        min: 1,
        max: 120,
        defaultValue: 20,
      },
    ],
    onChange: () => undefined,
    cta: 'Continue',
  },
  {
    id: 'permission-priming-notifications',
    type: 'permission-priming',
    permission: 'notifications',
    title: 'Never miss a live premiere',
    description: 'Get a heads-up when channels you love go live.',
    benefits: ['Only from channels you follow', 'Snooze any time', 'Silent by default'],
    iconName: 'Bell',
    onRequest: async () => 'prompt',
    cta: 'Turn on alerts',
  },
  {
    id: 'paywall',
    type: 'paywall',
    title: 'Watch without limits',
    subtitle: 'Ad-free, offline downloads, 4K.',
    price: '$11.99 / month',
    trialDays: 14,
    cta: 'Start 14-day trial',
    secondaryCta: 'Continue with ads',
    features: [
      { iconName: 'Tv', text: '4K Ultra HD' },
      { iconName: 'Download', text: 'Offline downloads' },
      { iconName: 'Users', text: '4 screens at once' },
      { iconName: 'Ban', text: 'Zero ads' },
    ],
    socialProof: { text: 'Loved by', count: 1200000 },
    onSecondaryCta: () => undefined,
    onAccept: async () => ({ accepted: true, trialStarted: true }),
  },
];

export const videoOnboardingTemplate: OnboardingConfig = {
  category: 'video',
  screens,
  onSkip: () => undefined,
  onComplete: () => undefined,
};
