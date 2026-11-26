import { useCallback, useEffect, useState } from 'react';

export interface UseCommandPaletteOptions {
  shortcut?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function useCommandPalette(options: UseCommandPaletteOptions = {}) {
  const { shortcut = true, defaultOpen = false, onOpenChange } = options;
  const [open, setOpen] = useState(defaultOpen);

  const toggle = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
      onOpenChange?.(next);
      return next;
    });
  }, [onOpenChange]);

  const openPalette = useCallback(() => {
    setOpen(true);
    onOpenChange?.(true);
  }, [onOpenChange]);

  const close = useCallback(() => {
    setOpen(false);
    onOpenChange?.(false);
  }, [onOpenChange]);

  useEffect(() => {
    if (!shortcut) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [shortcut, toggle]);

  return {
    open,
    setOpen,
    toggle,
    openPalette,
    close,
  };
}
