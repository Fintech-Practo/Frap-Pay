import { useState } from "react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Globe,
  CreditCard,
  Smartphone,
} from "lucide-react";

const providers = [
  {
    id: "1",
    name: "RazorPay Gateway",
    type: "Payment Gateway",
    icon: CreditCard,
    active: true,
    latency: "120ms",
    uptime: "99.9%",
  },
  {
    id: "2",
    name: "PhonePe UPI",
    type: "UPI Provider",
    icon: Smartphone,
    active: true,
    latency: "80ms",
    uptime: "99.7%",
  },
  {
    id: "3",
    name: "ICICI IMPS",
    type: "Bank Transfer",
    icon: Globe,
    active: false,
    latency: "200ms",
    uptime: "98.5%",
  },
  {
    id: "4",
    name: "PayU Money",
    type: "Payment Gateway",
    icon: Zap,
    active: true,
    latency: "150ms",
    uptime: "99.5%",
  },
  {
    id: "5",
    name: "Google Pay",
    type: "UPI Provider",
    icon: Smartphone,
    active: false,
    latency: "90ms",
    uptime: "99.8%",
  },
  {
    id: "6",
    name: "Axis Bank NEFT",
    type: "Bank Transfer",
    icon: Globe,
    active: true,
    latency: "250ms",
    uptime: "99.2%",
  },
];

const APISwitchingPage = () => {
  const [apis, setApis] = useState(providers);

  const toggle = (id) => {
    setApis((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, active: !a.active } : a
      )
    );
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          API Switching
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Manage payment provider APIs and routing.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {apis.map((api, i) => (
          <div
            key={api.id}
            className={cn(
              "card-interactive opacity-0 animate-in-up",
              api.active && "ring-1 ring-success/30"
            )}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "p-2.5 rounded-xl",
                    api.active ? "bg-success/10" : "bg-muted"
                  )}
                >
                  <api.icon
                    className={cn(
                      "h-5 w-5",
                      api.active
                        ? "text-success"
                        : "text-muted-foreground"
                    )}
                  />
                </div>

                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {api.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {api.type}
                  </p>
                </div>
              </div>

              <Switch
                checked={api.active}
                onCheckedChange={() => toggle(api.id)}
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 p-2.5 rounded-lg bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground">
                  Latency
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {api.latency}
                </p>
              </div>

              <div className="flex-1 p-2.5 rounded-lg bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground">
                  Uptime
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {api.uptime}
                </p>
              </div>

              <Badge
                variant={api.active ? "default" : "secondary"}
                className={cn(
                  "rounded-full text-xs",
                  api.active
                    ? "bg-success/10 text-success border-0"
                    : ""
                )}
              >
                {api.active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default APISwitchingPage;