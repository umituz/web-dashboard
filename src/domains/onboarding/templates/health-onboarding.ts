import type { OnboardingConfig } from '../types/config';
import type { OnboardingScreen } from '../types/screens';

const screens: OnboardingScreen[] = [
  {
    id: 'welcome',
    type: 'welcome',
    title: 'Your health, your data, your call',
    subtitle: 'Private by design. Always encrypted on-device.',
    cta: 'Get started',
    heroIconName: 'ShieldCheck',
    highlight: 'HIPAA-ready',
  },
  {
    id: 'goal',
    type: 'goal-question',
    question: 'What brings you here today?',
    multiSelect: false,
    options: [
      { id: 'sleep', label: 'Better sleep', iconName: 'Moon' },
      { id: 'fitness', label: 'Get fitter', iconName: 'Dumbbell' },
      { id: 'nutrition', label: 'Eat healthier', iconName: 'Apple' },
      { id: 'stress', label: 'Manage stress', iconName: 'HeartPulse' },
    ],
    onChange: () => undefined,
    cta: 'Continue',
  },
  {
    id: 'privacy',
    type: 'pain-points',
    title: 'What worries you most about health apps?',
    painPoints: [
      { id: 'data-shared', label: 'Data shared with insurers' },
      { id: 'tracking', label: 'Being tracked across apps' },
      { id: 'ads', label: 'Seeing health ads' },
      { id: 'leaks', label: 'Data breaches' },
    ],
    multiSelect: true,
    onChange: () => undefined,
    cta: 'Continue',
  },
  {
    id: 'permission-priming-notifications',
    type: 'permission-priming',
    permission: 'notifications',
    title: 'Gentle daily reminders',
    description: 'We only ping you when it matters — never spammy.',
    benefits: [
      'Reminders you can mute any time',
      'On-device scheduling — nothing leaves your phone',
      'One-tap unsubscribe from any category',
    ],
    iconName: 'Bell',
    onRequest: async () => 'prompt',
    cta: 'Allow reminders',
  },
  {
    id: 'processing',
    type: 'processing',
    title: 'Building your wellness plan…',
    steps: ['Reading your goals', 'Filtering privacy settings', 'Personalizing the plan'],
    durationMs: 3000,
    onComplete: () => undefined,
  },
  {
    id: 'paywall',
    type: 'paywall',
    title: 'Unlock your full plan',
    subtitle: 'Most users see results in their first week.',
    price: '$6.99 / month',
    trialDays: 7,
    trialPrice: 'Free',
    cta: 'Start 7-day trial',
    secondaryCta: 'Maybe later',
    features: [
      { iconName: 'Lock', text: 'End-to-end encrypted data' },
      { iconName: 'Activity', text: 'Personalized daily plan' },
      { iconName: 'MessageCircle', text: '24/7 human coaching' },
      { iconName: 'Award', text: 'Progress you can share (or not)' },
    ],
    socialProof: { text: 'Trusted by', count: 250000 },
    onSecondaryCta: () => undefined,
    onAccept: async () => ({ accepted: true, trialStarted: true }),
  },
];

export const healthOnboardingTemplate: OnboardingConfig = {
  category: 'health',
  screens,
  onSkip: () => undefined,
  onComplete: () => undefined,
};
