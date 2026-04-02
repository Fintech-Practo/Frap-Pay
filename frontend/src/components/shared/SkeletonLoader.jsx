import { cn } from "@/lib/utils";

const SkeletonPulse = ({ className, style }) => (
  <div
    className={cn("animate-pulse rounded-lg bg-muted", className)}
    style={style}
  />
);

export const SkeletonCard = ({ className }) => (
  <div className={cn("card-modern space-y-4", className)}>
    <div className="flex items-center justify-between">
      <SkeletonPulse className="h-4 w-24" />
      <SkeletonPulse className="h-8 w-8 rounded-full" />
    </div>
    <SkeletonPulse className="h-8 w-32" />
    <SkeletonPulse className="h-3 w-20" />
  </div>
);

export const SkeletonTableRow = () => (
  <div className="flex items-center gap-4 py-4 px-4">
    <SkeletonPulse className="h-4 w-24" />
    <SkeletonPulse className="h-4 w-32 flex-1" />
    <SkeletonPulse className="h-4 w-20" />
    <SkeletonPulse className="h-6 w-16 rounded-full" />
    <SkeletonPulse className="h-4 w-24" />
  </div>
);

export const SkeletonChart = ({ className }) => (
  <div className={cn("card-modern", className)}>
    <div className="flex items-center justify-between mb-6">
      <SkeletonPulse className="h-5 w-32" />
      <div className="flex gap-2">
        <SkeletonPulse className="h-8 w-16 rounded-md" />
        <SkeletonPulse className="h-8 w-16 rounded-md" />
      </div>
    </div>

    <div className="flex items-end gap-3 h-48">
      {[40, 60, 35, 80, 55, 70, 45].map((h, i) => (
        <SkeletonPulse
          key={i}
          className="flex-1 rounded-t-md"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  </div>
);

const SkeletonLoader = ({
  variant = "card",
  count = 1,
  className,
}) => {
  const items = Array.from({ length: count });

  if (variant === "stat")
    return (
      <>
        {items.map((_, i) => (
          <SkeletonCard key={i} className={className} />
        ))}
      </>
    );

  if (variant === "table-row")
    return (
      <>
        {items.map((_, i) => (
          <SkeletonTableRow key={i} />
        ))}
      </>
    );

  if (variant === "chart")
    return <SkeletonChart className={className} />;

  if (variant === "text")
    return (
      <SkeletonPulse
        className={cn("h-4 w-full", className)}
      />
    );

  return (
    <>
      {items.map((_, i) => (
        <SkeletonCard key={i} className={className} />
      ))}
    </>
  );
};

export default SkeletonLoader;