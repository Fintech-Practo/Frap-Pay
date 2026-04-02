import { useState, useEffect } from "react";
import SkeletonLoader from "@/components/shared/SkeletonLoader";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Banknote,
  Landmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const walletTypes = [
  {
    type: "Collection Credit Wallet",
    balance: 4250000,
    currency: "₹",
    change: 8.3,
    icon: CreditCard,
  },
  {
    type: "AEPS Debit Wallet",
    balance: 1820000,
    currency: "₹",
    change: -2.5,
    icon: Banknote,
  },
  {
    type: "Payin Wallet",
    balance: 2450000,
    currency: "₹",
    change: 12.5,
    icon: Wallet,
  },
  {
    type: "Payout Wallet",
    balance: 1650000,
    currency: "₹",
    change: -3.2,
    icon: Wallet,
  },
  {
    type: "Commission Wallet",
    balance: 156000,
    currency: "₹",
    change: 8.7,
    icon: Landmark,
  },
  {
    type: "Settlement Wallet",
    balance: 890000,
    currency: "₹",
    change: 5.1,
    icon: Landmark,
  },
];

const AdminWalletPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const formatAmount = (n) =>
    n >= 100000
      ? `₹${(n / 100000).toFixed(2)} L`
      : `₹${n.toLocaleString()}`;

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Wallets Overview
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Monitor all wallet balances across the system.
          </p>
        </div>

        <Link to="/admin/wallet/approval">
          <Button className="gradient-primary text-primary-foreground rounded-xl gap-2">
            <Landmark className="h-4 w-4" /> Fund Requests
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <SkeletonLoader variant="stat" count={6} />
        ) : (
          walletTypes.map((w, i) => {
            const Icon = w.icon;

            return (
              <div
                key={i}
                className="stat-card opacity-0 animate-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 rounded-xl gradient-subtle">
                    <Icon className="h-5 w-5 text-primary" />
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
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminWalletPage;