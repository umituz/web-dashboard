import type {
  AccountGateScreenConfig,
  PaywallScreenConfig,
  PermissionPrimingScreenConfig,
} from '../types/screens';

export function hasOnRequest(config: PermissionPrimingScreenConfig): boolean {
  return typeof config.onRequest === 'function';
}

export function hasOnAccept(config: PaywallScreenConfig): boolean {
  return typeof config.onAccept === 'function';
}

export function hasOnSignIn(config: AccountGateScreenConfig): boolean {
  return typeof config.onSignIn === 'function';
}

export function accountGateAllowsSkip(config: AccountGateScreenConfig): boolean {
  return config.optional === true;
}
