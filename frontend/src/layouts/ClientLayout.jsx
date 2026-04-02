import { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Wallet,
  Landmark,
  HeadphonesIcon,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  KeyRound,
  Globe,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationPanel from "@/components/shared/NotificationPanel";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { api } from "@/services/api";

const sidebarItems = [
  {
    label: "Reports",
    icon: FileText,
    children: [
      { label: "Payin Reports", path: "/client/reports/payin" },
      { label: "Payout Reports", path: "/client/reports/payout" },
    ],
  },
  {
    label: "Wallet",
    icon: Wallet,
    children: [
      { label: "Payin Wallet", path: "/client/wallet/payin" },
      { label: "Payout Wallet", path: "/client/wallet/payout" },
    ],
  },
  {
    label: "Fund",
    icon: Landmark,
    children: [
      { label: "Fund Request", path: "/client/fund/request" },
      { label: "Fund Report", path: "/client/fund/report" },
    ],
  },
  { label: "Support", icon: HeadphonesIcon, path: "/client/support" },
];

const ClientLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState(["Reports"]);
  const [profile, setProfile] = useState(null);
  const desktopNavRef = useRef(null);
  const mobileNavRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    api.getClientProfile().then(setProfile);
  }, []);

  const activeGroups = useMemo(
    () =>
      sidebarItems
        .filter((item) => item.children?.some((child) => location.pathname.startsWith(child.path)))
        .map((item) => item.label),
    [location.pathname]
  );

  useEffect(() => {
    if (!activeGroups.length) return;
    setExpanded((prev) => Array.from(new Set([...prev, ...activeGroups])));
  }, [activeGroups]);

  useEffect(() => {
    const savedPosition = Number(sessionStorage.getItem("client-sidebar-scroll") || 0);
    const restoreScroll = () => {
      if (desktopNavRef.current) desktopNavRef.current.scrollTop = savedPosition;
      if (mobileNavRef.current) mobileNavRef.current.scrollTop = savedPosition;
    };
    restoreScroll();
    window.requestAnimationFrame(restoreScroll);
  }, [location.pathname, sidebarOpen, mobileOpen]);

  const handleSidebarScroll = (event) => {
    sessionStorage.setItem("client-sidebar-scroll", String(event.currentTarget.scrollTop));
  };

  const toggleExpand = (label) => {
    setExpanded((prev) =>
      prev.includes(label)
        ? prev.filter((l) => l !== label)
        : [...prev, label]
    );
  };

  const isActive = (path) => location.pathname === path;

  const renderSidebarContent = (navRef) => (
    <div className="flex flex-col h-full">
      <div className="border-b border-border/50 p-6">
        <Link to="/client" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl gradient-primary">
            <span className="text-base font-bold text-primary-foreground">
              F
            </span>
          </div>
          {sidebarOpen && (
            <span className="text-[1.15rem] font-semibold tracking-tight text-foreground">
              FrapPay
            </span>
          )}
        </Link>
      </div>

      <nav ref={navRef} onScroll={handleSidebarScroll} className="flex-1 space-y-1.5 overflow-y-auto p-4">
        <Link
          to="/client"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-2xl text-[15px] font-medium transition-all",
            isActive("/client")
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <LayoutDashboard className="h-4 w-4 shrink-0" />
          {sidebarOpen && "Dashboard"}
        </Link>

        {sidebarItems.map((item) => (
          <div key={item.label}>
            {item.children ? (
              <>
                <button
                  onClick={() => toggleExpand(item.label)}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-[15px] font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
                >
                  <item.icon className="h-4 w-4 shrink-0" />

                  {sidebarOpen && (
                    <>
                      <span className="flex-1 text-left">
                        {item.label}
                      </span>

                      {expanded.includes(item.label) ? (
                        <ChevronDown className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5" />
                      )}
                    </>
                  )}
                </button>

                {sidebarOpen && expanded.includes(item.label) && (
                  <div className="ml-7 space-y-0.5 mt-0.5">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={cn(
                          "block rounded-xl px-3.5 py-2.5 text-[14px] transition-all",
                          isActive(child.path)
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-[15px] font-medium transition-all",
                  isActive(item.path)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {sidebarOpen && item.label}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside
        className={cn(
          "hidden lg:flex shrink-0 flex-col border-r border-border/50 bg-card transition-all duration-300",
          sidebarOpen ? "w-60" : "w-16"
        )}
      >
        {renderSidebarContent(desktopNavRef)}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-60 bg-card border-r border-border/50 shadow-lg">
            {renderSidebarContent(mobileNavRef)}
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="z-10 flex h-[4.5rem] shrink-0 items-center justify-between border-b border-border/50 bg-card/80 px-5 backdrop-blur-md lg:px-7">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>

            <div className="hidden sm:flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-2xl bg-success/10 px-4 py-2 text-[13px] font-semibold text-success">
                <Wallet className="h-3.5 w-3.5" />
                <span>Payin: ₹24,50,000</span>
              </div>

              <div className="flex items-center gap-2 rounded-2xl bg-primary/10 px-4 py-2 text-[13px] font-semibold text-primary">
                <Wallet className="h-3.5 w-3.5" />
                <span>Payout: ₹18,20,000</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <NotificationPanel />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium">
                    Rahul S.
                  </span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => navigate("/client/profile")}
                >
                  <User className="h-4 w-4 mr-2" /> Profile
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => navigate("/client/settings")}
                >
                  <Settings className="h-4 w-4 mr-2" /> Settings
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => navigate("/client/forgot-pin")}
                >
                  <KeyRound className="h-4 w-4 mr-2" /> Forgot PIN
                </DropdownMenuItem>

                {profile?.fallbackUrls?.payin && (
                  <DropdownMenuItem onClick={() => window.open(profile.fallbackUrls.payin, "_blank", "noopener,noreferrer")}>
                    <Globe className="h-4 w-4 mr-2" /> Callback Payin
                  </DropdownMenuItem>
                )}

                {profile?.fallbackUrls?.payout && (
                  <DropdownMenuItem onClick={() => window.open(profile.fallbackUrls.payout, "_blank", "noopener,noreferrer")}>
                    <ExternalLink className="h-4 w-4 mr-2" /> Callback Payout
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => navigate("/client/login")}
                  className="text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 lg:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;
