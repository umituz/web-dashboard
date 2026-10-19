import { motion } from 'framer-motion';
import { cn } from '../../theme/cn';
import { renderBundledIcon } from './renderBundledIcon';
import { doesIconNameResolve } from '../../predicates/icon-name-resolves';
import type { OnboardingOption } from '../../types/screens';

export interface OptionCardProps {
  option: OnboardingOption;
  selected: boolean;
  onToggle: (id: string) => void;
  multiSelect?: boolean;
  className?: string;
}

/**
 * Selectable option card with optional icon.
 * Single responsibility: render one option and emit toggle events.
 */
export function OptionCard({ option, selected, onToggle, multiSelect = false, className }: OptionCardProps) {
  return (
    <motion.button
      type="button"
      role={multiSelect ? 'checkbox' : 'radio'}
      aria-checked={selected}
      onClick={() => onToggle(option.id)}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-[rgb(var(--uob-primary-500))] focus:ring-offset-2',
        selected
          ? 'border-[rgb(var(--uob-primary-500))] bg-[rgb(var(--uob-primary-50))]'
          : 'border-[rgb(var(--uob-border))] bg-[rgb(var(--uob-surface))] hover:border-[rgb(var(--uob-primary-100))]',
        className,
      )}
    >
      {doesIconNameResolve(option.iconName) && (
        <span
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
            selected
              ? 'bg-[rgb(var(--uob-primary-500))] text-white'
              : 'bg-[rgb(var(--uob-surface-muted))] text-[rgb(var(--uob-text-muted))]',
          )}
        >
          {renderBundledIcon(option.iconName, 'h-5 w-5')}
        </span>
      )}
      <span className="flex flex-1 flex-col">
        <span className="text-base font-medium text-[rgb(var(--uob-text-primary))]">
          {option.label}
        </span>
        {option.description && (
          <span className="text-sm text-[rgb(var(--uob-text-muted))]">{option.description}</span>
        )}
      </span>
      <span
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
          selected
            ? 'border-[rgb(var(--uob-primary-500))] bg-[rgb(var(--uob-primary-500))] text-white'
            : 'border-[rgb(var(--uob-border))]',
        )}
        aria-hidden="true"
      >
        {selected && (
          <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 6 L5 9 L10 3" />
          </svg>
        )}
      </span>
    </motion.button>
  );
}
