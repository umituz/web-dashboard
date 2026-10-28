export interface LegendItem {
  label: string;
  color: string;
  value?: string;
  hint?: string;
}

export function Legend({ items }: { items: LegendItem[] }) {
  return (
    <div className="udb-chartlegend">
      {items.map((i) => (
        <span key={i.label} className="udb-chartlegend__item">
          <span className="udb-chartlegend__dot" style={{ background: i.color }} />
          {i.label}
          {i.value && <span className="udb-chartlegend__value">{i.value}</span>}
          {i.hint && <span className="udb-chartlegend__hint">{i.hint}</span>}
        </span>
      ))}
    </div>
  );
}
