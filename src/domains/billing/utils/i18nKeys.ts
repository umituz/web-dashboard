/**
 * Billing Domain i18n Keys
 */

export const BILLING_KEYS = {
  // Page
  page: {
    backToDashboard: 'billing.page.backToDashboard',
    title: 'billing.page.title',
    description: 'billing.page.description',
    needHelp: 'billing.page.needHelp',
    contact: 'billing.page.contact',
    contactAria: 'billing.page.contactAria',
  },

  // Common
  common: {
    loading: 'common.loading',
    usage: 'common.usage',
  },

  // Portal
  portal: {
    tabs: {
      overview: 'billing.portal.tabs.overview',
      paymentMethods: 'billing.portal.tabs.paymentMethods',
      invoices: 'billing.portal.tabs.invoices',
      plan: 'billing.portal.tabs.plan',
    },
    overview: {
      currentSubscription: 'billing.portal.overview.currentSubscription',
      trialDaysLeft: 'billing.portal.overview.trialDaysLeft',
      nextBilling: 'billing.portal.overview.nextBilling',
      upcomingInvoice: 'billing.portal.overview.upcomingInvoice',
    },
    invoices: {
      title: 'billing.portal.invoices.title',
      empty: 'billing.portal.invoices.empty',
    },
    plan: {
      title: 'billing.portal.plan.title',
      actionsTitle: 'billing.portal.plan.actionsTitle',
      changePlan: 'billing.portal.plan.changePlan',
      cancelSubscription: 'billing.portal.plan.cancelSubscription',
      confirmCancel: 'billing.portal.plan.confirmCancel',
      cancelling: 'billing.portal.plan.cancelling',
      cancelConfirmMessage: 'billing.portal.plan.cancelConfirmMessage',
    },
    paymentMethods: {
      addNew: 'billing.portal.paymentMethods.addNew',
      empty: 'billing.portal.paymentMethods.empty',
    },
  },

  // Plan comparison
  planComparison: {
    monthly: 'billing.planComparison.monthly',
    yearly: 'billing.planComparison.yearly',
    save: 'billing.planComparison.save',
    mostPopular: 'billing.planComparison.mostPopular',
    bestValue: 'billing.planComparison.bestValue',
    processing: 'billing.planComparison.processing',
    currentPlan: 'billing.planComparison.currentPlan',
    selectPlan: 'billing.planComparison.selectPlan',
    monthlyShort: 'billing.planComparison.monthlyShort',
    yearlyShort: 'billing.planComparison.yearlyShort',
    saveWithYearly: 'billing.planComparison.saveWithYearly',
    trial: 'billing.planComparison.trial',
    trialWithBrand: 'billing.planComparison.trialWithBrand',
    billingCycleLabel: 'billing.planComparison.billingCycleLabel',
    radiogroupLabel: 'billing.planComparison.radiogroupLabel',
  },

  // Payment methods
  paymentMethods: {
    none: 'billing.paymentMethods.none',
    add: 'billing.paymentMethods.add',
    expires: 'billing.paymentMethods.expires',
    default: 'billing.paymentMethods.default',
    bankAccount: 'billing.paymentMethods.bankAccount',
    setDefault: 'billing.paymentMethods.setDefault',
    remove: 'billing.paymentMethods.remove',
    removeConfirm: 'billing.paymentMethods.removeConfirm',
    confirmRemove: 'billing.paymentMethods.confirmRemove',
    cancelRemove: 'billing.paymentMethods.cancelRemove',
  },

  // Invoice
  invoice: {
    moreItems: 'billing.invoice.moreItems',
    due: 'billing.invoice.due',
    viewInvoice: 'billing.invoice.viewInvoice',
    downloadPdf: 'billing.invoice.downloadPdf',
  },

  // Usage
  usage: {
    limit: 'billing.usage.limit',
    resets: 'billing.usage.resets',
  },

  // Status labels
  status: {
    active: 'billing.status.active',
    trialing: 'billing.status.trialing',
    pastDue: 'billing.status.pastDue',
    canceled: 'billing.status.canceled',
    incomplete: 'billing.status.incomplete',
    incompleteExpired: 'billing.status.incompleteExpired',
    unpaid: 'billing.status.unpaid',
    paused: 'billing.status.paused',
  },

  invoiceStatus: {
    draft: 'billing.invoiceStatus.draft',
    open: 'billing.invoiceStatus.open',
    paid: 'billing.invoiceStatus.paid',
    uncollectible: 'billing.invoiceStatus.uncollectible',
    void: 'billing.invoiceStatus.void',
  },

  // Trial
  trial: {
    endsToday: 'billing.trial.endsToday',
    oneDayLeft: 'billing.trial.oneDayLeft',
    daysLeft: 'billing.trial.daysLeft',
  },
} as const;
