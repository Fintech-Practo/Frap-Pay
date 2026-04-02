import { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Users,
  Percent,
  Wallet,
  ToggleLeft,
  Building2,
  HeadphonesIcon,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  User,
  LogOut,
  Activity,
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

const sidebarItems = [
  {
    label: "Reports",
    icon: FileText,
    children: [
      { label: "Payin Reports", path: "/admin/reports/payin" },
      { label: "Payout Reports", path: "/admin/reports/payout" },
      { label: "UPI Reports", path: "/admin/reports/upi" },
    ],
  },
  {
    label: "Members",
    icon: Users,
    children: [
      { label: "View Members", path: "/admin/members" },
      { label: "Add Member", path: "/admin/members/add" },
    ],
  },
  {
    label: "Commission",
    icon: Percent,
    children: [
      { label: "Schemes", path: "/admin/commission/schemes" },
      { label: "Slabs", path: "/admin/commission/slabs" },
    ],
  },
  {
    label: "Wallet",
    icon: Wallet,
    children: [
      { label: "All Wallets", path: "/admin/wallet" },
      { label: "Fund Approval", path: "/admin/wallet/approval" },
    ],
  },
  {
    label: "Ledger",
    icon: FileText,
    children: [
      { label: "Payin Ledger", path: "/admin/ledger/payin" },
      { label: "Payout Ledger", path: "/admin/ledger/payout" },
    ],
  },
  { label: "API Switching", icon: ToggleLeft, path: "/admin/api-switching" },
  {
    label: "More",
    icon: Building2,
    children: [
      { label: "Bank Management", path: "/admin/bank" },
      { label: "Services", path: "/admin/services" },
    ],
  },
  { label: "Activity Log", icon: Activity, path: "/admin/activity" },
  { label: "Support", icon: HeadphonesIcon, path: "/admin/support" },
];

const AdminLayout = () => {
  const brandName = "Frap Pay";
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState(["Reports"]);
  const desktopNavRef = useRef(null);
  const mobileNavRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

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
    const savedPosition = Number(sessionStorage.getItem("admin-sidebar-scroll") || 0);
    const restoreScroll = () => {
      if (desktopNavRef.current) desktopNavRef.current.scrollTop = savedPosition;
      if (mobileNavRef.current) mobileNavRef.current.scrollTop = savedPosition;
    };
    restoreScroll();
    window.requestAnimationFrame(restoreScroll);
  }, [location.pathname, sidebarOpen, mobileOpen]);

  const handleSidebarScroll = (event) => {
    sessionStorage.setItem("admin-sidebar-scroll", String(event.currentTarget.scrollTop));
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
    <div className="flex h-full flex-col">
      <div className="border-b border-border/50 px-5 py-4">
        <Link to="/admin" className="flex items-center gap-3">
          <img src="/Logo.png" alt={`${brandName} logo`} className="h-12 w-12 shrink-0 object-contain" />
          {sidebarOpen && (
            <span className="text-[1.15rem] font-semibold tracking-tight text-foreground">
              {brandName} Admin
            </span>
          )}
        </Link>
      </div>

      <nav ref={navRef} onScroll={handleSidebarScroll} className="hide-scrollbar flex-1 space-y-1.5 overflow-y-auto p-4">
        <Link
          to="/admin"
          className={cn(
            "flex items-center gap-3 rounded-2xl px-4 py-3 text-[15px] font-medium transition-all",
            isActive("/admin")
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
                      <span className="flex-1 text-left">{item.label}</span>
                      {expanded.includes(item.label) ? (
                        <ChevronDown className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5" />
                      )}
                    </>
                  )}
                </button>

                {sidebarOpen && expanded.includes(item.label) && (
                  <div className="ml-7 mt-0.5 space-y-0.5">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={cn(
                          "block rounded-xl px-3.5 py-2.5 text-[14px] transition-all",
                          isActive(child.path)
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
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
    <div className="flex h-screen overflow-hidden bg-background">
      <aside
        className={cn(
          "hidden shrink-0 flex-col border-r border-border/50 bg-card transition-all duration-300 lg:flex",
          sidebarOpen ? "w-64" : "w-16"
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
          <aside className="absolute left-0 top-0 h-full w-64 border-r border-border/50 bg-card shadow-lg">
            {renderSidebarContent(mobileNavRef)}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
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
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>

            <div className="hidden items-center gap-4 md:flex">
              <div className="rounded-2xl bg-success/10 px-4 py-2 text-[13px] font-semibold text-success">
                Virtual: Rs 85,00,000
              </div>
              <div className="rounded-2xl bg-primary/10 px-4 py-2 text-[13px] font-semibold text-primary">
                Collection: Rs 42,50,000
              </div>
              <div className="rounded-2xl bg-warning/10 px-4 py-2 text-[13px] font-semibold text-warning">
                API: Rs 12,30,000
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <NotificationPanel />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="gap-2 rounded-full border border-border/70 bg-muted/60 px-2.5 hover:bg-muted"
                >
                  <img src="/Logo.png" alt={`${brandName} logo`} className="h-9 w-9 object-contain" />
                  <span className="hidden text-sm font-medium sm:block">Admin</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate("/admin/profile")}>
                  <User className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => navigate("/admin/settings")}>
                  <Activity className="mr-2 h-4 w-4" /> Settings
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => navigate("/admin/forgot-pin")}>
                  <Activity className="mr-2 h-4 w-4" /> Forgot PIN
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => navigate("/admin/login")}
                  className="text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Logout
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

export default AdminLayout;




