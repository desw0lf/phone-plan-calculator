export const VerticalLine: React.FC<{ xPercentage: number }> = ({ xPercentage }) => {
  if (xPercentage <= 0) {
    return null;
  }
  return (
    <div className="absolute w-full inset-y-0 -z-[1] pointer-events-none flex flex-grow items-center gap-4">
      <div className="h-full flex gap-2 flex-col flex-grow">
        <div className="bg-border w-[2px] h-full" style={{ marginLeft: `${xPercentage}%` }} />
      </div>
      <span className="charty__label text-xs text-muted-foreground"></span>
    </div>
  );
};
