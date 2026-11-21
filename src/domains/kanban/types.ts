import type { ReactNode } from 'react';

export type KanbanTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

export interface KanbanTag {
  readonly label: string;
  readonly tone?: KanbanTone | string;
}

export interface KanbanAssignee {
  readonly name: string;
  readonly avatarUrl?: string;
  readonly initials?: string;
}

export interface KanbanItem<T = unknown> {
  readonly id: string;
  readonly columnId: string;
  readonly title: ReactNode;
  readonly description?: ReactNode;
  readonly tone?: KanbanTone;
  readonly badge?: ReactNode;
  readonly tags?: readonly KanbanTag[];
  readonly assignee?: KanbanAssignee;
  readonly meta?: ReactNode;
  readonly disabled?: boolean;
  readonly payload?: T;
}

export interface KanbanColumn<T = unknown> {
  readonly id: string;
  readonly title: ReactNode;
  readonly tone?: KanbanTone;
  readonly limit?: number;
  readonly badge?: ReactNode;
  readonly icon?: ReactNode;
  readonly headerActions?: ReactNode;
  readonly canDrop?: boolean | ((draggedItem: KanbanItem<T>) => boolean);
  readonly meta?: ReactNode;
}

export interface KanbanCardActions {
  readonly canMoveBack: boolean;
  readonly canMoveForward: boolean;
  readonly moveBack: () => void;
  readonly moveForward: () => void;
}

export interface KanbanBoardProps<T = unknown> {
  readonly columns: readonly KanbanColumn<T>[];
  readonly items: readonly KanbanItem<T>[];
  readonly onMoveItem?: (
    itemId: string,
    targetColumnId: string,
    sourceColumnId: string,
    targetIndex?: number,
  ) => void;
  readonly onSelectItem?: (item: KanbanItem<T>) => void;
  readonly onColumnAction?: (columnId: string) => void;
  readonly renderCard?: (
    item: KanbanItem<T>,
    column: KanbanColumn<T>,
    actions?: KanbanCardActions,
  ) => ReactNode;
  readonly renderColumnHeader?: (
    column: KanbanColumn<T>,
    items: readonly KanbanItem<T>[],
  ) => ReactNode;
  readonly renderColumnFooter?: (column: KanbanColumn<T>) => ReactNode;
  readonly renderEmptyColumn?: (column: KanbanColumn<T>) => ReactNode;
  readonly showStageActions?: boolean;
  readonly emptyText?: string;
  readonly className?: string;
  readonly columnClassName?: string;
  readonly cardClassName?: string;
}

export interface KanbanKpi {
  readonly label: string;
  readonly value: ReactNode;
  readonly hint?: ReactNode;
  readonly change?: string;
  readonly tone?: KanbanTone;
  readonly icon?: ReactNode;
}

export interface KanbanPageProps<T = unknown> extends KanbanBoardProps<T> {
  readonly kicker?: ReactNode;
  readonly title: ReactNode;
  readonly subtitle?: ReactNode;
  readonly actions?: ReactNode;
  readonly callout?: ReactNode;
  readonly kpis?: readonly KanbanKpi[];
  readonly search?: {
    readonly value: string;
    readonly onChange: (value: string) => void;
    readonly placeholder?: string;
  };
  readonly filterBar?: ReactNode;
  readonly loading?: boolean;
  readonly footer?: ReactNode;
  readonly children?: ReactNode;
}
