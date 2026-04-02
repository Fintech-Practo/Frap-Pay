import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Layouts
import ClientLayout from "@/layouts/ClientLayout";
import AdminLayout from "@/layouts/AdminLayout";

// Auth
import LoginPage from "@/pages/auth/LoginPage";

// Client Pages
import ClientDashboard from "@/pages/client/ClientDashboard";
import ReportsPage from "@/pages/client/ReportsPage";
import WalletPage from "@/pages/client/WalletPage";
import FundPage from "@/pages/client/FundPage";
import SupportPage from "@/pages/client/SupportPage";
import ProfilePage from "@/pages/client/ProfilePage";
import SettingsPage from "@/pages/client/SettingsPage";
import ForgotPinPage from "@/pages/client/ForgotPinPage";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import MembersPage from "@/pages/admin/MembersPage";
import MemberDetailPage from "@/pages/admin/MemberDetailPage";
import CommissionPage from "@/pages/admin/CommissionPage";
import FundApprovalPage from "@/pages/admin/FundApprovalPage";
import APISwitchingPage from "@/pages/admin/APISwitchingPage";
import AdminWalletPage from "@/pages/admin/AdminWalletPage";
import ActivityLogPage from "@/pages/admin/ActivityLogPage";
import BankManagementPage from "@/pages/admin/BankManagementPage";
import ServicesPage from "@/pages/admin/ServicesPage";
import AdminForgotPinPage from "@/pages/admin/ForgotPinPage";
import AdminProfilePage from "@/pages/admin/AdminProfilePage";
import AdminSettingsPage from "@/pages/admin/AdminSettingsPage";
import LedgerReportPage from "@/pages/admin/LedgerReportPage";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing redirect */}
          <Route path="/" element={<Navigate to="/client" replace />} />

          {/* Auth */}
          <Route path="/client/login" element={<LoginPage type="client" />} />
          <Route path="/admin/login" element={<LoginPage type="admin" />} />

          {/* Client Dashboard */}
          <Route path="/client" element={<ClientLayout />}>
            <Route index element={<ClientDashboard />} />
            <Route path="reports/payin" element={<ReportsPage type="payin" />} />
            <Route path="reports/payout" element={<ReportsPage type="payout" />} />
            <Route path="wallet/payin" element={<WalletPage type="payin" />} />
            <Route path="wallet/payout" element={<WalletPage type="payout" />} />
            <Route path="fund/request" element={<FundPage variant="request" />} />
            <Route path="fund/report" element={<FundPage variant="report" />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="forgot-pin" element={<ForgotPinPage />} />
          </Route>

          {/* Admin Dashboard */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="reports/payin" element={<ReportsPage type="payin" />} />
            <Route path="reports/payout" element={<ReportsPage type="payout" />} />
            <Route path="reports/upi" element={<ReportsPage type="payin" />} />
            <Route path="ledger/payin" element={<LedgerReportPage type="payin" />} />
            <Route path="ledger/payout" element={<LedgerReportPage type="payout" />} />
            <Route path="members" element={<MembersPage />} />
            <Route path="members/add" element={<MembersPage />} />
            <Route path="members/:memberId" element={<MemberDetailPage />} />
            <Route path="commission/schemes" element={<CommissionPage />} />
            <Route path="commission/slabs" element={<CommissionPage />} />
            <Route path="wallet" element={<AdminWalletPage />} />
            <Route path="wallet/approval" element={<FundApprovalPage />} />
            <Route path="api-switching" element={<APISwitchingPage />} />
            <Route path="activity" element={<ActivityLogPage />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="bank" element={<BankManagementPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="forgot-pin" element={<AdminForgotPinPage />} />
            <Route path="profile" element={<AdminProfilePage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
