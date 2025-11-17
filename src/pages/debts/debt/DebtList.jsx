import React, { useState, useEffect } from "react";
import {
  Search,
  Eye,
  CurrencyDollar,
  Bell,
  Plus,
  Info,
} from "@phosphor-icons/react";
import DataTable from "../components/DataTable";
import EmptyState from "../components/EmptyState";
import CreateDebtModal from "./CreateDebtModal";
import { debtApi } from "../services/mockApi";
import "./DebtList.css";

/**
 * DebtList - Debt list with filters and actions
 * @param {Function} onViewLedger - Handler to view client ledger
 * @param {Function} onRecordPayment - Handler to record payment
 * @param {Array} clients - List of clients (for create debt modal)
 * @param {boolean} darkMode - Dark mode flag
 */
function DebtList({
  onViewLedger,
  onRecordPayment,
  clients = [],
  darkMode = false,
}) {
  const [createDebtOpen, setCreateDebtOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    filter: null,
    search: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("uz-UZ", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await debtApi.getList({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      });
      if (response.status === 200) {
        setData(response.data.data);
        setPagination((prev) => ({
          ...prev,
          total: response.data.total,
        }));
      } else {
        setError("Ma'lumotlarni yuklashda xatolik");
      }
    } catch (err) {
      setError("Ma'lumotlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters, pagination.page, pagination.limit]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSendReminder = (client) => {
    // Mock reminder
    console.log("Sending reminder to:", client.name);
    // In real app, this would call an API
  };

  const columns = [
    {
      key: "name",
      label: "Mijoz nomi",
      sortable: false,
    },
    {
      key: "phone",
      label: "Telefon",
      sortable: false,
    },
    {
      key: "outstanding",
      label: "Qarz qoldig'i",
      sortable: true,
      render: (value) => (
        <span
          className={`debt-outstanding ${value > 0 ? "has-debt" : "cleared"}`}
        >
          {formatCurrency(value)} so'm
        </span>
      ),
    },
    {
      key: "last_payment",
      label: "Oxirgi to'lov",
      sortable: false,
      render: (value) => formatDate(value),
    },
    {
      key: "overdue",
      label: "Holat",
      sortable: false,
      render: (value, row) => {
        if (row.outstanding === 0) {
          return <span className="debt-status cleared">To'landi</span>;
        }
        if (value) {
          return <span className="debt-status overdue">Muddat o'tgan</span>;
        }
        return <span className="debt-status active">Faol</span>;
      },
    },
  ];

  const renderActions = (row) => {
    return (
      <div className="debt-list-actions">
        <button
          type="button"
          className="debt-list-action-btn"
          onClick={(e) => {
            e.stopPropagation();
            onViewLedger && onViewLedger(row.client_id, row);
          }}
          aria-label={`${row.name} uchun ledger ko'rish`}
          title="Ledger ko'rish"
        >
          <Eye size={18} />
        </button>
        {row.outstanding > 0 && (
          <>
            <button
              type="button"
              className="debt-list-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                onRecordPayment && onRecordPayment(row.client_id, row);
              }}
              aria-label={`${row.name} uchun to'lov qayd etish`}
              title="To'lov qayd etish"
            >
              <CurrencyDollar size={18} />
            </button>
            <button
              type="button"
              className="debt-list-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleSendReminder(row);
              }}
              aria-label={`${row.name} ga eslatma yuborish`}
              title="Eslatma yuborish"
            >
              <Bell size={18} />
            </button>
          </>
        )}
      </div>
    );
  };

  const handleCreateDebtSuccess = () => {
    // Refresh debt list
    loadData();
  };

  return (
    <div className={`debt-list ${darkMode ? "dark" : ""}`}>
      {/* Info Banner */}
      <div className="debt-list-info-banner" role="alert">
        <div className="debt-list-info-banner-icon">
          <Info size={20} />
        </div>
        <div className="debt-list-info-banner-content">
          <strong>Qarzlar qo'lda kiritiladi</strong>
          <p>
            Hozircha barcha qarzlar qo'lda kiritiladi. Sotuv bilan bog'lanish
            funksiyasi keyinchalik qo'shiladi. Qarz qo'shish uchun "Yangi qarz
            qo'shish" tugmasini bosing.
          </p>
        </div>
      </div>

      <div className="debt-list-header">
        <h2 className="debt-list-title">Mijozlar qarzlari</h2>
        <button
          type="button"
          className="debt-list-create-btn"
          onClick={() => setCreateDebtOpen(true)}
          aria-label="Yangi qarz qo'shish"
        >
          <Plus size={20} />
          Yangi qarz qo'shish
        </button>
      </div>
      <div className="debt-list-filters">
        <div className="debt-list-filters-row">
          <div className="debt-list-search">
            {/* <Search size={20} />
						<input
							type="text"
							placeholder="Mijoz nomi yoki telefon bo'yicha qidirish..."
							value={filters.search}
							onChange={(e) => handleFilterChange("search", e.target.value)}
							className="debt-list-search-input"
						/> */}
          </div>
          <div className="debt-list-filter-buttons">
            <button
              type="button"
              className={`debt-list-filter-btn ${
                filters.filter === null ? "active" : ""
              }`}
              onClick={() => handleFilterChange("filter", null)}
            >
              Barchasi
            </button>
            <button
              type="button"
              className={`debt-list-filter-btn ${
                filters.filter === "overdue" ? "active" : ""
              }`}
              onClick={() => handleFilterChange("filter", "overdue")}
            >
              Muddat o'tgan
            </button>
            <button
              type="button"
              className={`debt-list-filter-btn ${
                filters.filter === "active" ? "active" : ""
              }`}
              onClick={() => handleFilterChange("filter", "active")}
            >
              Faol
            </button>
            <button
              type="button"
              className={`debt-list-filter-btn ${
                filters.filter === "cleared" ? "active" : ""
              }`}
              onClick={() => handleFilterChange("filter", "cleared")}
            >
              To'langan
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="debt-list-error" role="alert">
          {error}
          <button type="button" onClick={loadData}>
            Qayta urinish
          </button>
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <EmptyState
          title="Qarz topilmadi"
          description="Tanlangan filtrlarda qarz ma'lumotlari mavjud emas"
          ctaLabel="Yangi mijoz qo'shish"
          darkMode={darkMode}
        />
      )}

      {!error && (
        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          renderActions={renderActions}
          darkMode={darkMode}
        />
      )}

      {pagination.total > pagination.limit && (
        <div className="debt-list-pagination">
          <button
            type="button"
            disabled={pagination.page === 1}
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
            }
          >
            Oldingi
          </button>
          <span>
            Sahifa {pagination.page} /{" "}
            {Math.ceil(pagination.total / pagination.limit)}
          </span>
          <button
            type="button"
            disabled={
              pagination.page >= Math.ceil(pagination.total / pagination.limit)
            }
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
            }
          >
            Keyingi
          </button>
        </div>
      )}

      <CreateDebtModal
        open={createDebtOpen}
        onClose={() => setCreateDebtOpen(false)}
        onSuccess={handleCreateDebtSuccess}
        clients={clients}
        darkMode={darkMode}
      />
    </div>
  );
}

export default DebtList;
