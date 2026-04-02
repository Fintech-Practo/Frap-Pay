import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

const formatValue = (value, prefix) => {
  if (typeof value === "string") return value;

  if (prefix === "₹") {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value.toLocaleString()}`;
  }

  if (value >= 1000) return value.toLocaleString();
  return String(value);
};

const StatsCard = ({
  label,
  value,
  change,
  prefix,
  icon: Icon,
  className,
  delay = 0,
}) => {
  const isPositive = (change ?? 0) >= 0;

  return (
    <div
      className={cn("stat-card opacity-0 animate-in-up", className)}
      style={{ animationDelay: `${delay * 100}ms` }}
    >
      <div className="mb-5 flex items-start justify-between">
        <span className="text-[15px] font-medium text-muted-foreground">
          {label}
        </span>

        {Icon && (
          <div className="rounded-2xl p-2.5 gradient-subtle">
            <Icon className="h-[18px] w-[18px] text-primary" />
          </div>
        )}
      </div>

      <div className="animate-count-up text-[1.95rem] font-bold tracking-tight text-foreground">
        {formatValue(value, prefix)}
      </div>

      {change !== undefined && (
        <div
          className={cn(
            "mt-3 flex items-center gap-1.5 text-[13px] font-medium",
            isPositive ? "text-success" : "text-destructive"
          )}
        >
          {isPositive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}

          <span>
            {isPositive ? "+" : ""}
            {change}%
          </span>

          <span className="text-muted-foreground ml-1">
            vs last week
          </span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
