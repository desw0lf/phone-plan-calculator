export const MonthSeparators: React.FC<{ count: number }> = ({ count }) => (
  <aside className="charty__month-separators absolute pointer-events-none flex flex-col h-full left-0 w-6 mt-px opacity-10 dark:opacity-40">
    {Array.from({ length: count - 1 }, (_, i) => (
      <div key={i} className="w-full pointer-events-none border-b border-dotted" style={{ height: `${100 / count}%` }}></div>
    ))}
  </aside>
);
