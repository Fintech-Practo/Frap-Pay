import { useState, useEffect } from "react";
import { api } from "@/services/api";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import {
  Shield,
  ArrowRightLeft,
  Settings,
  Zap,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const typeConfig = {
  auth: { icon: Shield, color: "primary", label: "Authentication" },
  transaction: {
    icon: ArrowRightLeft,
    color: "success",
    label: "Transaction",
  },
  setting: { icon: Settings, color: "warning", label: "Setting" },
  api: { icon: Zap, color: "destructive", label: "API" },
};

const ActivityLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api.getActivityLogs().then((l) => {
      setLogs(l);
      setLoading(false);
    });
  }, []);

  const filtered =
    filter === "all"
      ? logs
      : logs.filter((l) => l.type === filter);

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Activity Log
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Complete audit trail of all system activities.
          </p>
        </div>

        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40 h-9 rounded-lg bg-muted/50 border-0">
            <Filter className="h-3.5 w-3.5 mr-2" />
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="auth">Authentication</SelectItem>
            <SelectItem value="transaction">Transaction</SelectItem>
            <SelectItem value="setting">Setting</SelectItem>
            <SelectItem value="api">API</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="card-modern p-0">
        <div className="divide-y divide-border/30">
          {loading ? (
            <SkeletonLoader variant="table-row" count={5} />
          ) : (
            filtered.map((log, i) => {
              const config = typeConfig[log.type];
              const Icon = config.icon;

              return (
                <div
                  key={log.id}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors opacity-0 animate-in-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-${config.color}/10 flex items-center justify-center shrink-0`}
                  >
                    <Icon
                      className={`h-4 w-4 text-${config.color}`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-foreground">
                        {log.action}
                      </p>
                      <span className="badge-neutral text-[10px]">
                        {config.label}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {log.details}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">
                      {log.timestamp}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60">
                      {log.user}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLogPage;