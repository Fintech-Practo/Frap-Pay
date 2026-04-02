import { useState, useEffect } from "react";
import { api } from "@/services/api";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import StatusBadge from "@/components/shared/StatusBadge";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const WalletPage = ({ type }) => {
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [w, t] = await Promise.all([
        api.getWallets(),
        api.getTransactions(type),
      ]);

      setWallets(
        w.filter((_, i) =>
          type === "payin" ? i % 2 === 0 : i % 2 === 1
        )
      );

      setTransactions(t.slice(0, 6));
      setLoading(false);
    };

    load();
  }, [type]);

  const formatAmount = (n) => {
    if (n >= 100000)
      return `₹${(n / 100000).toFixed(2)} L`;
    return `₹${n.toLocaleString()}`;
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground capitalize">
          {type} Wallet
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Manage your {type} wallet balances.
        </p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {loading ? (
          <SkeletonLoader variant="stat" count={2} />
        ) : (
          wallets.map((w, i) => (
            <div
              key={i}
              className="stat-card opacity-0 animate-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-xl gradient-subtle">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>

                <div
                  className={`flex items-center gap-1 text-xs font-medium ${
                    w.change >= 0
                      ? "text-success"
                      : "text-destructive"
                  }`}
                >
                  {w.change >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {w.change >= 0 ? "+" : ""}
                  {w.change}%
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-1">
                {w.type}
              </p>

              <p className="text-3xl font-bold text-foreground tracking-tight">
                {formatAmount(w.balance)}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Transaction Timeline */}
      <div className="card-modern p-0">
        <div className="p-5 border-b border-border/50">
          <h3 className="font-semibold text-foreground">
            Recent Transactions
          </h3>
        </div>

        <div className="p-5 space-y-4">
          {loading ? (
            <SkeletonLoader variant="table-row" count={4} />
          ) : (
            transactions.map((txn, i) => (
              <div
                key={txn.id}
                className="flex items-center gap-4 opacity-0 animate-in-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
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

                  {i < transactions.length - 1 && (
                    <div className="w-px h-8 bg-border/50 mt-1" />
                  )}
                </div>

                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {txn.customer}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {txn.date} · {txn.method}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={txn.status} />
                    <span className="text-sm font-semibold tabular-nums">
                      ₹{txn.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletPage;