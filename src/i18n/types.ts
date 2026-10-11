/**
 * Translation function contract.
 *
 * Keyed by the package's i18n catalog constants (e.g. AUTH_KEYS);
 * `params` feeds `{{placeholder}}` interpolation. The signature is
 * deliberately compatible with i18next's `t` so hosts can bridge
 * their own setup: `<DashboardI18nProvider t={i18n.t}>`.
 */

export type TranslateFn = (
  key: string,
  params?: Record<string, unknown>,
) => string;
