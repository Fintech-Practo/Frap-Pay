// // Update this page (the content is just a fallback if you fail to update the page)

// // IMPORTANT: Fully REPLACE this with your own code
// const PlaceholderIndex = () => {
//   // PLACEHOLDER: Replace this entire return statement with the user's app.
//   // The inline background color is intentionally not part of the design system.
//   return (
//     <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: '#fcfbf8' }}>
//       <img data-lovable-blank-page-placeholder="REMOVE_THIS" src="/placeholder.svg" alt="Your app will live here!" />
//     </div>
//   );
// };

// const Index = PlaceholderIndex;

// export default Index;
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

/* ===== Pages ===== */
import LoginPage from "@/pages/auth/LoginPage";
import ClientDashboard from "@/pages/client/Dashboard";
import AdminDashboard from "@/pages/admin/Dashboard";
import WalletPage from "@/pages/client/WalletPage";
import ReportsPage from "@/pages/client/ReportsPage";
import LedgerReportPage from "@/pages/client/LedgerReportPage";
import ProfilePage from "@/pages/client/ProfilePage";
import SettingsPage from "@/pages/client/SettingsPage";
import SupportPage from "@/pages/client/SupportPage";
import FundPage from "@/pages/client/FundPage";

/* ===== Layout (optional if you have one) ===== */
// import AppLayout from "@/layouts/AppLayout";

const Index = () => {
  return (
    <Router>
      <Routes>
        {/* ===== AUTH ===== */}
        <Route path="/" element={<Navigate to="/client/login" />} />
        <Route path="/client/login" element={<LoginPage type="client" />} />
        <Route path="/admin/login" element={<LoginPage type="admin" />} />

        {/* ===== CLIENT ROUTES ===== */}
        <Route path="/client/dashboard" element={<ClientDashboard />} />
        <Route path="/client/wallet/:type" element={<WalletPage type="payin" />} />
        <Route path="/client/reports/:type" element={<ReportsPage type="payin" />} />
        <Route path="/client/ledger/:type" element={<LedgerReportPage type="payin" />} />
        <Route path="/client/profile" element={<ProfilePage />} />
        <Route path="/client/settings" element={<SettingsPage />} />
        <Route path="/client/support" element={<SupportPage />} />
        <Route path="/client/funds" element={<FundPage variant="request" />} />

        {/* ===== ADMIN ROUTES ===== */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* ===== FALLBACK ===== */}
        <Route path="*" element={<Navigate to="/client/login" />} />
      </Routes>
    </Router>
  );
};

export default Index;