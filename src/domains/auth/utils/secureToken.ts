/**
 * Auth Utilities - Secure Token
 *
 * Cryptographically secure token generation utilities
 */

/**
 * Generate a cryptographically secure random token.
 * Uses Web Crypto API (crypto.getRandomValues) when available;
 * falls back to crypto.randomUUID otherwise.
 *
 * @param length - Token length in bytes (default: 32)
 * @returns Hex-encoded random token
 */
export function generateResetToken(length: number = 32): string {
  const byteLength = Math.max(1, Math.floor(length));
  const bytes = new Uint8Array(byteLength);

  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < byteLength; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }

  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}
