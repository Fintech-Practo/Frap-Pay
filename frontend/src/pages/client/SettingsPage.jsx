import { useState } from "react";
import {
  Lock,
  KeyRound,
  Shield,
  Eye,
  EyeOff,
  Bell,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const { toast } = useToast();

  const handleSave = (section) => {
    toast({
      title: `${section} updated`,
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Manage your account preferences
        </p>
      </div>

      <Tabs defaultValue="security" className="space-y-6">
        <TabsList className="bg-muted/50 rounded-xl p-1">
          <TabsTrigger
            value="security"
            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
          >
            Security
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
          >
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
          >
            Preferences
          </TabsTrigger>
        </TabsList>

        {/* ================= SECURITY ================= */}
        <TabsContent value="security" className="space-y-6">
          {/* Change Password */}
          <div className="card-modern space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Lock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">
                  Change Password
                </h3>
                <p className="text-xs text-muted-foreground">
                  Update your login password
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Current Password
                </Label>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="rounded-xl pr-10"
                  />

                  <button
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  New Password
                </Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Confirm New Password
                </Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="rounded-xl"
                />
              </div>

              <Button
                onClick={() => handleSave("Password")}
                className="rounded-xl gradient-primary text-primary-foreground"
              >
                Update Password
              </Button>
            </div>
          </div>

          {/* Change PIN */}
          <div className="card-modern space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-warning/10 flex items-center justify-center">
                <KeyRound className="h-4 w-4 text-warning" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">
                  Transaction PIN
                </h3>
                <p className="text-xs text-muted-foreground">
                  Change your 4-digit transaction PIN
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Current PIN
                </Label>

                <div className="relative">
                  <Input
                    type={showPin ? "text" : "password"}
                    maxLength={4}
                    placeholder="••••"
                    className="rounded-xl w-40 pr-10"
                  />

                  <button
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPin ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  New PIN
                </Label>
                <Input
                  type="password"
                  maxLength={4}
                  placeholder="••••"
                  className="rounded-xl w-40"
                />
              </div>

              <Button
                onClick={() => handleSave("PIN")}
                className="rounded-xl gradient-primary text-primary-foreground"
              >
                Update PIN
              </Button>
            </div>
          </div>

          {/* 2FA */}
          <div className="card-modern">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-success/10 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">
                    Two-Factor Authentication
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Add an extra layer of security
                  </p>
                </div>
              </div>
              <Switch />
            </div>
          </div>
        </TabsContent>

        {/* ================= NOTIFICATIONS ================= */}
        <TabsContent value="notifications" className="space-y-4">
          <div className="card-modern space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Bell className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">
                Notification Preferences
              </h3>
            </div>

            {[
              {
                label: "Transaction alerts",
                desc: "Get notified for every transaction",
                defaultOn: true,
              },
              {
                label: "Fund request updates",
                desc: "Approvals & rejections",
                defaultOn: true,
              },
              {
                label: "Security alerts",
                desc: "Login from new device, password changes",
                defaultOn: true,
              },
              {
                label: "Marketing emails",
                desc: "Product updates and newsletters",
                defaultOn: false,
              },
              {
                label: "Weekly summary",
                desc: "Weekly transaction report via email",
                defaultOn: false,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-2"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {item.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
                <Switch defaultChecked={item.defaultOn} />
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ================= PREFERENCES ================= */}
        <TabsContent value="preferences" className="space-y-4">
          <div className="card-modern space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Globe className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">
                General Preferences
              </h3>
            </div>

            {[
              {
                label: "Compact view",
                desc: "Use denser table rows and smaller cards",
                defaultOn: false,
              },
              {
                label: "Show balance in navbar",
                desc: "Display wallet balance in the top bar",
                defaultOn: true,
              },
              {
                label: "Auto-refresh data",
                desc: "Automatically refresh dashboard data every 30s",
                defaultOn: true,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-2"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {item.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
                <Switch defaultChecked={item.defaultOn} />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;