import { X } from "@phosphor-icons/react"
import { useOutletContext } from "react-router-dom"

const Search = ({ handleSearch, clearSearch }) => {
	const [
		userInfo,
		inputRef,
		action,
		setAction,
		showDropdown,
		setshowDropdown,
		addModalVisible,
		setAddModalVisible,
		addModalDisplay,
		setAddModalDisplay,
	] = useOutletContext()

	return (
		<div className="search-wrapper">
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
			</div>
		</div>
	)
}

export default Search
