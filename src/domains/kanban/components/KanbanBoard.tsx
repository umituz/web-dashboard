import { useCallback, useMemo, useState, type DragEvent, type ReactNode } from 'react';
import type { KanbanBoardProps, KanbanCardActions, KanbanColumn as IKanbanColumn, KanbanItem } from '../types';
import { KanbanColumn } from './KanbanColumn';

export function KanbanBoard<T = unknown>({
  columns,
  items,
  onMoveItem,
  onSelectItem,
  onColumnAction,
  renderCard,
  renderColumnHeader,
  renderColumnFooter,
  renderEmptyColumn,
  showStageActions = true,
  emptyText,
  className,
  columnClassName,
  cardClassName,
}: KanbanBoardProps<T>): ReactNode {
  const [draggingItemId, setDraggingItemId] = useState<string | null>(null);

  const itemsByColumn = useMemo(() => {
    const map = new Map<string, KanbanItem<T>[]>();
    for (const col of columns) {
      map.set(col.id, []);
    }
    for (const item of items) {
      const list = map.get(item.columnId);
      if (list) {
        list.push(item);
      } else {
        map.set(item.columnId, [item]);
      }
    }
    return map;
  }, [columns, items]);

  const columnIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    columns.forEach((col, idx) => {
      map.set(col.id, idx);
    });
    return map;
  }, [columns]);

  const handleDragStartCard = useCallback(
    (_e: DragEvent<HTMLDivElement>, item: KanbanItem<T>) => {
      setDraggingItemId(item.id);
    },
    [],
  );

  const handleDragEndCard = useCallback(() => {
    setDraggingItemId(null);
  }, []);

  const handleDropItem = useCallback(
    (targetColumnId: string, itemId: string) => {
      setDraggingItemId(null);
      const item = items.find((i) => i.id === itemId);
      if (!item || item.columnId === targetColumnId) {
        return;
      }
      const targetColumn = columns.find((c) => c.id === targetColumnId);
      if (targetColumn) {
        if (targetColumn.canDrop === false) {
          return;
        }
        if (typeof targetColumn.canDrop === 'function' && !targetColumn.canDrop(item)) {
          return;
        }
      }
      onMoveItem?.(itemId, targetColumnId, item.columnId);
    },
    [columns, items, onMoveItem],
  );

  const getCardActions = useCallback(
    (item: KanbanItem<T>, column: IKanbanColumn<T>): KanbanCardActions => {
      const colIdx = columnIndexMap.get(column.id) ?? -1;
      const canMoveBack = colIdx > 0;
      const canMoveForward = colIdx >= 0 && colIdx < columns.length - 1;

      return {
        canMoveBack,
        canMoveForward,
        moveBack: () => {
          if (canMoveBack) {
            const prevCol = columns[colIdx - 1];
            if (prevCol) {
              onMoveItem?.(item.id, prevCol.id, column.id);
            }
          }
        },
        moveForward: () => {
          if (canMoveForward) {
            const nextCol = columns[colIdx + 1];
            if (nextCol) {
              onMoveItem?.(item.id, nextCol.id, column.id);
            }
          }
        },
      };
    },
    [columnIndexMap, columns, onMoveItem],
  );

  return (
    <div className={`udb-kanban-board${className ? ` ${className}` : ''}`}>
      {columns.map((column) => (
        <KanbanColumn<T>
          key={column.id}
          column={column}
          items={itemsByColumn.get(column.id) ?? []}
          draggingItemId={draggingItemId}
          getCardActions={getCardActions}
          onDropItem={handleDropItem}
          onSelectItem={onSelectItem}
          onColumnAction={onColumnAction}
          onDragStartCard={handleDragStartCard}
          onDragEndCard={handleDragEndCard}
          renderCard={renderCard}
          renderColumnHeader={renderColumnHeader}
          renderColumnFooter={renderColumnFooter}
          renderEmptyColumn={renderEmptyColumn}
          showStageActions={showStageActions}
          emptyText={emptyText}
          className={columnClassName}
          cardClassName={cardClassName}
        />
      ))}
    </div>
  );
}
