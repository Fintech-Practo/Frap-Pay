import { useState, useEffect } from "react";
import { api } from "@/services/api";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowUpRight, ArrowDownLeft, TrendingUp, TrendingDown } from "lucide-react";

const WalletPage = ({ type }) => {
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [walletData, transactionData, walletAnalytics] = await Promise.all([api.getWallets(), api.getTransactions(type), api.getWalletAnalytics(type)]);

      setWallets(walletData.filter((_, index) => (type === "payin" ? index % 2 === 0 : index % 2 === 1)));
      setTransactions(transactionData.slice(0, 6));
      setAnalytics(walletAnalytics);
      setLoading(false);
    };

    load();
  }, [type]);

  const formatAmount = (amount) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground capitalize">{type} Wallet</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Manage your {type} wallet balances.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {loading ? (
          <SkeletonLoader variant="stat" count={2} />
        ) : (
          wallets.map((wallet, index) => (
            <div key={wallet.type} className="stat-card opacity-0 animate-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-xl gradient-subtle">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>

                <div className={`flex items-center gap-1 text-xs font-medium ${wallet.change >= 0 ? "text-success" : "text-destructive"}`}>
                  {wallet.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {wallet.change >= 0 ? "+" : ""}
                  {wallet.change}%
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-1">{wallet.type}</p>
              <p className="text-3xl font-bold text-foreground tracking-tight">{formatAmount(wallet.balance)}</p>
            </div>
          ))
        )}
      </div>

      {!loading && analytics && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.35fr_1fr]">
          <div className="card-modern overflow-hidden">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{type} Performance Snapshot</div>
                <h2 className="mt-2 text-2xl font-bold text-foreground">Stronger wallet analytics for daily decision making</h2>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  Get a quick top-level view of processed value, pending volume, average ticket size, and operational exceptions before reviewing detailed transactions.
                </p>
              </div>
              <Button variant="outline" className="rounded-xl text-sm font-semibold">
                Updated {analytics.lastUpdated}
              </Button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Successful Volume</div>
                <div className="mt-2 text-2xl font-bold text-foreground">{formatAmount(analytics.successfulAmount)}</div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Average Ticket</div>
                <div className="mt-2 text-2xl font-bold text-foreground">{formatAmount(analytics.averageTicket)}</div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Pending Volume</div>
                <div className="mt-2 text-2xl font-bold text-foreground">{formatAmount(analytics.pendingAmount)}</div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Failed Transactions</div>
                <div className="mt-2 text-2xl font-bold text-foreground">{analytics.failedCount}</div>
              </div>
            </div>
          </div>

          <div className="card-modern">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Quick Highlights</div>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                <div className="text-sm font-semibold text-foreground">Transactions Processed</div>
                <div className="mt-2 text-3xl font-bold text-foreground">{analytics.transactionCount}</div>
                <div className="mt-1 text-sm text-muted-foreground">In the current {type} wallet dataset</div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                <div className="text-sm font-semibold text-foreground">Operational Health</div>
                <div className="mt-2 text-base font-semibold text-foreground">{analytics.failedCount === 0 ? "Stable" : "Needs review"}</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {analytics.failedCount === 0 ? "No failed transactions in the current sample." : `${analytics.failedCount} failed transactions require attention.`}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card-modern p-0">
        <div className="p-5 border-b border-border/50">
          <h3 className="font-semibold text-foreground">Recent Transactions</h3>
        </div>

        <div className="p-5 space-y-4">
          {loading ? (
            <SkeletonLoader variant="table-row" count={4} />
          ) : (
            transactions.map((txn, index) => (
              <div key={txn.id} className="flex items-center gap-4 opacity-0 animate-in-up" style={{ animationDelay: `${index * 60}ms` }}>
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${txn.type === "payin" ? "bg-success/10" : "bg-primary/10"}`}>
                    {txn.type === "payin" ? <ArrowDownLeft className="h-4 w-4 text-success" /> : <ArrowUpRight className="h-4 w-4 text-primary" />}
                  </div>

                  {index < transactions.length - 1 && <div className="w-px h-8 bg-border/50 mt-1" />}
                </div>

                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{txn.customer}</p>
                    <p className="text-xs text-muted-foreground">
                      {txn.date} · {txn.method}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={txn.status} />
                    <span className="text-sm font-semibold tabular-nums">₹{txn.amount.toLocaleString("en-IN")}</span>
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
