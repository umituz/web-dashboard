import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { DetailPage } from './DetailPage';

describe('DetailPage', () => {
  it('renders notFound empty state when notFound is true', () => {
    render(
      <MemoryRouter>
        <DetailPage
          title="Not Found"
          notFound={{ title: 'Client not found', description: 'Could not find client.' }}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText('Client not found')).toBeTruthy();
    expect(screen.getByText('Could not find client.')).toBeTruthy();
  });

  it('renders title, description, badge, and back button', () => {
    render(
      <MemoryRouter>
        <DetailPage
          backTo={{ href: '/clients', label: 'All clients' }}
          title="Acme Corp"
          badge={<span>Active</span>}
          description="Enterprise legal client since 2024"
        >
          <div>Main Details</div>
        </DetailPage>
      </MemoryRouter>,
    );
    expect(screen.getByText('Acme Corp')).toBeTruthy();
    expect(screen.getByText('All clients')).toBeTruthy();
    expect(screen.getByText('Active')).toBeTruthy();
    expect(screen.getByText('Enterprise legal client since 2024')).toBeTruthy();
    expect(screen.getByText('Main Details')).toBeTruthy();
  });

  it('renders tabs and switches active tab on click', () => {
    const handleTabChange = vi.fn();
    render(
      <MemoryRouter>
        <DetailPage
          title="Acme Corp"
          tabs={[
            { id: 'overview', label: 'Overview', content: <div>Overview Content</div> },
            { id: 'cases', label: 'Cases', count: 5, content: <div>Cases Content</div> },
          ]}
          onTabChange={handleTabChange}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText('Overview Content')).toBeTruthy();
    expect(screen.getByText('Cases')).toBeTruthy();
    expect(screen.getByText('5')).toBeTruthy();

    fireEvent.click(screen.getByText('Cases'));
    expect(handleTabChange).toHaveBeenCalledWith('cases');
    expect(screen.getByText('Cases Content')).toBeTruthy();
  });

  it('renders sidebar layout when sidebar prop is provided', () => {
    render(
      <MemoryRouter>
        <DetailPage
          title="Acme Corp"
          sidebar={<div>Sidebar Information</div>}
        >
          <div>Body Information</div>
        </DetailPage>
      </MemoryRouter>,
    );
    expect(screen.getByText('Sidebar Information')).toBeTruthy();
    expect(screen.getByText('Body Information')).toBeTruthy();
  });

  it('renders KPI metrics when provided', () => {
    render(
      <MemoryRouter>
        <DetailPage
          title="Acme Corp"
          kpis={[
            { label: 'Active Matters', value: '12', delta: { value: '+3', direction: 'up' } },
            { label: 'Total Billed', value: '$45,000' },
          ]}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText('Active Matters')).toBeTruthy();
    expect(screen.getByText('12')).toBeTruthy();
    expect(screen.getByText('+3')).toBeTruthy();
    expect(screen.getByText('Total Billed')).toBeTruthy();
    expect(screen.getByText('$45,000')).toBeTruthy();
  });
});
