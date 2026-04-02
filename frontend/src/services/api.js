const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const INR = "\u20B9";
const clone = (value) => JSON.parse(JSON.stringify(value));
const serviceOrder = ["payout", "fundRequest", "payin", "pan", "aeps"];
const serviceLabels = {
  payout: "Payout Service",
  fundRequest: "Fund Request Service",
  payin: "Payin Service",
  pan: "PAN Service",
  aeps: "AEPS Service",
};

const createDocPreview = (title, accent, tag) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760">
      <rect width="1200" height="760" fill="#f8fafc"/>
      <rect x="44" y="44" width="1112" height="672" rx="32" fill="white" stroke="#e2e8f0" stroke-width="4"/>
      <rect x="72" y="72" width="1056" height="120" rx="24" fill="${accent}"/>
      <text x="112" y="144" font-size="54" font-family="Arial" fill="white" font-weight="700">${title}</text>
      <rect x="88" y="244" width="232" height="276" rx="26" fill="#eef2ff"/>
      <circle cx="204" cy="332" r="74" fill="#cbd5e1"/>
      <rect x="368" y="260" width="696" height="26" rx="13" fill="#cbd5e1"/>
      <rect x="368" y="318" width="560" height="20" rx="10" fill="#e2e8f0"/>
      <rect x="88" y="576" width="976" height="72" rx="24" fill="#f8fafc" stroke="#e2e8f0" stroke-width="3"/>
      <text x="126" y="620" font-size="26" font-family="Arial" fill="#334155">${tag}</text>
    </svg>
  `)}`;

let clientProfile = {
  name: "Rahul Sharma",
  email: "rahul@example.com",
  phone: "+91 98765 43210",
  address: "Mumbai, Maharashtra",
  role: "Merchant",
  joinDate: "June 15, 2024",
  kycStatus: "verified",
  approvalStatus: "approved",
  fallbackUrls: {
    payin: "https://fallback.payin.punjikendra.test/merchant/rahul",
    payout: "https://fallback.payout.punjikendra.test/merchant/rahul",
  },
};

let commissionSchemes = [
  { id: "scheme-upi-standard", name: "UPI Standard", category: "payin", description: "Default merchant collection rates.", appliedMembers: ["M001", "M004"], slabs: [
    { id: "slab-upi-1", min: 0, max: 5000, rate: 0.3, rateType: "percentage" },
    { id: "slab-upi-2", min: 5001, max: 25000, rate: 0.25, rateType: "percentage" },
    { id: "slab-upi-3", min: 25001, max: null, rate: 0.2, rateType: "percentage" },
  ]},
  { id: "scheme-payout-pro", name: "Payout Pro", category: "payout", description: "Enterprise payout bands.", appliedMembers: ["M002", "M005"], slabs: [
    { id: "slab-payout-1", min: 0, max: 10000, rate: 5, rateType: "flat" },
    { id: "slab-payout-2", min: 10001, max: 50000, rate: 8, rateType: "flat" },
    { id: "slab-payout-3", min: 50001, max: null, rate: 12, rateType: "flat" },
  ]},
];

