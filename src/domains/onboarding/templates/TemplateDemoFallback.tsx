import { useState } from 'react';
import { Button } from '@umituz/web-design-system/atoms';
import { Sparkles } from 'lucide-react';
import { cn } from '@umituz/web-design-system/utils/cn';
import type { DemoConfig, OnboardingScreen } from '../types/screens';

export interface TemplateDemoResult {
  variant: string;
  palette: string[];
  generatedAt: number;
}

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
    <div className="udb-onb-question__body">
      <div className="udb-onb-palettes">
        {palettes.map((p, i) => (
          <button
            key={p.variant}
            type="button"
            onClick={() => setActiveIdx(i)}
            className={cn('udb-onb-palette', i === activeIdx && 'udb-onb-palette--active')}
          >
            <div className="udb-onb-palette__strip">
              {p.palette.map((c) => (
                <span key={c} className="udb-onb-palette__chip" style={{ background: c }} />
              ))}
            </div>
            <span className="udb-onb-palette__name">{p.variant}</span>
          </button>
        ))}
      </div>
      <div className="udb-onb-palette-preview">
        <div className="udb-onb-palette__strip udb-onb-palette__strip--lg">
          {active.palette.map((c) => (
            <span key={c} className="udb-onb-palette__chip" style={{ background: c }} />
          ))}
        </div>
        <p className="udb-onb-lead">
          Preview: <strong>{active.variant}</strong> palette
        </p>
      </div>
      <Button
        variant="primary"
        size="sm"
        icon={<Sparkles className="udb-onb-icon--sm" />}
        onClick={() =>
          onSave({
            variant: active.variant,
            palette: [...active.palette],
            generatedAt: Date.now(),
          })
        }
      >
        Save this style
      </Button>
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

export function withDefaultDemo(screen: OnboardingScreen, fallback: DemoConfig = fallbackDemo): OnboardingScreen {
  if (screen.type !== 'app-demo') return screen;
  return { ...screen, demo: { ...fallback, ...screen.demo } };
}

export function defaultDemoResult(): TemplateDemoResult {
  return { ...fallbackResult };
}

export { TemplateDemoFallback };
export type { DemoConfig };
