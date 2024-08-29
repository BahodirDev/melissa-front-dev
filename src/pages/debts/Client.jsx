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
import { get, post, remove } from "../../customHook/api"
import { DebtTable } from "../../components/debt tables/DebtTable"
import Loader from "../../components/loader/Loader"
import CurrencyInput from "react-currency-input-field"

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
	const { client, deliver, users, currency } = useSelector((state) => state)
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
	const [isEnter, setIsEnter] = useState("outcome")
	const [desc, setDesc] = useState("")
	const [date, setDate] = useState("")
	const [newCurrency, setNewCurrency] = useState({})

	const handleSearch = () => {
		setLoading(true)
		get("/debts/debts-list").then((data) => {
			if (data?.status === 201 || data?.status === 200) {
				setList(data?.data)
			} else {
				toast.error("Nomalur server xatolik")
			}
			setLoading(false)
		})
	}

	const clearSearch = () => {}

	const clearOnly = () => {
		setNewCurrency(
			currency?.data?.filter((item) => item?.currency_symbol === "so'm")[0]
		)

		setWho("client")
		setPerson("")
		setType("cash")
		setSumma(0)
		setIsEnter("outcome")
		setDesc("")

		setObjId("")
		setSubmitted(false)
		setBtn_loading(false)
	}

	const handleAdd = () => {
		setSubmitted(true)
		if (who && person && type && summa > 0 && newCurrency?.currency_name) {
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
					transaction_currency: newCurrency?.currency_name,
				}

				post(`/debts/debts-post`, newObj).then((data) => {
					if (data?.status === 201) {
						let dataObj = {
							transaction_id: data?.data?.[0]?.transaction_id,
							transaction_from: data?.data?.[0]?.transaction_from,
							transaction_to: data?.data?.[0]?.transaction_to,
							transaction_status: data?.data?.[0]?.transaction_status,
							transaction_money: data?.data?.[0]?.transaction_money,
							transaction_money_type: data?.data?.[0]?.transaction_money_type,
							transaction_type: data?.data?.[0]?.transaction_type,
							transaction_summary: data?.data?.[0]?.transaction_summary,
							transaction_created_at: data?.data?.[0]?.transaction_created_at,
							transaction_currency: data?.data?.[0]?.transaction_currency,
						}

						if (who === "client") {
							if (isEnter === "income") {
								dataObj.details_from = {
									name: person?.clients_name,
									description: person?.clients_desc,
									nomer: person?.clients_nomer,
									created_at: person?.clients_createdat,
								}
								dataObj.details_to = {
									name: userInfo?.name,
								}
							} else if (isEnter === "outcome") {
								dataObj.details_from = {
									name: userInfo?.name,
								}
								dataObj.details_to = {
									name: person?.clients_name,
									description: person?.clients_desc,
									nomer: person?.clients_nomer,
									created_at: person?.clients_createdat,
								}
							}
						} else if (who === "deliver") {
							if (isEnter === "income") {
								dataObj.details_from = {
									name: person?.deliver_name,
								}
								dataObj.details_to = {
									name: userInfo?.name,
								}
							} else if (isEnter === "outcome") {
								dataObj.details_from = {
									name: userInfo?.name,
								}
								dataObj.details_to = {
									name: person?.deliver_name,
								}
							}
						} else if (who === "user") {
							if (isEnter === "income") {
								dataObj.details_from = {
									name: person?.user_name,
								}
								dataObj.details_to = {
									name: userInfo?.name,
								}
							} else if (isEnter === "outcome") {
								dataObj.details_from = {
									name: userInfo?.name,
								}
								dataObj.details_to = {
									name: person?.user_name,
								}
							}
						}

						setList([dataObj, ...list])
						clearAndClose()
						toast.success("Oldi berdi muvoffaqiyatli kiritildi")
					} else {
						toast.error("Nomalum server")
					}
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
		setIsEnter("outcome")
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

	const handleDelete = (id, type, status, summa) => {
		setLoading(true)
		remove(
			`/debts/debts-delete/${id}?transaction_status=${status}&transaction_type=${type}&transaction_money=${summa}`
		).then((data) => {
			if (data?.status === 200) {
				setList((prev) =>
					prev?.filter(
						(item) => item?.transaction_id !== data?.data?.transaction_id
					)
				)
				toast.success("Oldi / berdi muvoffaqiyatli o'chirildi")
				clearAndClose()
			} else {
				toast.error("Nomalum server xatolik")
			}
			setLoading(false)
		})
	}

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
							value={"outcome"}
						>
							<div>
								<span>Berildi</span>
							</div>
						</Select.Option>
						<Select.Option
							className={`${darkMode ? "dark" : null}`}
							value={"income"}
						>
							<div>
								<span>Olindi</span>
							</div>
						</Select.Option>
					</Select>
				</div>
				<div
					className={`input-wrapper modal-form ${
						submitted &&
						stringCheck(newCurrency?.currency_name) !== null &&
						"error"
					} ${darkMode ? "dark" : null}`}
				>
					<label>Pul birligi</label>
					<Select
						showSearch
						placeholder="Pul birligi tanlang"
						className="select"
						value={
							newCurrency?.currency_name
								? `${newCurrency?.currency_name} - ${newCurrency?.currency_amount} so'm`
								: null
						}
						onChange={(e) => {
							e ? setNewCurrency(JSON.parse(e)) : setNewCurrency({})
						}}
						suffixIcon={
							submitted && stringCheck(newCurrency?.currency_name) !== null ? (
								<Info size={20} />
							) : (
								<CaretDown size={16} />
							)
						}
					>
						{currency?.data?.length
							? currency?.data.map((item, idx) => {
									return (
										<Select.Option
											key={idx}
											value={JSON.stringify(item)}
											className={` ${darkMode ? "dark" : null}`}
										>
											<div>
												<span>
													{item?.currency_name} - {item?.currency_amount} so'm
												</span>
											</div>
										</Select.Option>
									)
							  })
							: null}
					</Select>
					<div className="validation-field">
						<span>
							{submitted &&
								stringCheck(
									newCurrency?.currency_name,
									"Valyuta tanlash majburiy"
								)}
						</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form regular svgMargin ${
						darkMode ? "dark" : null
					} ${submitted && numberCheck(summa) !== null && "error"}`}
				>
					<label>Summa / To'lov turi</label>

					<div className="input-of-two">
						<CurrencyInput
							id="input-example"
							name="input-name"
							className="input input-of-two-second"
							placeholder="Qiymat kiriting"
							groupSeparator={" "}
							value={summa}
							onValueChange={(value, name, values) => setSumma(value)}
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
						darkMode ? "dark" : null
					}`}
				>
					<label>Sana</label>
					<input
						type="date"
						placeholder="Sana tanlang"
						className="input date"
						value={date ? date : ""}
						onChange={(e) => setDate(e.target.value)}
					/>
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

			{loading ? (
				<Loader />
			) : (
				<DebtTable
					data={list}
					sidebar={sidebar}
					showDropdown={showDropdown}
					setshowDropdown={setshowDropdown}
					darkMode={darkMode}
					handleDelete={handleDelete}
				/>
			)}
		</>
	)
}

export default Client