let mockMembers = [
  { id: "M001", name: "Rahul Sharma", email: "rahul@example.com", phone: "+91 98765 21001", role: "merchant", status: "active", kycStatus: "verified", joinDate: "2024-06-15", volume: 5200000, walletBalance: 542000, ipAddress: "49.42.211.8", dob: "1990-08-18", gender: "male", address: "14 Rose Avenue, Andheri East", city: "Mumbai", state: "Maharashtra", pincode: "400069", schemeId: "scheme-upi-standard", avatar: createDocPreview("Rahul Sharma", "#dc2626", "Profile"), services: { payout: true, fundRequest: true, payin: true, pan: false, aeps: false }, bank: { bankName: "State Bank of India", accountNo: "XXXXXX4582", ifsc: "SBIN0001234", accountType: "current", branchName: "Andheri East", beneficiaryName: "Rahul Sharma" }, kyc: { aadhaar: "4582 1134 9876", pan: "RAHUL1234F", gstNo: "27RAHUL1234F1Z5", voterId: "MHX1234567", verificationNote: "All submitted documents matched during manual verification.", documents: [{ key: "aadhaarFront", label: "Aadhaar Front", image: createDocPreview("Aadhaar Front", "#1d4ed8", "Verified") }, { key: "aadhaarBack", label: "Aadhaar Back", image: createDocPreview("Aadhaar Back", "#2563eb", "Verified") }, { key: "panCard", label: "PAN Card", image: createDocPreview("PAN Card", "#059669", "Verified") }] } },
  { id: "M002", name: "Priya Patel", email: "priya@example.com", phone: "+91 98989 30021", role: "agent", status: "active", kycStatus: "verified", joinDate: "2024-08-22", volume: 3100000, walletBalance: 732000, ipAddress: "103.84.120.77", dob: "1992-05-04", gender: "female", address: "22 Riverfront Residency", city: "Ahmedabad", state: "Gujarat", pincode: "380015", schemeId: "scheme-payout-pro", avatar: createDocPreview("Priya Patel", "#7c3aed", "Profile"), services: { payout: true, fundRequest: true, payin: true, pan: true, aeps: false }, bank: { bankName: "HDFC Bank", accountNo: "XXXXXX7184", ifsc: "HDFC0009012", accountType: "savings", branchName: "Satellite", beneficiaryName: "Priya Patel" }, kyc: { aadhaar: "9213 4421 1109", pan: "PRIYA2190P", gstNo: "", voterId: "GJH2200119", verificationNote: "Primary documents verified.", documents: [{ key: "aadhaarFront", label: "Aadhaar Front", image: createDocPreview("Aadhaar Front", "#1d4ed8", "Verified") }, { key: "voterId", label: "Voter ID", image: createDocPreview("Voter ID", "#f59e0b", "Verified") }] } },
  { id: "M003", name: "Amit Kumar", email: "amit@example.com", phone: "+91 97654 88020", role: "distributor", status: "inactive", kycStatus: "pending", joinDate: "2024-11-10", volume: 0, walletBalance: 145000, ipAddress: "115.112.18.205", dob: "1988-01-12", gender: "male", address: "3 Civic Towers", city: "Lucknow", state: "Uttar Pradesh", pincode: "226010", schemeId: "scheme-payout-pro", avatar: createDocPreview("Amit Kumar", "#2563eb", "Pending"), services: { payout: false, fundRequest: false, payin: false, pan: true, aeps: true }, bank: { bankName: "ICICI Bank", accountNo: "XXXXXX1198", ifsc: "ICIC0004422", accountType: "current", branchName: "Gomti Nagar", beneficiaryName: "Amit Kumar" }, kyc: { aadhaar: "1188 7722 5544", pan: "AMITK9921R", gstNo: "", voterId: "", verificationNote: "Back-side proof pending.", documents: [{ key: "aadhaarFront", label: "Aadhaar Front", image: createDocPreview("Aadhaar Front", "#0284c7", "Pending") }, { key: "panCard", label: "PAN Card", image: createDocPreview("PAN Card", "#16a34a", "Pending") }] } },
  { id: "M004", name: "Sneha Gupta", email: "sneha@example.com", phone: "+91 90000 18274", role: "merchant", status: "active", kycStatus: "rejected", joinDate: "2024-09-05", volume: 1800000, walletBalance: 395000, ipAddress: "61.95.181.203", dob: "1994-03-09", gender: "female", address: "88 Lake View Enclave", city: "Bengaluru", state: "Karnataka", pincode: "560095", schemeId: "scheme-upi-standard", avatar: createDocPreview("Sneha Gupta", "#db2777", "Rejected"), services: { payout: false, fundRequest: true, payin: false, pan: false, aeps: false }, bank: { bankName: "Axis Bank", accountNo: "XXXXXX2047", ifsc: "UTIB0002204", accountType: "current", branchName: "Koramangala", beneficiaryName: "Sneha Gupta" }, kyc: { aadhaar: "7732 6611 7745", pan: "SNEHA4401C", gstNo: "29SNEHA4401C1ZM", voterId: "KAA9923110", verificationNote: "PAN image blur detected.", documents: [{ key: "aadhaarFront", label: "Aadhaar Front", image: createDocPreview("Aadhaar Front", "#1d4ed8", "Verified") }, { key: "panCard", label: "PAN Card", image: createDocPreview("PAN Card", "#dc2626", "Rejected") }] } },
  { id: "M005", name: "Vikram Singh", email: "vikram@example.com", phone: "+91 98110 65432", role: "agent", status: "active", kycStatus: "verified", joinDate: "2024-07-18", volume: 4500000, walletBalance: 615000, ipAddress: "106.51.204.119", dob: "1987-12-28", gender: "male", address: "71 Green Park", city: "Delhi", state: "Delhi", pincode: "110016", schemeId: "scheme-payout-pro", avatar: createDocPreview("Vikram Singh", "#ea580c", "Profile"), services: { payout: true, fundRequest: false, payin: true, pan: true, aeps: false }, bank: { bankName: "Kotak Mahindra Bank", accountNo: "XXXXXX6324", ifsc: "KKBK0005511", accountType: "savings", branchName: "Green Park", beneficiaryName: "Vikram Singh" }, kyc: { aadhaar: "4411 8822 1199", pan: "VIKRA9988T", gstNo: "", voterId: "", verificationNote: "KYC completed.", documents: [{ key: "aadhaarFront", label: "Aadhaar Front", image: createDocPreview("Aadhaar Front", "#1d4ed8", "Verified") }, { key: "panCard", label: "PAN Card", image: createDocPreview("PAN Card", "#16a34a", "Verified") }] } },
];

