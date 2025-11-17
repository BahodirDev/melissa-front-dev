import React from "react"
import { FileX, Plus } from "@phosphor-icons/react"
import "./EmptyState.css"

/**
 * EmptyState - Empty state component with illustration and CTA
 * @param {string} title - Empty state title
 * @param {string} description - Empty state description
 * @param {string} ctaLabel - CTA button label
 * @param {Function} onCtaClick - CTA click handler
 * @param {ReactNode} icon - Optional custom icon
 * @param {boolean} darkMode - Dark mode flag
 */
function EmptyState({ title, description, ctaLabel, onCtaClick, icon, darkMode = false }) {
	return (
		<div className={`empty-state ${darkMode ? "dark" : ""}`} role="status" aria-live="polite">
			<div className="empty-state-icon">
				{icon || <FileX size={64} />}
			</div>
			<h3 className="empty-state-title">{title}</h3>
			{description && <p className="empty-state-description">{description}</p>}
			{ctaLabel && onCtaClick && (
				<button
					className="empty-state-cta"
					onClick={onCtaClick}
					aria-label={ctaLabel}
				>
					<Plus size={20} />
					{ctaLabel}
				</button>
			)}
		</div>
	)
}

export default EmptyState

