import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdminKpiGrid } from './AdminKpiGrid';
import type { AdminKpiItem } from '../types';

const items: AdminKpiItem[] = [
  {
    id: 'kpi-1',
    label: 'Total Users',
    value: '1,420',
    sub: '+12% from last month',
    change: { value: '+12%', trend: 'up' },
  },
  {
    id: 'kpi-2',
    label: 'Open Reports',
    value: '5',
    sub: '-2 resolved today',
    change: { value: '-28%', trend: 'down' },
  },
];

describe('AdminKpiGrid', () => {
  it('renders KPI cards with labels, values, and trends', () => {
    render(<AdminKpiGrid items={items} />);
    expect(screen.getByText('Total Users')).toBeTruthy();
    expect(screen.getByText('1,420')).toBeTruthy();
    expect(screen.getByText('+12% from last month')).toBeTruthy();
    expect(screen.getByText('+12%')).toBeTruthy();

    expect(screen.getByText('Open Reports')).toBeTruthy();
    expect(screen.getByText('5')).toBeTruthy();
    expect(screen.getByText('-28%')).toBeTruthy();
  });

  it('renders null when items list is empty', () => {
    const { container } = render(<AdminKpiGrid items={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
