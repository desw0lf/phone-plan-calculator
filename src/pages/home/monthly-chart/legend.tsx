import { LegendItem } from "./legend-item";
// ? TYPES:
import { TLegendBox } from "./monthly-chart.types";

export const Legend: React.FC<{ items: TLegendBox[] }> = ({ items }) => (
  <aside className="flex items-center justify-center gap-4 pt-3 text-xs">
    {items.map((item) => (
      <LegendItem key={item.label} {...item} />
    ))}
  </aside>
);
