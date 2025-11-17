import React, { useState, useEffect } from "react"
import { Download, ArrowLeft } from "@phosphor-icons/react"
import DataTable from "../components/DataTable"
import DateRangePicker from "../components/DateRangePicker"
import { debtApi } from "../services/mockApi"
import "./DebtLedger.css"

/**
 * DebtLedger - Client debt ledger/history view
 * @param {string} clientId - Client ID
 * @param {Object} client - Client data
 * @param {Function} onBack - Back handler
 * @param {Function} onRecordPayment - Handler to record payment
 * @param {boolean} darkMode - Dark mode flag
 */
function DebtLedger({ clientId, client, onBack, onRecordPayment, darkMode = false }) {
	const [data, setData] = useState(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const [filters, setFilters] = useState({
		from: null,
		to: null,
		type: null,
	})

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("uz-UZ", {
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount)
	}

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString("uz-UZ", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
		})
	}

	const loadData = async () => {
		setLoading(true)
		setError(null)
		try {
			const response = await debtApi.getLedger(clientId, filters)
			if (response.status === 200) {
				setData(response.data)
			} else {
				setError("Ma'lumotlarni yuklashda xatolik")
			}
		} catch (err) {
			setError("Ma'lumotlarni yuklashda xatolik")
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (clientId) {
			loadData()
		}
	}, [clientId, filters])

	const handleFilterChange = (key, value) => {
		setFilters((prev) => ({ ...prev, [key]: value }))
	}

	const handleDateRangeChange = (range) => {
		setFilters((prev) => ({
			...prev,
			from: range.from || null,
			to: range.to || null,
		}))
	}

	const handleExport = () => {
		// Mock export
		console.log("Exporting ledger for:", clientId)
	}

	const columns = [
		{
			key: "date",
			label: "Sana",
			sortable: false,
			render: (value) => formatDate(value),
		},
		{
			key: "type",
			label: "Turi",
			sortable: false,
			render: (value) => {
				const labels = {
					sale: "Sotuv",
					payment: "To'lov",
					writeoff: "Yozib olish",
				}
				return (
					<span className={`ledger-type ledger-type-${value}`}>
						{labels[value] || value}
					</span>
				)
			},
		},
		{
			key: "amount",
			label: "Summa",
			sortable: false,
			render: (value, row) => {
				const isNegative = row.type === "payment" || row.type === "writeoff"
				return (
					<span className={`ledger-amount ${isNegative ? "negative" : "positive"}`}>
						{isNegative ? "-" : "+"}
						{formatCurrency(value)} so'm
					</span>
				)
			},
		},
		{
			key: "balance_after",
			label: "Qoldiq",
			sortable: false,
			render: (value) => formatCurrency(value) + " so'm",
		},
		{
			key: "note",
			label: "Izoh",
			sortable: false,
		},
		{
			key: "operator",
			label: "Operator",
			sortable: false,
		},
	]

	if (!clientId) return null

	return (
		<div className={`debt-ledger ${darkMode ? "dark" : ""}`}>
			<div className="debt-ledger-header">
				<button
					type="button"
					className="debt-ledger-back"
					onClick={onBack}
					aria-label="Orqaga"
				>
					<ArrowLeft size={20} />
					Orqaga
				</button>
				<div className="debt-ledger-info">
					<h2 className="debt-ledger-title">{client?.name || "Mijoz"}</h2>
					{data && (
						<div className="debt-ledger-balance">
							<span className="debt-ledger-balance-label">Joriy qoldiq:</span>
							<span className={`debt-ledger-balance-value ${data.balance > 0 ? "has-debt" : "cleared"}`}>
								{formatCurrency(data.balance)} so'm
							</span>
						</div>
					)}
				</div>
				<button
					type="button"
					className="debt-ledger-export"
					onClick={handleExport}
					aria-label="CSV ga eksport qilish"
				>
					<Download size={20} />
					Eksport
				</button>
			</div>

			<div className="debt-ledger-filters">
				<DateRangePicker
					value={{ from: filters.from, to: filters.to }}
					onChange={handleDateRangeChange}
					darkMode={darkMode}
				/>
				<div className="debt-ledger-type-filter">
					<label>Turi</label>
					<select
						value={filters.type || ""}
						onChange={(e) => handleFilterChange("type", e.target.value || null)}
						className="debt-ledger-select"
					>
						<option value="">Barchasi</option>
						<option value="sale">Sotuv</option>
						<option value="payment">To'lov</option>
						<option value="writeoff">Yozib olish</option>
					</select>
				</div>
				{data && data.balance > 0 && (
					<button
						type="button"
						className="debt-ledger-payment-btn"
						onClick={() => onRecordPayment && onRecordPayment(clientId, client, data.balance)}
					>
						To'lov qayd etish
					</button>
				)}
			</div>

			{error && (
				<div className="debt-ledger-error" role="alert">
					{error}
					<button type="button" onClick={loadData}>
						Qayta urinish
					</button>
				</div>
			)}

			{!loading && !error && data && (
				<DataTable
					columns={columns}
					data={data.history}
					loading={loading}
					darkMode={darkMode}
				/>
			)}
		</div>
	)
}

export default DebtLedger

