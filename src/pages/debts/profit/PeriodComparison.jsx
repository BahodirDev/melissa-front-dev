import React from "react"
import { TrendUp, TrendDown, Minus } from "@phosphor-icons/react"
import "./PeriodComparison.css"

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
		}).format(amount)
	}

	const calculateChange = (currentVal, previousVal) => {
		if (!previousVal || previousVal === 0) {
			return currentVal > 0 ? { value: 100, type: "increase" } : { value: 0, type: "neutral" }
		}
		const change = ((currentVal - previousVal) / previousVal) * 100
		return {
			value: Math.abs(change),
			type: change > 0 ? "increase" : change < 0 ? "decrease" : "neutral",
		}
	}

	const getPeriodLabel = (periodType) => {
		const labels = {
			today: "Kecha",
			week: "O'tgan hafta",
			month: "O'tgan oy",
			year: "O'tgan yil",
		}
		return labels[periodType] || "Oldingi davr"
	}

	const profitChange = calculateChange(current?.total || 0, previous?.total || 0)
	const revenueChange = calculateChange(current?.revenue || 0, previous?.revenue || 0)
	const costChange = calculateChange(current?.cost || 0, previous?.cost || 0)

	const renderChange = (change, label) => {
		if (change.type === "neutral") {
			return (
				<div className="comparison-item-neutral">
					<Minus size={16} />
					<span>O'zgarmadi</span>
				</div>
			)
		}

		return (
			<div className={`comparison-item comparison-item-${change.type}`}>
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
		)
	}

	return (
		<div className={`period-comparison ${darkMode ? "dark" : ""}`}>
			<div className="period-comparison-header">
				<h3 className="period-comparison-title">Taqqoslash: {getPeriodLabel(period)} bilan</h3>
			</div>

			<div className="period-comparison-grid">
				<div className="comparison-card">
					<div className="comparison-card-header">
						<span className="comparison-label">Jami foyda</span>
						{renderChange(profitChange, "o'sdi")}
					</div>
					<div className="comparison-values">
						<div className="comparison-value">
							<span className="comparison-value-label">Joriy:</span>
							<strong className="comparison-value-current">
								{formatCurrency(current?.total || 0)} so'm
							</strong>
						</div>
						<div className="comparison-value">
							<span className="comparison-value-label">Oldingi:</span>
							<span className="comparison-value-previous">
								{formatCurrency(previous?.total || 0)} so'm
							</span>
						</div>
					</div>
				</div>

				<div className="comparison-card">
					<div className="comparison-card-header">
						<span className="comparison-label">Daromad</span>
						{renderChange(revenueChange, "o'sdi")}
					</div>
					<div className="comparison-values">
						<div className="comparison-value">
							<span className="comparison-value-label">Joriy:</span>
							<strong className="comparison-value-current">
								{formatCurrency(current?.revenue || 0)} so'm
							</strong>
						</div>
						<div className="comparison-value">
							<span className="comparison-value-label">Oldingi:</span>
							<span className="comparison-value-previous">
								{formatCurrency(previous?.revenue || 0)} so'm
							</span>
						</div>
					</div>
				</div>

				<div className="comparison-card">
					<div className="comparison-card-header">
						<span className="comparison-label">Xarajat</span>
						{renderChange(costChange, "kamaydi")}
					</div>
					<div className="comparison-values">
						<div className="comparison-value">
							<span className="comparison-value-label">Joriy:</span>
							<strong className="comparison-value-current">
								{formatCurrency(current?.cost || 0)} so'm
							</strong>
						</div>
						<div className="comparison-value">
							<span className="comparison-value-label">Oldingi:</span>
							<span className="comparison-value-previous">
								{formatCurrency(previous?.cost || 0)} so'm
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default PeriodComparison

