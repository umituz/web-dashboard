import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { SectionHeader } from './SectionHeader';

describe('SectionHeader markup smoke', () => {
  it('renders an h2 title with optional kicker before it', () => {
    const html = renderToString(
      <SectionHeader kicker="This week" title="Reading" subtitle="Long-form practice" />,
    );
    const kickerAt = html.indexOf('udb-sectionheader__kicker');
    const titleAt = html.indexOf('<h2 class="udb-sectionheader__title"');
    expect(kickerAt).toBeGreaterThan(-1);
    expect(kickerAt).toBeLessThan(titleAt);
    expect(html).toContain('Long-form practice');

    const bare = renderToString(<SectionHeader title="Reading" />);
    expect(bare).not.toContain('udb-sectionheader__kicker');
    expect(bare).not.toContain('udb-sectionheader__subtitle');
  });

  it('renders actions in their slot and accepts description as subtitle alias', () => {
    const html = renderToString(
      <SectionHeader title="Writing" description="Timed tasks" actions={<button type="button">New</button>} />,
    );
    expect(html).toContain('udb-sectionheader__actions');
    expect(html).toContain('udb-sectionheader__subtitle');
    expect(html).toContain('New');
  });
});
