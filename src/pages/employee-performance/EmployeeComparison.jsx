import React from "react";
import { TrendUp, TrendDown } from "@phosphor-icons/react";
import InfoItem from "../../components/info_item/InfoItem";

const EmployeeComparison = ({ comparison, darkMode }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("uz-UZ", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatPercentage = (value) => {
    if (!value && value !== 0) return "0%";
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  const getChangeColor = (value) => {
    return value >= 0 ? "var(--color-success)" : "var(--color-danger)";
  };

  const getChangeIcon = (value) => {
    return value >= 0 ? (
      <TrendUp size={20} color={getChangeColor(value)} />
    ) : (
      <TrendDown size={20} color={getChangeColor(value)} />
    );
  };

  return (
    <div className={`employee-comparison ${darkMode ? "dark" : null}`}>
      <h3>Joriy va oldingi davr taqqoslash</h3>
      <div className="comparison-grid">
        <div className="comparison-item">
          <div className="comparison-label">Savdolar soni</div>
          <div className="comparison-values">
            <span className="current-value">
              {formatCurrency(comparison.current?.sales_count || 0)}
            </span>
            <span className="previous-value">
              Oldingi: {formatCurrency(comparison.previous?.sales_count || 0)}
            </span>
            <div
              className="comparison-change"
              style={{ color: getChangeColor(comparison.changes?.sales_count) }}
            >
              {getChangeIcon(comparison.changes?.sales_count)}
              {formatPercentage(comparison.changes?.sales_count || 0)}
            </div>
          </div>
        </div>

        <div className="comparison-item">
          <div className="comparison-label">Sotilgan mahsulotlar</div>
          <div className="comparison-values">
            <span className="current-value">
              {formatCurrency(comparison.current?.products_sold || 0)}
            </span>
            <span className="previous-value">
              Oldingi: {formatCurrency(comparison.previous?.products_sold || 0)}
            </span>
            <div
              className="comparison-change"
              style={{
                color: getChangeColor(comparison.changes?.products_sold),
              }}
            >
              {getChangeIcon(comparison.changes?.products_sold)}
              {formatPercentage(comparison.changes?.products_sold || 0)}
            </div>
          </div>
        </div>

        <div className="comparison-item">
          <div className="comparison-label">Daromad</div>
          <div className="comparison-values">
            <span className="current-value">
              {formatCurrency(comparison.current?.revenue || 0)} so'm
            </span>
            <span className="previous-value">
              Oldingi: {formatCurrency(comparison.previous?.revenue || 0)} so'm
            </span>
            <div
              className="comparison-change"
              style={{ color: getChangeColor(comparison.changes?.revenue) }}
            >
              {getChangeIcon(comparison.changes?.revenue)}
              {formatPercentage(comparison.changes?.revenue || 0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeComparison;

