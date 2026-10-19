import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
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
});
