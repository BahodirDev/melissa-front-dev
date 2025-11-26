import React from "react";
import { TrendUp, TrendDown, Minus } from "@phosphor-icons/react";
import "./PeriodComparison.css";

/**
 * PeriodComparison - Component showing comparison between current and previous period
 * @param {Object} current - Current period data
 * @param {Object} previous - Previous period data
 * @param {string} period - Period type: 'today', 'week', 'month', 'year'
 * @param {boolean} darkMode - Dark mode flag
 */
function PeriodComparison({ current, previous, period, darkMode = false }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("uz-UZ", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateChange = (currentVal, previousVal) => {
    if (!previousVal || previousVal === 0) {
      return currentVal > 0
        ? { value: 100, type: "increase" }
        : { value: 0, type: "neutral" };
    }
    const change = ((currentVal - previousVal) / previousVal) * 100;
    return {
      value: Math.abs(change),
      type: change > 0 ? "increase" : change < 0 ? "decrease" : "neutral",
    };
  };

  const getPeriodLabel = (periodType) => {
    const labels = {
      today: "Kecha",
      week: "O'tgan hafta",
      month: "O'tgan oy",
      year: "O'tgan yil",
    };
    return labels[periodType] || "Oldingi davr";
  };

  const metrics = [
    {
      id: "profit",
      title: "Jami foyda",
      currentValue: current?.total || 0,
      previousValue: previous?.total || 0,
      change: calculateChange(current?.total || 0, previous?.total || 0),
    },
    {
      id: "revenue",
      title: "Daromad",
      currentValue: current?.revenue || 0,
      previousValue: previous?.revenue || 0,
      change: calculateChange(current?.revenue || 0, previous?.revenue || 0),
    },
    {
      id: "cost",
      title: "Xarajat",
      currentValue: current?.cost || 0,
      previousValue: previous?.cost || 0,
      change: calculateChange(current?.cost || 0, previous?.cost || 0),
    },
  ];

  const renderChange = (change) => {
    if (change.type === "neutral") {
      return (
        <div className="comparison-trend comparison-trend-neutral">
          <div className="trend-icon">
            <Minus size={18} />
          </div>
          <div className="trend-info">
            <strong>0%</strong>
            <span>O'zgarmadi</span>
          </div>
        </div>
      );
    }

    const isIncrease = change.type === "increase";
    const label = isIncrease ? "o'sdi" : "kamaydi";
    const Icon = isIncrease ? TrendUp : TrendDown;
    const prefix = isIncrease ? "+" : "-";

    return (
      <div className={`comparison-trend comparison-trend-${change.type}`}>
        <div className="trend-icon">
          <Icon size={18} />
        </div>
        <div className="trend-info">
          <strong>
            {prefix}
            {change.value.toFixed(1)}%
          </strong>
          <span>{label}</span>
        </div>
      </div>
    );
  };

  return (
    <div className={`period-comparison ${darkMode ? "dark" : ""}`}>
      <div className="period-comparison-header">
        <h3 className="period-comparison-title">
          Taqqoslash: {getPeriodLabel(period)} bilan
        </h3>
      </div>

      <div className="period-comparison-grid">
        {metrics.map((item) => (
          <div key={item.id} className="comparison-card">
            <div className="comparison-card-header">
              <div className="comparison-card-title">
                <p>{item.title}</p>
                <span>Joriy va oldingi davr</span>
              </div>
              {renderChange(item.change)}
            </div>
            <div className="comparison-values">
              <div className="comparison-value">
                <div className="comparison-value-label">Joriy</div>
                <div className="comparison-value-current">
                  {formatCurrency(item.currentValue)} so'm
                </div>
              </div>
              <div className="comparison-value">
                <div className="comparison-value-label">Oldingi</div>
                <div className="comparison-value-previous">
                  {formatCurrency(item.previousValue)} so'm
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PeriodComparison;
