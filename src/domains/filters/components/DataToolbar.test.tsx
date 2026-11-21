import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataToolbar } from './DataToolbar';

describe('DataToolbar', () => {
  it('renders search input and calls onChange', () => {
    const handleSearch = vi.fn();
    render(
      <DataToolbar
        search={{ value: '', onChange: handleSearch, placeholder: 'Filter records…' }}
      />,
    );
    const input = screen.getByPlaceholderText('Filter records…');
    expect(input).toBeTruthy();
    fireEvent.change(input, { target: { value: 'test' } });
    expect(handleSearch).toHaveBeenCalledWith('test');
  });

  it('renders record count label', () => {
    render(<DataToolbar count={{ shown: 10, total: 50 }} />);
    expect(screen.getByTestId('data-toolbar-count').textContent).toBe('10 of 50');
  });

  it('renders active filter chips and handles remove and clear all', () => {
    const handleRemove = vi.fn();
    const handleClearAll = vi.fn();
    render(
      <DataToolbar
        activeFilters={[
          { id: 'status', label: 'Status', valueLabel: 'Active', onRemove: handleRemove },
        ]}
        onClearAllFilters={handleClearAll}
      />,
    );
    expect(screen.getByText('Status:')).toBeTruthy();
    expect(screen.getByText('Active')).toBeTruthy();

    fireEvent.click(screen.getByLabelText('Remove filter Status'));
    expect(handleRemove).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Clear all'));
    expect(handleClearAll).toHaveBeenCalled();
  });

  it('renders view switcher buttons and handles change', () => {
    const handleViewChange = vi.fn();
    render(
      <DataToolbar
        viewSwitcher={{
          current: 'table',
          options: [
            { id: 'table', label: 'Table' },
            { id: 'kanban', label: 'Kanban' },
          ],
          onChange: handleViewChange,
        }}
      />,
    );
    expect(screen.getByText('Table')).toBeTruthy();
    expect(screen.getByText('Kanban')).toBeTruthy();

    fireEvent.click(screen.getByText('Kanban'));
    expect(handleViewChange).toHaveBeenCalledWith('kanban');
  });
});