let walletLedger = {
  M001: [{ id: "WL001", date: "2025-03-24 11:05", type: "debit", amount: 18000, remark: "Settlement adjustment", reference: "ADMIN-SETTLE-021", balanceAfter: 542000 }],
  M002: [{ id: "WL002", date: "2025-03-20 10:25", type: "credit", amount: 32000, remark: "Agent activation credit", reference: "ADMIN-OPEN-002", balanceAfter: 732000 }],
  M003: [{ id: "WL003", date: "2025-03-22 16:40", type: "debit", amount: 5000, remark: "Compliance hold", reference: "ADMIN-HOLD-001", balanceAfter: 145000 }],
  M004: [{ id: "WL004", date: "2025-03-18 13:30", type: "credit", amount: 45000, remark: "Merchant wallet funding", reference: "ADMIN-OPEN-004", balanceAfter: 395000 }],
  M005: [{ id: "WL005", date: "2025-03-19 12:10", type: "credit", amount: 25000, remark: "Agent float top-up", reference: "ADMIN-OPEN-005", balanceAfter: 615000 }],
};

let mockTransactions = [
  { id: "1", memberId: "M001", type: "payin", amount: 25000, status: "success", method: "UPI", customer: "Rahul Sharma", date: "2025-03-28 14:23", txnId: "TXN20250328001" },
  { id: "2", memberId: "M002", type: "payout", amount: 15000, status: "pending", method: "IMPS", customer: "Priya Patel", date: "2025-03-28 13:45", txnId: "TXN20250328002" },
  { id: "3", memberId: "M003", type: "payin", amount: 50000, status: "success", method: "NEFT", customer: "Amit Kumar", date: "2025-03-28 12:30", txnId: "TXN20250328003" },
  { id: "4", memberId: "M004", type: "payout", amount: 8500, status: "failed", method: "UPI", customer: "Sneha Gupta", date: "2025-03-28 11:15", txnId: "TXN20250328004" },
  { id: "5", memberId: "M005", type: "payin", amount: 120000, status: "success", method: "RTGS", customer: "Vikram Singh", date: "2025-03-27 16:45", txnId: "TXN20250327005" },
  { id: "6", memberId: "M002", type: "payout", amount: 3200, status: "success", method: "UPI", customer: "Priya Patel", date: "2025-03-27 15:20", txnId: "TXN20250327006" },
  { id: "7", memberId: "M001", type: "payin", amount: 75000, status: "pending", method: "IMPS", customer: "Rahul Sharma", date: "2025-03-27 14:00", txnId: "TXN20250327007" },
  { id: "8", memberId: "M004", type: "payout", amount: 45000, status: "success", method: "NEFT", customer: "Sneha Gupta", date: "2025-03-27 10:30", txnId: "TXN20250327008" },
  { id: "9", memberId: "M001", type: "payin", amount: 92000, status: "success", method: "RTGS", customer: "Rahul Sharma", date: "2025-03-26 18:05", txnId: "TXN20250326009" },
  { id: "10", memberId: "M005", type: "payout", amount: 18500, status: "failed", method: "UPI", customer: "Vikram Singh", date: "2025-03-26 16:40", txnId: "TXN20250326010" },
  { id: "11", memberId: "M003", type: "payin", amount: 39500, status: "success", method: "IMPS", customer: "Amit Kumar", date: "2025-03-25 12:05", txnId: "TXN20250325011" },
  { id: "12", memberId: "M002", type: "payout", amount: 61200, status: "success", method: "RTGS", customer: "Priya Patel", date: "2025-03-24 09:25", txnId: "TXN20250324012" },
];

