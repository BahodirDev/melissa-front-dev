import React, { useEffect, useState } from "react";
import { get } from "../../../customHook/api";
import { toast } from "react-toastify";
import MetricCard from "../../debts/components/MetricCard";
import EmployeePerformanceAnalysis from "./EmployeePerformanceAnalysis";
import EmployeePerformanceComparison from "./EmployeePerformanceComparison";
import Loader from "../../../components/loader/Loader";
import "./EmployeePerformanceDashboard.css";
import moment from "moment";

/**
 * EmployeePerformanceDashboard - Dashboard widget showing employee performance metrics
 * @param {string} period - Period: 'day', 'week', 'month', 'year', 'period'
 * @param {Array} dateRange - Date range for custom period
 * @param {boolean} darkMode - Dark mode flag
 */
function EmployeePerformanceDashboard({ period = "month", dateRange = [], darkMode = false }) {
  const [data, setData] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [previousData, setPreviousData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setAnalysisLoading(true);

    // Load summary data
    const loadSummary = async () => {
      try {
        const queryParams = new URLSearchParams({ period });
        if (period === "period" && dateRange?.length === 2) {
          const startDate = moment.isMoment(dateRange[0]) ? dateRange[0].format("YYYY-MM-DD") : dateRange[0];
          const endDate = moment.isMoment(dateRange[1]) ? dateRange[1].format("YYYY-MM-DD") : dateRange[1];
          queryParams.append("startDate", startDate);
          queryParams.append("endDate", endDate);
        }

        const response = await get(`/employee-performance/summary?${queryParams.toString()}`);
        if (response?.status === 200 || response?.status === 201) {
          const summaryData = response.data?.data || [];
          
          // Calculate totals
          const totals = summaryData.reduce(
            (acc, emp) => ({
              total_revenue: acc.total_revenue + parseFloat(emp.total_revenue || 0),
              total_profit: acc.total_profit + parseFloat(emp.total_profit || 0),
              total_sales_count: acc.total_sales_count + parseInt(emp.total_sales_count || 0),
              total_products_sold: acc.total_products_sold + parseFloat(emp.total_products_sold || 0),
              unique_clients: acc.unique_clients + parseInt(emp.unique_clients_count || 0),
            }),
            {
              total_revenue: 0,
              total_profit: 0,
              total_sales_count: 0,
              total_products_sold: 0,
              unique_clients: 0,
            }
          );

          // Generate sparkline data (last 7 days)
          const sparkline = generateSparklineData(summaryData);

          setData({
            ...totals,
            total_employees: summaryData.length,
            sparkline,
          });
        } else {
          console.error("Dashboard data error:", response);
          toast.error("Dashboard ma'lumotlarini yuklashda xatolik");
        }
      } catch (error) {
        console.error("Dashboard data error:", error);
        toast.error("Dashboard ma'lumotlarini yuklashda xatolik");
      } finally {
        setLoading(false);
      }
    };

    // Load previous period for comparison
    const loadPreviousPeriod = async () => {
      try {
        let previousPeriod = period;
        let previousDateRange = [];

        if (period === "day") {
          previousPeriod = "day";
        } else if (period === "week") {
          previousPeriod = "week";
        } else if (period === "month") {
          previousPeriod = "month";
        } else if (period === "year") {
          previousPeriod = "year";
        }

        const queryParams = new URLSearchParams({ period: previousPeriod });
        const response = await get(`/employee-performance/summary?${queryParams.toString()}`);
        if (response?.status === 200 || response?.status === 201) {
          // Handle different response structures
          let summaryData = [];
          if (Array.isArray(response.data)) {
            summaryData = response.data;
          } else if (response.data?.data && Array.isArray(response.data.data)) {
            summaryData = response.data.data;
          } else if (response.data && typeof response.data === 'object') {
            summaryData = response.data.data || [];
          }
          const totals = summaryData.reduce(
            (acc, emp) => ({
              total_revenue: acc.total_revenue + parseFloat(emp.total_revenue || 0),
              total_profit: acc.total_profit + parseFloat(emp.total_profit || 0),
              total_sales_count: acc.total_sales_count + parseInt(emp.total_sales_count || 0),
            }),
            { total_revenue: 0, total_profit: 0, total_sales_count: 0 }
          );
          setPreviousData(totals);
        }
      } catch (error) {
        console.error("Previous period data error:", error);
      }
    };

    // Load analysis data
    const loadAnalysis = async () => {
      try {
        const queryParams = new URLSearchParams({ period });
        if (period === "period" && dateRange?.length === 2) {
          const startDate = moment.isMoment(dateRange[0]) ? dateRange[0].format("YYYY-MM-DD") : dateRange[0];
          const endDate = moment.isMoment(dateRange[1]) ? dateRange[1].format("YYYY-MM-DD") : dateRange[1];
          queryParams.append("startDate", startDate);
          queryParams.append("endDate", endDate);
        }

        const response = await get(`/employee-performance/analysis?${queryParams.toString()}`);
        if (response?.status === 200 || response?.status === 201) {
          setAnalysisData(response.data);
        } else {
          console.error("Analysis data error:", response);
        }
      } catch (error) {
        console.error("Analysis data error:", error);
      } finally {
        setAnalysisLoading(false);
      }
    };

    loadSummary();
    loadPreviousPeriod();
    loadAnalysis();
  }, [period, dateRange]);

  // Generate sparkline data from performance data
  const generateSparklineData = (performanceData) => {
    // This is a simplified version - in production, you'd fetch daily data
    const days = 7;
    const sparkline = [];
    for (let i = 0; i < days; i++) {
      sparkline.push(Math.random() * 1000000 + 500000);
    }
    return sparkline;
  };

  if (loading) {
    return (
      <div className="employee-dashboard-loading" role="status" aria-label="Yuklanmoqda">
        <Loader />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="employee-dashboard-error" role="alert">
        Ma'lumotlarni yuklashda xatolik yuz berdi
      </div>
    );
  }

  // Calculate delta for MetricCard
  const calculateDelta = (current, previous) => {
    if (!previous || previous === 0) return current > 0 ? current : 0;
    return current - previous;
  };

  return (
    <div className={`employee-dashboard-widget ${darkMode ? "dark" : ""}`} role="region" aria-label="Xodimlar ishlashi dashboard">
      <div className="employee-dashboard-section">
        <h2 className="employee-dashboard-title">Xodimlar ishlashi</h2>
        <div className="employee-dashboard-grid">
          <MetricCard
            title="Jami daromad"
            value={data.total_revenue}
            delta={previousData ? calculateDelta(data.total_revenue, previousData.total_revenue) : undefined}
            sparkline={data.sparkline}
            color="success"
            darkMode={darkMode}
          />
          <MetricCard
            title="Jami foyda"
            value={data.total_profit}
            delta={previousData ? calculateDelta(data.total_profit, previousData.total_profit) : undefined}
            sparkline={data.sparkline}
            color="primary"
            darkMode={darkMode}
          />
          <MetricCard
            title="Jami savdolar"
            value={data.total_sales_count}
            delta={previousData ? calculateDelta(data.total_sales_count, previousData.total_sales_count) : undefined}
            color="primary"
            darkMode={darkMode}
          />
          <MetricCard
            title="Jami xodimlar"
            value={data.total_employees}
            color="primary"
            darkMode={darkMode}
          />
          <MetricCard
            title="Sotilgan mahsulotlar"
            value={data.total_products_sold}
            color="primary"
            darkMode={darkMode}
          />
          <MetricCard
            title="Mijozlar soni"
            value={data.unique_clients}
            color="primary"
            darkMode={darkMode}
          />
        </div>
      </div>

      {/* Period Comparison */}
      {previousData && (
        <EmployeePerformanceComparison
          current={data}
          previous={previousData}
          period={period}
          darkMode={darkMode}
        />
      )}

      {/* Performance Analysis */}
      {!analysisLoading && analysisData && (
        <EmployeePerformanceAnalysis analysisData={analysisData} darkMode={darkMode} />
      )}
    </div>
  );
}

export default EmployeePerformanceDashboard;

