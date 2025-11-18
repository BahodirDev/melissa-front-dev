import React, { useState, useEffect } from "react"
import { Download, Pencil } from "@phosphor-icons/react"
import Modal from "../components/Modal"
import DataTable from "../components/DataTable"
import { get } from "../../../customHook/api";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
			const response = await get(`/profit/detail/${invoiceId}`)
			if (response?.status === 200 || response?.status === 201) {
				setData(response.data)
				setLastUpdated(new Date())
			} else {
				setError("Ma'lumotlarni yuklashda xatolik")
				toast.error("Ma'lumotlarni yuklashda xatolik")
			}
		} catch (err) {
			setError("Ma'lumotlarni yuklashda xatolik")
			toast.error("Ma'lumotlarni yuklashda xatolik")
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
		if (!data || !data.items || data.items.length === 0) {
			toast.warning("Eksport qilish uchun ma'lumot mavjud emas");
			return;
		}

		try {
			const doc = new jsPDF("portrait", "mm", "a4");

			// Title
			doc.setFontSize(18);
			doc.text(`Foyda Tafsilotlari: ${data.invoice_id}`, 14, 15);

			// Invoice info
			doc.setFontSize(10);
			let yPos = 25;
			doc.text(`Sana: ${formatDate(data.date)}`, 14, yPos);
			yPos += 6;
			doc.text(`Do'kon: ${data.store}`, 14, yPos);
			yPos += 6;
			doc.text(`Mahsulotlar soni: ${data.items.length} ta`, 14, yPos);
			yPos += 10;

			// Prepare table data
			const tableData = data.items.map((item) => [
				item.name || "",
				`${item.qty || 0} ta`,
				formatCurrency(item.unit_price),
				formatCurrency(item.revenue),
				formatCurrency(item.cost),
				formatCurrency(item.profit),
			]);

			// Add totals row
			tableData.push([
				"JAMI:",
				"",
				"",
				formatCurrency(data.totals.revenue),
				formatCurrency(data.totals.cost),
				formatCurrency(data.totals.profit),
			]);

			// Create table
			autoTable(doc, {
				startY: yPos,
				head: [
					[
						"Mahsulot",
						"Miqdor",
						"Narx (sotuv)",
						"Daromad",
						"Xarajat",
						"Foyda",
					],
				],
				body: tableData,
				theme: "striped",
				headStyles: {
					fillColor: [66, 139, 202],
					textColor: 255,
					fontStyle: "bold",
				},
				styles: {
					fontSize: 9,
					cellPadding: 3,
				},
				columnStyles: {
					0: { cellWidth: 60 },
					1: { cellWidth: 25, halign: "center" },
					2: { cellWidth: 30, halign: "right" },
					3: { cellWidth: 30, halign: "right" },
					4: { cellWidth: 30, halign: "right" },
					5: { cellWidth: 30, halign: "right" },
				},
				margin: { top: yPos, left: 14, right: 14 },
			});

			// Footer
			const pageCount = doc.internal.getNumberOfPages();
			for (let i = 1; i <= pageCount; i++) {
				doc.setPage(i);
				doc.setFontSize(8);
				doc.text(
					`Sahifa ${i} / ${pageCount}`,
					doc.internal.pageSize.getWidth() / 2,
					doc.internal.pageSize.getHeight() - 10,
					{ align: "center" }
				);
				doc.text(
					new Date().toLocaleString("uz-UZ"),
					doc.internal.pageSize.getWidth() - 14,
					doc.internal.pageSize.getHeight() - 10,
					{ align: "right" }
				);
			}

			// Generate filename
			const now = new Date();
			const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1)
				.toString()
				.padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;
			const formattedTime = `${now.getHours().toString().padStart(2, "0")}-${now
				.getMinutes()
				.toString()
				.padStart(2, "0")}-${now.getSeconds().toString().padStart(2, "0")}`;
			const filename = `Foyda_tafsiloti_${data.invoice_id}_${formattedDate}_${formattedTime}.pdf`;

			// Save PDF
			doc.save(filename);
			toast.success("PDF muvaffaqiyatli yuklab olindi");
		} catch (error) {
			console.error("Export error:", error);
			toast.error("PDF yuklab olishda xatolik");
		}
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

