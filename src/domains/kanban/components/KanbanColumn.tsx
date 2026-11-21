import { useCallback, useState, type DragEvent, type ReactNode } from 'react';
import { Plus } from 'lucide-react';
import type { KanbanCardActions, KanbanColumn as IKanbanColumn, KanbanItem } from '../types';
import { KanbanCard } from './KanbanCard';

export interface KanbanColumnProps<T = unknown> {
  readonly column: IKanbanColumn<T>;
  readonly items: readonly KanbanItem<T>[];
  readonly draggingItemId?: string | null;
  readonly getCardActions?: (item: KanbanItem<T>, column: IKanbanColumn<T>) => KanbanCardActions;
  readonly onDropItem?: (targetColumnId: string, itemId: string) => void;
  readonly onSelectItem?: (item: KanbanItem<T>) => void;
  readonly onColumnAction?: (columnId: string) => void;
  readonly onDragStartCard?: (e: DragEvent<HTMLDivElement>, item: KanbanItem<T>) => void;
  readonly onDragEndCard?: (e: DragEvent<HTMLDivElement>, item: KanbanItem<T>) => void;
  readonly renderCard?: (
    item: KanbanItem<T>,
    column: IKanbanColumn<T>,
    actions?: KanbanCardActions,
  ) => ReactNode;
  readonly renderColumnHeader?: (
    column: IKanbanColumn<T>,
    items: readonly KanbanItem<T>[],
  ) => ReactNode;
  readonly renderColumnFooter?: (column: IKanbanColumn<T>) => ReactNode;
  readonly renderEmptyColumn?: (column: IKanbanColumn<T>) => ReactNode;
  readonly showStageActions?: boolean;
  readonly emptyText?: string;
  readonly className?: string;
  readonly cardClassName?: string;
}

export function KanbanColumn<T = unknown>({
  column,
  items,
  draggingItemId,
  getCardActions,
  onDropItem,
  onSelectItem,
  onColumnAction,
  onDragStartCard,
  onDragEndCard,
  renderCard,
  renderColumnHeader,
  renderColumnFooter,
  renderEmptyColumn,
  showStageActions,
  emptyText = 'Drop here',
  className,
  cardClassName,
}: KanbanColumnProps<T>): ReactNode {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      const itemId = e.dataTransfer.getData('text/plain');
      if (itemId) {
        onDropItem?.(column.id, itemId);
      }
    },
    [column.id, onDropItem],
  );

  const isLimitExceeded =
    typeof column.limit === 'number' && column.limit > 0 && items.length > column.limit;

  return (
    <div
      className={`udb-kanban-col${isDragOver ? ' is-drag-over' : ''}${className ? ` ${className}` : ''}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-column-id={column.id}
    >
      {renderColumnHeader ? (
        renderColumnHeader(column, items)
      ) : (
        <div className="udb-kanban-col-head">
          <div className="udb-kanban-col-title-wrap">
            {column.icon}
            {column.tone && (
              <span
                className={`udb-kanban-tone-dot tone-${column.tone}`}
                aria-hidden="true"
              />
            )}
            <span className="udb-kanban-col-title">{column.title}</span>
            <span className="udb-kanban-col-count">{items.length}</span>
            {typeof column.limit === 'number' && column.limit > 0 && (
              <span
                className={`udb-kanban-col-limit${isLimitExceeded ? ' is-exceeded' : ''}`}
              >
                / {column.limit}
              </span>
            )}
          </div>

          <div className="udb-kanban-col-actions">
            {column.headerActions}
            {onColumnAction && (
              <button
                type="button"
                className="udb-kanban-col-btn"
                onClick={() => onColumnAction(column.id)}
                aria-label={`Add item to ${String(column.title)}`}
              >
                <Plus size={15} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="udb-kanban-col-body">
        {items.length === 0 ? (
          renderEmptyColumn ? (
            renderEmptyColumn(column)
          ) : (
            <div className="udb-kanban-empty-col">{emptyText}</div>
          )
        ) : (
          items.map((item) => (
            <KanbanCard<T>
              key={item.id}
              item={item}
              column={column}
              actions={getCardActions?.(item, column)}
              renderCard={renderCard}
              onSelectItem={onSelectItem}
              onDragStart={onDragStartCard}
              onDragEnd={onDragEndCard}
              isDragging={draggingItemId === item.id}
              showStageActions={showStageActions}
              className={cardClassName}
            />
          ))
        )}
      </div>

      {renderColumnFooter && renderColumnFooter(column)}
    </div>
  );
}
