export interface HeatmapCell {
  day: string;
  value: number;
}

export interface ActivityHeatmapProps {
  cells: HeatmapCell[];
  max?: number;
  titleFor?: (cell: HeatmapCell) => string;
  ariaLabel?: string;
  className?: string;
  levelClassNames?: string[];
}

const DEFAULT_HEATMAP_LEVELS = [
  'udb-heatmap__cell--l0',
  'udb-heatmap__cell--l1',
  'udb-heatmap__cell--l2',
  'udb-heatmap__cell--l3',
  'udb-heatmap__cell--l4',
];

export function ActivityHeatmap({
  cells,
  max,
  titleFor,
  ariaLabel = 'Activity heatmap',
  className = '',
  levelClassNames = DEFAULT_HEATMAP_LEVELS,
}: ActivityHeatmapProps) {
  const peak = Math.max(1, max ?? Math.max(0, ...cells.map((cell) => cell.value)));
  const maxIntensity = levelClassNames.length - 1;

  return (
    <div
      className={['udb-heatmap', className].filter(Boolean).join(' ')}
      role="img"
      aria-label={ariaLabel}
    >
      {cells.map((cell, index) => {
        const intensity =
          cell.value <= 0 ? 0 : Math.min(maxIntensity, Math.ceil((cell.value / peak) * maxIntensity));
        const cellClass = levelClassNames[intensity] ?? levelClassNames[0];
        const cellTitle = titleFor ? titleFor(cell) : `${cell.day}: ${cell.value}`;

        return (
          <span
            key={`${cell.day}-${index}`}
            className={`udb-heatmap__cell ${cellClass}`}
            title={cellTitle}
          >
            <span className="udb-heatmap__sr">{cellTitle}</span>
          </span>
        );
      })}
    </div>
  );
}
