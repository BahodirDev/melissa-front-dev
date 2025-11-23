import React, { useState, useEffect } from "react";
import {
  FilePdf,
  FileCsv,
  Info,
  TrendUp,
  TrendDown,
} from "@phosphor-icons/react";
import DataTable from "../components/DataTable";
import EmptyState from "../components/EmptyState";
import MetricCard from "../components/MetricCard";
import { get } from "../../../customHook/api";
import { Select } from "antd";
import { toast } from "react-toastify";
import { exportToCSV, exportToPDF } from "../utils/exportUtils";
import "./ProfitList.css";

/**
 * ProfitList - Profit list with filters, search, and table
 * @param {Function} onRowClick - Handler when row is clicked
 * @param {boolean} darkMode - Dark mode flag
 */
function ProfitList({ onRowClick, darkMode = false }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    from: null,
    to: null,
    store: null,
    minProfit: null,
    search: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [summary, setSummary] = useState({ total: 0, revenue: 0, cost: 0 });
  const [stores, setStores] = useState([]);

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
    });
  };

  const loadStores = async () => {
    try {
      const response = await get("/store/store-list");
      if (response?.status === 200 || response?.status === 201) {
        const storesData = response.data?.data || response.data || [];
        setStores(storesData.map(store => ({
          value: store.store_name,
          label: store.store_name
        })));
      }
    } catch (err) {
      console.error("Stores load error:", err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sortBy: sortBy,
        sortOrder: sortOrder,
      });

      if (filters.from) {
        const fromDate = filters.from instanceof Date ? filters.from.toISOString() : filters.from;
        queryParams.append("from", fromDate);
      }
      if (filters.to) {
        const toDate = filters.to instanceof Date ? filters.to.toISOString() : filters.to;
        queryParams.append("to", toDate);
      }
      if (filters.store) {
        queryParams.append("store", filters.store);
      }
      if (filters.minProfit) {
        queryParams.append("minProfit", filters.minProfit.toString());
      }
      if (filters.search) {
        queryParams.append("search", filters.search);
      }

      const response = await get(`/profit/list?${queryParams.toString()}`);
      
      if (response?.status === 200 || response?.status === 201) {
        // Ensure we always have an array
        let responseData = [];
        if (Array.isArray(response.data?.data)) {
          responseData = response.data.data;
        } else if (Array.isArray(response.data)) {
          responseData = response.data;
        } else if (response.data && typeof response.data === 'object' && Array.isArray(response.data.data)) {
          responseData = response.data.data;
        }
        setData(responseData);
        setPagination((prev) => ({
          ...prev,
          total: response.data?.total || responseData.length,
        }));

        // Calculate summary
        const totals = responseData.reduce(
          (acc, item) => ({
            total: acc.total + parseFloat(item.profit || 0),
            revenue: acc.revenue + parseFloat(item.revenue || 0),
            cost: acc.cost + parseFloat(item.cost || 0),
          }),
          { total: 0, revenue: 0, cost: 0 }
        );
        setSummary(totals);
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
    loadStores();
  }, []);

  useEffect(() => {
    loadData();
  }, [filters, pagination.page, pagination.limit, sortBy, sortOrder]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleDateRangeChange = (range) => {
    setFilters((prev) => ({
      ...prev,
      from: range.from || null,
      to: range.to || null,
    }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSort = (key, order) => {
    setSortBy(key);
    setSortOrder(order);
  };

  const handleExport = async (format) => {
    try {
      if (!data || data.length === 0) {
        toast.warning("Eksport qilish uchun ma'lumot mavjud emas");
        return;
      }

      if (format === "csv") {
        exportToCSV(data, summary, false);
        toast.success(
          `${data.length} ta yozuv CSV formatida yuklab olindi`
        );
      } else if (format === "pdf") {
        exportToPDF(data, summary, filters, false);
        toast.success(
          `${data.length} ta yozuv PDF formatida yuklab olindi`
        );
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Eksport qilishda xatolik yuz berdi");
    }
  };

  const columns = [
    {
      key: "date",
      label: "Sana",
      sortable: true,
      render: (value) => formatDate(value),
    },
    {
      key: "invoice_id",
      label: "Invoice ID",
      sortable: false,
    },
    {
      key: "store",
      label: "Do'kon",
      sortable: false,
    },
    {
      key: "product_count",
      label: "Mahsulotlar",
      sortable: false,
    },
    {
      key: "revenue",
      label: "Daromad",
      sortable: true,
      render: (value) => `${formatCurrency(value)} so'm`,
    },
    {
      key: "cost",
      label: "Xarajat",
      sortable: true,
      render: (value) => `${formatCurrency(value)} so'm`,
    },
    {
      key: "profit",
      label: "Foyda",
      sortable: true,
      render: (value) => (
        <span className="profit-value positive">
          {formatCurrency(value)} so'm
        </span>
      ),
    },
    {
      key: "profit_percent",
      label: "Foyda %",
      sortable: true,
      render: (value) => {
        const numValue = parseFloat(value) || 0;
        return (
          <span
            className={`profit-percent ${
              numValue >= 20 ? "high" : numValue >= 10 ? "medium" : "low"
            }`}
          >
            {numValue >= 20 ? (
              <TrendUp size={14} />
            ) : numValue < 10 ? (
              <TrendDown size={14} />
            ) : null}
            {numValue.toFixed(1)}%
          </span>
        );
      },
    },
  ];

  return (
    <div className={`profit-list ${darkMode ? "dark" : ""}`}>
      {/* Summary Cards */}
      {!loading && data.length > 0 && (
        <div className="profit-list-summary">
          <div className="profit-list-summary-title">
            <h3>Jami ko'rsatkichlar</h3>
            <div
              className="profit-list-summary-help"
              title="Bu ko'rsatkichlar joriy sahifadagi ma'lumotlar asosida hisoblanadi"
            >
              <Info size={16} />
            </div>
          </div>
          <div className="profit-list-summary-cards">
            <MetricCard
              title="Jami foyda"
              value={summary.total}
              color="success"
              darkMode={darkMode}
              isCurrency={true}
            />
            <MetricCard
              title="Jami daromad"
              value={summary.revenue}
              color="primary"
              darkMode={darkMode}
              isCurrency={true}
            />
            <MetricCard
              title="Jami xarajat"
              value={summary.cost}
              color="primary"
              darkMode={darkMode}
              isCurrency={true}
            />
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="profit-list-filters">
        <div className="profit-list-filters-header">
          <h3>Filtrlar</h3>
          <button
            type="button"
            className="profit-list-clear-filters"
            onClick={() => {
              setFilters({
                from: null,
                to: null,
                store: null,
                minProfit: null,
                search: "",
              });
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            disabled={
              !filters.from &&
              !filters.to &&
              !filters.store &&
              !filters.minProfit &&
              !filters.search
            }
          >
            Filtrlarni tozalash
          </button>
        </div>
        <div className="profit-list-filters-row">
          <div className="profit-list-filters-inline">
            <div className="profit-list-date-wrapper">
              <label className="profit-list-inline-label">
                Sana oralig'i
                <span
                  className="profit-list-filter-help"
                  title="Foyda ma'lumotlarini qaysi davr uchun ko'rsatish"
                >
                  <Info size={14} />
                </span>
              </label>
              <div className="profit-list-date-inputs-inline">
                <div className="profit-list-date-input-group">
                  <label htmlFor="date-from-inline" className="profit-list-date-input-label">Dan</label>
                  <input
                    id="date-from-inline"
                    type="date"
                    value={filters.from || ""}
                    onChange={(e) => handleDateRangeChange({ from: e.target.value, to: filters.to })}
                    className="profit-list-date-input"
                  />
                </div>
                <div className="profit-list-date-input-group">
                  <label htmlFor="date-to-inline" className="profit-list-date-input-label">Gacha</label>
                  <input
                    id="date-to-inline"
                    type="date"
                    value={filters.to || ""}
                    onChange={(e) => handleDateRangeChange({ from: filters.from, to: e.target.value })}
                    className="profit-list-date-input"
                  />
                </div>
              </div>
            </div>
            <div className="profit-list-filter-item-inline">
              <label>
                Do'kon
                <span
                  className="profit-list-filter-help"
                  title="Ma'lum bir do'kon uchun foyda ma'lumotlarini ko'rsatish"
                >
                  <Info size={14} />
                </span>
              </label>
              <Select
                placeholder="Barcha do'konlar"
                className="profit-list-select"
                value={filters.store}
                onChange={(value) => handleFilterChange("store", value)}
                allowClear
              >
                {stores.map((store) => (
                  <Select.Option key={store.value} value={store.value}>
                    {store.label}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <div className="profit-list-filter-item-inline">
              <label>
                Minimal foyda
                <span
                  className="profit-list-filter-help"
                  title="Faqat shu summa va undan yuqori foyda ko'rsatkichlarini ko'rsatish"
                >
                  <Info size={14} />
                </span>
              </label>
              <input
                type="number"
                className="profit-list-input"
                placeholder="Masalan: 100000"
                value={filters.minProfit || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "minProfit",
                    e.target.value ? Number(e.target.value) : null
                  )
                }
              />
            </div>
          </div>
        </div>
        <div className="profit-list-filters-row profit-list-filters-actions">
          <div className="profit-list-actions">
            <button
              type="button"
              className="profit-list-action-btn profit-list-action-btn-primary"
              onClick={() => handleExport("pdf")}
              aria-label="PDF ga eksport qilish"
              title="Barcha ma'lumotlarni PDF formatida yuklab olish"
            >
              <FilePdf size={18} />
              PDF
            </button>
            <button
              type="button"
              className="profit-list-action-btn profit-list-action-btn-primary"
              onClick={() => handleExport("csv")}
              aria-label="CSV ga eksport qilish"
              title="Barcha ma'lumotlarni CSV formatida yuklab olish"
            >
              <FileCsv size={18} />
              CSV
            </button>
          </div>
          <div className="profit-list-info">
            <span className="profit-list-info-text">
              Jami: <strong>{pagination.total}</strong> ta foyda yozuvi
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="profit-list-error" role="alert">
          {error}
          <button type="button" onClick={loadData}>
            Qayta urinish
          </button>
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <EmptyState
          title="Foyda topilmadi"
          description="Tanlangan filtrlarda foyda ma'lumotlari mavjud emas"
          darkMode={darkMode}
        />
      )}

      {!error && (
        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          onSort={handleSort}
          onRowClick={onRowClick}
          darkMode={darkMode}
        />
      )}

      {pagination.total > pagination.limit && (
        <div className="profit-list-pagination">
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
    </div>
  );
}

export default ProfitList;
