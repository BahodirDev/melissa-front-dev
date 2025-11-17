import React, { useState, useEffect } from "react";
import { Download, ArrowLeft, FileCsv, FilePdf } from "@phosphor-icons/react";
import DataTable from "../components/DataTable";
import { get } from "../../../customHook/api";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./DebtLedger.css";

/**
 * DebtLedger - Client debt ledger/history view
 * @param {string} clientId - Client ID
 * @param {Object} client - Client data
 * @param {Function} onBack - Back handler
 * @param {Function} onRecordPayment - Handler to record payment
 * @param {boolean} darkMode - Dark mode flag
 */
function DebtLedger({
  clientId,
  client,
  onBack,
  onRecordPayment,
  darkMode = false,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    from: null,
    to: null,
    type: null,
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("uz-UZ", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Build query string
      const queryParams = new URLSearchParams();
      if (filters.from) {
        // Convert to ISO string if it's a Date object
        const fromDate =
          filters.from instanceof Date
            ? filters.from.toISOString()
            : filters.from;
        queryParams.append("from", fromDate);
      }
      if (filters.to) {
        // Convert to ISO string if it's a Date object
        const toDate =
          filters.to instanceof Date ? filters.to.toISOString() : filters.to;
        queryParams.append("to", toDate);
      }
      if (filters.type) queryParams.append("type", filters.type);

      const queryString = queryParams.toString();
      const endpoint = `/client-debts/ledger/${clientId}${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await get(endpoint);

      if (response?.status === 200 || response?.status === 201) {
        // Backend returns: {status: 200, data: {client_id, client_name, balance, history: [...]}}
        // Axios response: response.data = {status: 200, data: {...}}
        // So the actual data is at: response.data.data
        const ledgerData = response.data?.data || response.data;
        setData(ledgerData);
      } else {
        setError("Ma'lumotlarni yuklashda xatolik");
        toast.error("Ma'lumotlarni yuklashda xatolik");
      }
    } catch (err) {
      setError("Ma'lumotlarni yuklashda xatolik");
      toast.error("Ma'lumotlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (clientId) {
      loadData();
    }
  }, [clientId, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleDateRangeChange = (range) => {
    setFilters((prev) => ({
      ...prev,
      from: range.from || null,
      to: range.to || null,
    }));
  };

  const handleExport = (format) => {
    if (!data || !data.history || data.history.length === 0) {
      toast.warning("Eksport qilish uchun ma'lumot mavjud emas");
      return;
    }

    try {
      if (format === "csv") {
        exportToCSV(data);
        toast.success("CSV formatida yuklab olindi");
      } else if (format === "pdf") {
        exportToPDF(data, client);
        toast.success("PDF formatida yuklab olindi");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Eksport qilishda xatolik yuz berdi");
    }
  };

  const exportToCSV = (ledgerData) => {
    const headers = ["Sana", "Turi", "Summa", "Qoldiq", "Izoh", "Operator"];
    const rows = ledgerData.history.map((item) => {
      const typeLabels = {
        sale: "Sotuv",
        payment: "To'lov",
        writeoff: "Yozib olish",
      };
      const isNegative = item.type === "payment" || item.type === "writeoff";
      const amount = `${isNegative ? "-" : "+"}${formatCurrency(
        item.amount
      )} so'm`;

      return [
        formatDate(item.date),
        typeLabels[item.type] || item.type,
        amount,
        `${formatCurrency(item.balance_after)} so'm`,
        item.note || "",
        item.operator || "",
      ];
    });

    const csvContent = [
      `Mijoz: ${ledgerData.client_name || client?.name || ""}`,
      `Joriy qoldiq: ${formatCurrency(ledgerData.balance)} so'm`,
      "",
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;
    const formattedTime = `${now.getHours().toString().padStart(2, "0")}-${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}-${now.getSeconds().toString().padStart(2, "0")}`;
    link.setAttribute(
      "download",
      `Qarz_tarixi_${
        ledgerData.client_name || "mijoz"
      }_${formattedDate}_${formattedTime}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = (ledgerData, clientInfo) => {
    const doc = new jsPDF("portrait", "mm", "a4");

    // Header
    doc.setFontSize(18);
    doc.text(
      `Qarz Tarixi: ${ledgerData.client_name || clientInfo?.name || "Mijoz"}`,
      14,
      15
    );

    let yPos = 25;
    doc.setFontSize(10);
    doc.text(
      `Joriy qoldiq: ${formatCurrency(ledgerData.balance)} so'm`,
      14,
      yPos
    );
    yPos += 10;

    // Table data
    const tableData = ledgerData.history.map((item) => {
      const typeLabels = {
        sale: "Sotuv",
        payment: "To'lov",
        writeoff: "Yozib olish",
      };
      const isNegative = item.type === "payment" || item.type === "writeoff";
      const amount = `${isNegative ? "-" : "+"}${formatCurrency(
        item.amount
      )} so'm`;

      return [
        formatDate(item.date),
        typeLabels[item.type] || item.type,
        amount,
        formatCurrency(item.balance_after) + " so'm",
        item.note || "",
        item.operator || "",
      ];
    });

    autoTable(doc, {
      startY: yPos,
      head: [["Sana", "Turi", "Summa", "Qoldiq", "Izoh", "Operator"]],
      body: tableData,
      theme: "striped",
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        fontStyle: "bold",
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 25, halign: "center" },
        2: { cellWidth: 35, halign: "right" },
        3: { cellWidth: 35, halign: "right" },
        4: { cellWidth: 30 },
        5: { cellWidth: 30 },
      },
      margin: { top: yPos, left: 14, right: 14 },
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

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;
    const formattedTime = `${now.getHours().toString().padStart(2, "0")}-${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}-${now.getSeconds().toString().padStart(2, "0")}`;
    const filename = `Qarz_tarixi_${
      ledgerData.client_name || "mijoz"
    }_${formattedDate}_${formattedTime}.pdf`;

    doc.save(filename);
  };

  const columns = [
    {
      key: "date",
      label: "Sana",
      sortable: false,
      render: (value) => formatDate(value),
    },
    {
      key: "type",
      label: "Turi",
      sortable: false,
      render: (value) => {
        const labels = {
          sale: "Sotuv",
          payment: "To'lov",
          writeoff: "Yozib olish",
        };
        return (
          <span className={`ledger-type ledger-type-${value}`}>
            {labels[value] || value}
          </span>
        );
      },
    },
    {
      key: "amount",
      label: "Summa",
      sortable: false,
      render: (value, row) => {
        const isNegative = row.type === "payment" || row.type === "writeoff";
        return (
          <span
            className={`ledger-amount ${isNegative ? "negative" : "positive"}`}
          >
            {isNegative ? "-" : "+"}
            {formatCurrency(value)} so'm
          </span>
        );
      },
    },
    {
      key: "balance_after",
      label: "Qoldiq",
      sortable: false,
      render: (value) => formatCurrency(value) + " so'm",
    },
    {
      key: "note",
      label: "Izoh",
      sortable: false,
    },
    {
      key: "operator",
      label: "Operator",
      sortable: false,
    },
  ];

  if (!clientId) return null;

  return (
    <div className={`debt-ledger ${darkMode ? "dark" : ""}`}>
      <div className="debt-ledger-header">
        <button
          type="button"
          className="debt-ledger-back"
          onClick={onBack}
          aria-label="Orqaga"
        >
          <ArrowLeft size={20} />
          Orqaga
        </button>
        <div className="debt-ledger-info">
          <h2 className="debt-ledger-title">{client?.name || "Mijoz"}</h2>
          {data && (
            <div className="debt-ledger-balance">
              <span className="debt-ledger-balance-label">Joriy qoldiq:</span>
              <span
                className={`debt-ledger-balance-value ${
                  data.balance > 0 ? "has-debt" : "cleared"
                }`}
              >
                {formatCurrency(data.balance)} so'm
              </span>
            </div>
          )}
        </div>
        <div className="debt-ledger-export-buttons">
          <button
            type="button"
            className="debt-ledger-export-btn"
            onClick={() => handleExport("csv")}
            aria-label="CSV ga eksport qilish"
            title="CSV formatida yuklab olish"
          >
            <FileCsv size={18} />
            CSV
          </button>
          <button
            type="button"
            className="debt-ledger-export-btn"
            onClick={() => handleExport("pdf")}
            aria-label="PDF ga eksport qilish"
            title="PDF formatida yuklab olish"
          >
            <FilePdf size={18} />
            PDF
          </button>
        </div>
      </div>

      <div className="debt-ledger-filters">
        <div className="debt-ledger-date-wrapper">
          <label className="debt-ledger-inline-label">Sana oralig'i</label>
          <div className="debt-ledger-date-inputs-inline">
            <div className="debt-ledger-date-input-group">
              <label htmlFor="debt-date-from" className="debt-ledger-date-input-label">Dan</label>
              <input
                id="debt-date-from"
                type="date"
                value={filters.from || ""}
                onChange={(e) => handleDateRangeChange({ from: e.target.value, to: filters.to })}
                className="debt-ledger-date-input"
              />
            </div>
            <div className="debt-ledger-date-input-group">
              <label htmlFor="debt-date-to" className="debt-ledger-date-input-label">Gacha</label>
              <input
                id="debt-date-to"
                type="date"
                value={filters.to || ""}
                onChange={(e) => handleDateRangeChange({ from: filters.from, to: e.target.value })}
                className="debt-ledger-date-input"
              />
            </div>
          </div>
        </div>
        <div className="debt-ledger-type-filter">
          <label>Turi</label>
          <select
            value={filters.type || ""}
            onChange={(e) => handleFilterChange("type", e.target.value || null)}
            className="debt-ledger-select"
          >
            <option value="">Barchasi</option>
            <option value="sale">Sotuv</option>
            <option value="payment">To'lov</option>
            <option value="writeoff">Yozib olish</option>
          </select>
        </div>
        {data && data.balance > 0 && (
          <button
            type="button"
            className="debt-ledger-payment-btn"
            onClick={() =>
              onRecordPayment && onRecordPayment(clientId, client, data.balance)
            }
          >
            To'lov qayd etish
          </button>
        )}
      </div>

      {error && (
        <div className="debt-ledger-error" role="alert">
          {error}
          <button type="button" onClick={loadData}>
            Qayta urinish
          </button>
        </div>
      )}

      {!loading && !error && data && (
        <DataTable
          columns={columns}
          data={data.history}
          loading={loading}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}

export default DebtLedger;
