import type {
  AccountGateScreenConfig,
  PaywallScreenConfig,
  PermissionPrimingScreenConfig,
} from '../types/screens';

/** Does the permission-priming config expose a usable `onRequest` callback? */
export function hasOnRequest(config: PermissionPrimingScreenConfig): boolean {
  return typeof config.onRequest === 'function';
}

/** Does the paywall config expose a usable `onAccept` callback? */
export function hasOnAccept(config: PaywallScreenConfig): boolean {
  return typeof config.onAccept === 'function';
}

/** Does the account-gate config expose a usable `onSignIn` callback? */
export function hasOnSignIn(config: AccountGateScreenConfig): boolean {
  return typeof config.onSignIn === 'function';
}

/** Is a skip affordance allowed by the account-gate config? */
export function accountGateAllowsSkip(config: AccountGateScreenConfig): boolean {
  return config.optional === true;
}
