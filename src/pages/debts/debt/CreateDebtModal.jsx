import React, { useState, useEffect } from "react"
import { Plus, X, Info } from "@phosphor-icons/react"
import Modal from "../components/Modal"
import { post } from "../../../customHook/api"
import { toast } from "react-toastify"
import { Select } from "antd"
import "./CreateDebtModal.css"

/**
 * CreateDebtModal - Modal for creating a new debt manually
 * @param {boolean} open - Whether modal is open
 * @param {Function} onClose - Close handler
 * @param {Function} onSuccess - Success callback
 * @param {Array} clients - List of clients for selection
 * @param {boolean} darkMode - Dark mode flag
 */
function CreateDebtModal({ open, onClose, onSuccess, clients = [], darkMode = false }) {
	const [formData, setFormData] = useState({
		client_id: null,
		amount: 0,
		due_date: "",
		note: "",
	})
	const [errors, setErrors] = useState({})
	const [loading, setLoading] = useState(false)

	// Reset form when modal opens/closes
	useEffect(() => {
		if (open) {
			setFormData({
				client_id: null,
				amount: 0,
				due_date: "",
				note: "",
			})
			setErrors({})
		}
	}, [open])

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("uz-UZ", {
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount)
	}

	const validate = () => {
		const newErrors = {}
		if (!formData.client_id) {
			newErrors.client_id = "Mijoz tanlash majburiy"
		}
		if (!formData.amount || formData.amount <= 0) {
			newErrors.amount = "Summa 0 dan katta bo'lishi kerak"
		}
		if (!formData.due_date) {
			newErrors.due_date = "Muddat tanlash majburiy"
		}
		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = async () => {
		if (!validate()) return

		setLoading(true)
		try {
			// Ensure due_date is in ISO format
			let dueDate = formData.due_date
			if (dueDate && !dueDate.includes('T')) {
				// If it's just a date string (YYYY-MM-DD), convert to ISO
				dueDate = new Date(dueDate + 'T00:00:00').toISOString()
			}
			
			const response = await post("/client-debts/create", {
				client_id: formData.client_id,
				amount: parseFloat(formData.amount),
				due_date: dueDate,
				note: formData.note || null,
			})

			if (response?.status === 200 || response?.status === 201) {
				toast.success("Qarz muvaffaqiyatli qo'shildi")
				onSuccess && onSuccess(response.data)
				onClose()
			} else {
				const errorMsg = response?.data?.message || response?.response?.data?.message || "Qarz qo'shishda xatolik"
				toast.error(errorMsg)
			}
		} catch (error) {
			const errorMsg = error?.response?.data?.message || "Qarz qo'shishda xatolik"
			toast.error(errorMsg)
		} finally {
			setLoading(false)
		}
	}

	return (
		<Modal
			title="Yangi qarz qo'shish"
			open={open}
			onClose={onClose}
			size="md"
			darkMode={darkMode}
			footer={
				<div className="create-debt-footer">
					<button
						type="button"
						className="create-debt-btn create-debt-btn-cancel"
						onClick={onClose}
						disabled={loading}
					>
						Bekor qilish
					</button>
					<button
						type="button"
						className="create-debt-btn create-debt-btn-submit"
						onClick={handleSubmit}
						disabled={loading}
					>
						{loading ? "Yuklanmoqda..." : "Qo'shish"}
					</button>
				</div>
			}
		>
			<div className={`create-debt-content ${darkMode ? "dark" : ""}`}>
				<div className="create-debt-field">
					<label htmlFor="debt-client">
						Mijoz <span className="required">*</span>
					</label>
					<Select
						id="debt-client"
						showSearch
						placeholder="Mijoz tanlang"
						className="create-debt-select"
						value={formData.client_id}
						onChange={(value) => {
							setFormData((prev) => ({ ...prev, client_id: value }))
							if (errors.client_id) {
								setErrors((prev) => ({ ...prev, client_id: null }))
							}
						}}
						filterOption={(input, option) =>
							(option?.label ?? "").toLowerCase().includes(input.toLowerCase())
						}
						options={clients.map((client) => ({
							value: client.client_id || client.id,
							label: `${client.name || client.clients_name} - ${client.phone || client.clients_nomer}`,
						}))}
					/>
					{errors.client_id && (
						<span className="create-debt-error" role="alert">
							{errors.client_id}
						</span>
					)}
				</div>

				<div className="create-debt-field">
					<label htmlFor="debt-amount">
						Qarz summasi <span className="required">*</span>
					</label>
					<div className="create-debt-amount-input">
						<input
							id="debt-amount"
							type="number"
							value={formData.amount}
							onChange={(e) => {
								const value = parseFloat(e.target.value) || 0
								setFormData((prev) => ({ ...prev, amount: value }))
								if (errors.amount) {
									setErrors((prev) => ({ ...prev, amount: null }))
								}
							}}
							className={errors.amount ? "error" : ""}
							min="0"
							step="1000"
							placeholder="Summa kiriting"
						/>
						<span className="create-debt-currency">so'm</span>
					</div>
					{errors.amount && (
						<span className="create-debt-error" role="alert">
							{errors.amount}
						</span>
					)}
					{formData.amount > 0 && (
						<div className="create-debt-amount-preview">
							{formatCurrency(formData.amount)} so'm
						</div>
					)}
				</div>

				<div className="create-debt-field">
					<label htmlFor="debt-due-date">
						Muddat <span className="required">*</span>
					</label>
					<input
						id="debt-due-date"
						type="date"
						value={formData.due_date}
						onChange={(e) => {
							setFormData((prev) => ({ ...prev, due_date: e.target.value }))
							if (errors.due_date) {
								setErrors((prev) => ({ ...prev, due_date: null }))
							}
						}}
						className={errors.due_date ? "error" : ""}
						min={new Date().toISOString().split("T")[0]}
					/>
					{errors.due_date && (
						<span className="create-debt-error" role="alert">
							{errors.due_date}
						</span>
					)}
				</div>

				<div className="create-debt-field">
					<label htmlFor="debt-note">Izoh</label>
					<textarea
						id="debt-note"
						value={formData.note}
						onChange={(e) => setFormData((prev) => ({ ...prev, note: e.target.value }))}
						className="create-debt-textarea"
						rows="3"
						placeholder="Qarz haqida qo'shimcha ma'lumot..."
					/>
				</div>

				<div className="create-debt-info">
					<div className="create-debt-info-icon">
						<Info size={18} />
					</div>
					<div className="create-debt-info-content">
						<strong>Qo'lda qarz qo'shish</strong>
						<p>
							Hozircha qarzlar faqat qo'lda kiritiladi. Sotuv bilan avtomatik bog'lanish funksiyasi keyinchalik qo'shiladi.
							Bu forma orqali mijozga qarz qo'shishingiz mumkin.
						</p>
					</div>
				</div>
			</div>
		</Modal>
	)
}

export default CreateDebtModal

