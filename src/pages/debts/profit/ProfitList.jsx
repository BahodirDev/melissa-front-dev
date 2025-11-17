import React, { useState, useEffect } from "react";
import {
  Search,
  Download,
  FilePdf,
  FileCsv,
  Info,
  TrendUp,
  TrendDown,
} from "@phosphor-icons/react";
import DataTable from "../components/DataTable";
import DateRangePicker from "../components/DateRangePicker";
import EmptyState from "../components/EmptyState";
import MetricCard from "../components/MetricCard";
import { profitApi, getStores } from "../services/mockApi";
import { Select } from "antd";
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
  const [selectedRows, setSelectedRows] = useState([]);
  const [summary, setSummary] = useState({ total: 0, revenue: 0, cost: 0 });

  const stores = getStores();

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

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await profitApi.getList({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
        sortBy,
        sortOrder,
      });
      if (response.status === 200) {
        setData(response.data.data);
        setPagination((prev) => ({
          ...prev,
          total: response.data.total,
        }));

        // Calculate summary
        const totals = response.data.data.reduce(
          (acc, item) => ({
            total: acc.total + item.profit,
            revenue: acc.revenue + item.revenue,
            cost: acc.cost + item.cost,
          }),
          { total: 0, revenue: 0, cost: 0 }
        );
        setSummary(totals);
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

  const handleExport = (format) => {
    // Mock export
    console.log(
      `Exporting to ${format}`,
      selectedRows.length > 0 ? selectedRows : "all"
    );
    // In real app, this would call an API
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
      render: (value) => (
        <span
          className={`profit-percent ${
            value >= 30 ? "high" : value >= 15 ? "medium" : "low"
          }`}
        >
          {value >= 30 ? (
            <TrendUp size={14} />
          ) : value < 15 ? (
            <TrendDown size={14} />
          ) : null}
          {value.toFixed(1)}%
        </span>
      ),
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
            />
            <MetricCard
              title="Jami daromad"
              value={summary.revenue}
              color="primary"
              darkMode={darkMode}
            />
            <MetricCard
              title="Jami xarajat"
              value={summary.cost}
              color="primary"
              darkMode={darkMode}
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
          <div className="profit-list-filter-group">
            <label>
              Sana oralig'i
              <span
                className="profit-list-filter-help"
                title="Foyda ma'lumotlarini qaysi davr uchun ko'rsatish"
              >
                <Info size={14} />
              </span>
            </label>
            <DateRangePicker
              value={{ from: filters.from, to: filters.to }}
              onChange={handleDateRangeChange}
              darkMode={darkMode}
            />
          </div>
          <div className="profit-list-filter-group">
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
          <div className="profit-list-filter-group">
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
        <div className="profit-list-filters-row profit-list-filters-actions">
          <div className="profit-list-actions">
            {selectedRows.length > 0 && (
              <button
                type="button"
                className="profit-list-action-btn profit-list-action-btn-secondary"
                onClick={() => handleExport("csv")}
                aria-label="Tanlanganlarni CSV ga eksport qilish"
                title={`${selectedRows.length} ta tanlangan elementni eksport qilish`}
              >
                <FileCsv size={18} />
                CSV ({selectedRows.length})
              </button>
            )}
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
              <Download size={18} />
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
          selectable={true}
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
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
