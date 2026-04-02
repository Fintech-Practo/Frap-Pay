import { cn } from "@/lib/utils";
import { FileX } from "lucide-react";

const EmptyState = ({
  title = "No data found",
  description = "There are no records to display at the moment.",
  icon,
  action,
  className,
}) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center py-16 px-4 text-center",
      className
    )}
  >
    <div className="p-4 rounded-2xl gradient-subtle mb-4">
      {icon || <FileX className="h-8 w-8 text-muted-foreground" />}
    </div>

    <h3 className="text-lg font-semibold text-foreground mb-1">
      {title}
    </h3>

    <p className="text-sm text-muted-foreground max-w-sm">
      {description}
    </p>

    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;