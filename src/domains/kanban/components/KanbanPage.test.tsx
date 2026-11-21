import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { KanbanPage } from './KanbanPage';
import type { KanbanColumn, KanbanItem, KanbanKpi } from '../types';

interface ProjectDeal {
  amount: number;
}

const COLUMNS: readonly KanbanColumn<ProjectDeal>[] = [
  { id: 'lead', title: 'New Leads', tone: 'neutral' },
  { id: 'qualified', title: 'Qualified', tone: 'info' },
  { id: 'won', title: 'Closed Won', tone: 'success' },
];

const ITEMS: readonly KanbanItem<ProjectDeal>[] = [
  {
    id: 'deal-1',
    columnId: 'lead',
    title: 'Acme Corp Contract',
    description: 'Enterprise license',
    meta: '$120,000',
    payload: { amount: 120000 },
  },
  {
    id: 'deal-2',
    columnId: 'qualified',
    title: 'Globex Deal',
    meta: '$45,000',
    payload: { amount: 45000 },
  },
];

const KPIS: readonly KanbanKpi[] = [
  { label: 'Active Pipeline', value: '$165,000' },
  { label: 'Deals in Progress', value: '2' },
];

describe('KanbanPage', () => {
  it('renders page header with kicker, title, and subtitle', () => {
    render(
      <MemoryRouter>
        <KanbanPage<ProjectDeal>
          kicker="Sales CRM"
          title="Pipeline Deals"
          subtitle="All active enterprise deals across stages"
          columns={COLUMNS}
          items={ITEMS}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('Sales CRM')).toBeDefined();
    expect(screen.getByText('Pipeline Deals')).toBeDefined();
    expect(screen.getByText('All active enterprise deals across stages')).toBeDefined();
  });

  it('renders KPI cards', () => {
    render(
      <MemoryRouter>
        <KanbanPage<ProjectDeal>
          title="Pipeline Deals"
          kpis={KPIS}
          columns={COLUMNS}
          items={ITEMS}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('Active Pipeline')).toBeDefined();
    expect(screen.getByText('$165,000')).toBeDefined();
    expect(screen.getByText('Deals in Progress')).toBeDefined();
    expect(screen.getByText('2')).toBeDefined();
  });

  it('renders search input and responds to change events', () => {
    const handleSearch = vi.fn();
    render(
      <MemoryRouter>
        <KanbanPage<ProjectDeal>
          title="Pipeline Deals"
          search={{
            value: '',
            onChange: handleSearch,
            placeholder: 'Search deals...',
          }}
          columns={COLUMNS}
          items={ITEMS}
        />
      </MemoryRouter>,
    );

    const input = screen.getByPlaceholderText('Search deals...');
    expect(input).toBeDefined();

    fireEvent.change(input, { target: { value: 'Acme' } });
    expect(handleSearch).toHaveBeenCalledWith('Acme');
  });

  it('renders footer when provided', () => {
    render(
      <MemoryRouter>
        <KanbanPage<ProjectDeal>
          title="Pipeline Deals"
          columns={COLUMNS}
          items={ITEMS}
          footer={<div data-testid="page-footer">Custom Footer Note</div>}
        />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('page-footer')).toBeDefined();
  });
});
