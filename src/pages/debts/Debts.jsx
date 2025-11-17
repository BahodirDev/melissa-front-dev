import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import DashboardWidget from "./profit/DashboardWidget";
import ProfitList from "./profit/ProfitList";
import ProfitDetailModal from "./profit/ProfitDetailModal";
import DebtList from "./debt/DebtList";
import DebtLedger from "./debt/DebtLedger";
import RecordPaymentModal from "./debt/RecordPaymentModal";
import "./debts.css";

function Debts() {
  const [
    inputRef,
    showDropdown,
    setshowDropdown,
    addModalVisible,
    setAddModalVisible,
    addModalDisplay,
    setAddModalDisplay,
    miniModal,
    setMiniModal,
    sidebar,
    userInfo,
    darkMode,
  ] = useOutletContext();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { client } = useSelector((state) => state);

  // View state
  const [view, setView] = useState("dashboard"); // 'dashboard', 'profit', 'debt'
  const [period, setPeriod] = useState("today"); // 'today', 'week', 'month', 'period'

  // Profit state
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [profitDetailOpen, setProfitDetailOpen] = useState(false);

  // Debt state
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [debtLedgerOpen, setDebtLedgerOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentOutstanding, setPaymentOutstanding] = useState(0);

  // Check if user is admin (role === 1)
  const isAdmin = localStorage.getItem("role") === "1";

  useEffect(() => {
    if (localStorage.getItem("role") !== "1") {
      navigate("/*");
    }
    const savedView = localStorage.getItem("debt-section");
    if (savedView) {
      setView(savedView);
    }
  }, [navigate]);

  const handleProfitClick = () => {
    setView("profit");
    localStorage.setItem("debt-section", "profit");
  };

  const handleDebtClick = () => {
    setView("debt");
    localStorage.setItem("debt-section", "debt");
  };

  const handleViewChange = (newView) => {
    setView(newView);
    localStorage.setItem("debt-section", newView);
  };

  const handleProfitRowClick = (row) => {
    setSelectedInvoice(row.invoice_id);
    setProfitDetailOpen(true);
  };

  const handleProfitAdjust = (invoiceId, data) => {
    // Open adjust modal (to be implemented)
    toast.info("Foyda tahrirlash funksiyasi keyinchalik qo'shiladi");
  };

  const handleViewLedger = (clientId, client) => {
    setSelectedClientId(clientId);
    setSelectedClient(client);
    setDebtLedgerOpen(true);
  };

  const handleRecordPayment = (clientId, client, outstanding) => {
    setSelectedClientId(clientId);
    setSelectedClient(client);
    setPaymentOutstanding(outstanding || client?.outstanding || 0);
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    // Refresh debt list if on debt view
    if (view === "debt") {
      // Force reload by toggling view
      setView("debt");
    }
    // Refresh ledger if open
    if (debtLedgerOpen) {
      setDebtLedgerOpen(false);
      setTimeout(() => {
        setDebtLedgerOpen(true);
      }, 100);
    }
  };

  return (
    <>
      <div className={`debt-switch ${darkMode ? "dark" : null}`}>
        <button
          type="button"
          onClick={() => handleViewChange("dashboard")}
          className={view === "dashboard" ? "active" : null}
          aria-label="Dashboard"
          aria-pressed={view === "dashboard"}
        >
          Dashboard
        </button>
        <button
          type="button"
          onClick={() => handleViewChange("profit")}
          className={view === "profit" ? "active" : null}
          aria-label="Foyda"
          aria-pressed={view === "profit"}
        >
          Foyda
        </button>
        <button
          type="button"
          onClick={() => handleViewChange("debt")}
          className={view === "debt" ? "active" : null}
          aria-label="Qarz"
          aria-pressed={view === "debt"}
        >
          Qarz
        </button>
      </div>

      {view === "dashboard" && (
        <div className="debts-dashboard">
          <div className="debts-dashboard-period">
            <button
              type="button"
              className={period === "today" ? "active" : ""}
              onClick={() => setPeriod("today")}
            >
              Bugun
            </button>
            <button
              type="button"
              className={period === "week" ? "active" : ""}
              onClick={() => setPeriod("week")}
            >
              Hafta
            </button>
            <button
              type="button"
              className={period === "month" ? "active" : ""}
              onClick={() => setPeriod("month")}
            >
              Oy
            </button>
            <button
              type="button"
              className={period === "year" ? "active" : ""}
              onClick={() => setPeriod("year")}
            >
              Yil
            </button>
            <button
              type="button"
              className={period === "period" ? "active" : ""}
              onClick={() => setPeriod("period")}
            >
              Davr
            </button>
          </div>
          <DashboardWidget
            onProfitClick={handleProfitClick}
            onDebtClick={handleDebtClick}
            period={period}
            darkMode={darkMode}
          />
        </div>
      )}

      {view === "profit" && (
        <ProfitList onRowClick={handleProfitRowClick} darkMode={darkMode} />
      )}

      {view === "debt" && !debtLedgerOpen && (
        <DebtList
          onViewLedger={handleViewLedger}
          onRecordPayment={handleRecordPayment}
          clients={
            client?.data?.map((c) => ({
              client_id: c.clients_id,
              id: c.clients_id,
              name: c.clients_name,
              clients_name: c.clients_name,
              phone: c.clients_nomer,
              clients_nomer: c.clients_nomer,
            })) || []
          }
          darkMode={darkMode}
        />
      )}

      {view === "debt" && debtLedgerOpen && (
        <DebtLedger
          clientId={selectedClientId}
          client={selectedClient}
          onBack={() => setDebtLedgerOpen(false)}
          onRecordPayment={handleRecordPayment}
          darkMode={darkMode}
        />
      )}

      {/* Profit Detail Modal */}
      <ProfitDetailModal
        invoiceId={selectedInvoice}
        open={profitDetailOpen}
        onClose={() => {
          setProfitDetailOpen(false);
          setSelectedInvoice(null);
        }}
        onAdjust={handleProfitAdjust}
        isAdmin={isAdmin}
        darkMode={darkMode}
      />

      {/* Record Payment Modal */}
      <RecordPaymentModal
        clientId={selectedClientId}
        client={selectedClient}
        outstanding={paymentOutstanding}
        open={paymentModalOpen}
        onClose={() => {
          setPaymentModalOpen(false);
          setSelectedClientId(null);
          setSelectedClient(null);
          setPaymentOutstanding(0);
        }}
        onSuccess={handlePaymentSuccess}
        darkMode={darkMode}
      />
    </>
  );
}

export default Debts;
