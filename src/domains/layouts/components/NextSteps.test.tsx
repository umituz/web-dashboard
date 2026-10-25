import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { NextSteps } from './NextSteps';

describe('NextSteps component', () => {
  it('renders lead text and action links', () => {
    const html = renderToString(
      <MemoryRouter>
        <NextSteps
          lead="Önerilen Adımlar"
          links={[
            { to: '/app/practice', label: 'Alıştırma Yap' },
            { to: '/app/exams', label: 'Sınavları Gör' },
          ]}
        />
      </MemoryRouter>
    );
    expect(html).toContain('Önerilen Adımlar');
    expect(html).toContain('Alıştırma Yap');
    expect(html).toContain('href="/app/practice"');
    expect(html).toContain('Sınavları Gör');
    expect(html).toContain('href="/app/exams"');
  });
});
