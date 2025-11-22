import React, { useEffect, useState } from "react";
import { Select, DatePicker, Tabs } from "antd";
import { ArrowLeft, Users, CurrencyDollar, TrendUp, Package } from "@phosphor-icons/react";
import { get } from "../../customHook/api";
import { toast } from "react-toastify";
import Loader from "../../components/loader/Loader";
import InfoItem from "../../components/info_item/InfoItem";
import EmployeeSalesTable from "./EmployeeSalesTable";
import EmployeeProductBreakdown from "./EmployeeProductBreakdown";
import EmployeeClientBreakdown from "./EmployeeClientBreakdown";
import EmployeeComparison from "./EmployeeComparison";
import EmployeeAverages from "./EmployeeAverages";
import EmployeePerformanceAnalysis from "./components/EmployeePerformanceAnalysis";
import EmployeePieCharts from "./components/EmployeePieCharts";
import "./employee-performance.css";

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const EmployeePerformanceDetail = ({
  employee,
  period,
  dateRange,
  onBack,
  darkMode,
  sidebar,
}) => {
  const [currentPeriod, setCurrentPeriod] = useState(period);
  const [currentDateRange, setCurrentDateRange] = useState(dateRange);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [averages, setAverages] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [salesData, setSalesData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [clientsData, setClientsData] = useState([]);

  useEffect(() => {
    loadAllData();
  }, [employee, currentPeriod, currentDateRange]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadSummary(),
        loadComparison(),
        loadAverages(),
        loadAnalysis(),
        loadSales(),
        loadProducts(),
        loadClients(),
      ]);
    } catch (error) {
      console.error("Data load error:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSummary = async () => {
    try {
      const queryParams = new URLSearchParams({
        period: currentPeriod,
        employeeId: employee.user_id,
      });
      if (currentPeriod === "period" && currentDateRange?.length === 2) {
        queryParams.append(
          "startDate",
          currentDateRange[0].format("YYYY-MM-DD")
        );
        queryParams.append(
          "endDate",
          currentDateRange[1].format("YYYY-MM-DD")
        );
      }
      const response = await get(
        `/employee-performance/summary?${queryParams.toString()}`
      );
      if (response?.status === 200 && response.data?.data?.length > 0) {
        setSummary(response.data.data[0]);
      }
    } catch (error) {
      console.error("Summary load error:", error);
    }
  };

  const loadComparison = async () => {
    try {
      const queryParams = new URLSearchParams({ period: currentPeriod });
      if (currentPeriod === "period" && currentDateRange?.length === 2) {
        queryParams.append(
          "startDate",
          currentDateRange[0].format("YYYY-MM-DD")
        );
        queryParams.append(
          "endDate",
          currentDateRange[1].format("YYYY-MM-DD")
        );
      }
      const response = await get(
        `/employee-performance/${employee.user_id}/comparison?${queryParams.toString()}`
      );
      if (response?.status === 200) {
        setComparison(response.data);
      }
    } catch (error) {
      console.error("Comparison load error:", error);
    }
  };

  const loadAverages = async () => {
    try {
      const response = await get(
        `/employee-performance/${employee.user_id}/averages`
      );
      if (response?.status === 200) {
        setAverages(response.data.data);
      }
    } catch (error) {
      console.error("Averages load error:", error);
    }
  };

  const loadSales = async () => {
    try {
      const queryParams = new URLSearchParams({
        period: currentPeriod,
        page: "1",
        limit: "50",
      });
      if (currentPeriod === "period" && currentDateRange?.length === 2) {
        queryParams.append(
          "startDate",
          currentDateRange[0].format("YYYY-MM-DD")
        );
        queryParams.append(
          "endDate",
          currentDateRange[1].format("YYYY-MM-DD")
        );
      }
      const response = await get(
        `/employee-performance/${employee.user_id}/sales?${queryParams.toString()}`
      );
      if (response?.status === 200) {
        setSalesData(response.data.data || []);
      }
    } catch (error) {
      console.error("Sales load error:", error);
    }
  };

  const loadProducts = async () => {
    try {
      const queryParams = new URLSearchParams({ period: currentPeriod });
      if (currentPeriod === "period" && currentDateRange?.length === 2) {
        queryParams.append(
          "startDate",
          currentDateRange[0].format("YYYY-MM-DD")
        );
        queryParams.append(
          "endDate",
          currentDateRange[1].format("YYYY-MM-DD")
        );
      }
      const response = await get(
        `/employee-performance/${employee.user_id}/products?${queryParams.toString()}`
      );
      if (response?.status === 200) {
        setProductsData(response.data.data || []);
      }
    } catch (error) {
      console.error("Products load error:", error);
    }
  };

  const loadClients = async () => {
    try {
      const queryParams = new URLSearchParams({ period: currentPeriod });
      if (currentPeriod === "period" && currentDateRange?.length === 2) {
        queryParams.append(
          "startDate",
          currentDateRange[0].format("YYYY-MM-DD")
        );
        queryParams.append(
          "endDate",
          currentDateRange[1].format("YYYY-MM-DD")
        );
      }
      const response = await get(
        `/employee-performance/${employee.user_id}/clients?${queryParams.toString()}`
      );
      if (response?.status === 200) {
        setClientsData(response.data.data || []);
      }
    } catch (error) {
      console.error("Clients load error:", error);
    }
  };

  const loadAnalysis = async () => {
    setAnalysisLoading(true);
    try {
      const queryParams = new URLSearchParams({ 
        period: currentPeriod,
        employeeId: employee.user_id,
      });
      if (currentPeriod === "period" && currentDateRange?.length === 2) {
        queryParams.append(
          "startDate",
          currentDateRange[0].format("YYYY-MM-DD")
        );
        queryParams.append(
          "endDate",
          currentDateRange[1].format("YYYY-MM-DD")
        );
      }
      const response = await get(
        `/employee-performance/${employee.user_id}/analysis?${queryParams.toString()}`
      );
      if (response?.status === 200 || response?.status === 201) {
        setAnalysisData(response.data);
      }
    } catch (error) {
      console.error("Analysis load error:", error);
    } finally {
      setAnalysisLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("uz-UZ", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  if (loading && !summary) {
    return <Loader />;
  }

  return (
    <>
      <button
        className={`primary-btn ${darkMode ? "dark" : null}`}
        onClick={onBack}
        style={{ marginBottom: "20px" }}
      >
        <ArrowLeft size={20} style={{ marginRight: "8px" }} /> Orqaga
      </button>

      <div className={`filter-wrapper ${darkMode ? "dark" : null}`}>
        <div className={`input-wrapper ${darkMode ? "dark" : null}`}>
          <Select
            value={currentPeriod}
            onChange={(value) => {
              setCurrentPeriod(value);
              if (value !== "period") {
                setCurrentDateRange([]);
              }
            }}
            className="select"
            placeholder="Davr"
          >
            <Select.Option value="day" className={darkMode ? "dark" : null}>
              <div>
                <span>Bugun</span>
              </div>
            </Select.Option>
            <Select.Option value="week" className={darkMode ? "dark" : null}>
              <div>
                <span>Hafta</span>
              </div>
            </Select.Option>
            <Select.Option
              value="month"
              className={darkMode ? "dark" : null}
            >
              <div>
                <span>Oy</span>
              </div>
            </Select.Option>
            <Select.Option value="year" className={darkMode ? "dark" : null}>
              <div>
                <span>Yil</span>
              </div>
            </Select.Option>
            <Select.Option
              value="period"
              className={darkMode ? "dark" : null}
            >
              <div>
                <span>Davr</span>
              </div>
            </Select.Option>
          </Select>
        </div>
        {currentPeriod === "period" && (
          <div className={`input-wrapper ${darkMode ? "dark" : null}`}>
            <RangePicker
              value={currentDateRange}
              onChange={setCurrentDateRange}
              format="YYYY-MM-DD"
              className="date-picker"
            />
          </div>
        )}
      </div>

      {/* Employee Information Section */}
      <div className={`employee-info-section ${darkMode ? "dark" : null}`}>
        <h2 className={`employee-section-title ${darkMode ? "dark" : null}`}>
          Xodim ma'lumotlari
        </h2>
        <div className="employee-info-grid">
          <div className="employee-info-item">
            <span className="employee-info-label">Ism:</span>
            <span className="employee-info-value">{employee.user_name}</span>
          </div>
          <div className="employee-info-item">
            <span className="employee-info-label">Telefon:</span>
            <span className="employee-info-value">{employee.user_nomer || "N/A"}</span>
          </div>
          <div className="employee-info-item">
            <span className="employee-info-label">Rol:</span>
            <span className="employee-info-value">
              {employee.user_role === 1
                ? "Admin"
                : employee.user_role === 2
                ? "Sotuvchi"
                : employee.user_role === 3
                ? "Kassir"
                : "Noma'lum"}
            </span>
          </div>
          {summary && (
            <>
              <div className="employee-info-item">
                <span className="employee-info-label">Birinchi savdo:</span>
                <span className="employee-info-value">
                  {summary.first_sale_date
                    ? new Date(summary.first_sale_date).toLocaleDateString("uz-UZ")
                    : "N/A"}
                </span>
              </div>
              <div className="employee-info-item">
                <span className="employee-info-label">Oxirgi savdo:</span>
                <span className="employee-info-value">
                  {summary.last_sale_date
                    ? new Date(summary.last_sale_date).toLocaleDateString("uz-UZ")
                    : "N/A"}
                </span>
              </div>
              <div className="employee-info-item">
                <span className="employee-info-label">Faol mahsulotlar:</span>
                <span className="employee-info-value">
                  {summary.unique_products_sold || 0} tur
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {summary && (
        <div className="info-wrapper">
          <InfoItem
            value={formatCurrency(summary.total_sales_count || 0)}
            name="Savdolar soni"
            icon={<TrendUp size={24} color="var(--color-primary)" />}
            iconBgColor={`${darkMode ? "var(--d-bg-icon)" : "var(--bg-icon)"}`}
            darkMode={darkMode}
          />
          <InfoItem
            value={formatCurrency(summary.total_products_sold || 0)}
            name="Sotilgan mahsulotlar"
            icon={<Package size={24} color="var(--color-primary)" />}
            iconBgColor={`${darkMode ? "var(--d-bg-icon)" : "var(--bg-icon)"}`}
            darkMode={darkMode}
          />
          <InfoItem
            value={formatCurrency(summary.total_revenue || 0) + " so'm"}
            name="Daromad"
            icon={<CurrencyDollar size={24} color="var(--color-success)" />}
            iconBgColor={`${darkMode ? "var(--d-bg-icon)" : "var(--bg-icon)"}`}
            darkMode={darkMode}
          />
          <InfoItem
            value={formatCurrency(summary.total_profit || 0) + " so'm"}
            name="Foyda"
            icon={<CurrencyDollar size={24} color="var(--color-primary)" />}
            iconBgColor={`${darkMode ? "var(--d-bg-icon)" : "var(--bg-icon)"}`}
            darkMode={darkMode}
          />
          <InfoItem
            value={formatCurrency(summary.unique_clients_count || 0)}
            name="Mijozlar soni"
            icon={<Users size={24} color="var(--color-primary)" />}
            iconBgColor={`${darkMode ? "var(--d-bg-icon)" : "var(--bg-icon)"}`}
            darkMode={darkMode}
          />
          <InfoItem
            value={formatCurrency(summary.average_sale_amount || 0) + " so'm"}
            name="O'rtacha savdo"
            icon={<TrendUp size={24} color="var(--color-primary)" />}
            iconBgColor={`${darkMode ? "var(--d-bg-icon)" : "var(--bg-icon)"}`}
            darkMode={darkMode}
          />
        </div>
      )}

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className={darkMode ? "dark" : null}
      >
        <TabPane tab="Umumiy ko'rinish" key="overview">
          {comparison && <EmployeeComparison comparison={comparison} darkMode={darkMode} />}
          {averages && <EmployeeAverages averages={averages} darkMode={darkMode} />}
        </TabPane>
        <TabPane tab="Tahlil" key="analysis">
          {analysisLoading ? (
            <Loader />
          ) : analysisData ? (
            <>
              <EmployeePerformanceAnalysis 
                analysisData={analysisData} 
                darkMode={darkMode}
                isEmployeeView={true}
              />
              <div style={{ marginTop: "40px" }}>
                <EmployeePieCharts 
                  analysisData={analysisData}
                  clientsData={clientsData}
                  darkMode={darkMode}
                />
              </div>
            </>
          ) : (
            <div style={{ padding: "20px", textAlign: "center" }}>
              Ma'lumotlar mavjud emas
            </div>
          )}
        </TabPane>
        <TabPane tab="Savdo tarixi" key="sales">
          <EmployeeSalesTable data={salesData} darkMode={darkMode} sidebar={sidebar} />
        </TabPane>
        <TabPane tab="Mahsulotlar bo'yicha" key="products">
          <EmployeeProductBreakdown data={productsData} darkMode={darkMode} sidebar={sidebar} />
        </TabPane>
        <TabPane tab="Mijozlar bo'yicha" key="clients">
          <EmployeeClientBreakdown data={clientsData} darkMode={darkMode} sidebar={sidebar} />
        </TabPane>
      </Tabs>
    </>
  );
};

export default EmployeePerformanceDetail;

