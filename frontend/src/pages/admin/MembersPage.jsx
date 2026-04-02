import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import DataTable from "@/components/shared/DataTable";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Building2,
  CreditCard,
  Eye,
  FileImage,
  Landmark,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  User,
  UserPlus,
  Users,
} from "lucide-react";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  dob: "",
  gender: "male",
  role: "merchant",
  address: "",
  city: "",
  state: "",
  pincode: "",
  bankName: "",
  accountNo: "",
  ifsc: "",
  accountType: "savings",
  branchName: "",
  aadhaar: "",
  pan: "",
  gstNo: "",
  voterId: "",
  aadhaarImage: "",
  panImage: "",
  voterIdImage: "",
};

const StatPill = ({ icon: Icon, label, value, tint }) => (
  <div className="rounded-[24px] border border-border/60 bg-card p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
    <div className="flex items-center justify-between">
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
        <div className="mt-3 text-2xl font-bold tracking-tight text-foreground">{value}</div>
      </div>
      <div className={`rounded-2xl p-3 ${tint}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </div>
);

const UploadField = ({ label, preview, onChange, helper }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <span className="text-xs text-muted-foreground">{helper}</span>
    </div>
    <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/30 p-4 text-center transition hover:border-primary/40 hover:bg-primary/5">
      {preview ? (
        <img src={preview} alt={label} className="h-36 w-full rounded-xl object-cover" />
      ) : (
        <>
          <div className="rounded-2xl bg-background p-3 text-primary shadow-sm">
            <FileImage className="h-5 w-5" />
          </div>
          <div className="mt-3 text-sm font-medium text-foreground">Upload document image</div>
          <div className="mt-1 text-xs text-muted-foreground">PNG, JPG, or scanned copy</div>
        </>
      )}
      <input type="file" accept="image/*" className="hidden" onChange={onChange} />
    </label>
  </div>
);

const MembersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [addTab, setAddTab] = useState("personal");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    api.getMembers().then((records) => {
      setMembers(records);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setAddOpen(location.pathname === "/admin/members/add");
  }, [location.pathname]);

  const resetForm = () => {
    setForm(initialForm);
    setAddTab("personal");
  };

  const handleDialogChange = (open) => {
    setAddOpen(open);

    if (!open) {
      resetForm();

      if (location.pathname === "/admin/members/add") {
        navigate("/admin/members");
      }
    }
  };

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (field) => (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const preview = URL.createObjectURL(file);
    updateForm(field, preview);
  };

  const formatVolume = (value) =>
    value >= 100000 ? `₹${(value / 100000).toFixed(1)}L` : `₹${value.toLocaleString("en-IN")}`;

  const metrics = useMemo(() => {
    const activeMembers = members.filter((member) => member.status === "active").length;
    const verifiedKyc = members.filter((member) => member.kycStatus === "verified").length;
    const totalVolume = members.reduce((sum, member) => sum + Number(member.volume || 0), 0);
    const pendingKyc = members.filter((member) => member.kycStatus !== "verified").length;

    return { activeMembers, verifiedKyc, totalVolume, pendingKyc };
  }, [members]);

  const handleAddMember = async () => {
    setSubmitting(true);

    const createdMember = await api.createMember(form);
    setMembers((prev) => [createdMember, ...prev]);
    setSubmitting(false);
    handleDialogChange(false);
  };

  const columns = [
    {
      key: "name",
      label: "Member",
      render: (item) => (
        <div className="flex items-center gap-3">
          <img src={item.avatar} alt={item.name} className="h-10 w-10 rounded-2xl border border-border/60 object-cover" />
          <div>
            <p className="font-medium text-foreground">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (item) => <span className="capitalize text-sm font-medium text-foreground">{item.role}</span>,
    },
    {
      key: "kycStatus",
      label: "KYC",
      render: (item) => <StatusBadge status={item.kycStatus} />,
    },
    {
      key: "status",
      label: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "volume",
      label: "Volume",
      render: (item) => <span className="font-semibold tabular-nums">{formatVolume(item.volume)}</span>,
    },
    {
      key: "joinDate",
      label: "Joined",
      render: (item) => <span className="text-muted-foreground">{item.joinDate}</span>,
    },
    {
      key: "actions",
      label: "",
      render: (item) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-xl border border-transparent hover:border-border/60 hover:bg-background"
          onClick={() => navigate(`/admin/members/${item.id}`)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const filters = [
    {
      key: "role",
      label: "Role",
      options: [
        { value: "all", label: "All Roles" },
        { value: "merchant", label: "Merchant" },
        { value: "agent", label: "Agent" },
        { value: "distributor", label: "Distributor" },
      ],
    },
    {
      key: "kycStatus",
      label: "KYC",
      options: [
        { value: "all", label: "All KYC" },
        { value: "verified", label: "Verified" },
        { value: "pending", label: "Pending" },
        { value: "rejected", label: "Rejected" },
        { value: "kyc_pending", label: "KYC Pending" },
      ],
    },
  ];

  const InputField = ({ label, field, placeholder, type = "text" }) => (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <Input
        value={form[field]}
        onChange={(event) => updateForm(field, event.target.value)}
        placeholder={placeholder}
        className="h-11 rounded-xl border-border/60 bg-background/70"
        type={type}
      />
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl">
      <section className="relative overflow-hidden rounded-[32px] border border-border/60 bg-card p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(220,38,38,0.12),_transparent_34%),radial-gradient(circle_at_left,_rgba(59,130,246,0.08),_transparent_22%)]" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Member Operations
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">Build a clean, trustworthy onboarding flow</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Review KYC, bank credentials, and onboarding quality from one place. The add-member flow now includes
              bank details, government ID capture, and image uploads so the admin side feels complete and production-ready.
            </p>
          </div>

          <Dialog open={addOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
              <Button
                className="rounded-2xl gradient-primary px-5 py-6 text-primary-foreground shadow-[0_14px_30px_rgba(220,38,38,0.28)]"
                onClick={() => navigate("/admin/members/add")}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            </DialogTrigger>

            <DialogContent className="max-h-[88vh] overflow-y-auto rounded-[28px] border-border/60 sm:max-w-4xl">
              <DialogHeader>
                <DialogTitle className="text-xl">Add New Member</DialogTitle>
              </DialogHeader>

              <Tabs value={addTab} onValueChange={setAddTab} className="mt-4 space-y-5">
                <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-muted/50 p-1">
                  <TabsTrigger value="personal" className="rounded-xl gap-2">
                    <User className="h-4 w-4" />
                    Personal
                  </TabsTrigger>
                  <TabsTrigger value="bank" className="rounded-xl gap-2">
                    <Landmark className="h-4 w-4" />
                    Bank Details
                  </TabsTrigger>
                  <TabsTrigger value="government" className="rounded-xl gap-2">
                    <CreditCard className="h-4 w-4" />
                    Government ID
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <InputField label="Full Name" field="name" placeholder="Enter full name" />
                    <InputField label="Email" field="email" placeholder="email@example.com" type="email" />
                    <InputField label="Phone" field="phone" placeholder="+91 XXXXX XXXXX" />
                    <InputField label="Date of Birth" field="dob" placeholder="YYYY-MM-DD" type="date" />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Gender</label>
                      <Select value={form.gender} onValueChange={(value) => updateForm("gender", value)}>
                        <SelectTrigger className="h-11 rounded-xl border-border/60 bg-background/70">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Role</label>
                      <Select value={form.role} onValueChange={(value) => updateForm("role", value)}>
                        <SelectTrigger className="h-11 rounded-xl border-border/60 bg-background/70">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="merchant">Merchant</SelectItem>
                          <SelectItem value="agent">Agent</SelectItem>
                          <SelectItem value="distributor">Distributor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <InputField label="Address" field="address" placeholder="Full address" />

                  <div className="grid gap-4 md:grid-cols-3">
                    <InputField label="City" field="city" placeholder="City" />
                    <InputField label="State" field="state" placeholder="State" />
                    <InputField label="Pincode" field="pincode" placeholder="000000" />
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={() => setAddTab("bank")} className="rounded-xl px-5">
                      Next: Bank Details
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="bank" className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <InputField label="Bank Name" field="bankName" placeholder="e.g. State Bank of India" />
                    <InputField label="Account Number" field="accountNo" placeholder="Account number" />
                    <InputField label="IFSC Code" field="ifsc" placeholder="e.g. SBIN0001234" />

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Account Type</label>
                      <Select value={form.accountType} onValueChange={(value) => updateForm("accountType", value)}>
                        <SelectTrigger className="h-11 rounded-xl border-border/60 bg-background/70">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="savings">Savings</SelectItem>
                          <SelectItem value="current">Current</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <InputField label="Branch Name" field="branchName" placeholder="Branch name" />

                  <div className="rounded-2xl border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
                    Bank details feed directly into payout setup and settlement checks, so onboarding should capture them
                    before activation.
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" className="rounded-xl" onClick={() => setAddTab("personal")}>
                      Back
                    </Button>
                    <Button onClick={() => setAddTab("government")} className="rounded-xl px-5">
                      Next: Government ID
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="government" className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <InputField label="Aadhaar Number" field="aadhaar" placeholder="XXXX XXXX XXXX" />
                    <InputField label="PAN Number" field="pan" placeholder="ABCDE1234F" />
                    <InputField label="GST Number" field="gstNo" placeholder="Optional for eligible businesses" />
                    <InputField label="Voter ID" field="voterId" placeholder="Optional backup ID" />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <UploadField
                      label="Aadhaar Image"
                      helper="Required"
                      preview={form.aadhaarImage}
                      onChange={handleImageUpload("aadhaarImage")}
                    />
                    <UploadField
                      label="PAN Image"
                      helper="Required"
                      preview={form.panImage}
                      onChange={handleImageUpload("panImage")}
                    />
                    <UploadField
                      label="Voter ID Image"
                      helper="Optional"
                      preview={form.voterIdImage}
                      onChange={handleImageUpload("voterIdImage")}
                    />
                  </div>

                  <div className="rounded-2xl border border-success/20 bg-success/5 p-4 text-sm text-muted-foreground">
                    <div className="mb-1 flex items-center gap-2 font-medium text-foreground">
                      <ShieldCheck className="h-4 w-4 text-success" />
                      KYC readiness check
                    </div>
                    Provide clear, front-facing document images so compliance review can approve the member without a re-upload cycle.
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" className="rounded-xl" onClick={() => setAddTab("bank")}>
                      Back
                    </Button>
                    <Button
                      className="rounded-xl gradient-primary text-primary-foreground"
                      disabled={submitting}
                      onClick={handleAddMember}
                    >
                      {submitting ? "Adding Member..." : "Add Member"}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatPill icon={Users} label="Active Members" value={metrics.activeMembers} tint="bg-primary/10 text-primary" />
        <StatPill icon={ShieldCheck} label="Verified KYC" value={metrics.verifiedKyc} tint="bg-success/10 text-success" />
        <StatPill icon={TrendingUp} label="Portfolio Volume" value={`₹${metrics.totalVolume.toLocaleString("en-IN")}`} tint="bg-warning/10 text-warning" />
        <StatPill icon={Building2} label="Pending Review" value={metrics.pendingKyc} tint="bg-muted text-foreground" />
      </section>

      <DataTable
        data={members}
        columns={columns}
        filters={filters}
        loading={loading}
        searchPlaceholder="Search members, role, or email..."
      />
    </div>
  );
};

export default MembersPage;
