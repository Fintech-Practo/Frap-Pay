import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StatusBadge from "@/components/shared/StatusBadge";

const ProfilePage = () => {
  const [editing, setEditing] = useState(false);

  const profile = {
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91 98765 43210",
    address: "Mumbai, Maharashtra",
    role: "Merchant",
    joinDate: "June 15, 2024",
    kycStatus: "verified",
    approvalStatus: "approved",
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Profile
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Manage your account information
        </p>
      </div>

      {/* Approval Status Banner */}
      <div className="card-modern flex items-center gap-4 bg-success/5 border-success/20">
        <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
          <CheckCircle className="h-5 w-5 text-success" />
        </div>

        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">
            Account Approved
          </p>
          <p className="text-xs text-muted-foreground">
            Your account has been verified and approved by
            admin.
          </p>
        </div>

        <StatusBadge status="success" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Avatar Card */}
        <div className="card-modern flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-primary-foreground">
              RS
            </span>
          </div>

          <h3 className="font-semibold text-foreground">
            {profile.name}
          </h3>

          <p className="text-sm text-muted-foreground">
            {profile.role}
          </p>

          <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            Joined {profile.joinDate}
          </div>

          <div className="mt-4 flex gap-2">
            <StatusBadge status="verified" />
          </div>
        </div>

        {/* Details */}
        <div className="card-modern md:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">
              Personal Information
            </h3>

            <Button
              variant={editing ? "default" : "outline"}
              size="sm"
              onClick={() => setEditing(!editing)}
              className="rounded-xl"
            >
              {editing ? "Save Changes" : "Edit Profile"}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                <User className="h-3 w-3" /> Full Name
              </Label>
              <Input
                defaultValue={profile.name}
                disabled={!editing}
                className="rounded-xl"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Mail className="h-3 w-3" /> Email
              </Label>
              <Input
                defaultValue={profile.email}
                disabled={!editing}
                className="rounded-xl"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Phone className="h-3 w-3" /> Phone
              </Label>
              <Input
                defaultValue={profile.phone}
                disabled={!editing}
                className="rounded-xl"
              />
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-3 w-3" /> Address
              </Label>
              <Input
                defaultValue={profile.address}
                disabled={!editing}
                className="rounded-xl"
              />
            </div>
          </div>

          {/* Verification */}
          <div className="pt-4 border-t border-border/50">
            <h4 className="text-sm font-medium text-foreground mb-3">
              Verification
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50">
                <Shield className="h-4 w-4 text-success" />
                <div>
                  <p className="text-xs font-medium text-foreground">
                    KYC Status
                  </p>
                  <p className="text-xs text-success">
                    Verified
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50">
                <CheckCircle className="h-4 w-4 text-success" />
                <div>
                  <p className="text-xs font-medium text-foreground">
                    Admin Approval
                  </p>
                  <p className="text-xs text-success">
                    Approved
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;