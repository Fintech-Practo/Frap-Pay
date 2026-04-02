import { useState, useEffect } from "react";
import { api } from "@/services/api";
import StatsCard from "@/components/shared/StatsCard";
import StatusBadge from "@/components/shared/StatusBadge";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import {
  IndianRupee,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ClientDashboard = () => {
  const [stats, setStats] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [s, c, t] = await Promise.all([
        api.getStats(),
        api.getChartData(),
        api.getTransactions(),
      ]);

      setStats(s);
      setChartData(c);
      setTransactions(t.slice(0, 5));
      setLoading(false);
    };

    load();
  }, []);

  const icons = [
    IndianRupee,
    ArrowUpRight,
    TrendingUp,
    BarChart3,
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Welcome back, Rahul. Here's your overview.
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

      {/* Chart */}
      <div className="card-modern">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-foreground">
              Transaction Volume
            </h3>
            <p className="text-sm text-muted-foreground">
              Last 7 days
            </p>
          </div>

          <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" /> Payin
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success" /> Payout
            </span>
          </div>
        </div>

        {loading ? (
          <div className="h-64 animate-pulse bg-muted rounded-xl" />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="payinGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(0, 85%, 55%)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(0, 85%, 55%)" stopOpacity={0} />
                </linearGradient>

                <linearGradient id="payoutGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>

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
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                }}
                formatter={(value) => [
                  `₹${value.toLocaleString()}`,
                  "",
                ]}
              />

              <Area
                type="monotone"
                dataKey="payin"
                stroke="hsl(0, 85%, 55%)"
                fill="url(#payinGrad)"
                strokeWidth={2}
              />

              <Area
                type="monotone"
                dataKey="payout"
                stroke="hsl(142, 71%, 45%)"
                fill="url(#payoutGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Transactions */}
      <div className="card-modern p-0">
        <div className="p-5 border-b border-border/50">
          <h3 className="font-semibold text-foreground">
            Recent Activity
          </h3>
        </div>

        <div className="divide-y divide-border/30">
          {loading ? (
            <SkeletonLoader variant="table-row" count={5} />
          ) : (
            transactions.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors"
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    txn.type === "payin"
                      ? "bg-success/10"
                      : "bg-primary/10"
                  }`}
                >
                  {txn.type === "payin" ? (
                    <ArrowDownLeft className="h-4 w-4 text-success" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-primary" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {txn.customer}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {txn.method} · {txn.txnId}
                  </p>
                </div>

                <StatusBadge status={txn.status} />

                <span
                  className={`text-sm font-semibold tabular-nums ${
                    txn.type === "payin"
                      ? "text-success"
                      : "text-foreground"
                  }`}
                >
                  {txn.type === "payin" ? "+" : "-"}₹
                  {txn.amount.toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;