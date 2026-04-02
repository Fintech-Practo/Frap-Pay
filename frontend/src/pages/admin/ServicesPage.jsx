import { useState } from "react";
import {
  Zap,
  IndianRupee,
  CreditCard,
  Smartphone,
  Wifi,
  Shield,
  ToggleLeft,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

const mockServices = [
  {
    id: "S1",
    name: "UPI Payments",
    description: "Accept payments via UPI",
    icon: Smartphone,
    active: true,
    category: "Payments",
  },
  {
    id: "S2",
    name: "IMPS Transfer",
    description: "Instant fund transfers via IMPS",
    icon: Zap,
    active: true,
    category: "Payments",
  },
  {
    id: "S3",
    name: "NEFT Transfer",
    description: "NEFT based fund transfers",
    icon: IndianRupee,
    active: true,
    category: "Payments",
  },
  {
    id: "S4",
    name: "RTGS Transfer",
    description: "High-value RTGS transfers",
    icon: CreditCard,
    active: false,
    category: "Payments",
  },
  {
    id: "S5",
    name: "Auto Settlement",
    description: "Automatic daily settlement",
    icon: Wifi,
    active: true,
    category: "Operations",
  },
  {
    id: "S6",
    name: "Fraud Detection",
    description: "AI-powered fraud screening",
    icon: Shield,
    active: true,
    category: "Security",
  },
  {
    id: "S7",
    name: "Webhook Alerts",
    description: "Real-time event notifications",
    icon: ToggleLeft,
    active: false,
    category: "Operations",
  },
];

const ServicesPage = () => {
  const [services, setServices] = useState(mockServices);

  const toggleService = (id) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, active: !s.active } : s
      )
    );
  };

  const categories = [...new Set(services.map((s) => s.category))];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Services
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Enable or disable platform services
        </p>
      </div>

      {categories.map((cat) => (
        <div key={cat} className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {cat}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services
              .filter((s) => s.category === cat)
              .map((service) => (
                <div
                  key={service.id}
                  className="card-modern flex items-center gap-4"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      service.active
                        ? "bg-success/10"
                        : "bg-muted"
                    }`}
                  >
                    <service.icon
                      className={`h-5 w-5 ${
                        service.active
                          ? "text-success"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {service.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {service.description}
                    </p>
                  </div>

                  <Switch
                    checked={service.active}
                    onCheckedChange={() =>
                      toggleService(service.id)
                    }
                  />
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServicesPage;