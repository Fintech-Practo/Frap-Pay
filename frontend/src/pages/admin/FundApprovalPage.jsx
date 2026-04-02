import { useState, useEffect } from "react";
import { api } from "@/services/api";
import StatusBadge from "@/components/shared/StatusBadge";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, X, Clock, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const FundApprovalPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [actionDialog, setActionDialog] = useState({
    open: false,
    type: "approve",
    request: null,
  });

  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    api.getFundRequests().then((r) => {
      setRequests(r);
      setLoading(false);
    });
  }, []);

  const handleAction = async () => {
    if (!actionDialog.request) return;

    setProcessing(true);

    if (actionDialog.type === "approve") {
      await api.approveFundRequest(actionDialog.request.id);
      toast({
        title: "Request Approved",
        description: `Fund request ${actionDialog.request.id} has been approved.`,
      });
    } else {
      await api.rejectFundRequest(actionDialog.request.id);
      toast({
        title: "Request Rejected",
        description: `Fund request ${actionDialog.request.id} has been rejected.`,
        variant: "destructive",
      });
    }

    setRequests((prev) =>
      prev.map((r) =>
        r.id === actionDialog.request.id
          ? {
              ...r,
              status:
                actionDialog.type === "approve"
                  ? "approved"
                  : "rejected",
            }
          : r
      )
    );

    setProcessing(false);

    setActionDialog({
      open: false,
      type: "approve",
      request: null,
    });
  };

  const summary = [
    {
      label: "Pending",
      count: requests.filter((r) => r.status === "pending").length,
      icon: Clock,
      color: "warning",
    },
    {
      label: "Approved",
      count: requests.filter((r) => r.status === "approved").length,
      icon: Check,
      color: "success",
    },
    {
      label: "Rejected",
      count: requests.filter((r) => r.status === "rejected").length,
      icon: X,
      color: "destructive",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Fund Approval
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Review and process fund requests.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summary.map(({ label, count, icon: Icon, color }) => (
          <div key={label} className="card-modern flex items-center gap-4">
            <div className={`p-2.5 rounded-xl bg-${color}/10`}>
              <Icon className={`h-5 w-5 text-${color}`} />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                {label}
              </p>
              <p className="text-2xl font-bold text-foreground">
                {loading ? "—" : count}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Request List */}
      <div className="card-modern p-0">
        <div className="p-5 border-b border-border/50">
          <h3 className="font-semibold text-foreground">
            All Requests
          </h3>
        </div>

        <div className="divide-y divide-border/30">
          {loading ? (
            <SkeletonLoader variant="table-row" count={4} />
          ) : (
            requests.map((req, i) => (
              <div
                key={req.id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors opacity-0 animate-in-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    req.status === "pending"
                      ? "bg-warning/10"
                      : req.status === "approved"
                      ? "bg-success/10"
                      : "bg-destructive/10"
                  }`}
                >
                  {req.status === "pending" ? (
                    <Clock className="h-4 w-4 text-warning" />
                  ) : req.status === "approved" ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <X className="h-4 w-4 text-destructive" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {req.requestedBy}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {req.id} · {req.method} · {req.reference}
                  </p>
                </div>

                <span className="text-sm font-semibold tabular-nums">
                  ₹{req.amount.toLocaleString()}
                </span>

                <StatusBadge status={req.status} />

                {req.status === "pending" && (
                  <div className="flex gap-1.5">
                    <Button
                      size="sm"
                      className="h-8 rounded-lg bg-success/10 text-success hover:bg-success/20 border-0"
                      onClick={() =>
                        setActionDialog({
                          open: true,
                          type: "approve",
                          request: req,
                        })
                      }
                    >
                      <Check className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                      size="sm"
                      className="h-8 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 border-0"
                      onClick={() =>
                        setActionDialog({
                          open: true,
                          type: "reject",
                          request: req,
                        })
                      }
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Dialog */}
      <Dialog
        open={actionDialog.open}
        onOpenChange={(open) =>
          setActionDialog((prev) => ({ ...prev, open }))
        }
      >
        <DialogContent className="sm:max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              {actionDialog.type === "approve"
                ? "Approve"
                : "Reject"}{" "}
              Request
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 mb-4">
              <AlertTriangle
                className={`h-5 w-5 ${
                  actionDialog.type === "approve"
                    ? "text-success"
                    : "text-destructive"
                }`}
              />

              <p className="text-sm">
                Are you sure you want to {actionDialog.type} fund
                request{" "}
                <strong>{actionDialog.request?.id}</strong> for{" "}
                <strong>
                  ₹
                  {actionDialog.request?.amount?.toLocaleString()}
                </strong>
                ?
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() =>
                  setActionDialog({
                    open: false,
                    type: "approve",
                    request: null,
                  })
                }
              >
                Cancel
              </Button>

              <Button
                className={`flex-1 rounded-xl ${
                  actionDialog.type === "approve"
                    ? "bg-success hover:bg-success/90"
                    : "bg-destructive hover:bg-destructive/90"
                } text-primary-foreground`}
                onClick={handleAction}
                disabled={processing}
              >
                {processing ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : actionDialog.type === "approve" ? (
                  "Approve"
                ) : (
                  "Reject"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FundApprovalPage;