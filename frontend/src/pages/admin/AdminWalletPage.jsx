import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/services/api";
import DataTable from "@/components/shared/DataTable";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Landmark, Wallet } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const formatAmount = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const AdminWalletPage = () => {
  const [loading, setLoading] = useState(true);
  const [wallets, setWallets] = useState([]);
  const [members, setMembers] = useState([]);
  const [memberEntries, setMemberEntries] = useState([]);
  const [form, setForm] = useState({ memberId: "", transferType: "credit", amount: "", reference: "", remark: "" });

  const load = async () => {
    setLoading(true);
    const [walletData, memberData] = await Promise.all([api.getWallets(), api.getMembers()]);
    setWallets(walletData);
    setMembers(memberData);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!form.memberId) {
      setMemberEntries([]);
      return;
    }
    api.getWalletEntries(form.memberId).then(setMemberEntries);
  }, [form.memberId]);

  const selectedMember = useMemo(() => members.find((item) => item.id === form.memberId), [members, form.memberId]);
  const projectedBalance = useMemo(() => {
    if (!selectedMember) return 0;
    const enteredAmount = Number(form.amount || 0);
    return form.transferType === "credit" ? selectedMember.walletBalance + enteredAmount : selectedMember.walletBalance - enteredAmount;
  }, [selectedMember, form.amount, form.transferType]);

  const submitAction = async () => {
    try {
      await api.adjustMemberBalance(form);
      await load();
      const entries = await api.getWalletEntries(form.memberId);
      setMemberEntries(entries);
      setForm((prev) => ({ ...prev, amount: "", reference: "", remark: "" }));
      toast({
        title: "Wallet updated",
        description: `${selectedMember?.name || "Member"} ${form.transferType} processed successfully.`,
      });
    } catch (error) {
      toast({
        title: "Wallet action failed",
        description: error.message || "Please check the selected transfer type and amount.",
        variant: "destructive",
      });
    }
  };

  const entryColumns = [
    { key: "reference", label: "Reference" },
    { key: "type", label: "Transfer Type", render: (item) => <span className="capitalize">{item.type}</span> },
    {
      key: "amount",
      label: "Amount",
      render: (item) => <span className={item.type === "credit" ? "font-semibold text-success" : "font-semibold text-destructive"}>{formatAmount(item.amount)}</span>,
    },
    { key: "balanceAfter", label: "Wallet Balance", render: (item) => <span className="font-semibold">{formatAmount(item.balanceAfter)}</span> },
    { key: "remark", label: "Remark" },
    { key: "date", label: "Date", render: (item) => <span className="text-muted-foreground">{item.date}</span> },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Wallets Overview</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Monitor wallet balances and credit or debit member balances directly from admin.</p>
        </div>
        <Link to="/admin/wallet/approval">
          <Button className="gradient-primary text-primary-foreground rounded-xl gap-2">
            <Landmark className="h-4 w-4" /> Fund Requests
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <SkeletonLoader variant="stat" count={6} />
        ) : (
          wallets.map((wallet) => (
            <div key={wallet.type} className="card-modern">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-xl gradient-subtle">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <div className={`text-xs font-medium ${wallet.change >= 0 ? "text-success" : "text-destructive"}`}>
                  {wallet.change >= 0 ? "+" : ""}
                  {wallet.change}%
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{wallet.type}</p>
              <p className="text-3xl font-bold text-foreground tracking-tight">{formatAmount(wallet.balance)}</p>
            </div>
          ))
        )}
      </div>

      <div className="card-modern">
        <div className="flex items-center gap-2 mb-5">
          <CreditCard className="h-4 w-4 text-primary" />
          <h2 className="font-semibold text-foreground">Credit / Debit Member Wallet</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Member</label>
            <Select value={form.memberId} onValueChange={(value) => setForm((prev) => ({ ...prev, memberId: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select member" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Transfer Type</label>
            <Select value={form.transferType} onValueChange={(value) => setForm((prev) => ({ ...prev, transferType: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit">Credit</SelectItem>
                <SelectItem value="debit">Debit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Amount</label>
            <Input value={form.amount} onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))} placeholder="Enter amount" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Reference</label>
            <Input value={form.reference} onChange={(e) => setForm((prev) => ({ ...prev, reference: e.target.value }))} placeholder="Transaction ref" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Wallet Balance</label>
            <Input value={selectedMember ? formatAmount(selectedMember.walletBalance) : ""} disabled placeholder="Balance" />
          </div>
        </div>

        {selectedMember && (
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Selected Member</div>
              <div className="mt-2 text-lg font-semibold text-foreground">{selectedMember.name}</div>
              <div className="mt-1 text-sm text-muted-foreground">
                {selectedMember.id} • {selectedMember.role}
              </div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Current Balance</div>
              <div className="mt-2 text-lg font-semibold text-foreground">{formatAmount(selectedMember.walletBalance)}</div>
              <div className="mt-1 text-sm text-muted-foreground">Based on the selected member</div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Projected Balance</div>
              <div className={`mt-2 text-lg font-semibold ${projectedBalance < 0 ? "text-destructive" : "text-foreground"}`}>{formatAmount(projectedBalance)}</div>
              <div className="mt-1 text-sm text-muted-foreground">After the current {form.transferType} action</div>
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-[1fr_auto] mt-4">
          <Input value={form.remark} onChange={(e) => setForm((prev) => ({ ...prev, remark: e.target.value }))} placeholder="Enter remark" />
          <Button className="rounded-xl gradient-primary text-primary-foreground" disabled={!form.memberId || !form.amount || projectedBalance < 0} onClick={submitAction}>
            Submit
          </Button>
        </div>
      </div>

      <DataTable data={memberEntries} columns={entryColumns} searchPlaceholder="Search member wallet history..." />
    </div>
  );
};

export default AdminWalletPage;
