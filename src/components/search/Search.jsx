import { X } from "@phosphor-icons/react"
import { useOutletContext } from "react-router-dom"

const Search = ({
	handleSearch,
	clearSearch,
	showAddBtn = true,
	className,
	clearOnly,
	darkMode,
	handleDeepSearch = false,
}) => {
	const [
		inputRef,
		showDropdown,
		setshowDropdown,
		addModalVisible,
		setAddModalVisible,
		addModalDisplay,
		setAddModalDisplay,
	] = useOutletContext()

	const handleKeyPress = (event) => {
		if (event.key === "Enter") {
			handleSearch()
		}
	}

	return (
		<div className={`search-wrapper ${className} ${darkMode ? "dark" : null}`}>
			<div>
				<div className={`input-wrapper ${darkMode ? "dark" : null}`}>
					<input
						type="text"
						placeholder="Izlash..."
						ref={inputRef}
						onKeyPress={handleKeyPress}
					/>
				</div>
				<button
					className={`primary-btn ${darkMode ? "dark" : null}`}
					onClick={() => {
						handleDeepSearch ? handleDeepSearch() : handleSearch()
					}}
				>
					Izlash
				</button>
				<X size={18} onClick={clearSearch} />
			</div>
			<div>
				{showAddBtn && (
					<button
						className={`primary-btn  ${darkMode ? "dark" : null}`}
						onClick={(e) => {
							e.stopPropagation()
							setshowDropdown("")
							clearOnly()
							setAddModalVisible(true)
							setAddModalDisplay("block")
						}}
					>
						Qo'shish
					</button>
				)}
			</div>
		</div>
	)
}

export default Search
