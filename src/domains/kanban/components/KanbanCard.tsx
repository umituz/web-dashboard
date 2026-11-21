import { useCallback, type DragEvent, type KeyboardEvent, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { KanbanCardActions, KanbanColumn, KanbanItem } from '../types';

export interface KanbanCardProps<T = unknown> {
  readonly item: KanbanItem<T>;
  readonly column: KanbanColumn<T>;
  readonly actions?: KanbanCardActions;
  readonly renderCard?: (
    item: KanbanItem<T>,
    column: KanbanColumn<T>,
    actions?: KanbanCardActions,
  ) => ReactNode;
  readonly onSelectItem?: (item: KanbanItem<T>) => void;
  readonly onDragStart?: (e: DragEvent<HTMLDivElement>, item: KanbanItem<T>) => void;
  readonly onDragEnd?: (e: DragEvent<HTMLDivElement>, item: KanbanItem<T>) => void;
  readonly isDragging?: boolean;
  readonly showStageActions?: boolean;
  readonly className?: string;
}

export function KanbanCard<T = unknown>({
  item,
  column,
  actions,
  renderCard,
  onSelectItem,
  onDragStart,
  onDragEnd,
  isDragging = false,
  showStageActions = false,
  className,
}: KanbanCardProps<T>): ReactNode {
  const handleClick = useCallback(() => {
    onSelectItem?.(item);
  }, [onSelectItem, item]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if ((e.target as HTMLElement).tagName.toLowerCase() === 'button') {
          return;
        }
        e.preventDefault();
        onSelectItem?.(item);
      }
    },
    [onSelectItem, item],
  );

  const handleDragStart = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.dataTransfer.setData('text/plain', item.id);
      e.dataTransfer.effectAllowed = 'move';
      onDragStart?.(e, item);
    },
    [item, onDragStart],
  );

  const handleDragEnd = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      onDragEnd?.(e, item);
    },
    [item, onDragEnd],
  );

  if (renderCard) {
    return (
      <div
        draggable={!item.disabled}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        className={`udb-kanban-card${isDragging ? ' is-dragging' : ''}${item.disabled ? ' is-disabled' : ''}${className ? ` ${className}` : ''}`}
      >
        {renderCard(item, column, actions)}
      </div>
    );
  }

  return (
    <div
      draggable={!item.disabled}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className={`udb-kanban-card${isDragging ? ' is-dragging' : ''}${item.disabled ? ' is-disabled' : ''}${className ? ` ${className}` : ''}`}
    >
      <div className="udb-kanban-card-head">
        <div className="udb-kanban-card-title">{item.title}</div>
        {item.badge}
      </div>

      {item.description && <div className="udb-kanban-card-desc">{item.description}</div>}

      {item.tags && item.tags.length > 0 && (
        <div className="udb-kanban-card-tags">
          {item.tags.map((tag) => (
            <span key={tag.label} className="udb-kanban-card-tag">
              {tag.label}
            </span>
          ))}
        </div>
      )}

      {(item.meta || item.assignee || (showStageActions && actions)) && (
        <div className="udb-kanban-card-foot">
          <div className="udb-kanban-card-meta">
            {item.assignee && (
              <span className="udb-kanban-card-assignee">
                <span className="udb-kanban-card-avatar">
                  {item.assignee.avatarUrl ? (
                    <img src={item.assignee.avatarUrl} alt={item.assignee.name} />
                  ) : (
                    item.assignee.initials ?? item.assignee.name.slice(0, 2)
                  )}
                </span>
                <span>{item.assignee.name}</span>
              </span>
            )}
            {item.meta}
          </div>

          {showStageActions && actions && (
            <div
              className="udb-kanban-stage-actions"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="udb-kanban-stage-btn"
                disabled={!actions.canMoveBack}
                onClick={actions.moveBack}
                aria-label="Move backward"
              >
                <ChevronLeft size={13} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="udb-kanban-stage-btn"
                disabled={!actions.canMoveForward}
                onClick={actions.moveForward}
                aria-label="Move forward"
              >
                <ChevronRight size={13} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
