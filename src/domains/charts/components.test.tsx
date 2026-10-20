import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { BarChart, Donut, Legend, LineChart, Sparkline } from './components';

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

  it('fleet aliases: LineChart accepts labels/formatValue and key-less series with data/color', () => {
    const html = renderToString(
      <LineChart
        labels={['m1', 'm2']}
        series={[{ label: 'views', data: [1, 3], color: '#123456' }]}
        formatValue={(v) => String(v)}
      />,
    );
    expect(html).toContain('#123456');
    expect(html).toContain('views');
    expect(html).toContain('m1');
  });

  it('fleet aliases: BarChart accepts key-less series with data/color', () => {
    const html = renderToString(
      <BarChart labels={['a', 'b']} series={[{ label: 'A', data: [2, 4], color: '#654321' }]} />,
    );
    expect(html).toContain('#654321');
    expect(html).toContain('height:100%');
  });

  it('BarChart renders a dashed goal line that counts toward max and clamps at 100%', () => {
    const html = renderToString(
      <BarChart
        labels={['a', 'b']}
        series={[{ label: 'A', values: [2, 4] }]}
        goalLine={{ value: 4, label: 'goal 4', tone: '#111111' }}
      />,
    );
    expect(html).toContain('udb-barchart__goal');
    expect(html).toContain('bottom:100%');
    expect(html).toContain('border-top-color:#111111');
    expect(html).toContain('>goal 4<');

    const above = renderToString(
      <BarChart labels={['a']} series={[{ label: 'A', values: [2] }]} goalLine={{ value: 99 }} />,
    );
    expect(above).toContain('bottom:100%');
    expect(above).not.toContain('udb-barchart__goallabel');

    const without = renderToString(<BarChart labels={['a']} series={[{ label: 'A', values: [2] }]} />);
    expect(without).not.toContain('udb-barchart__goal');
  });

  it('fleet aliases: Legend renders hint suffix and Donut accepts color', () => {
    const html = renderToString(
      <>
        <Legend items={[{ label: 'A', color: '#111111', value: '12', hint: '(per month)' }]} />
        <Donut segments={[{ label: 'x', value: 2, color: '#333333' }]} />
      </>,
    );
    expect(html).toContain('udb-chartlegend__hint');
    expect(html).toContain('(per month)');
    expect(html).toContain('#333333');
  });
});
