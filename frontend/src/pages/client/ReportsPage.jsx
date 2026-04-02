import { useEffect, useMemo, useState } from "react";
import { api } from "@/services/api";
import DataTable from "@/components/shared/DataTable";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { exportTransactionsToCsv, exportTransactionsToPdf } from "@/lib/export";
import { ArrowDownToLine, FileText, Receipt, TrendingUp, Wallet } from "lucide-react";

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const ReportsPage = ({ type }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const statement = await api.getStatementRows(type);
      setRows(statement);
      setLoading(false);
    };

    load();
  }, [type]);

  const totalCredit = useMemo(() => rows.reduce((sum, row) => sum + Number(row.credit || 0), 0), [rows]);
  const totalDebit = useMemo(() => rows.reduce((sum, row) => sum + Number(row.debit || 0), 0), [rows]);
  const closingBalance = rows.at(-1)?.closingBalance || 0;

  const exportRows = rows.map((row) => ({
    date: row.txnDate,
    txnId: row.txnId,
    customer: row.member,
    type: row.txnType,
    method: row.method,
    status: row.status,
    amount: row.credit || row.debit,
  }));

  const columns = [
    { key: "serialNo", label: "Sl.No." },
    { key: "txnId", label: "Txn ID", render: (item) => <span className="font-mono text-xs">{item.txnId}</span> },
    { key: "member", label: "Member", render: (item) => <span className="font-medium text-foreground">{item.member}</span> },
    { key: "openingBalance", label: "O.B.", render: (item) => <span className="tabular-nums">{formatCurrency(item.openingBalance)}</span> },
    { key: "credit", label: "C.R.", render: (item) => <span className="font-semibold text-success tabular-nums">{item.credit ? formatCurrency(item.credit) : "-"}</span> },
    { key: "debit", label: "D.B.", render: (item) => <span className="font-semibold text-destructive tabular-nums">{item.debit ? formatCurrency(item.debit) : "-"}</span> },
    { key: "closingBalance", label: "C.B.", render: (item) => <span className="font-semibold tabular-nums">{formatCurrency(item.closingBalance)}</span> },
    { key: "txnType", label: "Txn Type", render: (item) => <span className="capitalize">{item.txnType}</span> },
    { key: "status", label: "Status", render: (item) => <StatusBadge status={item.status} /> },
    { key: "txnDate", label: "Txn Date", render: (item) => <span className="text-muted-foreground">{item.txnDate}</span> },
  ];

  const filters = [
    { key: "status", label: "Status", options: [{ value: "all", label: "All Status" }, { value: "success", label: "Success" }, { value: "pending", label: "Pending" }, { value: "failed", label: "Failed" }] },
    { key: "txnType", label: "Txn Type", options: [{ value: "all", label: "All Types" }, { value: "payin", label: "Payin" }, { value: "payout", label: "Payout" }] },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <section className="rounded-[28px] border border-border/60 bg-card p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <Receipt className="h-3.5 w-3.5" />
              Statement Report
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground capitalize">{type} Report Statement</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Bank-statement style view with opening balance, credit, debit, and closing balance for every report entry.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => exportTransactionsToCsv(exportRows, `${type}-statement.csv`)}>
              <ArrowDownToLine className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button className="rounded-xl gradient-primary text-primary-foreground" onClick={() => exportTransactionsToPdf(exportRows, `${type}-statement.pdf`, `${type.toUpperCase()} Statement Report`)}>
              <FileText className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Total Credit</div>
            <div className="mt-3 text-2xl font-bold text-success">{formatCurrency(totalCredit)}</div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5" />
              Total Debit
            </div>
            <div className="mt-3 text-2xl font-bold text-destructive">{formatCurrency(totalDebit)}</div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <Wallet className="h-3.5 w-3.5" />
              Closing Balance
            </div>
            <div className="mt-3 text-2xl font-bold text-foreground">{formatCurrency(closingBalance)}</div>
          </div>
        </div>
      </section>

      <DataTable data={rows} columns={columns} filters={filters} loading={loading} searchPlaceholder="Search statement by txn ID, member, or balance..." />
    </div>
  );
};

export default ReportsPage;