const mockWallets = [
  { type: "Collection Credit Wallet", balance: 4250000, currency: INR, change: 8.3 },
  { type: "AEPS Debit Wallet", balance: 1820000, currency: INR, change: -2.5 },
  { type: "Payin Wallet", balance: 2450000, currency: INR, change: 12.5 },
  { type: "Payout Wallet", balance: 1650000, currency: INR, change: -3.2 },
  { type: "Commission Wallet", balance: 156000, currency: INR, change: 8.7 },
  { type: "Settlement Wallet", balance: 890000, currency: INR, change: 5.1 },
];

let mockFundRequests = [
  { id: "FR001", amount: 500000, status: "pending", date: "2025-03-28", method: "Bank Transfer", reference: "REF123456", requestedBy: "Rahul Sharma" },
  { id: "FR002", amount: 250000, status: "approved", date: "2025-03-27", method: "UPI", reference: "REF789012", requestedBy: "Priya Patel" },
  { id: "FR003", amount: 100000, status: "rejected", date: "2025-03-26", method: "NEFT", reference: "REF345678", requestedBy: "Amit Kumar" },
  { id: "FR004", amount: 750000, status: "pending", date: "2025-03-28", method: "RTGS", reference: "REF901234", requestedBy: "Sneha Gupta" },
];

let mockTickets = [
  { id: "TK001", subject: "Payment not received", status: "open", priority: "high", createdAt: "2025-03-28 10:00", lastReply: "2025-03-28 14:30", messages: [{ sender: "Rahul Sharma", text: `I made a payment of ${INR}25,000 but it has not been credited to my wallet yet.`, time: "10:00 AM", isAgent: false }, { sender: "Support Agent", text: "We are looking into this. Can you share the transaction ID?", time: "10:15 AM", isAgent: true }] },
  { id: "TK002", subject: "KYC verification delay", status: "in_progress", priority: "medium", createdAt: "2025-03-27 09:00", lastReply: "2025-03-28 11:00", messages: [{ sender: "Amit Kumar", text: "My KYC has been pending for 5 days. Please expedite.", time: "09:00 AM", isAgent: false }, { sender: "Support Agent", text: "We apologize for the delay. Your documents are under review.", time: "11:00 AM", isAgent: true }] },
];

const mockChartData = [
  { name: "Mon", payin: 420000, payout: 380000 },
  { name: "Tue", payin: 380000, payout: 350000 },
  { name: "Wed", payin: 510000, payout: 420000 },
  { name: "Thu", payin: 470000, payout: 460000 },
  { name: "Fri", payin: 590000, payout: 520000 },
  { name: "Sat", payin: 320000, payout: 280000 },
  { name: "Sun", payin: 280000, payout: 250000 },
];

const mockNotifications = [
  { id: "N1", title: "Large transaction detected", message: `A transaction of ${INR}1,20,000 was processed via RTGS.`, type: "warning", time: "5 min ago", read: false },
  { id: "N2", title: "Payout completed", message: `Payout of ${INR}45,000 to Deepa Iyer was successful.`, type: "success", time: "1 hour ago", read: false },
  { id: "N3", title: "New member registered", message: "Sneha Gupta has registered as a merchant.", type: "info", time: "3 hours ago", read: true },
  { id: "N4", title: "KYC rejected", message: "KYC for Amit Kumar was rejected. Documents unclear.", type: "error", time: "5 hours ago", read: true },
];

