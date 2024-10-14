export type TLegendBox<T = undefined | null> = { label: string; className: string; value?: T; labelSuffix?: string };

export type TLegendBoxTooltip = TLegendBox<string | null>;

export interface BarProps {
  width: number;
  className?: string;
  label?: string;
}

export type CSS = React.CSSProperties;
