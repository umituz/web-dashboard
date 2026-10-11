/**
 * Dashboard i18n injection.
 *
 * The package ships no i18n runtime. Hosts that have one wrap their
 * app once: `<DashboardI18nProvider t={i18n.t}>` — the signature
 * already matches i18next (and the fleet's custom `t()` helpers).
 * Without a provider, `useT()` falls back to `defaultT`, which
 * humanizes catalog keys into readable English.
 *
 * Components consume only `useT()`; the key catalogs (i18nKeys.ts)
 * remain the documented string contract.
 */

import { createContext, useContext, type ReactNode } from "react";
import { defaultT } from "./defaultT";
import type { TranslateFn } from "./types";

export interface DashboardI18nProviderProps {
  /** Host translation function (e.g. i18next's `t`). */
  t: TranslateFn;
  children: ReactNode;
}

const I18nContext = createContext<TranslateFn | null>(null);

export const DashboardI18nProvider = ({
  t,
  children,
}: DashboardI18nProviderProps) => (
  <I18nContext.Provider value={t}>{children}</I18nContext.Provider>
);

export const useT = (): TranslateFn => useContext(I18nContext) ?? defaultT;
