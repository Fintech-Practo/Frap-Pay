const variantMap = {
  "Active": "success",
  "Closed Won": "success",
  "New": "info",
  "Contacted": "info",
  "Visit Scheduled": "info",
  "Negotiation": "warning",
  "Pending": "warning",
  "On Leave": "warning",
  "Paused": "warning",
  "Closed Lost": "danger",
  "Inactive": "danger",
  "scheduled": "info",
  "completed": "success",
  "cancelled": "danger",
  "pending": "warning",
  "approved": "success",
  "rejected": "danger",
  "Open": "info",
  "In Review": "warning",
};

export function StatusBadge({ status, variant }) {
  const v = variant || variantMap[status] || "default";

  const classes = {
    success: "badge-success",
    warning: "badge-warning",
    info: "badge-info",
    danger: "badge-danger",
    default: "bg-secondary text-secondary-foreground",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${classes[v]}`}
    >
      {status}
    </span>
  );
}
