import React from "react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "./EmployeePerformanceAnalysis.css";
import "./EmployeePerformanceDashboard.css";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

/**
 * EmployeePerformanceAnalysis - Component showing employee performance analysis with charts
 * @param {Object} analysisData - Analysis data with top employees, products, clients
 * @param {boolean} darkMode - Dark mode flag
 * @param {boolean} isEmployeeView - If true, shows employee-specific analysis (hides top_employees)
 */
function EmployeePerformanceAnalysis({ analysisData, darkMode = false, isEmployeeView = false }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("uz-UZ", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!analysisData) {
    return (
      <div className="employee-analysis-loading" role="status">
        Ma'lumotlar yuklanmoqda...
      </div>
    );
  }

  // Top employees chart
  const topEmployeesData = {
    labels: analysisData.top_employees?.map((e) => e.name) || [],
    datasets: [
      {
        label: "Daromad (so'm)",
        data: analysisData.top_employees?.map((e) => e.revenue) || [],
        backgroundColor: "#059669",
        borderColor: "#047857",
        borderWidth: 1,
      },
    ],
  };

  // Top products chart
  const topProductsData = {
    labels: analysisData.top_products?.map((p) => p.name) || [],
    datasets: [
      {
        label: "Sotilgan miqdor",
        data: analysisData.top_products?.map((p) => p.quantity) || [],
        backgroundColor: "#3b82f6",
        borderColor: "#2563eb",
        borderWidth: 1,
      },
    ],
  };

  // Top clients chart
  const topClientsData = {
    labels: analysisData.top_clients?.map((c) => c.name) || [],
    datasets: [
      {
        label: "Savdolar soni",
        data: analysisData.top_clients?.map((c) => c.sales_count) || [],
        backgroundColor: "#8b5cf6",
        borderColor: "#7c3aed",
        borderWidth: 1,
      },
    ],
  };

  // Time breakdown chart (daily/weekly/monthly)
  const timeBreakdownData = {
    labels: analysisData.time_breakdown?.map((t) => t.label) || [],
    datasets: [
      {
        label: "Daromad (so'm)",
        data: analysisData.time_breakdown?.map((t) => t.revenue) || [],
        backgroundColor: "#f59e0b",
        borderColor: "#d97706",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            if (context.dataset.label.includes("so'm")) {
              return formatCurrency(context.parsed.y) + " so'm";
            }
            return context.parsed.y;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            if (value >= 1000000) {
              return (value / 1000000).toFixed(1) + "M";
            }
            if (value >= 1000) {
              return (value / 1000).toFixed(0) + "K";
            }
            return value;
          },
        },
      },
    },
  };

  return (
    <div className={`employee-performance-analysis ${darkMode ? "dark" : ""}`}>
      <h3 className="employee-analysis-title">Xodimlar ishlashi tahlili</h3>

      <div className="employee-analysis-grid">
        {/* Top Employees - Only show in aggregate view, not for individual employee */}
        {!isEmployeeView && analysisData.top_employees && analysisData.top_employees.length > 0 && (
          <div className="employee-analysis-card">
            <h4 className="employee-analysis-card-title">Eng yaxshi xodimlar</h4>
            <div className="employee-analysis-chart">
              <Bar data={topEmployeesData} options={chartOptions} />
            </div>
            <div className="employee-analysis-list">
              {analysisData.top_employees.slice(0, 5).map((employee, idx) => (
                <div key={idx} className="employee-analysis-item">
                  <span className="employee-analysis-item-name">{employee.name}</span>
                  <span className="employee-analysis-item-value">
                    {formatCurrency(employee.revenue)} so'm
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Products */}
        {analysisData.top_products && analysisData.top_products.length > 0 && (
          <div className="employee-analysis-card">
            <h4 className="employee-analysis-card-title">Eng ko'p sotilgan mahsulotlar</h4>
            <div className="employee-analysis-chart">
              <Bar data={topProductsData} options={chartOptions} />
            </div>
            <div className="employee-analysis-list">
              {analysisData.top_products.slice(0, 5).map((product, idx) => (
                <div key={idx} className="employee-analysis-item">
                  <span className="employee-analysis-item-name">{product.name}</span>
                  <span className="employee-analysis-item-value">
                    {formatCurrency(product.quantity)} dona
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Clients */}
        {analysisData.top_clients && analysisData.top_clients.length > 0 && (
          <div className="employee-analysis-card">
            <h4 className="employee-analysis-card-title">Eng ko'p savdo qilingan mijozlar</h4>
            <div className="employee-analysis-chart">
              <Bar data={topClientsData} options={chartOptions} />
            </div>
            <div className="employee-analysis-list">
              {analysisData.top_clients.slice(0, 5).map((client, idx) => (
                <div key={idx} className="employee-analysis-item">
                  <span className="employee-analysis-item-name">{client.name}</span>
                  <span className="employee-analysis-item-value">
                    {formatCurrency(client.sales_count)} ta savdo
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Time Breakdown */}
        {analysisData.time_breakdown && analysisData.time_breakdown.length > 0 && (
          <div className="employee-analysis-card">
            <h4 className="employee-analysis-card-title">Vaqt bo'yicha taqsimot</h4>
            <div className="employee-analysis-chart">
              <Bar data={timeBreakdownData} options={chartOptions} />
            </div>
            <div className="employee-analysis-list">
              {analysisData.time_breakdown.map((time, idx) => (
                <div key={idx} className="employee-analysis-item">
                  <span className="employee-analysis-item-name">{time.label}</span>
                  <span className="employee-analysis-item-value">
                    {formatCurrency(time.revenue)} so'm
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Key Insights */}
      {analysisData.insights && analysisData.insights.length > 0 && (
        <div className="employee-analysis-insights">
          <h4 className="employee-analysis-insights-title">Asosiy xulosalar</h4>
          <ul className="employee-analysis-insights-list">
            {analysisData.insights.map((insight, idx) => (
              <li key={idx} className="employee-analysis-insight-item">
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default EmployeePerformanceAnalysis;

