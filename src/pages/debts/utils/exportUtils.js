import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Format currency for display
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("uz-UZ", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

/**
 * Format date for display
 */
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

/**
 * Generate filename with timestamp
 */
const generateFilename = (prefix, extension) => {
  const now = new Date();
  const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;
  const formattedTime = `${now.getHours().toString().padStart(2, "0")}-${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}-${now.getSeconds().toString().padStart(2, "0")}`;
  return `${prefix}_${formattedDate}_${formattedTime}.${extension}`;
};

/**
 * Export profit data to CSV
 * @param {Array} data - Profit data array
 * @param {Object} summary - Summary object with totals
 * @param {boolean} selectedOnly - Whether to export only selected rows
 */
export const exportToCSV = (data, summary = null, selectedOnly = false) => {
  if (!data || data.length === 0) {
    return;
  }

  // CSV headers
  const headers = [
    "Sana",
    "Invoice ID",
    "Do'kon",
    "Mahsulotlar",
    "Daromad (so'm)",
    "Xarajat (so'm)",
    "Foyda (so'm)",
    "Foyda %",
  ];

  // Convert data to CSV rows
  const rows = data.map((item) => [
    formatDate(item.date),
    item.invoice_id || "",
    item.store || "",
    item.product_count || 0,
    formatCurrency(item.revenue),
    formatCurrency(item.cost),
    formatCurrency(item.profit),
    `${(parseFloat(item.profit_percent) || 0).toFixed(2)}%`,
  ]);

  // Add summary row if provided
  if (summary) {
    rows.push([]); // Empty row
    rows.push([
      "JAMI:",
      "",
      "",
      "",
      formatCurrency(summary.revenue),
      formatCurrency(summary.cost),
      formatCurrency(summary.total),
      "",
    ]);
  }

  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  // Add BOM for UTF-8 support (for Excel)
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", generateFilename("Foyda_ro'yxati", "csv"));
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Export profit data to PDF
 * @param {Array} data - Profit data array
 * @param {Object} summary - Summary object with totals
 * @param {Object} filters - Current filters applied
 * @param {boolean} selectedOnly - Whether to export only selected rows
 */
export const exportToPDF = (data, summary = null, filters = null, selectedOnly = false) => {
  if (!data || data.length === 0) {
    return;
  }

  const doc = new jsPDF("landscape", "mm", "a4");

  // Title
  doc.setFontSize(18);
  doc.text("Foyda Ro'yxati", 14, 15);

  // Filters info
  if (filters) {
    doc.setFontSize(10);
    let yPos = 22;
    const filterTexts = [];
    if (filters.from || filters.to) {
      const from = filters.from ? formatDate(filters.from) : "";
      const to = filters.to ? formatDate(filters.to) : "";
      filterTexts.push(`Sana: ${from} - ${to}`);
    }
    if (filters.store) {
      filterTexts.push(`Do'kon: ${filters.store}`);
    }
    if (filters.minProfit) {
      filterTexts.push(`Minimal foyda: ${formatCurrency(filters.minProfit)}`);
    }
    if (filterTexts.length > 0) {
      doc.text(filterTexts.join(" | "), 14, yPos);
      yPos += 5;
    }
    if (selectedOnly) {
      doc.text(`Tanlangan: ${data.length} ta`, 14, yPos);
      yPos += 5;
    }
  }

  // Prepare table data
  const tableData = data.map((item) => [
    formatDate(item.date),
    item.invoice_id || "",
    item.store || "",
    item.product_count || 0,
    formatCurrency(item.revenue),
    formatCurrency(item.cost),
    formatCurrency(item.profit),
    `${(parseFloat(item.profit_percent) || 0).toFixed(2)}%`,
  ]);

  // Add summary row if provided
  if (summary) {
    tableData.push([
      "JAMI:",
      "",
      "",
      "",
      formatCurrency(summary.revenue),
      formatCurrency(summary.cost),
      formatCurrency(summary.total),
      "",
    ]);
  }

  // Create table
  autoTable(doc, {
    startY: filters ? 30 : 22,
    head: [
      [
        "Sana",
        "Invoice ID",
        "Do'kon",
        "Mahsulotlar",
        "Daromad",
        "Xarajat",
        "Foyda",
        "Foyda %",
      ],
    ],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
      fontStyle: "bold",
    },
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 55 }, // Increased Invoice ID width
      2: { cellWidth: 30 },
      3: { cellWidth: 25, halign: "center" },
      4: { cellWidth: 30, halign: "right" },
      5: { cellWidth: 30, halign: "right" },
      6: { cellWidth: 30, halign: "right" },
      7: { cellWidth: 25, halign: "right" },
    },
    margin: { top: filters ? 30 : 22, left: 14, right: 14 },
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Sahifa ${i} / ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
    doc.text(
      new Date().toLocaleString("uz-UZ"),
      doc.internal.pageSize.getWidth() - 14,
      doc.internal.pageSize.getHeight() - 10,
      { align: "right" }
    );
  }

  // Save PDF
  doc.save(generateFilename("Foyda_ro'yxati", "pdf"));
};

