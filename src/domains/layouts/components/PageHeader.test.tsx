import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { PageHeader } from './PageHeader';

describe('PageHeader markup smoke', () => {
  it('renders kicker before title and omits it when undefined', () => {
    const html = renderToString(
      <PageHeader kicker="Customer area" title="Policies" subtitle="Your coverage at a glance" />,
    );
    const kickerAt = html.indexOf('udb-pageheader__kicker');
    const titleAt = html.indexOf('udb-pageheader__title');
    expect(kickerAt).toBeGreaterThan(-1);
    expect(kickerAt).toBeLessThan(titleAt);
    expect(html).toContain('Customer area');

    const bare = renderToString(<PageHeader title="Policies" />);
    expect(bare).not.toContain('udb-pageheader__kicker');
  });

  it('renders actions and breadcrumb nodes in their slots', () => {
    const html = renderToString(
      <PageHeader
        title="Claims"
        breadcrumbs={<a href="/policies">Policies</a>}
        actions={<button type="button">New claim</button>}
      />,
    );
    expect(html).toContain('udb-pageheader__breadcrumbs');
    expect(html).toContain('udb-pageheader__actions');
    expect(html).toContain('New claim');
  });

  it('renders crumb lists as in-app links', () => {
    const { container } = render(
      <MemoryRouter>
        <PageHeader
          title="Claim 92"
          breadcrumbs={[{ label: 'Policies', to: '/policies' }, { label: 'Claim 92' }]}
        />
      </MemoryRouter>,
    );
    expect(container.querySelectorAll("a[href='/policies']")).toHaveLength(1);
    expect(container.querySelector('.udb-pageheader__crumb a')?.textContent).toBe('Policies');
  });

  it('renders meta under the title block and omits it when undefined', () => {
    const html = renderToString(
      <PageHeader title="Policy AC-123" meta={<span>Renews 2027-01-15</span>} />,
    );
    const metaAt = html.indexOf('udb-pageheader__meta');
    expect(metaAt).toBeGreaterThan(-1);
    expect(html.indexOf('udb-pageheader__subtitle')).toBe(-1);
    expect(html).toContain('Renews 2027-01-15');

    const bare = renderToString(<PageHeader title="Policy AC-123" />);
    expect(bare).not.toContain('udb-pageheader__meta');
  });
});
