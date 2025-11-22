import React, { useEffect, useState } from "react";
import { useOutletContext, useNavigate, useParams } from "react-router-dom";
import { Select, DatePicker } from "antd";
import { toast } from "react-toastify";
import { get } from "../../customHook/api";
import Loader from "../../components/loader/Loader";
import InfoItem from "../../components/info_item/InfoItem";
import EmployeePerformanceList from "./EmployeePerformanceList";
import EmployeePerformanceDetail from "./EmployeePerformanceDetail";
import EmployeePerformanceDashboard from "./components/EmployeePerformanceDashboard";
import { Users, TrendUp, TrendDown, CurrencyDollar } from "@phosphor-icons/react";
import "./employee-performance.css";

const { RangePicker } = DatePicker;

export default function EmployeePerformance() {
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
  const { employeeId } = useParams();

  const [period, setPeriod] = useState("month");
  const [dateRange, setDateRange] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("dashboard"); // 'dashboard' or 'list'
  const [summary, setSummary] = useState({
    total_employees: 0,
    total_revenue: 0,
    total_sales_count: 0,
    total_products_sold: 0,
  });

  useEffect(() => {
    if (localStorage.getItem("role") !== "1") {
      navigate("/*");
    }
    loadEmployees();
    loadPerformanceData();
  }, [navigate, period, dateRange]);

  // Handle route parameter for employee detail
  useEffect(() => {
    if (employeeId && employees.length > 0) {
      const employee = employees.find((emp) => emp.user_id === employeeId);
      if (employee) {
        setSelectedEmployee(employee);
      }
    } else if (!employeeId && selectedEmployee) {
      // If navigating away from detail page, clear selection
      setSelectedEmployee(null);
    }
  }, [employeeId, employees]);

  const loadEmployees = async () => {
    try {
      const response = await get("/users/users-list?limit=1000");
      if (response?.status === 200 || response?.status === 201) {
        const employeesData =
          response.data?.data || response.data || [];
        // Filter employees with roles 1 (Admin), 2 (Sotuvchi), or 3 (Kassir)
        const sellers = employeesData.filter(
          (emp) => emp.user_role === 1 || emp.user_role === 2 || emp.user_role === 3
        );
        setEmployees(sellers);
      }
    } catch (error) {
      console.error("Employees load error:", error);
      toast.error("Xodimlarni yuklashda xatolik");
    }
  };

  const loadPerformanceData = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({ period });
      if (period === "period" && dateRange?.length === 2) {
        queryParams.append(
          "startDate",
          dateRange[0].format("YYYY-MM-DD")
        );
        queryParams.append("endDate", dateRange[1].format("YYYY-MM-DD"));
      }

      const response = await get(
        `/employee-performance/summary?${queryParams.toString()}`
      );
      if (response?.status === 200 || response?.status === 201) {
        // Handle different response structures
        let data = [];
        if (Array.isArray(response.data)) {
          data = response.data;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          data = response.data.data;
        } else if (response.data && typeof response.data === 'object') {
          // If response.data is an object with data property
          data = response.data.data || [];
        }
        
        console.log("Performance data received:", data, "Length:", data.length, "Is Array:", Array.isArray(data));
        setPerformanceData(Array.isArray(data) ? data : []);

        // Calculate summary
        const summaryData = data.reduce(
          (acc, emp) => ({
            total_employees: data.length,
            total_revenue: acc.total_revenue + parseFloat(emp.total_revenue || 0),
            total_sales_count:
              acc.total_sales_count + parseInt(emp.total_sales_count || 0),
            total_products_sold:
              acc.total_products_sold + parseFloat(emp.total_products_sold || 0),
          }),
          {
            total_employees: 0,
            total_revenue: 0,
            total_sales_count: 0,
            total_products_sold: 0,
          }
        );
        setSummary(summaryData);
      } else {
        toast.error("Ma'lumotlarni yuklashda xatolik");
      }
    } catch (error) {
      console.error("Performance data load error:", error);
      toast.error("Ma'lumotlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeSelect = (employeeId) => {
    // Navigate to employee detail page
    navigate(`/employee-performance/${employeeId}`);
  };

  const handleBackToList = () => {
    // Navigate back to list
    navigate("/employee-performance");
    setSelectedEmployee(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("uz-UZ", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  if (selectedEmployee) {
    return (
      <EmployeePerformanceDetail
        employee={selectedEmployee}
        period={period}
        dateRange={dateRange}
        onBack={handleBackToList}
        darkMode={darkMode}
        sidebar={sidebar}
      />
    );
  }

  return (
    <>
      {/* View Toggle Buttons - At the top like Debts section */}
      <div className={`employee-view-switch ${darkMode ? "dark" : null}`}>
        <button
          type="button"
          onClick={() => setView("dashboard")}
          className={view === "dashboard" ? "active" : null}
          aria-label="Dashboard"
          aria-pressed={view === "dashboard"}
        >
          Dashboard
        </button>
        <button
          type="button"
          onClick={() => setView("list")}
          className={view === "list" ? "active" : null}
          aria-label="Ro'yxat"
          aria-pressed={view === "list"}
        >
          Ro'yxat
        </button>
      </div>

      {/* Dashboard View */}
      {view === "dashboard" && (
        <div className="employee-dashboard-container">
          <div className={`employee-dashboard-period ${darkMode ? "dark" : null}`}>
            <button
              type="button"
              className={period === "day" ? "active" : ""}
              onClick={() => {
                setPeriod("day");
                setDateRange([]);
              }}
            >
              Bugun
            </button>
            <button
              type="button"
              className={period === "week" ? "active" : ""}
              onClick={() => {
                setPeriod("week");
                setDateRange([]);
              }}
            >
              Hafta
            </button>
            <button
              type="button"
              className={period === "month" ? "active" : ""}
              onClick={() => {
                setPeriod("month");
                setDateRange([]);
              }}
            >
              Oy
            </button>
            <button
              type="button"
              className={period === "year" ? "active" : ""}
              onClick={() => {
                setPeriod("year");
                setDateRange([]);
              }}
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
          {period === "period" && (
            <div className={`filter-wrapper ${darkMode ? "dark" : null}`} style={{ marginBottom: "20px" }}>
              <div className={`input-wrapper ${darkMode ? "dark" : null}`}>
                <RangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  format="YYYY-MM-DD"
                  className="date-picker"
                />
              </div>
            </div>
          )}
          <EmployeePerformanceDashboard
            period={period}
            dateRange={dateRange}
            darkMode={darkMode}
          />
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <>
          <div className={`filter-wrapper ${darkMode ? "dark" : null}`}>
            <div className={`input-wrapper ${darkMode ? "dark" : null}`}>
              <Select
                value={period}
                onChange={(value) => {
                  setPeriod(value);
                  if (value !== "period") {
                    setDateRange([]);
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
            {period === "period" && (
              <div className={`input-wrapper ${darkMode ? "dark" : null}`}>
                <RangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  format="YYYY-MM-DD"
                  className="date-picker"
                />
              </div>
            )}
          </div>

          <div className="info-wrapper">
            <InfoItem
              value={summary.total_employees}
              name="Jami xodimlar"
              icon={<Users size={24} color="var(--color-primary)" />}
              iconBgColor={`${darkMode ? "var(--d-bg-icon)" : "var(--bg-icon)"}`}
              darkMode={darkMode}
            />
            <InfoItem
              value={formatCurrency(summary.total_revenue) + " so'm"}
              name="Jami daromad"
              icon={<CurrencyDollar size={24} color="var(--color-success)" />}
              iconBgColor={`${darkMode ? "var(--d-bg-icon)" : "var(--bg-icon)"}`}
              darkMode={darkMode}
            />
            <InfoItem
              value={summary.total_sales_count}
              name="Jami savdolar"
              icon={<TrendUp size={24} color="var(--color-primary)" />}
              iconBgColor={`${darkMode ? "var(--d-bg-icon)" : "var(--bg-icon)"}`}
              darkMode={darkMode}
            />
            <InfoItem
              value={formatCurrency(summary.total_products_sold)}
              name="Jami sotilgan mahsulotlar"
              icon={<TrendDown size={24} color="var(--color-primary)" />}
              iconBgColor={`${darkMode ? "var(--d-bg-icon)" : "var(--bg-icon)"}`}
              darkMode={darkMode}
            />
          </div>

          {loading ? (
            <Loader />
          ) : performanceData && Array.isArray(performanceData) && performanceData.length > 0 ? (
            <EmployeePerformanceList
              data={performanceData}
              employees={employees}
              onEmployeeClick={handleEmployeeSelect}
              darkMode={darkMode}
              sidebar={sidebar}
            />
          ) : (
            <div style={{ padding: "20px", textAlign: "center", color: darkMode ? "var(--d-text-secondary)" : "var(--text-secondary)" }}>
              Ma'lumotlar mavjud emas yoki yuklanmoqda...
            </div>
          )}
        </>
      )}
    </>
  );
}

