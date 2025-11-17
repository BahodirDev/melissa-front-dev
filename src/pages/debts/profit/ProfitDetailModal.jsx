import React, { useState, useEffect } from "react"
import { Download, Pencil } from "@phosphor-icons/react"
import Modal from "../components/Modal"
import DataTable from "../components/DataTable"
import { profitApi } from "../services/mockApi"
import "./ProfitDetailModal.css"

/**
 * ProfitDetailModal - Modal showing profit detail with items breakdown
 * @param {string} invoiceId - Invoice ID
 * @param {boolean} open - Whether modal is open
 * @param {Function} onClose - Close handler
 * @param {Function} onAdjust - Handler for adjust profit action
 * @param {boolean} isAdmin - Whether user is admin
 * @param {boolean} darkMode - Dark mode flag
 */
function ProfitDetailModal({ invoiceId, open, onClose, onAdjust, isAdmin = false, darkMode = false }) {
	const [data, setData] = useState(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const [lastUpdated, setLastUpdated] = useState(null)

	useEffect(() => {
		if (open && invoiceId) {
			loadDetail()
		}
	}, [open, invoiceId])

	const loadDetail = async () => {
		setLoading(true)
		setError(null)
		try {
			const response = await profitApi.getDetail(invoiceId)
			if (response.status === 200) {
				setData(response.data)
				setLastUpdated(new Date())
			} else {
				setError("Ma'lumotlarni yuklashda xatolik")
			}
		} catch (err) {
			setError("Ma'lumotlarni yuklashda xatolik")
		} finally {
			setLoading(false)
		}
	}

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

	const handleExport = () => {
		// Mock export
		console.log("Exporting invoice:", invoiceId)
	}

	const columns = [
		{ 
			key: "name", 
			label: "Mahsulot", 
			sortable: false,
		},
		{ 
			key: "qty", 
			label: "Miqdor", 
			sortable: false,
			render: (value) => <span className="profit-detail-qty">{value} ta</span>,
		},
		{
			key: "unit_price",
			label: "Narx (sotuv)",
			sortable: false,
			render: (value) => (
				<span className="profit-detail-price">{formatCurrency(value)} so'm</span>
			),
		},
		{
			key: "revenue",
			label: "Daromad",
			sortable: false,
			render: (value) => (
				<span className="profit-detail-revenue">{formatCurrency(value)} so'm</span>
			),
		},
		{
			key: "profit",
			label: "Foyda",
			sortable: false,
			render: (value) => (
				<span className={`profit-detail-value ${value >= 0 ? "positive" : "negative"}`}>
					{formatCurrency(value)} so'm
				</span>
			),
		},
	]

	if (!open) return null

	return (
		<Modal
			title={`Foyda tafsilotlari: ${invoiceId}`}
			open={open}
			onClose={onClose}
			size="lg"
			darkMode={darkMode}
			footer={
				<div className="profit-detail-footer">
					<button
						type="button"
						className="profit-detail-btn profit-detail-btn-secondary"
						onClick={onClose}
					>
						Yopish
					</button>
					<button
						type="button"
						className="profit-detail-btn profit-detail-btn-primary"
						onClick={handleExport}
					>
						<Download size={20} />
						PDF yuklab olish
					</button>
					{isAdmin && (
						<button
							type="button"
							className="profit-detail-btn profit-detail-btn-warning"
							onClick={() => onAdjust && onAdjust(invoiceId, data)}
						>
							<Pencil size={20} />
							Foydani tahrirlash
						</button>
					)}
				</div>
			}
		>
			{loading && (
				<div className="profit-detail-loading" role="status" aria-label="Yuklanmoqda">
					Yuklanmoqda...
				</div>
			)}

			{error && (
				<div className="profit-detail-error" role="alert">
					{error}
					<button type="button" onClick={loadDetail}>
						Qayta urinish
					</button>
				</div>
			)}

			{!loading && !error && data && (
				<div className="profit-detail-content">
					{/* Simplified Header */}
					<div className="profit-detail-header">
						<div className="profit-detail-header-main">
							<div className="profit-detail-header-info">
								<div className="profit-detail-header-item">
									<span className="profit-detail-header-label">Sana:</span>
									<span className="profit-detail-header-value">{formatDate(data.date)}</span>
								</div>
								<div className="profit-detail-header-item">
									<span className="profit-detail-header-label">Do'kon:</span>
									<span className="profit-detail-header-value">{data.store}</span>
								</div>
								<div className="profit-detail-header-item">
									<span className="profit-detail-header-label">Mahsulotlar:</span>
									<span className="profit-detail-header-value">{data.items.length} ta</span>
								</div>
							</div>
							<div className="profit-detail-badge">
								<span className={`profit-badge ${data.totals.profit >= 0 ? "positive" : "negative"}`}>
									{data.totals.profit >= 0 ? "✓" : "✗"} {formatCurrency(Math.abs(data.totals.profit))} so'm
								</span>
							</div>
						</div>
					</div>

					{/* Quick Summary */}
					<div className="profit-detail-quick-summary">
						<div className="profit-detail-quick-item">
							<span className="profit-detail-quick-label">Jami daromad</span>
							<span className="profit-detail-quick-value">{formatCurrency(data.totals.revenue)} so'm</span>
						</div>
						<div className="profit-detail-quick-item">
							<span className="profit-detail-quick-label">Jami xarajat</span>
							<span className="profit-detail-quick-value">{formatCurrency(data.totals.cost)} so'm</span>
						</div>
						<div className="profit-detail-quick-item profit-detail-quick-item-main">
							<span className="profit-detail-quick-label">Jami foyda</span>
							<span className={`profit-detail-quick-value ${data.totals.profit >= 0 ? "positive" : "negative"}`}>
								{formatCurrency(data.totals.profit)} so'm
							</span>
						</div>
					</div>

					{/* Items Table */}
					<div className="profit-detail-items">
						<h4 className="profit-detail-items-title">Mahsulotlar ro'yxati</h4>
						<DataTable
							columns={columns}
							data={data.items}
							darkMode={darkMode}
						/>
					</div>
				</div>
			)}
		</Modal>
	)
}

export default ProfitDetailModal

