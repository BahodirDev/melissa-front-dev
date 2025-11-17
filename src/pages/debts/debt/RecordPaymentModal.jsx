import React, { useState } from "react"
import { CurrencyDollar } from "@phosphor-icons/react"
import Modal from "../components/Modal"
import Confirmation from "../components/Confirmation"
import { debtApi } from "../services/mockApi"
import { toast } from "react-toastify"
import "./RecordPaymentModal.css"

/**
 * RecordPaymentModal - Modal for recording a payment
 * @param {string} clientId - Client ID
 * @param {Object} client - Client data
 * @param {number} outstanding - Outstanding balance
 * @param {boolean} open - Whether modal is open
 * @param {Function} onClose - Close handler
 * @param {Function} onSuccess - Success callback
 * @param {boolean} darkMode - Dark mode flag
 */
function RecordPaymentModal({
	clientId,
	client,
	outstanding,
	open,
	onClose,
	onSuccess,
	darkMode = false,
}) {
	const [formData, setFormData] = useState({
		amount: outstanding || 0,
		method: "cash",
		note: "",
	})
	const [errors, setErrors] = useState({})
	const [loading, setLoading] = useState(false)
	const [showConfirm, setShowConfirm] = useState(false)
	const [optimisticUpdate, setOptimisticUpdate] = useState(null)

	// Update amount when outstanding changes
	React.useEffect(() => {
		if (open && outstanding) {
			setFormData((prev) => ({ ...prev, amount: outstanding }))
		}
	}, [open, outstanding])

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("uz-UZ", {
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount)
	}

	const validate = () => {
		const newErrors = {}
		if (!formData.amount || formData.amount <= 0) {
			newErrors.amount = "Summa 0 dan katta bo'lishi kerak"
		}
		if (formData.amount > outstanding) {
			newErrors.amount = `Summa qarz qoldig'idan (${formatCurrency(outstanding)} so'm) oshmasligi kerak`
		}
		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = async () => {
		if (!validate()) return

		setLoading(true)
		setOptimisticUpdate({
			amount: formData.amount,
			method: formData.method,
			note: formData.note,
			timestamp: new Date(),
		})

		try {
			const response = await debtApi.recordPayment(clientId, {
				amount: formData.amount,
				method: formData.method,
				note: formData.note,
			})

			if (response.status === 200) {
				toast.success("To'lov muvaffaqiyatli qayd etildi")
				setFormData({ amount: 0, method: "cash", note: "" })
				setOptimisticUpdate(null)
				onSuccess && onSuccess(response.data)
				onClose()
			} else {
				setOptimisticUpdate(null)
				toast.error("To'lov qayd etishda xatolik")
			}
		} catch (error) {
			setOptimisticUpdate(null)
			toast.error("To'lov qayd etishda xatolik")
		} finally {
			setLoading(false)
		}
	}

	const handleConfirm = () => {
		setShowConfirm(false)
		handleSubmit()
	}

	const handleAmountChange = (e) => {
		const value = parseFloat(e.target.value) || 0
		setFormData((prev) => ({ ...prev, amount: value }))
		if (errors.amount) {
			setErrors((prev) => ({ ...prev, amount: null }))
		}
	}

	const handleQuickAmount = (percent) => {
		const amount = Math.floor((outstanding * percent) / 100)
		setFormData((prev) => ({ ...prev, amount }))
	}

	return (
		<>
			<Modal
				title={`To'lov qayd etish: ${client?.name || "Mijoz"}`}
				open={open}
				onClose={onClose}
				size="md"
				darkMode={darkMode}
				footer={
					<div className="record-payment-footer">
						<button
							type="button"
							className="record-payment-btn record-payment-btn-cancel"
							onClick={onClose}
							disabled={loading}
						>
							Bekor qilish
						</button>
						<button
							type="button"
							className="record-payment-btn record-payment-btn-submit"
							onClick={() => setShowConfirm(true)}
							disabled={loading || !!errors.amount}
						>
							{loading ? "Yuklanmoqda..." : "Tasdiqlash"}
						</button>
					</div>
				}
			>
				<div className="record-payment-content">
					<div className="record-payment-outstanding">
						<span>Qarz qoldig'i:</span>
						<strong>{formatCurrency(outstanding)} so'm</strong>
					</div>

					{optimisticUpdate && (
						<div className="record-payment-optimistic" role="status">
							<span>To'lov qayd etilmoqda...</span>
						</div>
					)}

					<div className="record-payment-form">
						<div className="record-payment-field">
							<label htmlFor="payment-amount">
								Summa <span className="required">*</span>
							</label>
							<div className="record-payment-amount-input">
								<CurrencyDollar size={20} />
								<input
									id="payment-amount"
									type="number"
									value={formData.amount}
									onChange={handleAmountChange}
									className={errors.amount ? "error" : ""}
									min="0"
									max={outstanding}
									step="1000"
									aria-invalid={!!errors.amount}
									aria-describedby={errors.amount ? "amount-error" : undefined}
								/>
								<span className="record-payment-currency">so'm</span>
							</div>
							{errors.amount && (
								<span id="amount-error" className="record-payment-error" role="alert">
									{errors.amount}
								</span>
							)}
							<div className="record-payment-quick-amounts">
								<button
									type="button"
									className="record-payment-quick-btn"
									onClick={() => handleQuickAmount(25)}
								>
									25%
								</button>
								<button
									type="button"
									className="record-payment-quick-btn"
									onClick={() => handleQuickAmount(50)}
								>
									50%
								</button>
								<button
									type="button"
									className="record-payment-quick-btn"
									onClick={() => handleQuickAmount(75)}
								>
									75%
								</button>
								<button
									type="button"
									className="record-payment-quick-btn"
									onClick={() => handleQuickAmount(100)}
								>
									100%
								</button>
							</div>
						</div>

						<div className="record-payment-field">
							<label htmlFor="payment-method">
								To'lov usuli <span className="required">*</span>
							</label>
							<select
								id="payment-method"
								value={formData.method}
								onChange={(e) => setFormData((prev) => ({ ...prev, method: e.target.value }))}
								className="record-payment-select"
							>
								<option value="cash">Naqd</option>
								<option value="card">Karta</option>
								<option value="transfer">O'tkazma</option>
							</select>
						</div>

						<div className="record-payment-field">
							<label htmlFor="payment-note">Izoh</label>
							<textarea
								id="payment-note"
								value={formData.note}
								onChange={(e) => setFormData((prev) => ({ ...prev, note: e.target.value }))}
								className="record-payment-textarea"
								rows="3"
								placeholder="To'lov haqida qo'shimcha ma'lumot..."
							/>
						</div>

						<div className="record-payment-summary">
							<div className="record-payment-summary-row">
								<span>To'lanadi:</span>
								<strong>{formatCurrency(formData.amount)} so'm</strong>
							</div>
							<div className="record-payment-summary-row">
								<span>Qoladi:</span>
								<strong>
									{formatCurrency(Math.max(0, outstanding - formData.amount))} so'm
								</strong>
							</div>
						</div>
					</div>
				</div>
			</Modal>

			<Confirmation
				title="To'lovni tasdiqlash"
				body={
					<div>
						<p>
							<strong>{client?.name}</strong> uchun <strong>{formatCurrency(formData.amount)} so'm</strong>{" "}
							to'lov qayd etilmoqda.
						</p>
						<p>To'lov usuli: {formData.method === "cash" ? "Naqd" : formData.method === "card" ? "Karta" : "O'tkazma"}</p>
						{formData.note && <p>Izoh: {formData.note}</p>}
					</div>
				}
				open={showConfirm}
				onConfirm={handleConfirm}
				onCancel={() => setShowConfirm(false)}
				confirmLabel="Tasdiqlash"
				cancelLabel="Bekor qilish"
				variant="info"
				darkMode={darkMode}
			/>
		</>
	)
}

export default RecordPaymentModal

