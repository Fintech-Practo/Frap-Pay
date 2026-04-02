import { useEffect, useMemo, useState } from "react";
import { api } from "@/services/api";
import DataTable from "@/components/shared/DataTable";
import StatsCard from "@/components/shared/StatsCard";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import { Button } from "@/components/ui/button";
import { exportTransactionsToCsv, exportTransactionsToPdf } from "@/lib/export";
import { ArrowDownLeft, ArrowDownToLine, ArrowUpRight, FileSpreadsheet, Scale, TrendingUp } from "lucide-react";

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const LedgerReportPage = ({ type }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setRows(await api.getStatementRows(type));
      setLoading(false);
    };
    load();
  }, [type]);

  const totalCredit = useMemo(() => rows.reduce((sum, row) => sum + Number(row.credit || 0), 0), [rows]);
  const totalDebit = useMemo(() => rows.reduce((sum, row) => sum + Number(row.debit || 0), 0), [rows]);
  const netBalance = useMemo(() => (rows.at(-1)?.closingBalance || 0) - (rows[0]?.openingBalance || 0), [rows]);

  const exportRows = rows.map((row) => ({ date: row.txnDate, txnId: row.txnId, customer: row.member, type: row.txnType, method: row.method, status: row.status, amount: row.credit || row.debit }));
  const icons = [ArrowDownLeft, ArrowUpRight, Scale, TrendingUp];
  const stats = [
    { label: "Total Credit", value: totalCredit, change: 8.5, prefix: "₹" },
    { label: "Total Debit", value: totalDebit, change: -3.2, prefix: "₹" },
    { label: "Net Movement", value: netBalance, change: 12.1, prefix: "₹" },
    { label: "Entries", value: rows.length, change: 5 },
  ];

  const columns = [
    { key: "serialNo", label: "Sl.No." },
    { key: "txnId", label: "Txn Id", render: (item) => <span className="font-mono text-xs">{item.txnId}</span> },
    { key: "member", label: "Member", render: (item) => <span className="font-medium text-foreground">{item.member}</span> },
    { key: "openingBalance", label: "O.B.", render: (item) => formatCurrency(item.openingBalance) },
    { key: "credit", label: "C.R.", render: (item) => <span className="font-semibold text-success">{item.credit ? formatCurrency(item.credit) : "-"}</span> },
    { key: "debit", label: "D.B.", render: (item) => <span className="font-semibold text-destructive">{item.debit ? formatCurrency(item.debit) : "-"}</span> },
    { key: "closingBalance", label: "C.B.", render: (item) => <span className="font-semibold">{formatCurrency(item.closingBalance)}</span> },
    { key: "txnType", label: "Txn Type", render: (item) => <span className="capitalize">{item.txnType}</span> },
    { key: "method", label: "Mode" },
    { key: "txnDate", label: "Txn Date", render: (item) => <span className="text-muted-foreground">{item.txnDate}</span> },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <section className="rounded-[28px] border border-border/60 bg-card p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              Ledger Statement
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground capitalize">{type} Ledger Report</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Statement-style admin ledger with opening balance, debit, credit, closing balance, mode, and transaction timestamps.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => exportTransactionsToCsv(exportRows, `${type}-ledger.csv`)}><ArrowDownToLine className="mr-2 h-4 w-4" />Export CSV</Button>
            <Button className="rounded-xl gradient-primary text-primary-foreground" onClick={() => exportTransactionsToPdf(exportRows, `${type}-ledger.pdf`, `${type.toUpperCase()} Ledger Statement`)}><FileSpreadsheet className="mr-2 h-4 w-4" />Export PDF</Button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? <SkeletonLoader variant="stat" count={4} /> : stats.map((stat, index) => <StatsCard key={stat.label} {...stat} icon={icons[index]} delay={index * 100} />)}
      </div>

      <DataTable data={rows} columns={columns} loading={loading} searchable filters={[{ key: "txnType", label: "Txn Type", options: [{ value: "all", label: "All Types" }, { value: "payin", label: "Payin" }, { value: "payout", label: "Payout" }] }]} searchPlaceholder="Search ledger statement..." />
    </div>
  );
};

export default LedgerReportPage;
