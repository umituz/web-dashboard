import { useRef, useState } from 'react';

export const PALETTE = ['#357344', '#b06e22', '#3e5f80', '#7a6ba8', '#8a5a3b', '#5e7d5a', '#a8b5a0', '#c9862f'];

export interface TipRow {
  label: string;
  value: string;
  color?: string;
}

export interface TipState {
  x: number;
  y: number;
  title: string;
  rows: TipRow[];
}

export function useTip() {
  const [tip, setTip] = useState<TipState | null>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const show = (e: React.MouseEvent, title: string, rows: TipRow[]) => {
    const rect = hostRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTip({ x: e.clientX - rect.left, y: e.clientY - rect.top, title, rows });
  };
  const hide = () => setTip(null);
  return { tip, hostRef, show, hide };
}

export function niceMax(max: number): number {
  if (max <= 0) return 1;
  const exp = Math.floor(Math.log10(max));
  const base = Math.pow(10, exp);
  const frac = max / base;
  const nice = frac <= 1 ? 1 : frac <= 2 ? 2 : frac <= 2.5 ? 2.5 : frac <= 5 ? 5 : 10;
  return nice * base;
}

export function gridTicks(max: number, count = 4): number[] {
  const nice = niceMax(max);
  return Array.from({ length: count + 1 }, (_, i) => (nice / count) * i);
}
