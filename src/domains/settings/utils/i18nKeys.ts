/**
 * Settings domain i18n keys (admin skeleton screens) — the
 * documented string contract. Column titles and role labels come
 * from props; only empty/denied states fall back to these keys.
 */

export const SETTINGS_ADMIN_KEYS = {
  users: {
    empty: "settings.users.empty",
  },
  matrix: {
    granted: "settings.matrix.granted",
    denied: "settings.matrix.denied",
  },
  audit: {
    empty: "settings.audit.empty",
  },
} as const;
