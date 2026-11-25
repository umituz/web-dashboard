import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StatGrid } from './StatGrid';

describe('StatGrid', () => {
  it('renders nothing when items is empty and no children', () => {
    const { container } = render(<StatGrid items={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders skeleton cards when loading is true', () => {
    render(<StatGrid loading columns={4} />);
    const grid = screen.getByRole('status');
    expect(grid).toBeTruthy();
    expect(grid.getAttribute('aria-busy')).toBe('true');
  });

  it('renders items with KPI cards and handles onClick', () => {
    const handleClick = vi.fn();
    render(
      <StatGrid
        columns={3}
        items={[
          { id: 'revenue', label: 'Total Revenue', value: '$120k', hint: '12% MoM', onClick: handleClick },
          { id: 'users', label: 'Active Users', value: '450' },
        ]}
      />,
    );
    expect(screen.getByText('Total Revenue')).toBeTruthy();
    expect(screen.getByText('$120k')).toBeTruthy();
    expect(screen.getByText('Active Users')).toBeTruthy();
    expect(screen.getByText('450')).toBeTruthy();

    fireEvent.click(screen.getByText('Total Revenue'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders custom children when provided', () => {
    render(
      <StatGrid columns={2}>
        <div>Custom Block A</div>
        <div>Custom Block B</div>
      </StatGrid>,
    );
    expect(screen.getByText('Custom Block A')).toBeTruthy();
    expect(screen.getByText('Custom Block B')).toBeTruthy();
  });
});
