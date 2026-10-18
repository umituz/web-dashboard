import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { BarChart, Donut, LineChart, Sparkline } from './components';

describe('charts markup smoke', () => {
  it('Sparkline renders an svg path for enough data and null for less', () => {
    const html = renderToString(<Sparkline data={[1, 3, 2, 5]} />);
    expect(html).toContain('<svg');
    expect(html).toContain('<path');
    expect(renderToString(<Sparkline data={[1]} />)).toBe('');
  });

  it('BarChart renders one grouped column per label with one bar per series', () => {
    const html = renderToString(
      <BarChart
        labels={['mon', 'tue', 'wed']}
        series={[
          { key: 'a', label: 'A', values: [4, 8, 0] },
          { key: 'b', label: 'B', values: [2, 4, 6], tone: '#111111' },
        ]}
      />,
    );
    expect(html.match(/udb-barchart__col(?![a-z])/g)?.length).toBe(3);
    expect(html.match(/udb-barchart__bar(?![a-z_])/g)?.length).toBe(6);
    expect(html).toContain('height:100%');
    expect(html).toContain('height:50%');
    expect(html).toContain('#111111');
  });

  it('Donut renders a segment circle per label with dash math and center fallback', () => {
    const html = renderToString(
      <Donut
        segments={[
          { label: 'a', value: 3, tone: '#111111' },
          { label: 'b', value: 1, tone: '#222222' },
        ]}
        centerValue="4"
        centerLabel="total"
      />,
    );
    expect(html.match(/udb-donut__item(?![a-z])/g)?.length).toBe(2);
    expect(html).toContain('75<!-- -->%');
    expect(html).toContain('#111111');
    expect(html).toContain('>total<');
  });

  it('LineChart renders series paths, grid lines and a legend entry per series', () => {
    const html = renderToString(
      <LineChart
        points={[{ label: 'w1' }, { label: 'w2' }, { label: 'w3' }]}
        series={[
          { key: 's1', label: 'revenue', values: [2, 4, 8] },
          { key: 's2', label: 'cost', values: [5, 3, 1], kind: 'bars', axis: 'right' },
        ]}
      />,
    );
    expect(html).toContain('udb-linechart__grid');
    expect(html).toContain('revenue');
    expect(html).toContain('cost');
    expect(html.match(/<rect /g)?.length).toBe(3);
    expect(html.match(/udb-chartlegend__dot/g)?.length).toBeGreaterThanOrEqual(2);
  });

  it('LineChart renders nothing without points', () => {
    expect(renderToString(<LineChart points={[]} series={[]} />)).toBe('');
  });
});
