import { describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useCommandPalette } from './useCommandPalette';

describe('useCommandPalette', () => {
  it('initializes with defaultOpen false and toggles state', () => {
    const onOpenChange = vi.fn();
    const { result } = renderHook(() => useCommandPalette({ onOpenChange }));

    expect(result.current.open).toBe(false);

    act(() => {
      result.current.toggle();
    });
    expect(result.current.open).toBe(true);
    expect(onOpenChange).toHaveBeenCalledWith(true);

    act(() => {
      result.current.close();
    });
    expect(result.current.open).toBe(false);
    expect(onOpenChange).toHaveBeenCalledWith(false);

    act(() => {
      result.current.openPalette();
    });
    expect(result.current.open).toBe(true);
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('toggles on Cmd+K keydown', () => {
    const { result } = renderHook(() => useCommandPalette());
    expect(result.current.open).toBe(false);

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
    });
    expect(result.current.open).toBe(true);

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
    });
    expect(result.current.open).toBe(false);
  });

  it('respects shortcut: false option', () => {
    const { result } = renderHook(() => useCommandPalette({ shortcut: false }));
    expect(result.current.open).toBe(false);

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
    });
    expect(result.current.open).toBe(false);
  });
});
