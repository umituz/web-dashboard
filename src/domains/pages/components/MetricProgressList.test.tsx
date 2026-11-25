import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { MetricProgressList } from './MetricProgressList';

describe('MetricProgressList', () => {
  it('renders title, items with label, count, and value', () => {
    render(
      <MemoryRouter>
        <MetricProgressList
          title="Pipeline by Stage"
          items={[
            { id: 'lead', label: 'Lead Discovery', count: 12, value: '$45,000', percent: 60, href: '/crm' },
            { id: 'proposal', label: 'Proposal Sent', count: 4, value: '$20,000', percent: 20 },
          ]}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText('Pipeline by Stage')).toBeTruthy();
    expect(screen.getByText('Lead Discovery')).toBeTruthy();
    expect(screen.getByText('12')).toBeTruthy();
    expect(screen.getByText('$45,000')).toBeTruthy();
    expect(screen.getByText('Proposal Sent')).toBeTruthy();
    expect(screen.getByText('4')).toBeTruthy();
    expect(screen.getByText('$20,000')).toBeTruthy();
  });

  it('calculates percent automatically based on max when percent is omitted', () => {
    const handleClick = vi.fn();
    render(
      <MetricProgressList
        max={100}
        onItemClick={handleClick}
        items={[
          { id: 'stage1', label: 'Stage 1', count: 25 },
        ]}
      />,
    );
    expect(screen.getByText('Stage 1')).toBeTruthy();
    expect(screen.getByText('25')).toBeTruthy();

    fireEvent.click(screen.getByText('Stage 1'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
