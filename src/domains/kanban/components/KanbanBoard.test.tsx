import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { KanbanBoard } from './KanbanBoard';
import type { KanbanColumn, KanbanItem } from '../types';

interface TaskPayload {
  priority: 'low' | 'medium' | 'high';
}

const COLUMNS: readonly KanbanColumn<TaskPayload>[] = [
  { id: 'todo', title: 'To Do', tone: 'neutral' },
  { id: 'in_progress', title: 'In Progress', tone: 'primary', limit: 2 },
  { id: 'done', title: 'Done', tone: 'success' },
];

const ITEMS: readonly KanbanItem<TaskPayload>[] = [
  {
    id: 'task-1',
    columnId: 'todo',
    title: 'Prepare blueprints',
    description: 'Review structural schematics',
    tone: 'info',
    tags: [{ label: 'Arch' }],
    assignee: { name: 'Alice Smith', initials: 'AS' },
    meta: 'Due tomorrow',
    payload: { priority: 'high' },
  },
  {
    id: 'task-2',
    columnId: 'in_progress',
    title: 'Site excavation',
    tone: 'warning',
    payload: { priority: 'medium' },
  },
];

describe('KanbanBoard', () => {
  it('renders all columns with titles and counts', () => {
    render(<KanbanBoard<TaskPayload> columns={COLUMNS} items={ITEMS} />);

    expect(screen.getByText('To Do')).toBeDefined();
    expect(screen.getByText('In Progress')).toBeDefined();
    expect(screen.getByText('Done')).toBeDefined();

    expect(screen.getByText('Prepare blueprints')).toBeDefined();
    expect(screen.getByText('Site excavation')).toBeDefined();
  });

  it('renders empty column indicator for columns without items', () => {
    render(
      <KanbanBoard<TaskPayload>
        columns={COLUMNS}
        items={ITEMS}
        emptyText="No tasks here"
      />,
    );

    expect(screen.getByText('No tasks here')).toBeDefined();
  });

  it('fires onSelectItem when clicking a card', () => {
    const handleSelect = vi.fn();
    render(
      <KanbanBoard<TaskPayload>
        columns={COLUMNS}
        items={ITEMS}
        onSelectItem={handleSelect}
      />,
    );

    fireEvent.click(screen.getByText('Prepare blueprints'));
    expect(handleSelect).toHaveBeenCalledWith(ITEMS[0]);
  });

  it('fires onSelectItem on Enter key press', () => {
    const handleSelect = vi.fn();
    render(
      <KanbanBoard<TaskPayload>
        columns={COLUMNS}
        items={ITEMS}
        onSelectItem={handleSelect}
      />,
    );

    const card = screen.getByText('Prepare blueprints').closest('.udb-kanban-card');
    expect(card).toBeTruthy();
    if (card) {
      fireEvent.keyDown(card, { key: 'Enter' });
      expect(handleSelect).toHaveBeenCalledWith(ITEMS[0]);
    }
  });

  it('moves item forward via stage button', () => {
    const handleMove = vi.fn();
    render(
      <KanbanBoard<TaskPayload>
        columns={COLUMNS}
        items={ITEMS}
        onMoveItem={handleMove}
        showStageActions={true}
      />,
    );

    const forwardBtns = screen.getAllByRole('button', { name: 'Move forward' });
    const firstForward = forwardBtns[0];
    expect(firstForward).toBeDefined();
    if (firstForward) {
      fireEvent.click(firstForward);
      expect(handleMove).toHaveBeenCalledWith('task-1', 'in_progress', 'todo');
    }
  });

  it('moves item backward via stage button', () => {
    const handleMove = vi.fn();
    render(
      <KanbanBoard<TaskPayload>
        columns={COLUMNS}
        items={ITEMS}
        onMoveItem={handleMove}
        showStageActions={true}
      />,
    );

    const backwardBtns = screen.getAllByRole('button', { name: 'Move backward' });
    const inProgressBtn = backwardBtns.find((btn) => !btn.hasAttribute('disabled'));
    expect(inProgressBtn).toBeTruthy();
    if (inProgressBtn) {
      fireEvent.click(inProgressBtn);
      expect(handleMove).toHaveBeenCalledWith('task-2', 'todo', 'in_progress');
    }
  });

  it('handles drag and drop between columns', () => {
    const handleMove = vi.fn();
    const { container } = render(
      <KanbanBoard<TaskPayload>
        columns={COLUMNS}
        items={ITEMS}
        onMoveItem={handleMove}
      />,
    );

    const card = screen.getByText('Prepare blueprints').closest('.udb-kanban-card');
    const doneCol = container.querySelector('[data-column-id="done"]');

    expect(card).toBeTruthy();
    expect(doneCol).toBeTruthy();

    if (card && doneCol) {
      const dataTransfer = {
        setData: vi.fn(),
        getData: vi.fn(() => 'task-1'),
        effectAllowed: 'move',
        dropEffect: 'move',
      };

      fireEvent.dragStart(card, { dataTransfer });
      fireEvent.dragOver(doneCol, { dataTransfer });
      fireEvent.drop(doneCol, { dataTransfer });

      expect(handleMove).toHaveBeenCalledWith('task-1', 'done', 'todo');
    }
  });

  it('prevents dropping into column where canDrop is false', () => {
    const handleMove = vi.fn();
    const blockedCols: readonly KanbanColumn<TaskPayload>[] = [
      { id: 'todo', title: 'To Do', tone: 'neutral' },
      { id: 'in_progress', title: 'In Progress', tone: 'primary' },
      { id: 'done', title: 'Done', tone: 'success', canDrop: false },
    ];

    const { container } = render(
      <KanbanBoard<TaskPayload>
        columns={blockedCols}
        items={ITEMS}
        onMoveItem={handleMove}
      />,
    );

    const card = screen.getByText('Prepare blueprints').closest('.udb-kanban-card');
    const doneCol = container.querySelector('[data-column-id="done"]');

    if (card && doneCol) {
      const dataTransfer = {
        setData: vi.fn(),
        getData: vi.fn(() => 'task-1'),
        effectAllowed: 'move',
        dropEffect: 'move',
      };

      fireEvent.drop(doneCol, { dataTransfer });
      expect(handleMove).not.toHaveBeenCalled();
    }
  });

  it('renders custom card when renderCard is provided', () => {
    render(
      <KanbanBoard<TaskPayload>
        columns={COLUMNS}
        items={ITEMS}
        renderCard={(item) => <div data-testid={`custom-${item.id}`}>Custom: {item.title}</div>}
      />,
    );

    expect(screen.getByTestId('custom-task-1').textContent).toContain('Custom: Prepare blueprints');
  });

  it('indicates when column limit is exceeded', () => {
    const overflowItems: readonly KanbanItem<TaskPayload>[] = [
      ...ITEMS,
      { id: 'task-3', columnId: 'in_progress', title: 'Task 3' },
      { id: 'task-4', columnId: 'in_progress', title: 'Task 4' },
    ];

    render(
      <KanbanBoard<TaskPayload>
        columns={COLUMNS}
        items={overflowItems}
      />,
    );

    const limitPill = screen.getByText('/ 2');
    expect(limitPill.className).toContain('is-exceeded');
  });
});
