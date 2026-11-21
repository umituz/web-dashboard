import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdminOverview } from './AdminOverview';
import type { AdminKpiItem, AdminSystemHealth } from '../types';

const kpis: AdminKpiItem[] = [
  { id: 'tenants', label: 'Total Tenants', value: 142, sub: '128 active' },
  { id: 'mrr', label: 'Monthly Recurring Revenue', value: '$24,500', change: { value: '+12%', trend: 'up' } },
];

const health: AdminSystemHealth = {
  status: 'healthy',
  latencyMs: 35,
  uptime: '99.95%',
};

describe('AdminOverview', () => {
  it('renders KPI items with values and trends', () => {
    render(<AdminOverview kpis={kpis}><div>Main overview content</div></AdminOverview>);
    expect(screen.getByText('Total Tenants')).toBeTruthy();
    expect(screen.getByText('142')).toBeTruthy();
    expect(screen.getByText('Monthly Recurring Revenue')).toBeTruthy();
    expect(screen.getByText('$24,500')).toBeTruthy();
    expect(screen.getByText('+12%')).toBeTruthy();
    expect(screen.getByText('Main overview content')).toBeTruthy();
  });

  it('renders quick action buttons and handles clicks', () => {
    const handleClick = vi.fn();
    render(
      <AdminOverview
        health={health}
        quickActions={[
          { title: 'Create Tenant', description: 'Add a new organization', onClick: handleClick },
        ]}
      />,
    );

    expect(screen.getByText('Create Tenant')).toBeTruthy();
    expect(screen.getByText('Add a new organization')).toBeTruthy();
    fireEvent.click(screen.getByText('Create Tenant'));
    expect(handleClick).toHaveBeenCalled();
  });
});
