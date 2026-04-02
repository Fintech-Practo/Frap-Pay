import { useState, useEffect } from "react";
import { api } from "@/services/api";
import StatsCard from "@/components/shared/StatsCard";
import StatusBadge from "@/components/shared/StatusBadge";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import {
  Wallet,
  Users,
  Clock,
  ShieldCheck,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [fundRequests, setFundRequests] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [s, c, f, a] = await Promise.all([
        api.getAdminStats(),
        api.getChartData(),
        api.getFundRequests(),
        api.getActivityLogs(),
      ]);

      setStats(s);
      setChartData(c);
      setFundRequests(f);
      setActivityLogs(a);
      setLoading(false);
    };

    load();
  }, []);

  const icons = [Wallet, Wallet, Users, Clock];

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          System overview and controls.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <SkeletonLoader variant="stat" count={4} />
        ) : (
          stats.map((s, i) => (
            <StatsCard
              key={s.label}
              label={s.label}
              value={s.value}
              change={s.change}
              prefix={s.prefix}
              icon={icons[i]}
              delay={i}
            />
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart */}
        <div className="card-modern">
          <h3 className="font-semibold text-foreground mb-4">
            Weekly Volume
          </h3>

          {loading ? (
            <div className="h-64 animate-pulse bg-muted rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(220, 13%, 91%)"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: "hsl(220, 10%, 46%)",
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: "hsl(220, 10%, 46%)",
                  }}
                  tickFormatter={(v) =>
                    `₹${(v / 1000).toFixed(0)}K`
                  }
                />

                <Tooltip
                  contentStyle={{
                    background: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(220, 13%, 91%)",
                    borderRadius: "12px",
                  }}
                  formatter={(value) => [
                    `₹${value.toLocaleString()}`,
                    "",
                  ]}
                />

                <Bar
                  dataKey="payin"
                  fill="hsl(0, 85%, 55%)"
                  radius={[6, 6, 0, 0]}
                />

                <Bar
                  dataKey="payout"
                  fill="hsl(142, 71%, 45%)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pending Fund Requests */}
        <div className="card-modern p-0">
          <div className="p-5 border-b border-border/50 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">
              Pending Approvals
            </h3>

            <span className="badge-warning">
              {
                fundRequests.filter(
                  (f) => f.status === "pending"
                ).length
              }{" "}
              pending
            </span>
          </div>

          <div className="divide-y divide-border/30">
            {loading ? (
              <SkeletonLoader
                variant="table-row"
                count={3}
              />
            ) : (
              fundRequests
                .filter((f) => f.status === "pending")
                .map((req) => (
                  <div
                    key={req.id}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl bg-warning/10 flex items-center justify-center shrink-0">
                      <Clock className="h-4 w-4 text-warning" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {req.requestedBy}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {req.method} · {req.reference}
                      </p>
                    </div>

                    <span className="text-sm font-semibold">
                      ₹{req.amount.toLocaleString()}
                    </span>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="card-modern p-0">
        <div className="p-5 border-b border-border/50">
          <h3 className="font-semibold text-foreground">
            Audit Trail
          </h3>
        </div>

        <div className="divide-y divide-border/30">
          {loading ? (
            <SkeletonLoader
              variant="table-row"
              count={4}
            />
          ) : (
            activityLogs.map((log, i) => (
              <div
                key={log.id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors opacity-0 animate-in-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    log.type === "auth"
                      ? "bg-primary/10"
                      : log.type === "transaction"
                      ? "bg-success/10"
                      : log.type === "api"
                      ? "bg-warning/10"
                      : "bg-muted"
                  }`}
                >
                  <ShieldCheck
                    className={`h-4 w-4 ${
                      log.type === "auth"
                        ? "text-primary"
                        : log.type === "transaction"
                        ? "text-success"
                        : log.type === "api"
                        ? "text-warning"
                        : "text-muted-foreground"
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {log.action}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {log.details}
                  </p>
                </div>

                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {log.timestamp}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;