let mockActivityLogs = [
  { id: "A1", action: "Login", user: "admin@fintech.com", details: "Logged in from Chrome, Mumbai", timestamp: "2025-03-28 14:30", type: "auth" },
  { id: "A2", action: "Fund Approved", user: "admin@fintech.com", details: `Approved fund request FR002 for ${INR}2,50,000`, timestamp: "2025-03-28 14:15", type: "transaction" },
  { id: "A3", action: "API Key Rotated", user: "admin@fintech.com", details: "Payment gateway API key was rotated", timestamp: "2025-03-28 13:00", type: "api" },
  { id: "A4", action: "Member Added", user: "admin@fintech.com", details: "Added new merchant: Sneha Gupta", timestamp: "2025-03-28 11:00", type: "setting" },
];

const toDateValue = (value) => new Date(value.replace(" ", "T")).getTime();
const currentTimestamp = () => {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
};
const formatRange = (min, max) => `${INR}${Number(min).toLocaleString("en-IN")}${max == null ? "+" : ` - ${INR}${Number(max).toLocaleString("en-IN")}`}`;
const findMember = (memberId) => mockMembers.find((member) => member.id === memberId);
const getSchemeById = (schemeId) => commissionSchemes.find((scheme) => scheme.id === schemeId);
const enrichMember = (member) => ({ ...member, scheme: getSchemeById(member.schemeId) || null });
const getWalletEntries = (memberId) => clone(walletLedger[memberId] || []);
const appendActivity = (action, details, type = "setting") => {
  mockActivityLogs = [{ id: `A${mockActivityLogs.length + 1}`, action, user: "admin@fintech.com", details, timestamp: currentTimestamp(), type }, ...mockActivityLogs];
};

const buildStatementRows = (transactions, openingBalance = 250000) => {
  const ordered = [...transactions].sort((left, right) => toDateValue(left.date) - toDateValue(right.date));
  let runningBalance = openingBalance;
  return ordered.map((transaction, index) => {
    const credit = transaction.type === "payin" && transaction.status === "success" ? transaction.amount : 0;
    const debit = transaction.type === "payout" || transaction.status !== "success" ? transaction.amount : 0;
    const opening = runningBalance;
    const closing = opening + credit - debit;
    runningBalance = closing;
    return { id: `ST-${transaction.id}`, serialNo: index + 1, txnId: transaction.txnId, member: transaction.customer, memberId: transaction.memberId, openingBalance: opening, credit, debit, closingBalance: closing, txnType: transaction.type, txnDate: transaction.date, status: transaction.status, method: transaction.method, reference: transaction.remark || transaction.method };
  });
};

const getWalletAnalytics = (walletType, memberId) => {
  const transactions = mockTransactions
    .filter((item) => item.type === walletType && (!memberId || item.memberId === memberId))
    .sort((a, b) => toDateValue(b.date) - toDateValue(a.date));
  const successfulTransactions = transactions.filter((item) => item.status === "success");
  const successfulAmount = successfulTransactions.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const pendingAmount = transactions
    .filter((item) => item.status === "pending")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return {
    transactionCount: transactions.length,
    successfulAmount,
    pendingAmount,
    failedCount: transactions.filter((item) => item.status === "failed").length,
    averageTicket: successfulTransactions.length ? Math.round(successfulAmount / successfulTransactions.length) : 0,
    lastUpdated: transactions[0]?.date || currentTimestamp(),
  };
};

