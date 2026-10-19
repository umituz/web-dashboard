import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import type { DemoConfig } from '../types/screens';
import type { OnboardingScreen } from '../types/screens';

export interface TemplateDemoResult {
  variant: string;
  palette: string[];
  generatedAt: number;
}

/**
 * Default demo component used by the art and platform templates.
 * Lets users produce a real artifact in the template without forcing consumers
 * to wire up their own demo before they can preview the flow.
 *
 * Consumers who want their own demo should clone the template and replace
 * `screens[?].demo.component` with their own implementation.
 */
function TemplateDemoFallback({ onSave }: { onSave: (result: TemplateDemoResult) => void }) {
  const palettes: ReadonlyArray<{ variant: string; palette: string[] }> = [
    { variant: 'Minimal', palette: ['#0F172A', '#475569', '#94A3B8', '#F1F5F9', '#FFFFFF'] },
    { variant: 'Bold', palette: ['#7C3AED', '#EC4899', '#F59E0B', '#10B981', '#0EA5E9'] },
    { variant: 'Retro', palette: ['#92400E', '#B45309', '#D97706', '#FCD34D', '#FEF3C7'] },
    { variant: 'Playful', palette: ['#F472B6', '#A78BFA', '#60A9FA', '#34D399', '#FBBF24'] },
  ];

  const [activeIdx, setActiveIdx] = useState(0);
  const active = palettes[activeIdx];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {palettes.map((p, i) => (
          <button
            key={p.variant}
            type="button"
            onClick={() => setActiveIdx(i)}
            className={
              i === activeIdx
                ? 'rounded-lg border-2 border-[rgb(var(--uob-primary-500))] p-2'
                : 'rounded-lg border-2 border-transparent p-2 hover:border-[rgb(var(--uob-border))]'
            }
          >
            <div className="flex h-12 w-full overflow-hidden rounded">
              {p.palette.map((c) => (
                <span key={c} className="flex-1" style={{ background: c }} />
              ))}
            </div>
            <span className="mt-1 block text-xs font-medium text-[rgb(var(--uob-text-primary))]">
              {p.variant}
            </span>
          </button>
        ))}
      </div>
      <div className="rounded-xl border border-[rgb(var(--uob-border))] bg-[rgb(var(--uob-surface))] p-6">
        <div className="flex h-32 w-full overflow-hidden rounded-lg">
          {active.palette.map((c) => (
            <span key={c} className="flex-1" style={{ background: c }} />
          ))}
        </div>
        <p className="mt-3 text-sm text-[rgb(var(--uob-text-muted))]">
          Preview: <strong className="text-[rgb(var(--uob-text-primary))]">{active.variant}</strong>{' '}
          palette
        </p>
      </div>
      <button
        type="button"
        onClick={() =>
          onSave({
            variant: active.variant,
            palette: [...active.palette],
            generatedAt: Date.now(),
          })
        }
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[rgb(var(--uob-primary-500))] px-4 py-3 text-sm font-semibold text-white hover:bg-[rgb(var(--uob-primary-600))]"
      >
        <Sparkles className="h-4 w-4" />
        Save this style
      </button>
    </div>
  );
}

const fallbackDemo: DemoConfig = {
  component: TemplateDemoFallback as React.ComponentType<Record<string, unknown>>,
  onSave: () => undefined,
};

const fallbackResult: TemplateDemoResult = {
  variant: 'Minimal',
  palette: ['#0F172A', '#475569', '#94A3B8', '#F1F5F9', '#FFFFFF'],
  generatedAt: 0,
};

/**
 * Replace an `app-demo` screen in a template with a working default.
 * Used by the art and platform templates so the flow is fully runnable
 * out of the box; consumers can override the demo.component for their app.
 */
export function withDefaultDemo(screen: OnboardingScreen, fallback: DemoConfig = fallbackDemo): OnboardingScreen {
  if (screen.type !== 'app-demo') return screen;
  return { ...screen, demo: { ...fallback, ...screen.demo } };
}

export function defaultDemoResult(): TemplateDemoResult {
  return { ...fallbackResult };
}

// Re-export for convenience.
export { TemplateDemoFallback };
export type { DemoConfig };
