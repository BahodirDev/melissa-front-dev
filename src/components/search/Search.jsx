import { X } from "@phosphor-icons/react"
import { useOutletContext } from "react-router-dom"

const Search = ({
	handleSearch,
	clearSearch,
	showAddBtn = true,
	className,
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

	return (
		<div className={`search-wrapper ${className}`}>
			<div>
				<div className="input-wrapper">
					<input type="text" placeholder="Izlash..." ref={inputRef} />
				</div>
				<button className="primary-btn" onClick={handleSearch}>
					Izlash
				</button>
				<X size={18} onClick={clearSearch} />
			</div>
			<div>
				{showAddBtn && (
					<button
						className="primary-btn"
						onClick={(e) => {
							e.stopPropagation()
							setshowDropdown("")
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
