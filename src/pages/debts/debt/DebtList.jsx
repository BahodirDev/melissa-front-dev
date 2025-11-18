import React, { useState, useEffect } from "react";
import {
  MagnifyingGlass,
  Eye,
  CurrencyDollar,
  Bell,
  Plus,
  Info,
  Trash,
} from "@phosphor-icons/react";
import DataTable from "../components/DataTable";
import EmptyState from "../components/EmptyState";
import CreateDebtModal from "./CreateDebtModal";
import { get, post, remove } from "../../../customHook/api";
import { toast } from "react-toastify";
import { debtDeleteConfirm } from "../../../components/delete_modal/delete_modal";
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
      // Build query string
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (filters.filter && filters.filter !== "all") {
        queryParams.append("filter", filters.filter);
      }

      if (filters.search) {
        queryParams.append("search", filters.search);
      }

      const response = await get(
        `/client-debts/list?${queryParams.toString()}`
      );

      // Debug: Log the response structure
      console.log("DebtList - Full response:", {
        httpStatus: response?.status,
        hasResponseData: !!response?.data,
        responseDataType: typeof response?.data,
        hasNestedData: !!response?.data?.data,
        nestedDataType: typeof response?.data?.data,
        hasNestedNestedData: !!response?.data?.data?.data,
        nestedNestedDataType: Array.isArray(response?.data?.data?.data)
          ? "array"
          : typeof response?.data?.data?.data,
      });

      if (response?.status === 200 || response?.status === 201) {
        // Backend returns: {status: 200, data: {page, limit, total, debts, data: [...]}}
        // Axios response: response.data = {status: 200, data: {...}}
        // So the array is at: response.data.data.data
        let responseData = [];
        let totalCount = 0;

        // Primary check: response.data.data.data (nested structure from backend)
        if (
          response.data?.data?.data &&
          Array.isArray(response.data.data.data)
        ) {
          responseData = response.data.data.data;
          totalCount =
            response.data.data?.total ||
            response.data.data?.debts ||
            responseData.length;
          console.log(
            "DebtList - Using nested structure (response.data.data.data)",
            responseData.length,
            "items"
          );
        }
        // Fallback: response.data.data (if backend returns data directly)
        else if (Array.isArray(response.data?.data)) {
          responseData = response.data.data;
          totalCount =
            response.data?.total || response.data?.debts || responseData.length;
          console.log(
            "DebtList - Using direct array (response.data.data)",
            responseData.length,
            "items"
          );
        }
        // Fallback: response.data (if backend returns array directly)
        else if (Array.isArray(response.data)) {
          responseData = response.data;
          totalCount = responseData.length;
          console.log(
            "DebtList - Using flat array (response.data)",
            responseData.length,
            "items"
          );
        } else {
          console.error(
            "DebtList - Could not find data array in response:",
            response
          );
        }

        setData(responseData);
        setPagination((prev) => ({
          ...prev,
          total: totalCount,
        }));
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
    loadData();
  }, [filters, pagination.page, pagination.limit]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSendReminder = async (client) => {
    if (!client || !client.client_id) {
      toast.error("Mijoz ma'lumotlari topilmadi");
      return;
    }

    try {
      const response = await post(
        `/client-debts/reminder/${client.client_id}`,
        {}
      );

      if (response?.status === 200 || response?.status === 201) {
        const responseData = response.data?.data || response.data;
        toast.success(
          `${
            responseData.client_name || client.name
          } ga eslatma muvaffaqiyatli yuborildi`
        );
      } else {
        const errorMessage =
          response.data?.message || "Eslatma yuborishda xatolik";
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error("Error sending reminder:", err);
      toast.error("Eslatma yuborishda xatolik yuz berdi");
    }
  };

  const handleDeleteDebt = (e, debt) => {
    if (!debt || !debt.client_debt_id) {
      toast.error("Qarz ma'lumotlari topilmadi");
      return;
    }

    const deleteAction = async () => {
      try {
        const response = await remove(`/client-debts/${debt.client_debt_id}`);

        if (response?.status === 200 || response?.status === 201) {
          toast.success("Qarz muvaffaqiyatli o'chirildi");
          // Reload the list
          loadData();
        } else {
          const errorMessage =
            response.data?.message ||
            response.data?.error ||
            "Qarzni o'chirishda xatolik";
          toast.error(errorMessage);
        }
      } catch (err) {
        console.error("Error deleting debt:", err);
        toast.error("Qarzni o'chirishda xatolik yuz berdi");
      }
    };

    debtDeleteConfirm(e, debt.name, debt.outstanding, deleteAction, darkMode);
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
        {row.client_debt_id && (
          <button
            type="button"
            className="debt-list-action-btn debt-list-action-btn-danger"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteDebt(e, row);
            }}
            aria-label={`${row.name} uchun qarzni o'chirish`}
            title="Qarzni o'chirish"
          >
            <Trash size={18} />
          </button>
        )}
      </div>
    );
  };

  const handleCreateDebtSuccess = (responseData) => {
    // Reset to first page
    setPagination((prev) => ({ ...prev, page: 1, total: 0 }));
    // Small delay to ensure backend has processed the new debt, then reload
    setTimeout(() => {
      // Force reload by calling loadData directly with page 1
      const queryParams = new URLSearchParams({
        page: "1",
        limit: pagination.limit.toString(),
      });

      if (filters.filter && filters.filter !== "all") {
        queryParams.append("filter", filters.filter);
      }

      if (filters.search) {
        queryParams.append("search", filters.search);
      }

      get(`/client-debts/list?${queryParams.toString()}`)
        .then((response) => {
          if (response?.status === 200 || response?.status === 201) {
            // Backend returns: {status: 200, data: {page, limit, total, debts, data: [...]}}
            // Axios response: response.data = {status: 200, data: {...}}
            // So the array is at: response.data.data.data
            let responseData = [];
            let totalCount = 0;

            // Primary check: response.data.data.data (nested structure from backend)
            if (
              response.data?.data?.data &&
              Array.isArray(response.data.data.data)
            ) {
              responseData = response.data.data.data;
              totalCount =
                response.data.data?.total ||
                response.data.data?.debts ||
                responseData.length;
            }
            // Fallback: response.data.data (if backend returns data directly)
            else if (Array.isArray(response.data?.data)) {
              responseData = response.data.data;
              totalCount =
                response.data?.total ||
                response.data?.debts ||
                responseData.length;
            }
            // Fallback: response.data (if backend returns array directly)
            else if (Array.isArray(response.data)) {
              responseData = response.data;
              totalCount = responseData.length;
            }

            setData(responseData);
            setPagination((prev) => ({
              ...prev,
              total: totalCount,
            }));
          }
        })
        .catch((err) => {
          console.error("Error refreshing debt list:", err);
        });
    }, 300);
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
            <MagnifyingGlass size={20} />
            <input
              type="text"
              placeholder="Mijoz nomi yoki telefon bo'yicha qidirish..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="debt-list-search-input"
            />
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
