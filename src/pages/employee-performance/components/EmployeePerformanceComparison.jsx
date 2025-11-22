import React from "react";
import { TrendUp, TrendDown, Minus } from "@phosphor-icons/react";
import "./EmployeePerformanceComparison.css";
import "./EmployeePerformanceDashboard.css";

/**
 * EmployeePerformanceComparison - Component showing comparison between current and previous period
 * @param {Object} current - Current period data
 * @param {Object} previous - Previous period data
 * @param {string} period - Period type: 'day', 'week', 'month', 'year'
 * @param {boolean} darkMode - Dark mode flag
 */
function EmployeePerformanceComparison({ current, previous, period, darkMode = false }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("uz-UZ", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateChange = (currentVal, previousVal) => {
    if (!previousVal || previousVal === 0) {
      return currentVal > 0 ? { value: 100, type: "increase" } : { value: 0, type: "neutral" };
    }
    const change = ((currentVal - previousVal) / previousVal) * 100;
    return {
      value: Math.abs(change),
      type: change > 0 ? "increase" : change < 0 ? "decrease" : "neutral",
    };
  };

  const getPeriodLabel = (periodType) => {
    const labels = {
      day: "Kecha",
      week: "O'tgan hafta",
      month: "O'tgan oy",
      year: "O'tgan yil",
    };
    return labels[periodType] || "Oldingi davr";
  };

  const revenueChange = calculateChange(current?.total_revenue || 0, previous?.total_revenue || 0);
  const profitChange = calculateChange(current?.total_profit || 0, previous?.total_profit || 0);
  const salesChange = calculateChange(current?.total_sales_count || 0, previous?.total_sales_count || 0);

  const renderChange = (change, label) => {
    if (change.type === "neutral") {
      return (
        <div className="employee-comparison-item-neutral">
          <Minus size={16} />
          <span>O'zgarmadi</span>
        </div>
      );
    }

    return (
      <div className={`employee-comparison-item employee-comparison-item-${change.type}`}>
        {change.type === "increase" ? (
          <TrendUp size={16} />
        ) : (
          <TrendDown size={16} />
        )}
        <span>
          {change.type === "increase" ? "+" : "-"}
          {change.value.toFixed(1)}% {label}
        </span>
      </div>
    );
  };

  return (
    <div className={`employee-performance-comparison ${darkMode ? "dark" : ""}`}>
      <div className="employee-comparison-header">
        <h3 className="employee-comparison-title">Taqqoslash: {getPeriodLabel(period)} bilan</h3>
      </div>

      <div className="employee-comparison-grid">
        <div className="employee-comparison-card">
          <div className="employee-comparison-card-header">
            <span className="employee-comparison-label">Jami daromad</span>
            {renderChange(revenueChange, "o'sdi")}
          </div>
          <div className="employee-comparison-values">
            <div className="employee-comparison-value">
              <span className="employee-comparison-value-label">Joriy:</span>
              <strong className="employee-comparison-value-current">
                {formatCurrency(current?.total_revenue || 0)} so'm
              </strong>
            </div>
            <div className="employee-comparison-value">
              <span className="employee-comparison-value-label">Oldingi:</span>
              <span className="employee-comparison-value-previous">
                {formatCurrency(previous?.total_revenue || 0)} so'm
              </span>
            </div>
          </div>
        </div>

        <div className="employee-comparison-card">
          <div className="employee-comparison-card-header">
            <span className="employee-comparison-label">Jami foyda</span>
            {renderChange(profitChange, "o'sdi")}
          </div>
          <div className="employee-comparison-values">
            <div className="employee-comparison-value">
              <span className="employee-comparison-value-label">Joriy:</span>
              <strong className="employee-comparison-value-current">
                {formatCurrency(current?.total_profit || 0)} so'm
              </strong>
            </div>
            <div className="employee-comparison-value">
              <span className="employee-comparison-value-label">Oldingi:</span>
              <span className="employee-comparison-value-previous">
                {formatCurrency(previous?.total_profit || 0)} so'm
              </span>
            </div>
          </div>
        </div>

        <div className="employee-comparison-card">
          <div className="employee-comparison-card-header">
            <span className="employee-comparison-label">Jami savdolar</span>
            {renderChange(salesChange, "o'sdi")}
          </div>
          <div className="employee-comparison-values">
            <div className="employee-comparison-value">
              <span className="employee-comparison-value-label">Joriy:</span>
              <strong className="employee-comparison-value-current">
                {formatCurrency(current?.total_sales_count || 0)}
              </strong>
            </div>
            <div className="employee-comparison-value">
              <span className="employee-comparison-value-label">Oldingi:</span>
              <span className="employee-comparison-value-previous">
                {formatCurrency(previous?.total_sales_count || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeePerformanceComparison;

