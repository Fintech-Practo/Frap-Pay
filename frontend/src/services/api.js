// Mock API service for FinTech Dashboard

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const INR = "\u20B9";

const createDocPreview = (title, subtitle, accent, tag) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760">
      <rect width="1200" height="760" fill="#f8fafc"/>
      <rect x="44" y="44" width="1112" height="672" rx="32" fill="white" stroke="#e2e8f0" stroke-width="4"/>
      <rect x="72" y="72" width="1056" height="120" rx="24" fill="${accent}"/>
      <text x="112" y="138" font-size="54" font-family="Arial, Helvetica, sans-serif" fill="white" font-weight="700">${title}</text>
      <text x="112" y="184" font-size="24" font-family="Arial, Helvetica, sans-serif" fill="rgba(255,255,255,0.85)">${subtitle}</text>
      <rect x="88" y="244" width="232" height="276" rx="26" fill="#eef2ff"/>
      <circle cx="204" cy="332" r="74" fill="#cbd5e1"/>
      <rect x="128" y="428" width="152" height="22" rx="11" fill="#94a3b8"/>
      <rect x="368" y="260" width="696" height="26" rx="13" fill="#cbd5e1"/>
      <rect x="368" y="318" width="560" height="20" rx="10" fill="#e2e8f0"/>
      <rect x="368" y="368" width="640" height="20" rx="10" fill="#e2e8f0"/>
      <rect x="368" y="418" width="516" height="20" rx="10" fill="#e2e8f0"/>
      <rect x="88" y="576" width="976" height="72" rx="24" fill="#f8fafc" stroke="#e2e8f0" stroke-width="3"/>
      <text x="126" y="620" font-size="26" font-family="Arial, Helvetica, sans-serif" fill="#334155">${tag}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
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
  { type: "Payin Wallet", balance: 2450000, currency: INR, change: 12.5 },
  { type: "Payout Wallet", balance: 1820000, currency: INR, change: -3.2 },
  { type: "Commission Wallet", balance: 156000, currency: INR, change: 8.7 },
  { type: "Settlement Wallet", balance: 890000, currency: INR, change: 5.1 },
];

let mockFundRequests = [
  { id: "FR001", amount: 500000, status: "pending", date: "2025-03-28", method: "Bank Transfer", reference: "REF123456", requestedBy: "Rahul Sharma" },
  { id: "FR002", amount: 250000, status: "approved", date: "2025-03-27", method: "UPI", reference: "REF789012", requestedBy: "Priya Patel" },
  { id: "FR003", amount: 100000, status: "rejected", date: "2025-03-26", method: "NEFT", reference: "REF345678", requestedBy: "Amit Kumar" },
  { id: "FR004", amount: 750000, status: "pending", date: "2025-03-28", method: "RTGS", reference: "REF901234", requestedBy: "Sneha Gupta" },
];

