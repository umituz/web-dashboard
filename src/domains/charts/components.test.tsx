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

  it('BarChart renders one column per datum with height proportional to value', () => {
    const html = renderToString(
      <BarChart data={[{ label: 'mon', value: 4 }, { label: 'tue', value: 8 }, { label: 'wed', value: 0, highlight: true }]} />,
    );
    expect(html.match(/udb-barchart__col/g)?.length).toBe(3);
    expect(html).toContain('height:50%');
    expect(html).toContain('height:100%');
    expect(html).toContain('#c2410c');
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
