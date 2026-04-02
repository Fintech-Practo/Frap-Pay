import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "@/services/api";
import StatusBadge from "@/components/shared/StatusBadge";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import DataTable from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  FileBadge2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Wallet,
} from "lucide-react";

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const DetailMetric = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </div>
    <div className="mt-3 text-lg font-semibold text-foreground">{value}</div>
  </div>
);

const MemberDetailPage = () => {
  const { memberId } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadMember = async () => {
      setLoading(true);
      const data = await api.getMemberById(memberId);

      if (mounted) {
        setMember(data);
        setLoading(false);
      }
    };

    loadMember();

    return () => {
      mounted = false;
    };
  }, [memberId]);

  const transactionColumns = useMemo(
    () => [
      { key: "txnId", label: "Transaction ID" },
      { key: "type", label: "Type", render: (item) => <span className="capitalize">{item.type}</span> },
      { key: "method", label: "Method" },
      { key: "amount", label: "Amount", render: (item) => <span className="font-semibold">{formatCurrency(item.amount)}</span> },
      { key: "status", label: "Status", render: (item) => <StatusBadge status={item.status} /> },
      { key: "date", label: "Date", render: (item) => <span className="text-muted-foreground">{item.date}</span> },
    ],
    []
  );

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl">
        <SkeletonLoader variant="stat" count={4} />
        <div className="card-modern">
          <div className="space-y-4">
            <div className="h-6 w-52 animate-pulse rounded bg-muted" />
            <div className="h-48 animate-pulse rounded-2xl bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="card-modern max-w-3xl">
        <h1 className="text-2xl font-bold text-foreground">Member not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The requested member record could not be loaded.
        </p>
        <Button asChild className="mt-6 rounded-xl">
          <Link to="/admin/members">Back to members</Link>
        </Button>
      </div>
    );
  }

  const successfulTransactions = member.transactions.filter((item) => item.status === "success");
  const totalProcessed = member.transactions.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Button variant="ghost" asChild className="mb-3 -ml-3 rounded-xl text-muted-foreground hover:text-foreground">
            <Link to="/admin/members">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Members
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{member.name}</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Full onboarding profile with KYC evidence, bank configuration, and transaction history.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={member.status} className="px-3 py-1.5 text-sm" />
          <StatusBadge status={member.kycStatus} className="px-3 py-1.5 text-sm" />
        </div>
      </div>

      <section className="relative overflow-hidden rounded-[28px] border border-border/60 bg-card p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(220,38,38,0.12),_transparent_32%),radial-gradient(circle_at_left,_rgba(59,130,246,0.08),_transparent_24%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex gap-4">
            <img
              src={member.avatar}
              alt={member.name}
              className="h-24 w-24 rounded-3xl border border-border/60 object-cover shadow-lg"
            />
            <div className="space-y-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  {member.role}
                </div>
                <div className="mt-1 text-2xl font-semibold text-foreground">{member.name}</div>
              </div>
              <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {member.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {member.phone || "Phone not added"}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {[member.city, member.state].filter(Boolean).join(", ")}
                </div>
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4" />
                  Joined {member.joinDate}
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <DetailMetric icon={Wallet} label="Volume" value={formatCurrency(member.volume)} />
            <DetailMetric icon={ShieldCheck} label="Transactions" value={member.transactions.length} />
            <DetailMetric icon={FileBadge2} label="Successes" value={successfulTransactions.length} />
          </div>
        </div>
      </section>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-muted/50 p-1">
          <TabsTrigger value="overview" className="rounded-xl">Overview</TabsTrigger>
          <TabsTrigger value="documents" className="rounded-xl">KYC Documents</TabsTrigger>
          <TabsTrigger value="transactions" className="rounded-xl">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="card-modern">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Bank Details</h2>
                  <p className="text-sm text-muted-foreground">Verified payout destination and beneficiary metadata.</p>
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <DetailMetric icon={Building2} label="Bank Name" value={member.bank.bankName || "Not added"} />
                <DetailMetric icon={Wallet} label="Account Type" value={member.bank.accountType || "Not added"} />
                <DetailMetric icon={ShieldCheck} label="A/C Number" value={member.bank.accountNo || "Not added"} />
                <DetailMetric icon={BadgeCheck} label="IFSC" value={member.bank.ifsc || "Not added"} />
              </div>
              <div className="mt-4 rounded-2xl border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
                Branch: <span className="font-medium text-foreground">{member.bank.branchName || "Not added"}</span>
                {"  "} Beneficiary: <span className="font-medium text-foreground">{member.bank.beneficiaryName || member.name}</span>
              </div>
            </div>

            <div className="card-modern">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-success/10 p-3 text-success">
                  <FileBadge2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Government IDs</h2>
                  <p className="text-sm text-muted-foreground">Primary identifiers submitted during onboarding.</p>
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <DetailMetric icon={FileBadge2} label="Aadhaar" value={member.kyc.aadhaar || "Not added"} />
                <DetailMetric icon={FileBadge2} label="PAN" value={member.kyc.pan || "Not added"} />
                <DetailMetric icon={FileBadge2} label="GST Number" value={member.kyc.gstNo || "Not added"} />
                <DetailMetric icon={FileBadge2} label="Voter ID" value={member.kyc.voterId || "Not added"} />
              </div>
              <div className="mt-4 rounded-2xl border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
                {member.kyc.verificationNote}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {member.kyc.documents.map((document) => (
              <div key={document.key} className="card-modern overflow-hidden p-0">
                <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
                  <div>
                    <div className="text-sm font-semibold text-foreground">{document.label}</div>
                    <div className="text-xs text-muted-foreground">Submitted for KYC validation</div>
                  </div>
                  <StatusBadge status={member.kycStatus} />
                </div>
                <img src={document.image} alt={document.label} className="h-[260px] w-full object-cover" />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <DetailMetric icon={Wallet} label="Processed" value={formatCurrency(totalProcessed)} />
            <DetailMetric icon={ShieldCheck} label="Success Volume" value={formatCurrency(successfulTransactions.reduce((sum, item) => sum + item.amount, 0))} />
            <DetailMetric icon={BadgeCheck} label="Last Activity" value={member.transactions[0]?.date || "No activity"} />
          </div>

          <DataTable
            data={member.transactions}
            columns={transactionColumns}
            searchable
            loading={false}
            searchPlaceholder="Search transaction history..."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MemberDetailPage;
