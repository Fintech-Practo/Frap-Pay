import { useState, useEffect } from "react";
import { api } from "@/services/api";
import DataTable from "@/components/shared/DataTable";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const FundPage = ({ variant }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    amount: "",
    method: "bank_transfer",
    reference: "",
  });

  useEffect(() => {
    const load = async () => {
      const reqs = await api.getFundRequests();
      setData(reqs);
      setLoading(false);
    };
    load();
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);

    await api.submitFundRequest({
      amount: Number(form.amount),
      method: form.method,
      reference: form.reference,
    });

    setSubmitting(false);
    setSubmitted(true);

    toast({
      title: "Fund request submitted",
      description: "Your request is being reviewed.",
    });

    setTimeout(() => {
      setDialogOpen(false);
      setSubmitted(false);
      setForm({
        amount: "",
        method: "bank_transfer",
        reference: "",
      });
    }, 2000);
  };

  const columns = [
    {
      key: "id",
      label: "Request ID",
      render: (item) => (
        <span className="font-mono text-xs">{item.id}</span>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (item) => (
        <span className="font-semibold">
          ₹{item.amount.toLocaleString()}
        </span>
      ),
    },
    { key: "method", label: "Method" },
    {
      key: "reference",
      label: "Reference",
      render: (item) => (
        <span className="font-mono text-xs">
          {item.reference}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <StatusBadge status={item.status} />
      ),
    },
    { key: "date", label: "Date" },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {variant === "request"
              ? "Fund Request"
              : "Fund Report"}
          </h1>

          <p className="text-muted-foreground text-sm mt-0.5">
            {variant === "request"
              ? "Submit and track fund requests."
              : "View all fund request history."}
          </p>
        </div>

        {variant === "request" && (
          <Dialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground rounded-xl gap-2">
                <Plus className="h-4 w-4" /> New Request
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md rounded-2xl">
              <DialogHeader>
                <DialogTitle>
                  New Fund Request
                </DialogTitle>
              </DialogHeader>

              {submitted ? (
                <div className="flex flex-col items-center py-8">
                  <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mb-4">
                    <CheckCircle className="h-7 w-7 text-success" />
                  </div>

                  <p className="font-semibold text-foreground">
                    Request Submitted!
                  </p>

                  <p className="text-sm text-muted-foreground mt-1">
                    You'll be notified once approved.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  {/* Amount */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Amount (₹)
                    </label>

                    <Input
                      value={form.amount}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          amount: e.target.value,
                        })
                      }
                      placeholder="Enter amount"
                      className="h-11 rounded-xl"
                      type="number"
                    />
                  </div>

                  {/* Method */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Payment Method
                    </label>

                    <Select
                      value={form.method}
                      onValueChange={(v) =>
                        setForm({
                          ...form,
                          method: v,
                        })
                      }
                    >
                      <SelectTrigger className="h-11 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="bank_transfer">
                          Bank Transfer
                        </SelectItem>
                        <SelectItem value="upi">
                          UPI
                        </SelectItem>
                        <SelectItem value="neft">
                          NEFT
                        </SelectItem>
                        <SelectItem value="rtgs">
                          RTGS
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Reference */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Reference Number
                    </label>

                    <Input
                      value={form.reference}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          reference: e.target.value,
                        })
                      }
                      placeholder="UTR / Reference"
                      className="h-11 rounded-xl"
                    />
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={submitting || !form.amount}
                    className="w-full h-11 rounded-xl gradient-primary text-primary-foreground"
                  >
                    {submitting ? (
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (
                      "Submit Request"
                    )}
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>

      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search requests..."
      />
    </div>
  );
};

export default FundPage;