let mockMembers = [
  {
    id: "M001",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91 98765 21001",
    role: "merchant",
    status: "active",
    kycStatus: "verified",
    joinDate: "2024-06-15",
    volume: 5200000,
    dob: "1990-08-18",
    gender: "male",
    address: "14 Rose Avenue, Andheri East",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400069",
    avatar: createDocPreview("Rahul Sharma", "Merchant profile", "#dc2626", "Profile"),
    bank: {
      bankName: "State Bank of India",
      accountNo: "XXXXXX4582",
      ifsc: "SBIN0001234",
      accountType: "current",
      branchName: "Andheri East",
      beneficiaryName: "Rahul Sharma",
    },
    kyc: {
      aadhaar: "4582 1134 9876",
      pan: "RAHUL1234F",
      gstNo: "27RAHUL1234F1Z5",
      voterId: "MHX1234567",
      verificationNote: "All submitted documents matched during manual verification.",
      documents: [
        { key: "aadhaarFront", label: "Aadhaar Front", image: createDocPreview("Aadhaar Front", "Unique Identification Authority of India", "#1d4ed8", "Verified") },
        { key: "panCard", label: "PAN Card", image: createDocPreview("PAN Card", "Income Tax Department", "#059669", "Verified") },
      ],
    },
  },
  {
    id: "M002",
    name: "Priya Patel",
    email: "priya@example.com",
    phone: "+91 98989 30021",
    role: "agent",
    status: "active",
    kycStatus: "verified",
    joinDate: "2024-08-22",
    volume: 3100000,
    dob: "1992-05-04",
    gender: "female",
    address: "22 Riverfront Residency",
    city: "Ahmedabad",
    state: "Gujarat",
    pincode: "380015",
    avatar: createDocPreview("Priya Patel", "Agent profile", "#7c3aed", "Profile"),
    bank: {
      bankName: "HDFC Bank",
      accountNo: "XXXXXX7184",
      ifsc: "HDFC0009012",
      accountType: "savings",
      branchName: "Satellite",
      beneficiaryName: "Priya Patel",
    },
    kyc: {
      aadhaar: "9213 4421 1109",
      pan: "PRIYA2190P",
      gstNo: "",
      voterId: "GJH2200119",
      verificationNote: "Primary documents verified, business registration not required for agent role.",
      documents: [
        { key: "aadhaarFront", label: "Aadhaar Front", image: createDocPreview("Aadhaar Front", "Unique Identification Authority of India", "#1d4ed8", "Verified") },
        { key: "voterId", label: "Voter ID", image: createDocPreview("Voter ID", "Election Commission of India", "#f59e0b", "Verified") },
      ],
    },
  },
  {
    id: "M003",
    name: "Amit Kumar",
    email: "amit@example.com",
    phone: "+91 97654 88020",
    role: "distributor",
    status: "inactive",
    kycStatus: "pending",
    joinDate: "2024-11-10",
    volume: 0,
    dob: "1988-01-12",
    gender: "male",
    address: "3 Civic Towers",
    city: "Lucknow",
    state: "Uttar Pradesh",
    pincode: "226010",
    avatar: createDocPreview("Amit Kumar", "Distributor profile", "#2563eb", "Pending"),
    bank: {
      bankName: "ICICI Bank",
      accountNo: "XXXXXX1198",
      ifsc: "ICIC0004422",
      accountType: "current",
      branchName: "Gomti Nagar",
      beneficiaryName: "Amit Kumar",
    },
    kyc: {
      aadhaar: "1188 7722 5544",
      pan: "AMITK9921R",
      gstNo: "",
      voterId: "",
      verificationNote: "Back-side proof and selfie verification pending.",
      documents: [
        { key: "aadhaarFront", label: "Aadhaar Front", image: createDocPreview("Aadhaar Front", "Awaiting secondary verification", "#0284c7", "Pending") },
        { key: "panCard", label: "PAN Card", image: createDocPreview("PAN Card", "Submitted for review", "#16a34a", "Pending") },
      ],
    },
  },
  {
    id: "M004",
    name: "Sneha Gupta",
    email: "sneha@example.com",
    phone: "+91 90000 18274",
    role: "merchant",
    status: "active",
    kycStatus: "rejected",
    joinDate: "2024-09-05",
    volume: 1800000,
    dob: "1994-03-09",
    gender: "female",
    address: "88 Lake View Enclave",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560095",
    avatar: createDocPreview("Sneha Gupta", "Merchant profile", "#db2777", "Rejected"),
    bank: {
      bankName: "Axis Bank",
      accountNo: "XXXXXX2047",
      ifsc: "UTIB0002204",
      accountType: "current",
      branchName: "Koramangala",
      beneficiaryName: "Sneha Gupta",
    },
    kyc: {
      aadhaar: "7732 6611 7745",
      pan: "SNEHA4401C",
      gstNo: "29SNEHA4401C1ZM",
      voterId: "KAA9923110",
      verificationNote: "PAN image blur detected. Please re-upload a clearer copy.",
      documents: [
        { key: "aadhaarFront", label: "Aadhaar Front", image: createDocPreview("Aadhaar Front", "Accepted", "#1d4ed8", "Verified") },
        { key: "panCard", label: "PAN Card", image: createDocPreview("PAN Card", "Image quality issue", "#dc2626", "Rejected") },
      ],
    },
  },
  {
    id: "M005",
    name: "Vikram Singh",
    email: "vikram@example.com",
    phone: "+91 98110 65432",
    role: "agent",
    status: "active",
    kycStatus: "verified",
    joinDate: "2024-07-18",
    volume: 4500000,
    dob: "1987-12-28",
    gender: "male",
    address: "71 Green Park",
    city: "Delhi",
    state: "Delhi",
    pincode: "110016",
    avatar: createDocPreview("Vikram Singh", "Agent profile", "#ea580c", "Profile"),
    bank: {
      bankName: "Kotak Mahindra Bank",
      accountNo: "XXXXXX6324",
      ifsc: "KKBK0005511",
      accountType: "savings",
      branchName: "Green Park",
      beneficiaryName: "Vikram Singh",
    },
    kyc: {
      aadhaar: "4411 8822 1199",
      pan: "VIKRA9988T",
      gstNo: "",
      voterId: "",
      verificationNote: "KYC completed with biometric re-check.",
      documents: [
        { key: "aadhaarFront", label: "Aadhaar Front", image: createDocPreview("Aadhaar Front", "Unique Identification Authority of India", "#1d4ed8", "Verified") },
        { key: "panCard", label: "PAN Card", image: createDocPreview("PAN Card", "Income Tax Department", "#16a34a", "Verified") },
      ],
    },
  },
];

