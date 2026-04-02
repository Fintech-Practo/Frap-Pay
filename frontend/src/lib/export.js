const downloadFile = (content, filename, type) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const escapeCsvValue = (value) => {
  const stringValue = String(value ?? "");

  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

export const exportTransactionsToCsv = (rows, filename) => {
  const headers = ["Date", "Transaction ID", "Customer", "Type", "Method", "Status", "Amount"];
  const csvRows = rows.map((row) => [
    row.date,
    row.txnId,
    row.customer,
    row.type,
    row.method,
    row.status,
    row.amount,
  ]);

  const csv = [headers, ...csvRows].map((row) => row.map(escapeCsvValue).join(",")).join("\n");
  downloadFile(csv, filename, "text/csv;charset=utf-8;");
};

export const exportTransactionsToPdf = (rows, filename, title) => {
  const printWindow = window.open("", "_blank", "noopener,noreferrer,width=1200,height=900");

  if (!printWindow) {
    return;
  }

  const tableRows = rows
    .map(
      (row) => `
        <tr>
          <td>${row.date}</td>
          <td>${row.txnId}</td>
          <td>${row.customer}</td>
          <td>${row.type}</td>
          <td>${row.method}</td>
          <td>${row.status}</td>
          <td>₹${Number(row.amount).toLocaleString("en-IN")}</td>
        </tr>
      `
    )
    .join("");

  printWindow.document.write(`
    <html>
      <head>
        <title>${filename}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 32px; color: #0f172a; }
          h1 { margin: 0 0 8px; font-size: 24px; }
          p { margin: 0 0 24px; color: #475569; }
          table { width: 100%; border-collapse: collapse; margin-top: 24px; }
          th, td { border: 1px solid #cbd5e1; padding: 10px 12px; text-align: left; font-size: 12px; }
          th { background: #f8fafc; text-transform: uppercase; letter-spacing: 0.04em; font-size: 11px; }
          .summary { display: flex; gap: 12px; margin-top: 20px; }
          .card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 16px; min-width: 180px; }
          .label { color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; }
          .value { margin-top: 6px; font-size: 18px; font-weight: 700; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <p>Generated on ${new Date().toLocaleString("en-IN")}</p>
        <div class="summary">
          <div class="card">
            <div class="label">Entries</div>
            <div class="value">${rows.length}</div>
          </div>
          <div class="card">
            <div class="label">Total Amount</div>
            <div class="value">₹${rows.reduce((sum, row) => sum + Number(row.amount || 0), 0).toLocaleString("en-IN")}</div>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Transaction ID</th>
              <th>Customer</th>
              <th>Type</th>
              <th>Method</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};
