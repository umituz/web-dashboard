import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OverviewPage } from './OverviewPage';

describe('OverviewPage', () => {
  it('renders header, banner, kpis, children, and sidebar', () => {
    render(
      <OverviewPage
        header={{
          title: 'Executive Dashboard',
          kicker: 'Platform Overview',
          description: 'Key metrics and operational alerts.',
        }}
        banner={<div>Daily Streak Banner Slot</div>}
        kpis={[
          { id: '1', label: 'Revenue', value: '$85,000' },
          { id: '2', label: 'Members', value: '1,200' },
        ]}
        sidebar={<div>Sidebar Quick Links</div>}
      >
        <div>Primary Dashboard Content</div>
      </OverviewPage>,
    );

    expect(screen.getByText('Executive Dashboard')).toBeTruthy();
    expect(screen.getByText('Platform Overview')).toBeTruthy();
    expect(screen.getByText('Key metrics and operational alerts.')).toBeTruthy();
    expect(screen.getByText('Daily Streak Banner Slot')).toBeTruthy();
    expect(screen.getByText('Revenue')).toBeTruthy();
    expect(screen.getByText('$85,000')).toBeTruthy();
    expect(screen.getByText('Members')).toBeTruthy();
    expect(screen.getByText('1,200')).toBeTruthy();
    expect(screen.getByText('Primary Dashboard Content')).toBeTruthy();
    expect(screen.getByText('Sidebar Quick Links')).toBeTruthy();
  });

  it('renders custom header and custom kpis slot when provided as ReactNode', () => {
    render(
      <OverviewPage
        header={<h1>Custom Heading</h1>}
        kpis={<div>Custom KPI Tiles</div>}
      >
        <div>Child Section</div>
      </OverviewPage>,
    );
    expect(screen.getByText('Custom Heading')).toBeTruthy();
    expect(screen.getByText('Custom KPI Tiles')).toBeTruthy();
    expect(screen.getByText('Child Section')).toBeTruthy();
  });
});