const mockTickets = [
  {
    id: "TK001",
    subject: "Payment not received",
    status: "open",
    priority: "high",
    createdAt: "2025-03-28 10:00",
    lastReply: "2025-03-28 14:30",
    messages: [
      { sender: "Rahul Sharma", text: `I made a payment of ${INR}25,000 but it has not been credited to my wallet yet.`, time: "10:00 AM", isAgent: false },
      { sender: "Support Agent", text: "We are looking into this. Can you share the transaction ID?", time: "10:15 AM", isAgent: true },
      { sender: "Rahul Sharma", text: "TXN20250328001", time: "10:20 AM", isAgent: false },
    ],
  },
  {
    id: "TK002",
    subject: "KYC verification delay",
    status: "in_progress",
    priority: "medium",
    createdAt: "2025-03-27 09:00",
    lastReply: "2025-03-28 11:00",
    messages: [
      { sender: "Amit Kumar", text: "My KYC has been pending for 5 days. Please expedite.", time: "09:00 AM", isAgent: false },
      { sender: "Support Agent", text: "We apologize for the delay. Your documents are under review.", time: "11:00 AM", isAgent: true },
    ],
  },
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

const mockActivityLogs = [
  { id: "A1", action: "Login", user: "admin@fintech.com", details: "Logged in from Chrome, Mumbai", timestamp: "2025-03-28 14:30", type: "auth" },
  { id: "A2", action: "Fund Approved", user: "admin@fintech.com", details: `Approved fund request FR002 for ${INR}2,50,000`, timestamp: "2025-03-28 14:15", type: "transaction" },
  { id: "A3", action: "API Key Rotated", user: "admin@fintech.com", details: "Payment gateway API key was rotated", timestamp: "2025-03-28 13:00", type: "api" },
  { id: "A4", action: "Member Added", user: "admin@fintech.com", details: "Added new merchant: Sneha Gupta", timestamp: "2025-03-28 11:00", type: "setting" },
  { id: "A5", action: "Commission Updated", user: "admin@fintech.com", details: "Updated UPI commission slab to 0.3%", timestamp: "2025-03-27 16:00", type: "setting" },
];

const clone = (value) => JSON.parse(JSON.stringify(value));

const buildMemberRecord = (payload) => {
  const id = `M${String(mockMembers.length + 1).padStart(3, "0")}`;
  const name = payload.name?.trim() || "New Member";
  const email = payload.email?.trim() || `${id.toLowerCase()}@example.com`;
  const kycStatus = payload.aadhaar && payload.pan ? "pending" : "kyc_pending";
  const avatar = payload.avatar || createDocPreview(name, "New onboarding profile", "#0f766e", "Pending");

  return {
    id,
    name,
    email,
    phone: payload.phone || "",
    role: payload.role || "merchant",
    status: "active",
    kycStatus,
    joinDate: new Date().toISOString().slice(0, 10),
    volume: 0,
    dob: payload.dob || "",
    gender: payload.gender || "other",
    address: payload.address || "",
    city: payload.city || "",
    state: payload.state || "",
    pincode: payload.pincode || "",
    avatar,
    bank: {
      bankName: payload.bankName || "",
      accountNo: payload.accountNo || "",
      ifsc: payload.ifsc || "",
      accountType: payload.accountType || "savings",
      branchName: payload.branchName || "",
      beneficiaryName: name,
    },
    kyc: {
      aadhaar: payload.aadhaar || "",
      pan: payload.pan || "",
      gstNo: payload.gstNo || "",
      voterId: payload.voterId || "",
      verificationNote: "Fresh onboarding submitted. Awaiting compliance review.",
      documents: [
        { key: "aadhaarFront", label: "Aadhaar Front", image: payload.aadhaarImage || createDocPreview("Aadhaar Front", "Awaiting review", "#2563eb", "Pending") },
        { key: "panCard", label: "PAN Card", image: payload.panImage || createDocPreview("PAN Card", "Awaiting review", "#16a34a", "Pending") },
        ...(payload.voterIdImage ? [{ key: "voterId", label: "Voter ID", image: payload.voterIdImage }] : []),
      ],
    },
  };
};

export const api = {
  getStats: async () => {
    await delay(800);
    return [
      { label: "Total Volume", value: 12450000, change: 12.5, prefix: INR },
      { label: "Transactions", value: 3847, change: 8.3 },
      { label: "Success Rate", value: 96.8, change: 2.1, prefix: "" },
      { label: "Active Merchants", value: 156, change: 15.2 },
    ];
  },

  getTransactions: async (type, status) => {
    await delay(600);
    let filtered = [...mockTransactions];

    if (type && type !== "all") {
      filtered = filtered.filter((t) => t.type === type);
    }

    if (status && status !== "all") {
      filtered = filtered.filter((t) => t.status === status);
    }

    return clone(filtered);
  },

  getTransactionsByMember: async (memberId) => {
    await delay(400);
    return clone(mockTransactions.filter((transaction) => transaction.memberId === memberId));
  },

  getWallets: async () => {
    await delay(500);
    return clone(mockWallets);
  },

  getFundRequests: async () => {
    await delay(600);
    return clone(mockFundRequests);
  },

  approveFundRequest: async () => {
    await delay(1000);
    return { success: true };
  },

  rejectFundRequest: async () => {
    await delay(1000);
    return { success: true };
  },

  submitFundRequest: async () => {
    await delay(1200);
    return {
      success: true,
      id: `FR${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
    };
  },

  getMembers: async () => {
    await delay(700);
    return clone(mockMembers);
  },

  getMemberById: async (memberId) => {
    await delay(500);
    const member = mockMembers.find((entry) => entry.id === memberId);

    if (!member) {
      return null;
    }

    return clone({
      ...member,
      transactions: mockTransactions.filter((transaction) => transaction.memberId === memberId),
    });
  },

  createMember: async (payload) => {
    await delay(900);
    const member = buildMemberRecord(payload);
    mockMembers = [member, ...mockMembers];
    return clone(member);
  },

  getChartData: async () => {
    await delay(500);
    return clone(mockChartData);
  },

  getTickets: async () => {
    await delay(600);
    return clone(mockTickets);
  },

  getNotifications: async () => {
    await delay(400);
    return clone(mockNotifications);
  },

  getActivityLogs: async () => {
    await delay(500);
    return clone(mockActivityLogs);
  },

  getAdminStats: async () => {
    await delay(800);
    return [
      { label: "Virtual Balance", value: 8500000, change: 5.3, prefix: INR },
      { label: "Collection Balance", value: 4250000, change: -2.1, prefix: INR },
      { label: "Total Members", value: 342, change: 12.8 },
      { label: "Pending Approvals", value: 18, change: -5.0 },
    ];
  },
};