const buildMemberRecord = (payload) => {
  const id = `M${String(mockMembers.length + 1).padStart(3, "0")}`;
  const name = payload.name?.trim() || "New Member";
  return {
    id,
    name,
    email: payload.email?.trim() || `${id.toLowerCase()}@example.com`,
    phone: payload.phone || "",
    role: payload.role || "merchant",
    status: "active",
    kycStatus: payload.aadhaar && payload.pan ? "pending" : "kyc_pending",
    joinDate: new Date().toISOString().slice(0, 10),
    volume: 0,
    walletBalance: Number(payload.walletBalance || 0),
    ipAddress: payload.ipAddress || "0.0.0.0",
    dob: payload.dob || "",
    gender: payload.gender || "other",
    address: payload.address || "",
    city: payload.city || "",
    state: payload.state || "",
    pincode: payload.pincode || "",
    schemeId: payload.schemeId || commissionSchemes[0]?.id || null,
    avatar: createDocPreview(name, "#0f766e", "Pending"),
    services: { payout: Boolean(payload.services?.payout), fundRequest: Boolean(payload.services?.fundRequest), payin: Boolean(payload.services?.payin), pan: Boolean(payload.services?.pan), aeps: Boolean(payload.services?.aeps) },
    bank: { bankName: payload.bankName || "", accountNo: payload.accountNo || "", ifsc: payload.ifsc || "", accountType: payload.accountType || "savings", branchName: payload.branchName || "", beneficiaryName: name },
    kyc: { aadhaar: payload.aadhaar || "", pan: payload.pan || "", gstNo: payload.gstNo || "", voterId: payload.voterId || "", verificationNote: "Fresh onboarding submitted. Awaiting compliance review.", documents: [{ key: "aadhaarFront", label: "Aadhaar Front", image: payload.aadhaarImage || createDocPreview("Aadhaar Front", "#2563eb", "Pending") }, { key: "panCard", label: "PAN Card", image: payload.panImage || createDocPreview("PAN Card", "#16a34a", "Pending") }, ...(payload.voterIdImage ? [{ key: "voterId", label: "Voter ID", image: payload.voterIdImage }] : [])] },
  };
};

