import React, { useEffect, useRef } from "react"
import { X } from "@phosphor-icons/react"
import "./Modal.css"

/**
 * Modal - Accessible modal component
 * @param {string} title - Modal title
 * @param {ReactNode} children - Modal content
 * @param {ReactNode} footer - Optional footer content
 * @param {boolean} open - Whether modal is open
 * @param {Function} onClose - Close handler
 * @param {string} size - Modal size: 'sm', 'md', 'lg', 'full'
 * @param {boolean} darkMode - Dark mode flag
 */
function Modal({ title, children, footer, open, onClose, size = "md", darkMode = false }) {
	const modalRef = useRef(null)
	const previousFocusRef = useRef(null)

	useEffect(() => {
		if (open) {
			// Store previous focus
			previousFocusRef.current = document.activeElement
			// Focus modal
			setTimeout(() => {
				modalRef.current?.focus()
			}, 100)
			// Prevent body scroll
			document.body.style.overflow = "hidden"
		} else {
			// Restore body scroll
			document.body.style.overflow = ""
			// Restore focus
			if (previousFocusRef.current) {
				previousFocusRef.current.focus()
			}
		}

		return () => {
			document.body.style.overflow = ""
		}
	}, [open])

	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === "Escape" && open && onClose) {
				onClose()
			}
		}

		if (open) {
			document.addEventListener("keydown", handleEscape)
		}

		return () => {
			document.removeEventListener("keydown", handleEscape)
		}
	}, [open, onClose])

	if (!open) return null

	return (
		<div
			className="modal-overlay"
			onClick={onClose}
			role="dialog"
			aria-modal="true"
			aria-labelledby={title ? "modal-title" : undefined}
		>
			<div
				ref={modalRef}
				className={`modal-content ${size} ${darkMode ? "dark" : ""}`}
				onClick={(e) => e.stopPropagation()}
				tabIndex={-1}
			>
				{title && (
					<div className="modal-header">
						<h2 id="modal-title" className="modal-title">
							{title}
						</h2>
						<button
							className="modal-close"
							onClick={onClose}
							aria-label="Modalni yopish"
							type="button"
						>
							<X size={20} />
						</button>
					</div>
				)}
				<div className="modal-body">{children}</div>
				{footer && <div className="modal-footer">{footer}</div>}
			</div>
		</div>
	)
}

export default Modal

