import React from "react"
import "./Skeleton.css"

/**
 * Skeleton - Loading skeleton component
 * @param {string} variant - Skeleton variant: 'text', 'circular', 'rectangular'
 * @param {number} width - Width (for text/rectangular)
 * @param {number} height - Height
 * @param {boolean} darkMode - Dark mode flag
 */
function Skeleton({ variant = "rectangular", width, height, darkMode = false }) {
	const style = {}
	if (width) style.width = typeof width === "number" ? `${width}px` : width
	if (height) style.height = typeof height === "number" ? `${height}px` : height

	return (
		<div
			className={`skeleton ${variant} ${darkMode ? "dark" : ""}`}
			style={style}
			aria-hidden="true"
		/>
	)
}

/**
 * TableSkeleton - Skeleton for table rows
 */
export function TableSkeleton({ rows = 5, columns = 5, darkMode = false }) {
	return (
		<div className="table-skeleton" role="status" aria-label="Yuklanmoqda">
			{Array.from({ length: rows }).map((_, rowIdx) => (
				<div key={rowIdx} className="table-skeleton-row">
					{Array.from({ length: columns }).map((_, colIdx) => (
						<Skeleton
							key={colIdx}
							variant="rectangular"
							width="100%"
							height={48}
							darkMode={darkMode}
						/>
					))}
				</div>
			))}
		</div>
	)
}

export default Skeleton

