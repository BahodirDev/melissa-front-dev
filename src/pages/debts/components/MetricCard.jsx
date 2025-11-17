import React from "react"
import "./MetricCard.css"

/**
 * MetricCard - Displays a metric with title, value, optional delta, and sparkline
 * @param {string} title - Metric title
 * @param {number|string} value - Metric value
 * @param {number} delta - Optional delta/change value
 * @param {Array<number>} sparkline - Optional array of values for sparkline chart
 * @param {string} color - Color theme: 'primary', 'success', 'danger', 'warning'
 * @param {Function} onClick - Optional click handler
 * @param {boolean} darkMode - Dark mode flag
 */
function MetricCard({ title, value, delta, sparkline, color = "primary", onClick, darkMode = false }) {
	const formatValue = (val) => {
		if (typeof val === "number") {
			return new Intl.NumberFormat("uz-UZ", {
				minimumFractionDigits: 0,
				maximumFractionDigits: 0,
			}).format(val)
		}
		return val
	}

	const renderSparkline = () => {
		if (!sparkline || sparkline.length === 0) return null

		const max = Math.max(...sparkline)
		const min = Math.min(...sparkline)
		const range = max - min || 1

		const points = sparkline.map((val, idx) => {
			const x = (idx / (sparkline.length - 1)) * 100
			const y = 100 - ((val - min) / range) * 100
			return `${x},${y}`
		}).join(" ")

		return (
			<svg
				className="metric-sparkline"
				viewBox="0 0 100 100"
				preserveAspectRatio="none"
				aria-hidden="true"
			>
				<polyline
					points={points}
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					vectorEffect="non-scaling-stroke"
				/>
			</svg>
		)
	}

	return (
		<div
			className={`metric-card ${color} ${darkMode ? "dark" : ""} ${onClick ? "clickable" : ""}`}
			onClick={onClick}
			role={onClick ? "button" : "region"}
			tabIndex={onClick ? 0 : -1}
			aria-label={onClick ? `${title}: ${formatValue(value)}. Bosing` : `${title}: ${formatValue(value)}`}
			onKeyDown={(e) => {
				if (onClick && (e.key === "Enter" || e.key === " ")) {
					e.preventDefault()
					onClick()
				}
			}}
		>
			<div className="metric-header">
				<h3 className="metric-title">{title}</h3>
				{delta !== undefined && (
					<span className={`metric-delta ${delta >= 0 ? "positive" : "negative"}`}>
						{delta >= 0 ? "+" : ""}{formatValue(delta)}
					</span>
				)}
			</div>
			<div className="metric-value">{formatValue(value)} so'm</div>
			{sparkline && <div className="metric-sparkline-container">{renderSparkline()}</div>}
		</div>
	)
}

export default MetricCard

