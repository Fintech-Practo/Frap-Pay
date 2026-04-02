import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Bell, Shield, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const AdminSettingsPage = () => {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });
  const [notifications, setNotifications] = useState({
    fundApprovals: true, memberSignups: true, apiAlerts: true,
    systemUpdates: false, securityAlerts: true, dailyReport: true,
  });

  const handleChangePassword = () => {
    if (!passwords.old || !passwords.new || passwords.new !== passwords.confirm) {
      toast({ title: "Error", description: "Please fill all fields correctly.", variant: "destructive" });
      return;
    }
    toast({ title: "Password Changed", description: "Admin password updated successfully." });
    setPasswords({ old: '', new: '', confirm: '' });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Settings</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Manage security, notifications, and preferences.</p>
      </div>

      <Tabs defaultValue="security" className="space-y-4">
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="security" className="rounded-lg gap-2 data-[state=active]:bg-background"><Lock className="h-4 w-4" /> Security</TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg gap-2 data-[state=active]:bg-background"><Bell className="h-4 w-4" /> Notifications</TabsTrigger>
          <TabsTrigger value="access" className="rounded-lg gap-2 data-[state=active]:bg-background"><Shield className="h-4 w-4" /> Access</TabsTrigger>
        </TabsList>

        <TabsContent value="security" className="space-y-4">
          <div className="card-modern p-5 space-y-4">
            <h3 className="font-semibold text-foreground">Change Password</h3>
            <div className="space-y-3 max-w-md">
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Password</label>
                <div className="relative">
                  <Input type={showOld ? 'text' : 'password'} value={passwords.old} onChange={e => setPasswords({ ...passwords, old: e.target.value })} className="h-11 rounded-xl pr-10" placeholder="Enter current password" />
                  <button onClick={() => setShowOld(!showOld)} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
                    {showOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">New Password</label>
                <div className="relative">
                  <Input type={showNew ? 'text' : 'password'} value={passwords.new} onChange={e => setPasswords({ ...passwords, new: e.target.value })} className="h-11 rounded-xl pr-10" placeholder="Enter new password" />
                  <button onClick={() => setShowNew(!showNew)} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm New Password</label>
                <Input type="password" value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} className="h-11 rounded-xl" placeholder="Confirm new password" />
              </div>
              <Button onClick={handleChangePassword} className="rounded-xl gradient-primary text-primary-foreground">Update Password</Button>
            </div>
          </div>

          <div className="card-modern p-5">
            <h3 className="font-semibold text-foreground mb-3">Transaction PIN</h3>
            <p className="text-sm text-muted-foreground mb-4">Manage your admin transaction PIN for approvals.</p>
            <div className="flex gap-3">
              <Link to="/admin/forgot-pin">
                <Button variant="outline" className="rounded-xl">Reset PIN</Button>
              </Link>
            </div>
          </div>

          <div className="card-modern p-5">
            <h3 className="font-semibold text-foreground mb-3">Two-Factor Authentication</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to your admin account.</p>
                <p className="text-xs text-success font-medium mt-1">● Enabled</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <div className="card-modern p-5 space-y-4">
            <h3 className="font-semibold text-foreground">Notification Preferences</h3>
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                  <p className="text-xs text-muted-foreground">Receive notifications for {key.replace(/([A-Z])/g, ' $1').toLowerCase()}</p>
                </div>
                <Switch checked={value} onCheckedChange={v => setNotifications({ ...notifications, [key]: v })} />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <div className="card-modern p-5">
            <h3 className="font-semibold text-foreground mb-3">Active Sessions</h3>
            {[
              { device: 'Chrome on Windows', location: 'Mumbai, India', time: 'Active now', current: true },
              { device: 'Safari on iPhone', location: 'Delhi, India', time: '2 hours ago', current: false },
            ].map((session, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{session.device}</p>
                  <p className="text-xs text-muted-foreground">{session.location} · {session.time}</p>
                </div>
                {session.current ? (
                  <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-lg">Current</span>
                ) : (
                  <Button variant="ghost" size="sm" className="text-destructive text-xs">Revoke</Button>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettingsPage;
