import { useCallback, useEffect, useState } from 'react';
import type { PermissionStatus, PermissionType } from '../../types/screens';
import {
  isPermissionDecided,
  isPermissionUnsupported,
} from '../../predicates/permission-granted';
import { queryPermissionStatus, requestPermission } from '../../utils/permission-bridge';

export interface UsePermissionPrimingReturn {
  status: PermissionStatus;
  isRequesting: boolean;
  requestPermission: () => Promise<PermissionStatus>;
  reset: () => void;
}

/**
 * Owns permission state for a single permission type.
 * Single responsibility: query + request lifecycle, no UI.
 *
 * The `requestPermission` callback is a no-op (returns the current status)
 * once the permission has been decided or the runtime reports no support.
 */
export function usePermissionPriming(permission: PermissionType): UsePermissionPrimingReturn {
  const [status, setStatus] = useState<PermissionStatus>('prompt');
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    queryPermissionStatus(permission).then((initial) => {
      if (!cancelled) setStatus(initial);
    });
    return () => {
      cancelled = true;
    };
  }, [permission]);

  const request = useCallback(async (): Promise<PermissionStatus> => {
    if (isPermissionDecided(status) || isPermissionUnsupported(status)) return status;
    setIsRequesting(true);
    try {
      const next = await requestPermission(permission);
      setStatus(next);
      return next;
    } finally {
      setIsRequesting(false);
    }
  }, [permission, status]);

  const reset = useCallback(() => setStatus('prompt'), []);

  return { status, isRequesting, requestPermission: request, reset };
}