export const api = {
  getStats: async () => {
    await delay(800);
    return [{ label: "Total Volume", value: 12450000, change: 12.5, prefix: INR }, { label: "Transactions", value: 3847, change: 8.3 }, { label: "Success Rate", value: 96.8, change: 2.1, prefix: "" }, { label: "Active Merchants", value: 156, change: 15.2 }];
  },
  getAdminStats: async () => {
    await delay(800);
    return [{ label: "Virtual Balance", value: 8500000, change: 5.3, prefix: INR }, { label: "Collection Balance", value: 4250000, change: -2.1, prefix: INR }, { label: "Total Members", value: mockMembers.length, change: 12.8 }, { label: "Pending Approvals", value: mockFundRequests.filter((item) => item.status === "pending").length, change: -5 }];
  },
  getClientProfile: async () => { await delay(300); return clone(clientProfile); },
  updateClientFallbackUrls: async (payload) => { await delay(450); clientProfile = { ...clientProfile, fallbackUrls: { ...clientProfile.fallbackUrls, ...payload } }; return clone(clientProfile); },
  getTransactions: async (type, status) => {
    await delay(600);
    let filtered = [...mockTransactions];
    if (type && type !== "all") filtered = filtered.filter((item) => item.type === type);
    if (status && status !== "all") filtered = filtered.filter((item) => item.status === status);
    return clone(filtered.sort((a, b) => toDateValue(b.date) - toDateValue(a.date)));
  },
  getStatementRows: async (type) => { await delay(500); return buildStatementRows(await api.getTransactions(type), type === "payin" ? 385000 : 265000); },
  getTransactionsByMember: async (memberId) => { await delay(350); return clone(mockTransactions.filter((item) => item.memberId === memberId).sort((a, b) => toDateValue(b.date) - toDateValue(a.date))); },
  getWalletEntries: async (memberId) => { await delay(250); return getWalletEntries(memberId); },
  adjustMemberBalance: async ({ memberId, transferType, amount, remark, reference }) => {
    await delay(700);
    const member = findMember(memberId);
    if (!member) throw new Error("Member not found");
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) throw new Error("Enter a valid amount");
    if (!["credit", "debit"].includes(transferType)) throw new Error("Choose a valid transfer type");
    if (transferType === "debit" && numericAmount > member.walletBalance) throw new Error("Debit amount exceeds member wallet balance");
    member.walletBalance = transferType === "credit" ? member.walletBalance + numericAmount : member.walletBalance - numericAmount;
    const walletEntry = { id: `WL${String(Object.values(walletLedger).flat().length + 1).padStart(3, "0")}`, date: currentTimestamp(), type: transferType, amount: numericAmount, remark: remark || `Admin ${transferType}`, reference: reference || `ADMIN-${transferType.toUpperCase()}-${Date.now()}`, balanceAfter: member.walletBalance };
    walletLedger[memberId] = [walletEntry, ...(walletLedger[memberId] || [])];
    const transaction = { id: `${mockTransactions.length + 1}`, memberId, type: transferType === "credit" ? "payin" : "payout", amount: numericAmount, status: "success", method: "ADMIN", customer: member.name, date: walletEntry.date, txnId: walletEntry.reference, remark: walletEntry.remark };
    mockTransactions = [transaction, ...mockTransactions];
    appendActivity(transferType === "credit" ? "Wallet Credited" : "Wallet Debited", `${member.name} ${transferType}ed by ${INR}${numericAmount.toLocaleString("en-IN")}`, "transaction");
    return clone({ member: enrichMember(member), walletEntry, transaction });
  },
  getWallets: async () => { await delay(500); return clone(mockWallets); },
  getFundRequests: async () => { await delay(550); return clone(mockFundRequests); },
  approveFundRequest: async () => { await delay(900); return { success: true }; },
  rejectFundRequest: async () => { await delay(900); return { success: true }; },
  submitFundRequest: async ({ amount, method, reference }) => {
    await delay(1000);
    const request = {
      id: `FR${String(mockFundRequests.length + 1).padStart(3, "0")}`,
      amount: Number(amount || 0),
      status: "pending",
      date: new Date().toISOString().slice(0, 10),
      method: String(method || "bank_transfer").replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase()),
      reference: reference || `REF${Date.now()}`,
      requestedBy: clientProfile.name,
    };
    mockFundRequests = [request, ...mockFundRequests];
    appendActivity("Fund Request Submitted", `${clientProfile.name} requested ${INR}${request.amount.toLocaleString("en-IN")}`, "transaction");
    return { success: true, id: request.id };
  },
  getMembers: async () => { await delay(650); return clone(mockMembers.map(enrichMember)); },
  getMemberById: async (memberId) => {
    await delay(450);
    const member = findMember(memberId);
    if (!member) return null;
    const transactions = mockTransactions.filter((item) => item.memberId === memberId).sort((a, b) => toDateValue(b.date) - toDateValue(a.date));
    return clone({ ...enrichMember(member), servicesList: serviceOrder.map((key) => ({ key, label: serviceLabels[key], active: Boolean(member.services?.[key]) })), walletEntries: walletLedger[memberId] || [], transactions, statementRows: buildStatementRows(transactions, Math.max(member.walletBalance - member.volume / 20, 100000)) });
  },
  createMember: async (payload) => { await delay(850); const member = buildMemberRecord(payload); mockMembers = [member, ...mockMembers]; walletLedger[member.id] = []; appendActivity("Member Added", `Added new ${member.role}: ${member.name}`); return clone(enrichMember(member)); },
  updateMemberDetails: async (memberId, payload) => {
    await delay(550);
    const member = findMember(memberId);
    if (!member) throw new Error("Member not found");
    Object.assign(member, { phone: payload.phone ?? member.phone, address: payload.address ?? member.address, city: payload.city ?? member.city, state: payload.state ?? member.state, pincode: payload.pincode ?? member.pincode, ipAddress: payload.ipAddress ?? member.ipAddress, schemeId: payload.schemeId ?? member.schemeId });
    appendActivity("Member Updated", `Updated operational details for ${member.name}`);
    return clone(enrichMember(member));
  },
  updateMemberService: async (memberId, serviceKey, active) => {
    await delay(350);
    const member = findMember(memberId);
    if (!member) throw new Error("Member not found");
    member.services = { ...member.services, [serviceKey]: active };
    appendActivity("Service Permission Changed", `${serviceLabels[serviceKey]} set to ${active ? "Active" : "Inactive"} for ${member.name}`);
    return clone(enrichMember(member));
  },
  assignSchemeToMember: async (memberId, schemeId) => {
    await delay(350);
    const member = findMember(memberId);
    if (!member) throw new Error("Member not found");
    const previousSchemeId = member.schemeId;
    member.schemeId = schemeId;
    commissionSchemes = commissionSchemes.map((scheme) => ({ ...scheme, appliedMembers: scheme.id === previousSchemeId ? scheme.appliedMembers.filter((id) => id !== memberId) : scheme.id === schemeId ? Array.from(new Set([...scheme.appliedMembers, memberId])) : scheme.appliedMembers }));
    appendActivity("Commission Assigned", `Assigned ${getSchemeById(schemeId)?.name || "scheme"} to ${member.name}`);
    return clone(enrichMember(member));
  },
  getCommissionData: async () => {
    await delay(400);
    return clone(commissionSchemes.map((scheme) => ({ ...scheme, slabs: scheme.slabs.map((slab) => ({ ...slab, range: formatRange(slab.min, slab.max), displayRate: slab.rateType === "flat" ? `${INR}${slab.rate}` : `${slab.rate}%` })) })));
  },
  createCommissionScheme: async (payload) => { await delay(500); const scheme = { id: `scheme-${Date.now()}`, name: payload.name, category: payload.category, description: payload.description || "", appliedMembers: [], slabs: [] }; commissionSchemes = [scheme, ...commissionSchemes]; appendActivity("Scheme Added", `Created commission scheme ${scheme.name}`); return clone(scheme); },
  updateCommissionScheme: async (schemeId, payload) => { await delay(420); commissionSchemes = commissionSchemes.map((scheme) => scheme.id === schemeId ? { ...scheme, ...payload } : scheme); appendActivity("Scheme Updated", `Updated commission scheme ${payload.name || schemeId}`); return clone(getSchemeById(schemeId)); },
  createCommissionSlab: async (schemeId, payload) => { await delay(400); commissionSchemes = commissionSchemes.map((scheme) => scheme.id === schemeId ? { ...scheme, slabs: [...scheme.slabs, { id: `slab-${Date.now()}`, min: Number(payload.min || 0), max: payload.max === "" || payload.max == null ? null : Number(payload.max), rate: Number(payload.rate || 0), rateType: payload.rateType || "percentage" }] } : scheme); appendActivity("Commission Slab Added", `Added new slab to ${getSchemeById(schemeId)?.name || schemeId}`); return clone(getSchemeById(schemeId)); },
  updateCommissionSlab: async (schemeId, slabId, payload) => { await delay(380); commissionSchemes = commissionSchemes.map((scheme) => scheme.id === schemeId ? { ...scheme, slabs: scheme.slabs.map((slab) => slab.id === slabId ? { ...slab, min: Number(payload.min ?? slab.min), max: payload.max === "" ? null : payload.max != null ? Number(payload.max) : slab.max, rate: Number(payload.rate ?? slab.rate), rateType: payload.rateType || slab.rateType } : slab) } : scheme); appendActivity("Commission Slab Updated", `Updated slab ${slabId}`); return clone(getSchemeById(schemeId)); },
  getChartData: async () => { await delay(450); return clone(mockChartData); },
  getTickets: async () => { await delay(550); return clone(mockTickets); },
  createTicket: async ({ subject, priority, message, createdBy, context }) => {
    await delay(500);
    const ticket = {
      id: `TK${String(mockTickets.length + 1).padStart(3, "0")}`,
      subject,
      status: "open",
      priority: priority || "medium",
      createdAt: currentTimestamp(),
      lastReply: currentTimestamp(),
      context: context || "client",
      messages: [
        {
          sender: createdBy || "You",
          text: message,
          time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
          isAgent: context === "admin",
        },
      ],
    };
    mockTickets = [ticket, ...mockTickets];
    appendActivity("Support Ticket Created", `${ticket.id} created for ${context || "client"} support`, "setting");
    return clone(ticket);
  },
  addTicketMessage: async ({ ticketId, text, sender, isAgent }) => {
    await delay(250);
    const replyTime = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    mockTickets = mockTickets.map((ticket) =>
      ticket.id === ticketId
        ? {
            ...ticket,
            lastReply: currentTimestamp(),
            messages: [...ticket.messages, { sender: sender || "You", text, time: replyTime, isAgent: Boolean(isAgent) }],
          }
        : ticket
    );
    return clone(mockTickets.find((ticket) => ticket.id === ticketId));
  },
  getNotifications: async () => { await delay(350); return clone(mockNotifications); },
  getActivityLogs: async () => { await delay(450); return clone(mockActivityLogs); },
  getWalletAnalytics: async (type, memberId) => { await delay(280); return clone(getWalletAnalytics(type, memberId)); },
};
