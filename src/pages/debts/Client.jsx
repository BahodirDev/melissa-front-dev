import { useDispatch, useSelector } from "react-redux"
import { useOutletContext } from "react-router-dom"
import Search from "../../components/search/Search"
import { useEffect, useState } from "react"
import AddModal from "../../components/add/AddModal"
import { numberCheck, stringCheck } from "../../components/validation"
import { CaretDown, Info } from "@phosphor-icons/react"
import { Select } from "antd"
import format_phone_number from "../../components/format_phone_number/format_phone_number"
import { toast } from "react-toastify"
import { get, post } from "../../customHook/api"
import { DebtTable } from "../../components/debt tables/DebtTable"

const Client = () => {
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
	const { client, deliver, users } = useSelector((state) => state)
	const dispatch = useDispatch()

	const [list, setList] = useState([])
	const [filteredData, setFilteredData] = useState([])
	const [btn_loading, setBtn_loading] = useState(false)
	const [objId, setObjId] = useState("")
	const [submitted, setSubmitted] = useState(false)
	const [searchSubmitted, setSearchSubmitted] = useState(false)
	const [loading, setLoading] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)
	const [limit, setLimit] = useState(20)
	const [totalPages, setTotalPages] = useState(1)

	// new data
	const [who, setWho] = useState("client")
	const [person, setPerson] = useState("")
	const [type, setType] = useState("cash")
	const [summa, setSumma] = useState(0)
	const [isEnter, setIsEnter] = useState("income")
	const [desc, setDesc] = useState("")
	const [date, setDate] = useState("")

	const handleSearch = () => {}

	const clearSearch = () => {}

	const clearOnly = () => {}

	const handleAdd = () => {
		setSubmitted(true)
		if (who && person && type && summa > 0) {
			setBtn_loading(true)
			if (objId) {
				setBtn_loading(false)
			} else {
				let he = person?.clients_id
					? person?.clients_id
					: person?.deliver_id
					? person?.deliver_id
					: person?.user_id
				let newObj = {
					transaction_money: summa,
					transaction_money_type: type,
					transaction_type: isEnter,
					transaction_from: isEnter === "income" ? he : userInfo?.id,
					transaction_to: isEnter === "income" ? userInfo?.id : he,
					transaction_status: who,
					transaction_summary: desc,
					transaction_created_at: date ? new Date(date).toISOString() : null,
				}
				post(`/debts/debts-post`, newObj).then((data) => {
					if (data?.status === 201) {
						// dispatch(addData(data?.data))
						// dispatch(setQuantity())
						clearAndClose()
						toast.success("Oldi berdi muvoffaqiyatli kiritildi")
					} else {
						toast.error("Nomalum server")
					}
					// console.log(data)
					setBtn_loading(false)
				})
			}
		}
	}

	const clearAndClose = () => {
		setWho("client")
		setPerson("")
		setType("cash")
		setSumma(0)
		setIsEnter("income")
		setDesc("")

		setObjId("")
		setSubmitted(false)
		setBtn_loading(false)

		setAddModalVisible(false)
		setTimeout(() => {
			setAddModalDisplay("none")
		}, 300)
	}

	useEffect(() => {
		setLoading(true)
		get("/debts/debts-list").then((data) => {
			if (data?.status === 201 || data?.status === 200) {
				setList(data?.data)
			} else {
				toast.error("Nomalur server xatolik")
			}
			setLoading(false)
		})
	}, [])

	return (
		<>
			<AddModal
				name={objId ? "Oldi / Berdi tahrirlash" : "Oldi / Berdi qo'shish"}
			>
				<div
					className={`input-wrapper modal-form regular ${
						darkMode ? "dark" : null
					}`}
				>
					<label>Kimdam</label>
					<Select
						placeholder="Kimdan"
						className="select select-of-two-first"
						value={who}
						onChange={(e) => {
							setWho(e)
							setPerson({})
						}}
					>
						<Select.Option
							className={`${darkMode ? "dark" : null}`}
							value={"client"}
						>
							<div>
								<span>Mijozlar</span>
							</div>
						</Select.Option>
						<Select.Option
							className={`${darkMode ? "dark" : null}`}
							value={"deliver"}
						>
							<div>
								<span>Ta'minotchilar</span>
							</div>
						</Select.Option>
						<Select.Option
							className={`${darkMode ? "dark" : null}`}
							value={"user"}
						>
							<div>
								<span>Xodimlar</span>
							</div>
						</Select.Option>
					</Select>
				</div>
				<div
					className={`input-wrapper modal-form regular 
					${
						submitted &&
						stringCheck(
							person?.clients_name
								? person?.clients_name
								: person?.deliver_name
								? person?.deliver_name
								: person?.user_name
						) !== null &&
						"error"
					} ${darkMode ? "dark" : null}`}
				>
					<label>Shaxs</label>
					<Select
						showSearch
						allowClear
						placeholder="Shaxs tanlang"
						className="select"
						suffixIcon={
							submitted &&
							stringCheck(
								person?.clients_name
									? person?.clients_name
									: person?.deliver_name
									? person?.deliver_name
									: person?.user_name
							) !== null ? null : (
								<CaretDown size={16} />
							)
						}
						value={
							person?.clients_name
								? `${person.clients_name} - ${format_phone_number(
										person.clients_nomer
								  )}`
								: person?.deliver_name
								? `${person.deliver_name} - ${format_phone_number(
										person.deliver_nomer
								  )}`
								: person?.user_name
								? `${person.user_name} - ${format_phone_number(
										person.user_nomer
								  )}`
								: null
						}
						onChange={(e) => (e ? setPerson(JSON.parse(e)) : setPerson({}))}
					>
						{who === "client"
							? client?.data?.length
								? client?.data.map((item, idx) => {
										if (!item?.isdelete) {
											return (
												<Select.Option
													key={idx}
													className={`option-shrink ${
														darkMode ? "dark" : null
													}`}
													value={JSON.stringify(item)}
												>
													<div>
														<span>{item?.clients_name} - </span>
														<span>
															{format_phone_number(item?.clients_nomer)}
														</span>
													</div>
												</Select.Option>
											)
										}
								  })
								: null
							: who === "deliver"
							? deliver?.data?.length
								? deliver?.data.map((item, idx) => {
										if (!item?.isdelete) {
											return (
												<Select.Option
													key={idx}
													className={`option-shrink ${
														darkMode ? "dark" : null
													}`}
													value={JSON.stringify(item)}
												>
													<div>
														<span>{item?.deliver_name} - </span>
														<span>
															{format_phone_number(item?.deliver_nomer)}
														</span>
													</div>
												</Select.Option>
											)
										}
								  })
								: null
							: who === "user"
							? users?.data?.length
								? users?.data.map((item, idx) => {
										if (!item?.isdelete) {
											return (
												<Select.Option
													key={idx}
													className={`option-shrink ${
														darkMode ? "dark" : null
													}`}
													value={JSON.stringify(item)}
												>
													<div>
														<span>{item?.user_name} - </span>
														<span>{format_phone_number(item?.user_nomer)}</span>
													</div>
												</Select.Option>
											)
										}
								  })
								: null
							: null}
					</Select>
					{submitted &&
						stringCheck(
							person?.clients_name
								? person?.clients_name
								: person?.deliver_name
								? person?.deliver_name
								: person?.user_name
						) !== null && <Info size={20} />}
					<div className="validation-field">
						<span>
							{submitted &&
								stringCheck(
									person?.clients_name
										? person?.clients_name
										: person?.deliver_name
										? person?.deliver_name
										: person?.user_name,
									"Shaxs tanlash majburiy"
								)}
						</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form regular ${
						darkMode ? "dark" : null
					}`}
				>
					<label>Oldi / Berdi</label>
					<Select
						placeholder="Kimdan"
						className="select select-of-two-first"
						value={isEnter}
						onChange={(e) => setIsEnter(e)}
					>
						<Select.Option
							className={`${darkMode ? "dark" : null}`}
							value={"income"}
						>
							<div>
								<span>Olindi</span>
							</div>
						</Select.Option>
						<Select.Option
							className={`${darkMode ? "dark" : null}`}
							value={"outcome"}
						>
							<div>
								<span>Berildi</span>
							</div>
						</Select.Option>
					</Select>
				</div>
				<div
					className={`input-wrapper modal-form regular svgMargin ${
						darkMode ? "dark" : null
					} ${submitted && numberCheck(summa) !== null && "error"}`}
				>
					<label>Summa / To'lov turi</label>

					<div className="input-of-two">
						<input
							type="text"
							placeholder="Qiymat kiriting"
							className="input input-of-two-second"
							value={summa ? summa : ""}
							onKeyPress={(e) => {
								if (isNaN(e.key)) {
									e.preventDefault()
								}
							}}
							onChange={(e) => setSumma(e.target.value)}
						/>
						<Select
							placeholder="To'lov turi"
							className="select input-of-two-first"
							value={type}
							onChange={(e) => setType(e)}
						>
							<Select.Option
								className={`${darkMode ? "dark" : null}`}
								value={"cash"}
							>
								<div>
									<span>Naqd</span>
								</div>
							</Select.Option>
							<Select.Option
								className={`${darkMode ? "dark" : null}`}
								value={"card"}
							>
								<div>
									<span>Karta</span>
								</div>
							</Select.Option>
						</Select>
					</div>

					{submitted && numberCheck(summa) !== null && (
						<Info size={20} className="thisSvg" />
					)}
					<div className="validation-field">
						<span>{submitted && numberCheck(summa)}</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form regular ${
						darkMode ? "dark" : null
					}`}
				>
					<label>Izoh</label>
					<textarea
						placeholder="Izoh kiriting"
						className="desc-input"
						value={desc}
						onChange={(e) => setDesc(e.target.value)}
					></textarea>
				</div>
				<div
					className={`input-wrapper modal-form regular ${
						submitted && stringCheck(date) !== null && "error"
					} ${darkMode ? "dark" : null}`}
				>
					<label>Sana</label>
					<input
						type="datetime-local"
						placeholder="Sana tanlang"
						className="input date"
						value={date ? date : ""}
						onChange={(e) => setDate(e.target.value)}
					/>
					<div className="validation-field">
						<span>{submitted && stringCheck(date)}</span>
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

			<DebtTable
				data={list}
				sidebar={sidebar}
				showDropdown={showDropdown}
				setshowDropdown={setshowDropdown}
				darkMode={darkMode}
			/>
		</>
	)
}

export default Client
