import React, { useState } from "react"
import "./pagination.css"

function Pagination({ pages, currentPage, onPageChange }) {
	const [activePage, setActivePage] = useState(currentPage || 1)

	const handlePageChange = (pageNumber) => {
		setActivePage(pageNumber)
		onPageChange(pageNumber)
	}

	const renderPaginationItems = () => {
		if (pages < 6) {
			return Array.from({ length: pages }, (_, i) => (
				<button
					key={i + 1}
					className={`page-item ${activePage === i + 1 ? "active" : "no"}`}
					onClick={() => handlePageChange(i + 1)}
				>
					{i + 1}
				</button>
			))
		} else {
			const pageCutLow = Math.max(1, Math.min(activePage - 2, pages - 4)) // Ensures valid range
			const pageCutHigh = Math.min(pages, Math.max(activePage + 2, 6)) // Ensures valid range

			return (
				<>
					{activePage > 3 && (
						<button
							className="no page-item"
							onClick={() => handlePageChange(1)}
						>
							1
						</button>
					)}
					{activePage > 4 && (
						<button
							className="out-of-range"
							onClick={() => handlePageChange(activePage - 3)}
						>
							...
						</button>
					)}
					{Array.from({ length: pageCutHigh - pageCutLow + 1 }, (_, i) => (
						<button
							key={pageCutLow + i}
							className={`page-item ${
								activePage === pageCutLow + i ? "active" : "no"
							}`}
							onClick={() => handlePageChange(pageCutLow + i)}
						>
							{pageCutLow + i}
						</button>
					))}
					{activePage < pages - 3 && (
						<button
							className="out-of-range"
							onClick={() => handlePageChange(activePage + 3)}
						>
							...
						</button>
					)}
					{activePage < pages - 2 && (
						<button
							className="no page-item"
							onClick={() => handlePageChange(pages)}
						>
							{pages}
						</button>
					)}
				</>
			)
		}
	}

	return (
		<div className="custom-pagination">
			<button
				disabled={activePage <= 1}
				className="page-item previous no"
				onClick={() => handlePageChange(activePage - 1)}
			>
				&lt;
			</button>
			<div className="wrapper">{renderPaginationItems()}</div>
			<button
				disabled={activePage >= pages}
				className="page-item next no"
				onClick={() => handlePageChange(activePage + 1)}
			>
				&gt;
			</button>
		</div>
	)
}

export default Pagination
