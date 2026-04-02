import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "@/services/api";
import DataTable from "@/components/shared/DataTable";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Building2, Globe, ShieldCheck, Wallet } from "lucide-react";

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const Metric = ({ label, value }) => (
  <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
    <div className="mt-3 text-lg font-semibold text-foreground">{value}</div>
  </div>
);

const MemberDetailPage = () => {
  const { memberId } = useParams();
  const [member, setMember] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ phone: "", address: "", city: "", state: "", pincode: "", ipAddress: "", schemeId: "" });

  const loadMember = async () => {
    setLoading(true);
    const [memberData, schemeData] = await Promise.all([api.getMemberById(memberId), api.getCommissionData()]);
    setMember(memberData);
    setSchemes(schemeData);
    if (memberData) {
      setForm({
        phone: memberData.phone || "",
        address: memberData.address || "",
        city: memberData.city || "",
        state: memberData.state || "",
        pincode: memberData.pincode || "",
        ipAddress: memberData.ipAddress || "",
        schemeId: memberData.schemeId || "",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMember();
  }, [memberId]);

  const transactionColumns = useMemo(
    () => [
      { key: "txnId", label: "Transaction ID" },
      { key: "method", label: "Method" },
      { key: "amount", label: "Amount", render: (item) => <span className="font-semibold">{formatCurrency(item.amount)}</span> },
      { key: "status", label: "Status", render: (item) => <StatusBadge status={item.status} /> },
      { key: "date", label: "Date", render: (item) => <span className="text-muted-foreground">{item.date}</span> },
    ],
    []
  );

  const walletColumns = useMemo(
    () => [
      { key: "reference", label: "Reference" },
      { key: "type", label: "Type", render: (item) => <span className="capitalize">{item.type}</span> },
      {
        key: "amount",
        label: "Amount",
        render: (item) => <span className={item.type === "credit" ? "text-success font-semibold" : "text-destructive font-semibold"}>{formatCurrency(item.amount)}</span>,
      },
      { key: "balanceAfter", label: "Balance After", render: (item) => <span className="font-semibold">{formatCurrency(item.balanceAfter)}</span> },
      { key: "remark", label: "Remark" },
      { key: "date", label: "Date", render: (item) => <span className="text-muted-foreground">{item.date}</span> },
    ],
    []
  );

  const statementColumns = useMemo(
    () => [
      { key: "serialNo", label: "Sl.No." },
      { key: "txnId", label: "Txn Id" },
      { key: "openingBalance", label: "O.B.", render: (item) => formatCurrency(item.openingBalance) },
      { key: "credit", label: "C.R.", render: (item) => (item.credit ? formatCurrency(item.credit) : "-") },
      { key: "debit", label: "D.B.", render: (item) => (item.debit ? formatCurrency(item.debit) : "-") },
      { key: "closingBalance", label: "C.B.", render: (item) => formatCurrency(item.closingBalance) },
      { key: "txnType", label: "Txn Type", render: (item) => <span className="capitalize">{item.txnType}</span> },
      { key: "txnDate", label: "Txn Date", render: (item) => <span className="text-muted-foreground">{item.txnDate}</span> },
    ],
    []
  );

  if (loading) {
    return <div className="space-y-6 max-w-7xl"><SkeletonLoader variant="stat" count={4} /></div>;
  }

  if (!member) {
    return <div className="card-modern max-w-3xl">Member not found.</div>;
  }

  const assignedScheme = schemes.find((item) => item.id === (member.schemeId || form.schemeId)) || member.scheme || null;

  const saveDetails = async () => {
    const updated = await api.updateMemberDetails(member.id, form);
    setMember((prev) => ({ ...prev, ...updated, scheme: schemes.find((item) => item.id === form.schemeId) || prev.scheme }));
  };

  const toggleService = async (serviceKey, checked) => {
    const updated = await api.updateMemberService(member.id, serviceKey, checked);
    setMember((prev) => ({
      ...prev,
      services: updated.services,
      servicesList: prev.servicesList.map((item) => (item.key === serviceKey ? { ...item, active: checked } : item)),
    }));
  };

  const assignScheme = async (schemeId) => {
    setForm((prev) => ({ ...prev, schemeId }));
    const updated = await api.assignSchemeToMember(member.id, schemeId);
    setMember((prev) => ({ ...prev, schemeId: updated.schemeId, scheme: updated.scheme }));
  };

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
            Readable member detail page with editable IP, service permissions, commission mapping, KYC assets, and full statement-style activity.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={member.status} className="px-3 py-1.5 text-sm" />
          <StatusBadge status={member.kycStatus} className="px-3 py-1.5 text-sm" />
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Wallet Balance" value={formatCurrency(member.walletBalance)} />
        <Metric label="IP Address" value={member.ipAddress} />
        <Metric label="Assigned Scheme" value={member.scheme?.name || "Not assigned"} />
        <Metric label="Transactions" value={member.transactions.length} />
      </section>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 rounded-2xl bg-muted/50 p-1">
          <TabsTrigger value="overview" className="rounded-xl">Overview</TabsTrigger>
          <TabsTrigger value="services" className="rounded-xl">Services</TabsTrigger>
          <TabsTrigger value="documents" className="rounded-xl">Documents</TabsTrigger>
          <TabsTrigger value="history" className="rounded-xl">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <div className="card-modern space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <h2 className="font-semibold text-foreground">Operational Details</h2>
                  </div>
                  <StatusBadge status={member.status} />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Input value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} placeholder="Phone" />
                  <Input value={form.ipAddress} onChange={(e) => setForm((prev) => ({ ...prev, ipAddress: e.target.value }))} placeholder="IP Address" />
                  <Input value={form.city} onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))} placeholder="City" />
                  <Input value={form.state} onChange={(e) => setForm((prev) => ({ ...prev, state: e.target.value }))} placeholder="State" />
                  <Input value={form.pincode} onChange={(e) => setForm((prev) => ({ ...prev, pincode: e.target.value }))} placeholder="Pincode" />
                  <Select value={form.schemeId} onValueChange={assignScheme}>
                    <SelectTrigger>
                      <SelectValue placeholder="Assign scheme" />
                    </SelectTrigger>
                    <SelectContent>
                      {schemes.map((scheme) => (
                        <SelectItem key={scheme.id} value={scheme.id}>
                          {scheme.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Input value={form.address} onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))} placeholder="Address" />
                <Button className="rounded-xl" onClick={saveDetails}>Save Member Details</Button>
              </div>

              <div className="card-modern space-y-4">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-primary" />
                  <h2 className="font-semibold text-foreground">Bank & Identity</h2>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Metric label="Bank Name" value={member.bank.bankName || "Not added"} />
                  <Metric label="Account Type" value={member.bank.accountType || "Not added"} />
                  <Metric label="A/C Number" value={member.bank.accountNo || "Not added"} />
                  <Metric label="IFSC" value={member.bank.ifsc || "Not added"} />
                </div>

                <div className="rounded-2xl border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
                  Aadhaar: <span className="font-medium text-foreground">{member.kyc.aadhaar || "Not added"}</span>
                  <br />
                  PAN: <span className="font-medium text-foreground">{member.kyc.pan || "Not added"}</span>
                  <br />
                  GST: <span className="font-medium text-foreground">{member.kyc.gstNo || "Not added"}</span>
                  <br />
                  Voter ID: <span className="font-medium text-foreground">{member.kyc.voterId || "Not added"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="card-modern space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-foreground">Commission Mapping</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Scheme assignment stays editable here and the linked slab ranges update below.</p>
                  </div>
                  <StatusBadge status={assignedScheme ? "active" : "inactive"} />
                </div>

                <Select value={form.schemeId} onValueChange={assignScheme}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Assign scheme" />
                  </SelectTrigger>
                  <SelectContent>
                    {schemes.map((scheme) => (
                      <SelectItem key={scheme.id} value={scheme.id}>
                        {scheme.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                  <div className="text-lg font-semibold text-foreground">{assignedScheme?.name || "No scheme assigned"}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{assignedScheme?.description || "Assign a scheme to map commission slabs for this member."}</div>
                  <div className="mt-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    {assignedScheme?.category || "unassigned"} {assignedScheme ? `• ${assignedScheme.slabs.length} slabs` : ""}
                  </div>
                </div>

                <div className="space-y-3">
                  {assignedScheme?.slabs?.length ? (
                    assignedScheme.slabs.map((slab) => (
                      <div key={slab.id} className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/80 px-4 py-3">
                        <div>
                          <div className="text-sm font-semibold text-foreground">{slab.range}</div>
                          <div className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">{slab.rateType}</div>
                        </div>
                        <div className="text-base font-semibold text-primary">{slab.displayRate}</div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-border bg-muted/10 px-4 py-6 text-sm text-muted-foreground">
                      No slabs are linked with the assigned scheme yet.
                    </div>
                  )}
                </div>
              </div>

              <div className="card-modern">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Member Summary</div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Metric label="Joined" value={member.joinDate || "Not added"} />
                  <Metric label="KYC Status" value={member.kycStatus} />
                  <Metric label="Email" value={member.email || "Not added"} />
                  <Metric label="Role" value={member.role || "Not added"} />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {member.servicesList.map((service) => (
              <div key={service.key} className="card-modern flex items-center justify-between">
                <div>
                  <div className="text-base font-semibold text-foreground">{service.label}</div>
                  <div className="mt-1 text-sm text-muted-foreground">Control whether the member can use this operational service.</div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={service.active ? "active" : "inactive"} />
                  <Switch checked={service.active} onCheckedChange={(checked) => toggleService(service.key, checked)} />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {member.kyc.documents.map((document) => (
              <div key={document.key} className="card-modern overflow-hidden p-0">
                <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
                  <div className="text-sm font-semibold text-foreground">{document.label}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Globe className="h-3.5 w-3.5" /> Uploaded
                  </div>
                </div>
                <img src={document.image} alt={document.label} className="h-[260px] w-full object-cover" />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <DataTable data={member.walletEntries} columns={walletColumns} searchPlaceholder="Search wallet actions..." />
            <DataTable data={member.transactions} columns={transactionColumns} searchPlaceholder="Search transactions..." />
          </div>

          <div className="card-modern p-0">
            <div className="border-b border-border/50 px-5 py-4">
              <div className="flex items-center gap-2 text-base font-semibold text-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" /> Member Statement
              </div>
            </div>
            <DataTable data={member.statementRows} columns={statementColumns} searchable={false} pageSize={10} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MemberDetailPage;
