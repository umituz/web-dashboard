import type { TipState } from '../utils';

export function ChartTip({ tip }: { tip: TipState }) {
  return (
    <div className="udb-charttip" style={{ left: tip.x, top: tip.y }}>
      <div className="udb-charttip__title">{tip.title}</div>
      {tip.rows.map((r, i) => (
        <div key={i} className="udb-charttip__row">
          <span className="udb-charttip__label">
            {r.color && <span className="udb-chartlegend__dot" style={{ background: r.color }} />}
            {r.label}
          </span>
          <b>{r.value}</b>
        </div>
      ))}
    </div>
  );
}
