import { useEffect, useMemo, useState } from "react";
import { api } from "@/services/api";
import DataTable from "@/components/shared/DataTable";
import StatusBadge from "@/components/shared/StatusBadge";
import StatsCard from "@/components/shared/StatsCard";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import { Button } from "@/components/ui/button";
import { exportTransactionsToCsv, exportTransactionsToPdf } from "@/lib/export";
import {
  ArrowDownLeft,
  ArrowDownToLine,
  ArrowUpRight,
  FileSpreadsheet,
  Scale,
  TrendingUp,
} from "lucide-react";

const LedgerReportPage = ({ type }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await api.getTransactions(type);
      setTransactions(data);
      setLoading(false);
    };

    load();
  }, [type]);

  const totalCredit = useMemo(
    () => transactions.filter((item) => item.status === "success").reduce((sum, item) => sum + item.amount, 0),
    [transactions]
  );
  const totalDebit = useMemo(
    () => transactions.filter((item) => item.status !== "success").reduce((sum, item) => sum + item.amount, 0),
    [transactions]
  );
  const netBalance = totalCredit - totalDebit;

  const columns = [
    {
      key: "date",
      label: "Date",
      render: (item) => <span className="text-sm">{item.date}</span>,
    },
    {
      key: "txnId",
      label: "Txn ID",
      render: (item) => <span className="font-mono text-xs">{item.txnId}</span>,
    },
    {
      key: "customer",
      label: "Party",
      render: (item) => (
        <div className="flex items-center gap-2">
          <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${item.type === "payin" ? "bg-success/10" : "bg-primary/10"}`}>
            {item.type === "payin" ? (
              <ArrowDownLeft className="h-4 w-4 text-success" />
            ) : (
              <ArrowUpRight className="h-4 w-4 text-primary" />
            )}
          </div>
          <span className="text-sm font-medium">{item.customer}</span>
        </div>
      ),
    },
    { key: "method", label: "Method" },
    {
      key: "amount",
      label: "Credit",
      render: (item) => (
        <span className={`font-semibold tabular-nums ${item.status === "success" ? "text-success" : "text-muted-foreground"}`}>
          {item.status === "success" ? `+₹${item.amount.toLocaleString("en-IN")}` : "-"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Debit",
      render: (item) => (
        <span className={`font-semibold tabular-nums ${item.status !== "success" ? "text-destructive" : "text-muted-foreground"}`}>
          {item.status !== "success" ? `-₹${item.amount.toLocaleString("en-IN")}` : "-"}
        </span>
      ),
    },
    {
      key: "id",
      label: "Status",
      render: (item) => <StatusBadge status={item.status} />,
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

  const stats = [
    { label: "Total Credit", value: totalCredit, change: 8.5, prefix: "₹" },
    { label: "Total Debit", value: totalDebit, change: -3.2, prefix: "₹" },
    { label: "Net Balance", value: netBalance, change: 12.1, prefix: "₹" },
    { label: "Entries", value: transactions.length, change: 5.0 },
  ];

  const icons = [ArrowDownLeft, ArrowUpRight, Scale, TrendingUp];

  return (
    <div className="space-y-6 max-w-7xl">
      <section className="rounded-[28px] border border-border/60 bg-card p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              Ledger Intelligence
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground capitalize">{type} Ledger Report</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Detailed credit and debit visibility for operations, reconciliation, and audit. Export the same view to CSV or print-ready PDF whenever needed.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => exportTransactionsToCsv(transactions, `${type}-ledger.csv`)}
            >
              <ArrowDownToLine className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button
              className="rounded-xl gradient-primary text-primary-foreground"
              onClick={() => exportTransactionsToPdf(transactions, `${type}-ledger.pdf`, `${type.toUpperCase()} Ledger Report`)}
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <SkeletonLoader variant="stat" count={4} />
        ) : (
          stats.map((stat, index) => <StatsCard key={stat.label} {...stat} icon={icons[index]} delay={index * 100} />)
        )}
      </div>

      <DataTable
        data={transactions}
        columns={columns}
        filters={filters}
        loading={loading}
        searchPlaceholder="Search ledger by txn ID, party, or method..."
      />
    </div>
  );
};

export default LedgerReportPage;
