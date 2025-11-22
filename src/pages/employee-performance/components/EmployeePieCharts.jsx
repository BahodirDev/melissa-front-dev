import React from "react";
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import "./EmployeePerformanceAnalysis.css";

// Register Chart.js components for pie charts
ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * EmployeePieCharts - Component showing pie charts for client and time-based product sales
 * @param {Object} analysisData - Analysis data with top clients and time breakdown
 * @param {Object} clientsData - Detailed client sales data
 * @param {boolean} darkMode - Dark mode flag
 */
function EmployeePieCharts({ analysisData, clientsData, darkMode = false }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("uz-UZ", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Generate colors for pie chart segments
  const generateColors = (count) => {
    const colors = [
      "#059669", "#0ea5e9", "#8b5cf6", "#f59e0b", "#ef4444",
      "#10b981", "#3b82f6", "#a855f7", "#f97316", "#ec4899",
      "#14b8a6", "#6366f1", "#d946ef", "#fb7185", "#fbbf24",
    ];
    return colors.slice(0, count);
  };

  // Client distribution pie chart (products sold to whom)
  const clientChartData = React.useMemo(() => {
    if (!clientsData || clientsData.length === 0) {
      return null;
    }

    // Aggregate by client
    const clientMap = {};
    clientsData.forEach((item) => {
      if (item.client) {
        if (!clientMap[item.client]) {
          clientMap[item.client] = {
            name: item.client,
            quantity: 0,
            revenue: 0,
          };
        }
        clientMap[item.client].quantity += parseFloat(item.total_quantity_sold || 0);
        clientMap[item.client].revenue += parseFloat(item.total_revenue || 0);
      }
    });

    const clientArray = Object.values(clientMap).sort(
      (a, b) => b.quantity - a.quantity
    );

    // Take top 10 clients
    const topClients = clientArray.slice(0, 10);
    const colors = generateColors(topClients.length);

    return {
      labels: topClients.map((c) => c.name),
      datasets: [
        {
          label: "Sotilgan mahsulotlar (dona)",
          data: topClients.map((c) => c.quantity),
          backgroundColor: colors,
          borderColor: darkMode ? "#1f2937" : "#ffffff",
          borderWidth: 2,
        },
      ],
    };
  }, [clientsData, darkMode]);

  // Time breakdown pie chart (products sold when)
  const timeChartData = React.useMemo(() => {
    if (!analysisData?.time_breakdown || analysisData.time_breakdown.length === 0) {
      return null;
    }

    const timeData = analysisData.time_breakdown.slice(0, 12); // Limit to 12 segments
    const colors = generateColors(timeData.length);

    return {
      labels: timeData.map((t) => t.label),
      datasets: [
        {
          label: "Daromad (so'm)",
          data: timeData.map((t) => t.revenue),
          backgroundColor: colors,
          borderColor: darkMode ? "#1f2937" : "#ffffff",
          borderWidth: 2,
        },
      ],
    };
  }, [analysisData, darkMode]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: darkMode ? "#e5e7eb" : "#374151",
          font: {
            size: 12,
          },
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: darkMode ? "#1f2937" : "#ffffff",
        titleColor: darkMode ? "#e5e7eb" : "#111827",
        bodyColor: darkMode ? "#e5e7eb" : "#111827",
        borderColor: darkMode ? "#374151" : "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            if (context.dataset.label?.includes("dona")) {
              return `${label}: ${formatCurrency(value)} dona`;
            } else {
              return `${label}: ${formatCurrency(value)} so'm`;
            }
          },
        },
      },
    },
  };

  return (
    <div className="employee-pie-charts-container">
      {/* Client Distribution Chart */}
      <div className="employee-pie-chart-card">
        <h3 className={`employee-chart-title ${darkMode ? "dark" : null}`}>
          Mijozlar bo'yicha mahsulotlar taqsimoti
        </h3>
        <p className={`employee-chart-subtitle ${darkMode ? "dark" : null}`}>
          Qaysi mijozlarga qancha mahsulot sotilgan
        </p>
        {clientChartData ? (
          <div style={{ height: "400px", position: "relative" }}>
            <Pie data={clientChartData} options={chartOptions} />
          </div>
        ) : (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: darkMode ? "#9ca3af" : "#6b7280",
            }}
          >
            Mijozlar bo'yicha ma'lumotlar mavjud emas
          </div>
        )}
        {clientChartData && (
          <div className="employee-chart-stats">
            <div className="employee-stat-item">
              <span className="employee-stat-label">Jami mijozlar:</span>
              <span className="employee-stat-value">
                {clientChartData.labels.length}
              </span>
            </div>
            <div className="employee-stat-item">
              <span className="employee-stat-label">Jami mahsulotlar:</span>
              <span className="employee-stat-value">
                {formatCurrency(
                  clientChartData.datasets[0].data.reduce((a, b) => a + b, 0)
                )}{" "}
                dona
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Time Breakdown Chart */}
      <div className="employee-pie-chart-card">
        <h3 className={`employee-chart-title ${darkMode ? "dark" : null}`}>
          Vaqt bo'yicha mahsulotlar taqsimoti
        </h3>
        <p className={`employee-chart-subtitle ${darkMode ? "dark" : null}`}>
          Qachon qancha mahsulot sotilgan
        </p>
        {timeChartData ? (
          <div style={{ height: "400px", position: "relative" }}>
            <Pie data={timeChartData} options={chartOptions} />
          </div>
        ) : (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: darkMode ? "#9ca3af" : "#6b7280",
            }}
          >
            Vaqt bo'yicha ma'lumotlar mavjud emas
          </div>
        )}
        {timeChartData && (
          <div className="employee-chart-stats">
            <div className="employee-stat-item">
              <span className="employee-stat-label">Davrlar soni:</span>
              <span className="employee-stat-value">
                {timeChartData.labels.length}
              </span>
            </div>
            <div className="employee-stat-item">
              <span className="employee-stat-label">Jami daromad:</span>
              <span className="employee-stat-value">
                {formatCurrency(
                  timeChartData.datasets[0].data.reduce((a, b) => a + b, 0)
                )}{" "}
                so'm
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeePieCharts;

