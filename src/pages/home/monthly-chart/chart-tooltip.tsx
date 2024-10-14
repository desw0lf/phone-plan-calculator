import { LegendItem } from "./legend-item";
// ? TYPES:
import { TLegendBoxTooltip } from "./monthly-chart.types";

export const ChartTooltip: React.FC<{ title: string; subtitle?: string; items: TLegendBoxTooltip[] }> = ({ title, subtitle, items }) => (
  <div className="grid gap-3">
    <header className="flex flex-col">
      <span className="text-sm">{title}</span>
      <span className="text-muted-foreground">{subtitle}</span>
    </header>
    <div className="grid gap-1.5 pb-1 [&>*]:gap-6">
      {items.map((item) => (
        <LegendItem key={item.label} {...item} />
      ))}
    </div>
  </div>
);
