import { useEffect, useMemo, useState } from "react";
import { api } from "@/services/api";
import DataTable from "@/components/shared/DataTable";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { exportTransactionsToCsv, exportTransactionsToPdf } from "@/lib/export";
import { ArrowDownToLine, FileText, Receipt, TrendingUp } from "lucide-react";

const ReportsPage = ({ type }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const txns = await api.getTransactions(type);
      setData(txns);
      setLoading(false);
    };

    load();
  }, [type]);

  const successfulCount = useMemo(() => data.filter((item) => item.status === "success").length, [data]);
  const totalAmount = useMemo(() => data.reduce((sum, item) => sum + Number(item.amount || 0), 0), [data]);

  const columns = [
    {
      key: "txnId",
      label: "Transaction ID",
      render: (item) => <span className="font-mono text-xs">{item.txnId}</span>,
    },
    {
      key: "customer",
      label: "Customer",
      render: (item) => <span className="font-medium text-foreground">{item.customer}</span>,
    },
    { key: "method", label: "Method" },
    {
      key: "amount",
      label: "Amount",
      render: (item) => <span className="font-semibold tabular-nums">₹{item.amount.toLocaleString("en-IN")}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "date",
      label: "Date",
      render: (item) => <span className="text-muted-foreground">{item.date}</span>,
    },
  ];

  const filters = [
    {
      key: "status",
      label: "Status",
      options: [
        { value: "all", label: "All Status" },
        { value: "success", label: "Success" },
        { value: "pending", label: "Pending" },
        { value: "failed", label: "Failed" },
      ],
    },
    {
      key: "method",
      label: "Method",
      options: [
        { value: "all", label: "All Methods" },
        { value: "UPI", label: "UPI" },
        { value: "IMPS", label: "IMPS" },
        { value: "NEFT", label: "NEFT" },
        { value: "RTGS", label: "RTGS" },
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <section className="rounded-[28px] border border-border/60 bg-card p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <Receipt className="h-3.5 w-3.5" />
              Transaction Reports
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground capitalize">{type} Reports</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Review transaction performance, search by customer or ID, and export clean operational reports for finance and audit teams.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => exportTransactionsToCsv(data, `${type}-transactions.csv`)}
            >
              <ArrowDownToLine className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button
              className="rounded-xl gradient-primary text-primary-foreground"
              onClick={() => exportTransactionsToPdf(data, `${type}-transactions.pdf`, `${type.toUpperCase()} Transactions Report`)}
            >
              <FileText className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Total Entries</div>
            <div className="mt-3 text-2xl font-bold text-foreground">{data.length}</div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Successful Transactions</div>
            <div className="mt-3 text-2xl font-bold text-foreground">{successfulCount}</div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5" />
              Total Volume
            </div>
            <div className="mt-3 text-2xl font-bold text-foreground">₹{totalAmount.toLocaleString("en-IN")}</div>
          </div>
        </div>
      </section>

      <DataTable
        data={data}
        columns={columns}
        filters={filters}
        loading={loading}
        searchPlaceholder="Search by ID, customer, or method..."
      />
    </div>
  );
};

export default ReportsPage;
