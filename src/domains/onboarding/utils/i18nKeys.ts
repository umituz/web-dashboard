/**
 * Onboarding Domain i18n Keys
 */

export const ONBOARDING_KEYS = {
  // Wizard
  wizard: {
    cancel: 'onboarding.buttons.cancel',
    stepNotConfigured: 'onboarding.errors.stepNotConfigured',
    errors: {
      completionFailed: 'onboarding.errors.completionFailed',
    },
  },

  // User type step
  userType: {
    title: 'onboarding.userType.title',
    description: 'onboarding.userType.description',
  },

  // App focus step
  appFocus: {
    title: 'onboarding.appFocus.title',
    description: 'onboarding.appFocus.description',
    success: 'onboarding.appFocus.success',
  },

  // Platforms step
  platforms: {
    title: 'onboarding.platforms.title',
    description: 'onboarding.platforms.description',
    connect: 'onboarding.platforms.connect',
    connected: 'onboarding.platforms.connected',
    selected: 'onboarding.platforms.selected',
  },

  // Plan step
  plan: {
    title: 'onboarding.plan.title',
    description: 'onboarding.plan.description',
    monthly: 'onboarding.plan.monthly',
    yearly: 'onboarding.plan.yearly',
    save: 'onboarding.plan.save',
    recommended: 'onboarding.plan.recommended',
    selectedPlan: 'onboarding.plan.selectedPlan',
    mostPopular: 'onboarding.plan.mostPopular',
    bestValue: 'onboarding.plan.bestValue',
    custom: 'onboarding.plan.custom',
  },

  // Steps (default data — keys can be overridden per consumer)
  defaults: {
    founder: 'onboarding.defaults.userType.founder',
    founderDescription: 'onboarding.defaults.userType.founderDescription',
    contentCreator: 'onboarding.defaults.userType.contentCreator',
    contentCreatorDescription: 'onboarding.defaults.userType.contentCreatorDescription',
    smallBusiness: 'onboarding.defaults.userType.smallBusiness',
    smallBusinessDescription: 'onboarding.defaults.userType.smallBusinessDescription',
    enterprise: 'onboarding.defaults.userType.enterprise',
    enterpriseDescription: 'onboarding.defaults.userType.enterpriseDescription',
    agency: 'onboarding.defaults.userType.agency',
    agencyDescription: 'onboarding.defaults.userType.agencyDescription',
    personal: 'onboarding.defaults.userType.personal',
    personalDescription: 'onboarding.defaults.userType.personalDescription',
    mobileApp: 'onboarding.defaults.appType.mobileApp',
    mobileAppDescription: 'onboarding.defaults.appType.mobileAppDescription',
    webApp: 'onboarding.defaults.appType.webApp',
    webAppDescription: 'onboarding.defaults.appType.webAppDescription',
  },
} as const;
