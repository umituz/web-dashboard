import { describe, it, expect, vi, afterEach } from 'vitest';
import { queryPermissionStatus, requestPermission } from './permission-bridge';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('queryPermissionStatus', () => {
  it('maps photos to prompt and contacts to unsupported (no web-standard API)', async () => {
    await expect(queryPermissionStatus('photos')).resolves.toBe('prompt');
    await expect(queryPermissionStatus('contacts')).resolves.toBe('unsupported');
  });

  it('reads Notification.permission for notifications', async () => {
    vi.stubGlobal('Notification', { permission: 'granted' });
    await expect(queryPermissionStatus('notifications')).resolves.toBe('granted');
  });

  it('normalizes the browser "default" state to prompt', async () => {
    vi.stubGlobal('Notification', { permission: 'default' });
    await expect(queryPermissionStatus('notifications')).resolves.toBe('prompt');
  });

  it('returns unsupported when Notification is missing', async () => {
    const original = (globalThis as { Notification?: unknown }).Notification;
    vi.stubGlobal('Notification', undefined);
    try {
      await expect(queryPermissionStatus('notifications')).resolves.toBe('unsupported');
    } finally {
      if (original !== undefined) vi.stubGlobal('Notification', original);
    }
  });
});

describe('requestPermission — never throws', () => {
  it('resolves granted when the user accepts notifications', async () => {
    vi.stubGlobal('Notification', {
      permission: 'default',
      requestPermission: () => Promise.resolve('granted'),
    });
    await expect(requestPermission('notifications')).resolves.toBe('granted');
  });

  it('resolves denied when the user rejects notifications', async () => {
    vi.stubGlobal('Notification', {
      permission: 'default',
      requestPermission: () => Promise.resolve('denied'),
    });
    await expect(requestPermission('notifications')).resolves.toBe('denied');
  });

  it('maps a throwing requestPermission to denied, not a rejection', async () => {
    vi.stubGlobal('Notification', {
      permission: 'default',
      requestPermission: () => Promise.reject(new Error('blocked')),
    });
    await expect(requestPermission('notifications')).resolves.toBe('denied');
  });

  it('returns unsupported for permission types without a web API', async () => {
    await expect(requestPermission('contacts')).resolves.toBe('unsupported');
  });
});
