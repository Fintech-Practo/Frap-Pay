import { useState } from "react";
import {
  Building2,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatusBadge from "@/components/shared/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const mockBanks = [
  {
    id: "B1",
    name: "HDFC Bank",
    ifsc: "HDFC0001234",
    accountNumber: "****5678",
    type: "Current",
    status: "active",
  },
  {
    id: "B2",
    name: "ICICI Bank",
    ifsc: "ICIC0005678",
    accountNumber: "****9012",
    type: "Current",
    status: "active",
  },
  {
    id: "B3",
    name: "Axis Bank",
    ifsc: "UTIB0003456",
    accountNumber: "****3456",
    type: "Savings",
    status: "inactive",
  },
  {
    id: "B4",
    name: "SBI",
    ifsc: "SBIN0007890",
    accountNumber: "****7890",
    type: "Current",
    status: "active",
  },
];

const BankManagementPage = () => {
  const [banks] = useState(mockBanks);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const filtered = banks.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Bank Management
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Manage bank accounts and settlement details
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-xl gradient-primary text-primary-foreground gap-2">
              <Plus className="h-4 w-4" /> Add Bank
            </Button>
          </DialogTrigger>

          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle>Add Bank Account</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Bank Name
                </Label>
                <Input
                  placeholder="e.g., HDFC Bank"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Account Number
                </Label>
                <Input
                  placeholder="Account number"
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    IFSC Code
                  </Label>
                  <Input
                    placeholder="IFSC"
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Account Type
                  </Label>
                  <Input
                    placeholder="Current / Savings"
                    className="rounded-xl"
                  />
                </div>
              </div>

              <Button
                className="w-full rounded-xl gradient-primary text-primary-foreground"
                onClick={() =>
                  toast({
                    title: "Bank added",
                    description:
                      "Bank account added successfully.",
                  })
                }
              >
                Add Account
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Input
        placeholder="Search banks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm rounded-xl"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((bank) => (
          <div
            key={bank.id}
            className="card-modern flex items-center gap-4"
          >
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Building2 className="h-5 w-5 text-primary" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-foreground">
                  {bank.name}
                </p>

                <StatusBadge
                  status={
                    bank.status === "active"
                      ? "active"
                      : "inactive"
                  }
                />
              </div>

              <p className="text-xs text-muted-foreground mt-0.5">
                {bank.ifsc} · {bank.accountNumber} ·{" "}
                {bank.type}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BankManagementPage;