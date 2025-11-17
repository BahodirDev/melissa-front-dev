import React, { useState } from "react"
import { Calendar } from "@phosphor-icons/react"
import "./DateRangePicker.css"

/**
 * DateRangePicker - Date range picker with presets
 * @param {Object} value - {from: string, to: string}
 * @param {Function} onChange - Change handler
 * @param {Array} presets - Array of preset options
 * @param {boolean} darkMode - Dark mode flag
 */
function DateRangePicker({ value, onChange, presets = [], darkMode = false }) {
	const [showPresets, setShowPresets] = useState(false)

	const defaultPresets = [
		{ label: "Bugun", value: "today" },
		{ label: "Hafta", value: "week" },
		{ label: "Oy", value: "month" },
		{ label: "Yil", value: "year" },
	]

	const allPresets = presets.length > 0 ? presets : defaultPresets

	const applyPreset = (presetValue) => {
		const today = new Date()
		let from, to

		switch (presetValue) {
			case "today":
				from = new Date(today.setHours(0, 0, 0, 0)).toISOString().split("T")[0]
				to = new Date(today.setHours(23, 59, 59, 999)).toISOString().split("T")[0]
				break
			case "week":
				const weekStart = new Date(today)
				weekStart.setDate(today.getDate() - 7)
				from = weekStart.toISOString().split("T")[0]
				to = new Date().toISOString().split("T")[0]
				break
			case "month":
				const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
				from = monthStart.toISOString().split("T")[0]
				to = new Date().toISOString().split("T")[0]
				break
			case "year":
				const yearStart = new Date(today.getFullYear(), 0, 1)
				from = yearStart.toISOString().split("T")[0]
				to = new Date().toISOString().split("T")[0]
				break
			default:
				return
		}

		onChange({ from, to })
		setShowPresets(false)
	}

	return (
		<div className={`date-range-picker ${darkMode ? "dark" : ""}`}>
			<div className="date-range-inputs">
				<div className="date-input-group">
					<label htmlFor="date-from">Dan</label>
					<input
						id="date-from"
						type="date"
						value={value?.from || ""}
						onChange={(e) => onChange({ ...value, from: e.target.value })}
						className="date-input"
						aria-label="Boshlanish sanasi"
					/>
				</div>
				<div className="date-input-group">
					<label htmlFor="date-to">Gacha</label>
					<input
						id="date-to"
						type="date"
						value={value?.to || ""}
						onChange={(e) => onChange({ ...value, to: e.target.value })}
						className="date-input"
						aria-label="Tugash sanasi"
					/>
				</div>
			</div>
			{allPresets.length > 0 && (
				<div className="date-range-presets">
					<button
						type="button"
						className="preset-toggle"
						onClick={() => setShowPresets(!showPresets)}
						aria-label="Tezkor tanlovlar"
						aria-expanded={showPresets}
					>
						<Calendar size={16} />
						<span>Tezkor tanlov</span>
					</button>
					{showPresets && (
						<div className="preset-dropdown">
							{allPresets.map((preset) => (
								<button
									key={preset.value}
									type="button"
									className="preset-option"
									onClick={() => applyPreset(preset.value)}
								>
									{preset.label}
								</button>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	)
}

export default DateRangePicker

