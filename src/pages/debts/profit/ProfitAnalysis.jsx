import React from "react"
import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	Tooltip,
} from "chart.js"
import { Bar } from "react-chartjs-2"
import "./ProfitAnalysis.css"

// Register Chart.js components (must be done before using charts)
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

/**
 * ProfitAnalysis - Component showing profit factors analysis
 * @param {Object} analysisData - Analysis data with top products, stores, time breakdown
 * @param {boolean} darkMode - Dark mode flag
 */
function ProfitAnalysis({ analysisData, darkMode = false }) {
	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("uz-UZ", {
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount)
	}

	if (!analysisData) {
		return (
			<div className="profit-analysis-loading" role="status">
				Ma'lumotlar yuklanmoqda...
			</div>
		)
	}

	// Top products chart
	const topProductsData = {
		labels: analysisData.top_products?.map((p) => p.name) || [],
		datasets: [
			{
				label: "Foyda (so'm)",
				data: analysisData.top_products?.map((p) => p.profit) || [],
				backgroundColor: "#059669",
				borderColor: "#047857",
				borderWidth: 1,
			},
		],
	}

	// Top stores chart
	const topStoresData = {
		labels: analysisData.top_stores?.map((s) => s.name) || [],
		datasets: [
			{
				label: "Foyda (so'm)",
				data: analysisData.top_stores?.map((s) => s.profit) || [],
				backgroundColor: "#1f2937",
				borderColor: "#374151",
				borderWidth: 1,
			},
		],
	}

	// Time breakdown chart
	const timeBreakdownData = {
		labels: analysisData.time_breakdown?.map((t) => t.label) || [],
		datasets: [
			{
				label: "Foyda (so'm)",
				data: analysisData.time_breakdown?.map((t) => t.profit) || [],
				backgroundColor: "#3b82f6",
				borderColor: "#2563eb",
				borderWidth: 1,
			},
		],
	}

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
						return formatCurrency(context.parsed.y) + " so'm"
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
							return (value / 1000000).toFixed(1) + "M"
						}
						if (value >= 1000) {
							return (value / 1000).toFixed(0) + "K"
						}
						return value
					},
				},
			},
		},
	}

	return (
		<div className={`profit-analysis ${darkMode ? "dark" : ""}`}>
			<h3 className="profit-analysis-title">Foyda omillari tahlili</h3>

			<div className="profit-analysis-grid">
				{/* Top Products */}
				{analysisData.top_products && analysisData.top_products.length > 0 && (
					<div className="profit-analysis-card">
						<h4 className="profit-analysis-card-title">Eng ko'p foyda keltirgan mahsulotlar</h4>
						<div className="profit-analysis-chart">
							<Bar data={topProductsData} options={chartOptions} />
						</div>
						<div className="profit-analysis-list">
							{analysisData.top_products.slice(0, 5).map((product, idx) => (
								<div key={idx} className="profit-analysis-item">
									<span className="profit-analysis-item-name">{product.name}</span>
									<span className="profit-analysis-item-value">
										{formatCurrency(product.profit)} so'm
									</span>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Top Stores */}
				{analysisData.top_stores && analysisData.top_stores.length > 0 && (
					<div className="profit-analysis-card">
						<h4 className="profit-analysis-card-title">Eng ko'p foyda keltirgan do'konlar</h4>
						<div className="profit-analysis-chart">
							<Bar data={topStoresData} options={chartOptions} />
						</div>
						<div className="profit-analysis-list">
							{analysisData.top_stores.slice(0, 5).map((store, idx) => (
								<div key={idx} className="profit-analysis-item">
									<span className="profit-analysis-item-name">{store.name}</span>
									<span className="profit-analysis-item-value">
										{formatCurrency(store.profit)} so'm
									</span>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Time Breakdown */}
				{analysisData.time_breakdown && analysisData.time_breakdown.length > 0 && (
					<div className="profit-analysis-card">
						<h4 className="profit-analysis-card-title">Vaqt bo'yicha taqsimot</h4>
						<div className="profit-analysis-chart">
							<Bar data={timeBreakdownData} options={chartOptions} />
						</div>
						<div className="profit-analysis-list">
							{analysisData.time_breakdown.map((time, idx) => (
								<div key={idx} className="profit-analysis-item">
									<span className="profit-analysis-item-name">{time.label}</span>
									<span className="profit-analysis-item-value">
										{formatCurrency(time.profit)} so'm
									</span>
								</div>
							))}
						</div>
					</div>
				)}
			</div>

			{/* Key Insights */}
			{analysisData.insights && analysisData.insights.length > 0 && (
				<div className="profit-analysis-insights">
					<h4 className="profit-analysis-insights-title">Asosiy xulosalar</h4>
					<ul className="profit-analysis-insights-list">
						{analysisData.insights.map((insight, idx) => (
							<li key={idx} className="profit-analysis-insight-item">
								{insight}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	)
}

export default ProfitAnalysis

