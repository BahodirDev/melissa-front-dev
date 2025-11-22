import React from "react";
import InfoItem from "../../components/info_item/InfoItem";
import { TrendUp, CurrencyDollar } from "@phosphor-icons/react";

const EmployeeAverages = ({ averages, darkMode }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("uz-UZ", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <div className={`employee-averages ${darkMode ? "dark" : null}`}>
      <h3>O'rtacha ishlash ko'rsatkichlari</h3>
      <div className="averages-grid">
        <div className="averages-section">
          <h4>Kunlik o'rtacha</h4>
          <div className="info-wrapper">
            <InfoItem
              value={formatCurrency(averages.avg_daily_revenue || 0) + " so'm"}
              name="O'rtacha kunlik daromad"
              icon={<CurrencyDollar size={24} color="var(--color-primary)" />}
              iconBgColor={`${darkMode ? "var(--d-bg-icon)" : "var(--bg-icon)"}`}
              darkMode={darkMode}
            />
            <InfoItem
              value={formatCurrency(averages.avg_daily_sales_count || 0)}
              name="O'rtacha kunlik savdolar"
              icon={<TrendUp size={24} color="var(--color-primary)" />}
              iconBgColor={`${darkMode ? "var(--d-bg-icon)" : "var(--bg-icon)"}`}
              darkMode={darkMode}
            />
            <InfoItem
              value={formatCurrency(averages.avg_daily_products_sold || 0)}
              name="O'rtacha kunlik mahsulotlar"
              icon={<TrendUp size={24} color="var(--color-primary)" />}
              iconBgColor={`${darkMode ? "var(--d-bg-icon)" : "var(--bg-icon)"}`}
              darkMode={darkMode}
            />
          </div>
        </div>

        <div className="averages-section">
          <h4>Haftalik o'rtacha</h4>
          <div className="info-wrapper">
            <InfoItem
              value={formatCurrency(averages.avg_weekly_revenue || 0) + " so'm"}
              name="O'rtacha haftalik daromad"
              icon={<CurrencyDollar size={24} color="var(--color-primary)" />}
              iconBgColor={`${darkMode ? "var(--d-bg-icon)" : "var(--bg-icon)"}`}
              darkMode={darkMode}
            />
            <InfoItem
              value={formatCurrency(averages.avg_weekly_sales_count || 0)}
              name="O'rtacha haftalik savdolar"
              icon={<TrendUp size={24} color="var(--color-primary)" />}
              iconBgColor={`${darkMode ? "var(--d-bg-icon)" : "var(--bg-icon)"}`}
              darkMode={darkMode}
            />
          </div>
        </div>

        <div className="averages-section">
          <h4>Oylik o'rtacha</h4>
          <div className="info-wrapper">
            <InfoItem
              value={formatCurrency(averages.avg_monthly_revenue || 0) + " so'm"}
              name="O'rtacha oylik daromad"
              icon={<CurrencyDollar size={24} color="var(--color-primary)" />}
              iconBgColor={`${darkMode ? "var(--d-bg-icon)" : "var(--bg-icon)"}`}
              darkMode={darkMode}
            />
            <InfoItem
              value={formatCurrency(averages.avg_monthly_sales_count || 0)}
              name="O'rtacha oylik savdolar"
              icon={<TrendUp size={24} color="var(--color-primary)" />}
              iconBgColor={`${darkMode ? "var(--d-bg-icon)" : "var(--bg-icon)"}`}
              darkMode={darkMode}
            />
          </div>
        </div>

        <div className="averages-section">
          <h4>Eng yaxshi ko'rsatkichlar</h4>
          <div className="info-wrapper">
            <InfoItem
              value={formatCurrency(averages.best_daily_revenue || 0) + " so'm"}
              name="Eng yaxshi kunlik daromad"
              icon={<CurrencyDollar size={24} color="var(--color-success)" />}
              iconBgColor={`${darkMode ? "var(--d-bg-icon)" : "var(--bg-icon)"}`}
              darkMode={darkMode}
            />
            <InfoItem
              value={formatCurrency(averages.best_weekly_revenue || 0) + " so'm"}
              name="Eng yaxshi haftalik daromad"
              icon={<CurrencyDollar size={24} color="var(--color-success)" />}
              iconBgColor={`${darkMode ? "var(--d-bg-icon)" : "var(--bg-icon)"}`}
              darkMode={darkMode}
            />
            <InfoItem
              value={formatCurrency(averages.best_monthly_revenue || 0) + " so'm"}
              name="Eng yaxshi oylik daromad"
              icon={<CurrencyDollar size={24} color="var(--color-success)" />}
              iconBgColor={`${darkMode ? "var(--d-bg-icon)" : "var(--bg-icon)"}`}
              darkMode={darkMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAverages;

