import React, { useState } from "react"
import { CaretUp, CaretDown } from "@phosphor-icons/react"
import "./DataTable.css"

/**
 * DataTable - Accessible data table with sorting, selection, and actions
 * @param {Array} columns - Column definitions [{key, label, sortable, render}]
 * @param {Array} data - Table data
 * @param {boolean} loading - Loading state
 * @param {Function} onSort - Sort handler (key, order)
 * @param {Function} onRowClick - Row click handler
 * @param {Function} renderActions - Actions render function (row) => ReactNode
 * @param {boolean} selectable - Enable row selection
 * @param {Array} selectedRows - Selected row IDs
 * @param {Function} onSelectionChange - Selection change handler
 * @param {boolean} darkMode - Dark mode flag
 */
function DataTable({
	columns,
	data,
	loading = false,
	onSort,
	onRowClick,
	renderActions,
	selectable = false,
	selectedRows = [],
	onSelectionChange,
	darkMode = false,
}) {
	const [sortKey, setSortKey] = useState(null)
	const [sortOrder, setSortOrder] = useState("asc")

	// Ensure data is always an array
	const safeData = Array.isArray(data) ? data : []

	const handleSort = (key, sortable) => {
		if (!sortable || !onSort) return

		const newOrder = sortKey === key && sortOrder === "asc" ? "desc" : "asc"
		setSortKey(key)
		setSortOrder(newOrder)
		onSort(key, newOrder)
	}

	const handleSelectAll = (e) => {
		if (!selectable || !onSelectionChange) return
		if (e.target.checked) {
			onSelectionChange(safeData.map((row) => row.id || row.invoice_id || row.client_id))
		} else {
			onSelectionChange([])
		}
	}

	const handleSelectRow = (rowId, e) => {
		if (!selectable || !onSelectionChange) return
		e.stopPropagation()
		if (selectedRows.includes(rowId)) {
			onSelectionChange(selectedRows.filter((id) => id !== rowId))
		} else {
			onSelectionChange([...selectedRows, rowId])
		}
	}

	const isAllSelected = selectable && safeData.length > 0 && selectedRows.length === safeData.length
	const isIndeterminate = selectable && selectedRows.length > 0 && selectedRows.length < safeData.length

	if (loading) {
		return (
			<div className="data-table-loading" role="status" aria-label="Yuklanmoqda">
				<div className="data-table-skeleton">
					{Array.from({ length: 5 }).map((_, idx) => (
						<div key={idx} className="data-table-skeleton-row">
							{columns.map((col, colIdx) => (
								<div key={colIdx} className="data-table-skeleton-cell" />
							))}
						</div>
					))}
				</div>
			</div>
		)
	}

	if (!safeData || safeData.length === 0) {
		return null // Empty state handled by parent
	}

	return (
		<div className={`data-table-container ${darkMode ? "dark" : ""}`}>
			<table className="data-table" role="table">
				<thead>
					<tr>
						{selectable && (
							<th className="data-table-checkbox">
								<input
									type="checkbox"
									checked={isAllSelected}
									ref={(input) => {
										if (input) input.indeterminate = isIndeterminate
									}}
									onChange={handleSelectAll}
									aria-label="Barchasini tanlash"
								/>
							</th>
						)}
						{columns.map((column) => (
							<th
								key={column.key}
								className={`data-table-header ${column.sortable ? "sortable" : ""} ${sortKey === column.key ? `sorted-${sortOrder}` : ""}`}
								onClick={() => handleSort(column.key, column.sortable)}
								role={column.sortable ? "button" : undefined}
								tabIndex={column.sortable ? 0 : -1}
								aria-sort={
									column.sortable
										? sortKey === column.key
											? sortOrder === "asc"
												? "ascending"
												: "descending"
											: "none"
										: undefined
								}
								onKeyDown={(e) => {
									if (column.sortable && (e.key === "Enter" || e.key === " ")) {
										e.preventDefault()
										handleSort(column.key, column.sortable)
									}
								}}
							>
								<div className="data-table-header-content">
									<span>{column.label}</span>
									{column.sortable && (
										<div className="data-table-sort-icons">
											<CaretUp
												size={12}
												className={sortKey === column.key && sortOrder === "asc" ? "active" : ""}
											/>
											<CaretDown
												size={12}
												className={sortKey === column.key && sortOrder === "desc" ? "active" : ""}
											/>
										</div>
									)}
								</div>
							</th>
						))}
						{renderActions && <th className="data-table-actions-header">Amallar</th>}
					</tr>
				</thead>
				<tbody>
					{safeData.map((row, rowIdx) => {
						const rowId = row.id || row.invoice_id || row.client_id || rowIdx
						const isSelected = selectedRows.includes(rowId)
						return (
							<tr
								key={rowId}
								className={`data-table-row ${isSelected ? "selected" : ""} ${onRowClick ? "clickable" : ""} ${rowIdx % 2 === 0 ? "even" : "odd"}`}
								onClick={() => onRowClick && onRowClick(row)}
								role={onRowClick ? "button" : undefined}
								tabIndex={onRowClick ? 0 : -1}
								onKeyDown={(e) => {
									if (onRowClick && (e.key === "Enter" || e.key === " ")) {
										e.preventDefault()
										onRowClick(row)
									}
								}}
							>
								{selectable && (
									<td className="data-table-checkbox">
										<input
											type="checkbox"
											checked={isSelected}
											onChange={(e) => handleSelectRow(rowId, e)}
											onClick={(e) => e.stopPropagation()}
											aria-label={`${rowId} qatorni tanlash`}
										/>
									</td>
								)}
								{columns.map((column) => (
									<td key={column.key} className="data-table-cell">
										{column.render
											? column.render(row[column.key], row)
											: row[column.key] !== undefined && row[column.key] !== null
											? String(row[column.key])
											: "-"}
									</td>
								))}
								{renderActions && (
									<td className="data-table-actions" onClick={(e) => e.stopPropagation()}>
										{renderActions(row)}
									</td>
								)}
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}

export default DataTable

