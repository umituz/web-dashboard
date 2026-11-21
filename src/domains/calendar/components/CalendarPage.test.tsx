import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { CalendarPage } from './CalendarPage';
import type { CalendarCategory, CalendarPageItem } from '../types';

interface TestPayload {
  kind: 'task' | 'inspection';
  priority: string;
}

const ITEMS: readonly CalendarPageItem<TestPayload>[] = [
  {
    id: 'evt-1',
    dayKey: '2026-11-20',
    title: 'HVAC Filter Replacement',
    tone: 'info',
    startMin: 540,
    endMin: 600,
    meta: 'HQ Tower · 3rd Floor',
    kind: 'task',
    payload: { kind: 'task', priority: 'high' },
  },
  {
    id: 'evt-2',
    dayKey: '2026-11-20',
    title: 'Fire Safety Inspection',
    tone: 'warning',
    startMin: 660,
    endMin: 720,
    meta: 'DC Annex',
    kind: 'inspection',
    payload: { kind: 'inspection', priority: 'critical' },
  },
  {
    id: 'evt-3',
    dayKey: '2026-11-21',
    title: 'Roof Membrane Check',
    tone: 'info',
    meta: 'HQ Tower',
    kind: 'task',
    payload: { kind: 'task', priority: 'medium' },
  },
];

const CATEGORIES: readonly CalendarCategory[] = [
  { id: 'task', label: 'Tasks', tone: 'info' },
  { id: 'inspection', label: 'Inspections', tone: 'warning' },
];

function mount(props: Partial<Parameters<typeof CalendarPage<TestPayload>>[0]> = {}) {
  return render(
    <MemoryRouter>
      <CalendarPage<TestPayload>
        title="Site Operations"
        subtitle="Operational schedule"
        items={ITEMS}
        initialCursor="2026-11-20"
        initialSelectedDay="2026-11-20"
        {...props}
      />
    </MemoryRouter>,
  );
}

describe('CalendarPage', () => {
  it('renders header, subtitle and calendar events', () => {
    mount();
    expect(screen.getByText('Site Operations')).toBeDefined();
    expect(screen.getByText('Operational schedule')).toBeDefined();
    expect(screen.getAllByText('HVAC Filter Replacement').length).toBeGreaterThan(0);
  });

  it('renders custom actions correctly', () => {
    const handleAdd = vi.fn();
    mount({
      actions: {
        label: 'Add Event',
        onClick: handleAdd,
      },
    });
    const addBtn = screen.getByRole('button', { name: /Add Event/i });
    expect(addBtn).toBeDefined();
    fireEvent.click(addBtn);
    expect(handleAdd).toHaveBeenCalledTimes(1);
  });

  it('renders multiple actions as array', () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    mount({
      actions: [
        { label: 'Action 1', onClick: fn1 },
        { label: 'Action 2', onClick: fn2 },
      ],
    });
    expect(screen.getByRole('button', { name: /Action 1/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Action 2/i })).toBeDefined();
  });

  it('renders categories with counts and filters items on category click', () => {
    mount({
      categories: CATEGORIES,
      selectedDayDetail: true,
    });

    expect(screen.getByText('Tasks')).toBeDefined();
    expect(screen.getByText('Inspections')).toBeDefined();

    const inspectionChip = screen.getByRole('button', { name: /Inspections/i });
    fireEvent.click(inspectionChip);

    const allChip = screen.getByRole('button', { name: /^All/i });
    fireEvent.click(allChip);
    expect(allChip.getAttribute('aria-pressed')).toBe('true');
  });

  it('supports single category filter mode', () => {
    mount({
      categories: CATEGORIES,
      categoryMode: 'single',
      selectedDayDetail: true,
    });

    const taskChip = screen.getByRole('button', { name: /Tasks/i });
    fireEvent.click(taskChip);
    expect(taskChip.getAttribute('aria-pressed')).toBe('true');

    const allChip = screen.getByRole('button', { name: /^All/i });
    expect(allChip.getAttribute('aria-pressed')).toBe('false');
  });

  it('renders selected day detail panel when enabled', () => {
    const onSelect = vi.fn();
    const onAddForDay = vi.fn();
    mount({
      selectedDayDetail: {
        action: {
          label: 'Create for day',
          onClick: onAddForDay,
        },
      },
      onSelectItem: onSelect,
    });

    const panel = screen.getByTestId('calendar-selected-day-panel');
    expect(panel).toBeDefined();

    const addForDayBtn = screen.getByRole('button', { name: /Create for day/i });
    fireEvent.click(addForDayBtn);
    expect(onAddForDay).toHaveBeenCalledWith('2026-11-20');

    const itemRow = within(panel).getByText('HVAC Filter Replacement');
    fireEvent.click(itemRow);
    expect(onSelect).toHaveBeenCalled();
  });

  it('shows empty text in selected day detail panel when no items exist', () => {
    mount({
      selectedDay: '2026-11-25',
      selectedDayDetail: {
        emptyText: 'Zero tasks today.',
      },
    });

    expect(screen.getByText('Zero tasks today.')).toBeDefined();
  });

  it('supports custom renderItem and renderEmpty in selected day panel', () => {
    mount({
      selectedDayDetail: {
        renderItem: (item) => <div data-testid="custom-item">{item.title} (custom)</div>,
      },
    });

    expect(screen.getByText('HVAC Filter Replacement (custom)')).toBeDefined();
  });
});
