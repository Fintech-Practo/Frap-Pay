import { cn } from "@/lib/utils";

const statusConfig = {
  success: { class: "badge-success", label: "Success" },
  approved: { class: "badge-success", label: "Approved" },
  active: { class: "badge-success", label: "Active" },
  verified: { class: "badge-success", label: "Verified" },
  resolved: { class: "badge-success", label: "Resolved" },

  pending: { class: "badge-warning", label: "Pending" },
  kyc_pending: { class: "badge-warning", label: "KYC Pending" },
  in_progress: { class: "badge-warning", label: "In Progress" },
  open: { class: "badge-warning", label: "Open" },
  medium: { class: "badge-warning", label: "Medium" },

  failed: { class: "badge-destructive", label: "Failed" },
  rejected: { class: "badge-destructive", label: "Rejected" },
  high: { class: "badge-destructive", label: "High" },

  inactive: { class: "badge-neutral", label: "Inactive" },
  closed: { class: "badge-neutral", label: "Closed" },
  low: { class: "badge-neutral", label: "Low" },
};

const StatusBadge = ({ status, className }) => {
  const config =
    statusConfig[status] || {
      class: "badge-neutral",
      label: status,
    };

  return (
    <span className={cn(config.class, className)}>
      <span
        className={cn("w-1.5 h-1.5 rounded-full mr-1.5", {
          "bg-success": [
            "success",
            "approved",
            "active",
            "verified",
            "resolved",
          ].includes(status),

          "bg-warning": [
            "pending",
            "kyc_pending",
            "in_progress",
            "open",
            "medium",
          ].includes(status),

          "bg-destructive": ["failed", "rejected", "high"].includes(
            status
          ),

          "bg-muted-foreground": ["inactive", "closed", "low"].includes(
            status
          ),
        })}
      />

      {config.label}
    </span>
  );
};

export default StatusBadge;