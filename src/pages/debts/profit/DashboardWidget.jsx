import React, { useEffect, useState } from "react"
import MetricCard from "../components/MetricCard"
import PeriodComparison from "./PeriodComparison"
import ProfitAnalysis from "./ProfitAnalysis"
import { get } from "../../../customHook/api";
import { toast } from "react-toastify";
import "./DashboardWidget.css"

/**
 * DashboardWidget - Summary widget showing profit and debt metrics
 * @param {Function} onProfitClick - Handler when profit widget is clicked
 * @param {Function} onDebtClick - Handler when debt widget is clicked
 * @param {string} period - Period: 'today', 'week', 'month', 'year', 'period'
 * @param {boolean} darkMode - Dark mode flag
 */
function DashboardWidget({ onProfitClick, onDebtClick, period = "today", darkMode = false }) {
	const [data, setData] = useState(null)
	const [analysisData, setAnalysisData] = useState(null)
	const [loading, setLoading] = useState(true)
	const [analysisLoading, setAnalysisLoading] = useState(true)

	useEffect(() => {
		setLoading(true)
		setAnalysisLoading(true)
		
		// Load summary data
		const loadSummary = async () => {
			try {
				const queryParams = new URLSearchParams({ period });
				const response = await get(`/profit/dashboard/summary?${queryParams.toString()}`);
				if (response?.status === 200 || response?.status === 201) {
					setData(response.data);
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
		
		// Load analysis data
		const loadAnalysis = async () => {
			try {
				const queryParams = new URLSearchParams({ period });
				const response = await get(`/profit/dashboard/analysis?${queryParams.toString()}`);
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
		loadAnalysis();
	}, [period])

	if (loading) {
		return (
			<div className="dashboard-widget-loading" role="status" aria-label="Yuklanmoqda">
				<div className="dashboard-widget-skeleton" />
			</div>
		)
	}

	if (!data) {
		return (
			<div className="dashboard-widget-error" role="alert">
				Ma'lumotlarni yuklashda xatolik yuz berdi
			</div>
		)
	}

	const { profit, previous_profit, debt } = data

	// Calculate delta for MetricCard
	const calculateDelta = (current, previous) => {
		if (!previous || previous === 0) return current > 0 ? current : 0
		return current - previous
	}

	return (
		<div className={`dashboard-widget ${darkMode ? "dark" : ""}`} role="region" aria-label="Dashboard yig'ma ma'lumotlari">
			<div className="dashboard-widget-section">
				<h2 className="dashboard-widget-title">Foyda</h2>
				<div className="dashboard-widget-grid">
					<MetricCard
						title="Jami foyda"
						value={profit.total}
						delta={previous_profit ? calculateDelta(profit.total, previous_profit.total) : undefined}
						sparkline={profit.sparkline}
						color="success"
						onClick={onProfitClick}
						darkMode={darkMode}
						isCurrency={true}
					/>
					<MetricCard
						title="Daromad"
						value={profit.revenue}
						delta={previous_profit ? calculateDelta(profit.revenue, previous_profit.revenue) : undefined}
						sparkline={profit.sparkline}
						color="primary"
						darkMode={darkMode}
						isCurrency={true}
					/>
					<MetricCard
						title="Xarajat"
						value={profit.cost}
						delta={previous_profit ? calculateDelta(profit.cost, previous_profit.cost) : undefined}
						sparkline={profit.sparkline}
						color="primary"
						darkMode={darkMode}
						isCurrency={true}
					/>
				</div>
			</div>

			{/* Period Comparison */}
			{previous_profit && (
				<PeriodComparison
					current={profit}
					previous={previous_profit}
					period={period}
					darkMode={darkMode}
				/>
			)}

			{/* Profit Analysis */}
			{!analysisLoading && analysisData && (
				<ProfitAnalysis analysisData={analysisData} darkMode={darkMode} />
			)}

			<div className="dashboard-widget-section">
				<h2 className="dashboard-widget-title">Qarz</h2>
				<div className="dashboard-widget-grid">
					<MetricCard
						title="Qarz qoldig'i"
						value={debt.outstanding}
						sparkline={debt.sparkline}
						color="danger"
						onClick={onDebtClick}
						darkMode={darkMode}
						isCurrency={true}
					/>
					<MetricCard
						title="Muddat o'tgan"
						value={debt.overdue}
						color="danger"
						darkMode={darkMode}
						isCurrency={true}
					/>
					<MetricCard
						title="Faol mijozlar"
						value={debt.active_clients}
						color="primary"
						darkMode={darkMode}
						isCurrency={false}
					/>
				</div>
			</div>
		</div>
	)
}

export default DashboardWidget

