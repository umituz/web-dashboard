import type { ReactNode } from 'react';

export interface DataToolbarFilterOption {
  readonly value: string;
  readonly label: string;
}

export interface DataToolbarFilter {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly options: readonly DataToolbarFilterOption[];
  readonly onChange: (value: string) => void;
  readonly allLabel?: string;
}

export interface ActiveFilterChip {
  readonly id: string;
  readonly label: string;
  readonly valueLabel: string;
  readonly onRemove: () => void;
}

export interface ViewSwitcherOption {
  readonly id: string;
  readonly label: string;
  readonly icon?: ReactNode;
}

export interface DataToolbarProps {
  readonly search?: {
    readonly value: string;
    readonly onChange: (value: string) => void;
    readonly placeholder?: string;
  };
  readonly filters?: readonly DataToolbarFilter[];
  readonly activeFilters?: readonly ActiveFilterChip[];
  readonly onClearAllFilters?: () => void;
  readonly count?: number | { readonly shown: number; readonly total?: number };
  readonly viewSwitcher?: {
    readonly current: string;
    readonly options: readonly ViewSwitcherOption[];
    readonly onChange: (viewId: string) => void;
  };
  readonly actions?: ReactNode;
  readonly children?: ReactNode;
  readonly className?: string;
}
