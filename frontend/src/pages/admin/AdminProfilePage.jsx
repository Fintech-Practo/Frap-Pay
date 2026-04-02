import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User,
  Mail,
  Phone,
  Shield,
  Building2,
  MapPin,
  Camera,
} from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";
import { toast } from "@/hooks/use-toast";

const AdminProfilePage = () => {
  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@fintech.com",
    phone: "+91 98765 43210",
    role: "Super Admin",
    department: "Operations",
    location: "Mumbai, India",
  });

  const handleSave = () => {
    setEditing(false);
    toast({
      title: "Profile Updated",
      description: "Admin profile saved successfully.",
    });
  };

  const fields = [
    { icon: User, label: "Full Name", key: "name" },
    { icon: Mail, label: "Email Address", key: "email" },
    { icon: Phone, label: "Phone Number", key: "phone" },
    { icon: Shield, label: "Role", key: "role" },
    { icon: Building2, label: "Department", key: "department" },
    { icon: MapPin, label: "Location", key: "location" },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Admin Profile
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Manage your admin account details.
        </p>
      </div>

      {/* Profile Header */}
      <div className="card-modern p-6">
        <div className="flex items-start gap-6">
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center">
              <Shield className="h-10 w-10 text-primary-foreground" />
            </div>

            <button className="absolute inset-0 rounded-2xl bg-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="h-5 w-5 text-background" />
            </button>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-foreground">
                {profile.name}
              </h2>
              <StatusBadge status="active" />
            </div>

            <p className="text-sm text-muted-foreground mt-1">
              {profile.role} · {profile.department}
            </p>

            <p className="text-xs text-muted-foreground mt-0.5">
              Last login: 28 Mar 2025, 14:30 IST
            </p>
          </div>

          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() =>
              editing ? handleSave() : setEditing(true)
            }
          >
            {editing ? "Save Changes" : "Edit Profile"}
          </Button>
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field.key} className="card-modern p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-muted">
                <field.icon className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="flex-1">
                <p className="text-xs text-muted-foreground">
                  {field.label}
                </p>

                {editing && field.key !== "role" ? (
                  <Input
                    value={profile[field.key]}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        [field.key]: e.target.value,
                      })
                    }
                    className="h-8 mt-1 rounded-lg text-sm"
                  />
                ) : (
                  <p className="text-sm font-medium text-foreground mt-0.5">
                    {profile[field.key]}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Permissions */}
      <div className="card-modern p-5">
        <h3 className="font-semibold text-foreground mb-3">
          Admin Permissions
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            "Member Management",
            "Fund Approval",
            "API Configuration",
            "Commission Setup",
            "Wallet Management",
            "Activity Logs",
            "System Settings",
            "Support Management",
          ].map((perm) => (
            <div
              key={perm}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-success/5 border border-success/20"
            >
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-xs font-medium text-foreground">
                {perm}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;