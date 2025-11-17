import React from "react"
import Modal from "./Modal"
import { Warning } from "@phosphor-icons/react"
import "./Confirmation.css"

/**
 * Confirmation - Confirmation modal component
 * @param {string} title - Confirmation title
 * @param {string|ReactNode} body - Confirmation message
 * @param {Function} onConfirm - Confirm handler
 * @param {Function} onCancel - Cancel handler
 * @param {boolean} open - Whether modal is open
 * @param {string} confirmLabel - Confirm button label
 * @param {string} cancelLabel - Cancel button label
 * @param {string} variant - Variant: 'danger', 'warning', 'info'
 * @param {boolean} darkMode - Dark mode flag
 */
function Confirmation({
	title = "Tasdiqlash",
	body,
	onConfirm,
	onCancel,
	open,
	confirmLabel = "Tasdiqlash",
	cancelLabel = "Bekor qilish",
	variant = "info",
	darkMode = false,
}) {
	return (
		<Modal
			title={title}
			open={open}
			onClose={onCancel}
			size="sm"
			darkMode={darkMode}
		>
			<div className={`confirmation-content ${variant} ${darkMode ? "dark" : ""}`}>
				<div className="confirmation-icon">
					<Warning size={32} />
				</div>
				<div className="confirmation-body">{body}</div>
				<div className="confirmation-actions">
					<button
						type="button"
						className="confirmation-btn confirmation-btn-cancel"
						onClick={onCancel}
					>
						{cancelLabel}
					</button>
					<button
						type="button"
						className={`confirmation-btn confirmation-btn-confirm ${variant}`}
						onClick={onConfirm}
					>
						{confirmLabel}
					</button>
				</div>
			</div>
		</Modal>
	)
}

export default Confirmation

