import { useDispatch, useSelector } from "react-redux"
import { useOutletContext } from "react-router-dom"
import Search from "../../components/search/Search"
import { useState } from "react"
import AddModal from "../../components/add/AddModal"
import { stringCheck } from "../../components/validation"
import { Info } from "@phosphor-icons/react"

const Client = ({ getData }) => {
	const [
		inputRef,
		showDropdown,
		setshowDropdown,
		addModalVisible,
		setAddModalVisible,
		addModalDisplay,
		setAddModalDisplay,
		miniModal,
		setMiniModal,
		sidebar,
		userInfo,
		darkMode,
	] = useOutletContext()
	const state = useSelector((state) => state)
	const dispatch = useDispatch()

	const [filteredData, setFilteredData] = useState([])
	const [btn_loading, setBtn_loading] = useState(false)
	const [objId, setObjId] = useState("")
	const [submitted, setSubmitted] = useState(false)
	const [searchSubmitted, setSearchSubmitted] = useState(false)

	// new data
	const [person, setPerson] = useState("")
	const [type, setType] = useState("")
	const [summa, setSumma] = useState(0)
	const [desc, setDesc] = useState("")
	const [from, setFrom] = useState("")

	const handleSearch = () => {}

	const clearSearch = () => {}

	const clearOnly = () => {}

	const handleAdd = () => {}

	const clearAndClose = () => {}

	return (
		<>
			<AddModal
				name={objId ? "Oldi / Berdi tahrirlash" : "Oldi / Berdi qo'shish"}
			>
				<div
					className={`input-wrapper modal-form regular 
					${submitted && stringCheck(person.trim()) !== null && "error"} ${
						darkMode ? "dark" : null
					}`}
				>
					<label>Shaxs</label>

					{submitted && stringCheck(person.trim()) !== null && (
						<Info size={20} />
					)}
					<div className="validation-field">
						<span>
							{submitted &&
								stringCheck(person.trim(), "Shaxs tanlash majburiy")}
						</span>
					</div>
				</div>
				<div className="modal-btn-group">
					<button
						className={`primary-btn ${darkMode ? "dark" : null}`}
						disabled={btn_loading}
						onClick={handleAdd}
					>
						{objId ? "Saqlash" : "Qo'shish"}{" "}
						{btn_loading && (
							<span
								className="spinner-grow spinner-grow-sm"
								role="status"
								aria-hidden="true"
								style={{ marginLeft: "5px" }}
							></span>
						)}
					</button>
					<button
						className={`secondary-btn ${darkMode ? "dark" : null}`}
						onClick={clearAndClose}
					>
						Bekor qilish
					</button>
				</div>
			</AddModal>

			<Search
				handleSearch={handleSearch}
				clearSearch={clearSearch}
				clearOnly={clearOnly}
				darkMode={darkMode}
			/>
		</>
	)
}

export default Client
