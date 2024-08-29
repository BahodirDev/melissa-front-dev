import { useEffect, useState } from "react"
import { PatternFormat } from "react-number-format"
import { useDispatch, useSelector } from "react-redux"
import { useOutletContext } from "react-router-dom"
import Loader from "../../components/loader/Loader"
import {
	addData,
	editData,
	removeDebt,
	setData,
	setLoading,
	setQuantity,
} from "../../components/reducers/client"
import { phoneNumberCheck, stringCheck } from "../../components/validation"
import { get, patch, post, remove } from "../../customHook/api"
import ClientList from "./ClientList"
import "./client.css"
import { toast } from "react-toastify"
import Search from "../../components/search/Search"
import InfoItem from "../../components/info_item/InfoItem"
import { CaretDown, Info, UsersFour } from "@phosphor-icons/react"
import AddModal from "../../components/add/AddModal"
import { Select } from "antd"
import format_phone_number from "../../components/format_phone_number/format_phone_number"
import Pagination from "../../components/pagination/Pagination"

export default function Employees() {
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

	const [clientList, setClientList] = useState([])
	const [new_name, setNew_name] = useState("")
	const [new_number, setNew_number] = useState("")
	const [desc, setDesc] = useState("")
	const [btn_loading, setBtn_loading] = useState(false)
	const [filteredData, setFilteredData] = useState([])
	const [objId, setObjId] = useState("")
	const [submitted, setSubmitted] = useState(false)
	const state = useSelector((state) => state.client)
	const dispatch = useDispatch()
	const [searchSubmitted, setSearchSubmitted] = useState(false)
	const [otherClient, setOtherClient] = useState({})
	const [currentPage, setCurrentPage] = useState(1)
	const [limit, setLimit] = useState(20)
	const [totalPages, setTotalPage] = useState(1)

	useEffect(() => {
		dispatch(setLoading(true))
		get(`/clients/clients-lists?limit=${limit}&page=${currentPage}`).then(
			(data) => {
				if (data?.status === 201 || data?.status === 200) {
					setClientList(data?.data?.data)
					setTotalPage(Math.ceil(data?.data?.clients / limit))
					dispatch(setQuantity(data?.data?.clients))
				} else {
					toast.error("Nomalur server xatolik")
					setTotalPage(1)
				}
				dispatch(setLoading(false))
			}
		)
	}, [])

	useEffect(() => {
		dispatch(setLoading(true))
		get(`/clients/clients-lists?limit=${limit}&page=${currentPage}`).then(
			(data) => {
				if (data?.status === 201 || data?.status === 200) {
					setClientList(data?.data?.data)
					setTotalPage(Math.ceil(data?.data?.clients / limit))
					dispatch(setQuantity(data?.data?.clients))
				} else {
					toast.error("Nomalur server xatolik")
					setTotalPage(1)
				}
				dispatch(setLoading(false))
			}
		)
	}, [currentPage, limit])

	const handleSearch = () => {
		if (inputRef.current?.value.length > 0) {
			dispatch(setLoading(true))
			setSearchSubmitted(true)
			post("/clients/clients-search", {
				search: inputRef.current?.value,
			}).then((data) => {
				if (data.status === 200) {
					setFilteredData(data?.data?.data)
				} else {
					toast.error("Nomalum server xatolik")
				}
				dispatch(setLoading(false))
			})
		} else {
			setSearchSubmitted(false)
			setFilteredData([])
		}
	}

	const clearSearch = () => {
		setSearchSubmitted(false)
		setFilteredData([])
		inputRef.current.value = ""
	}

	const addNewClient = () => {
		setSubmitted(true)
		if (new_name.length && new_number.slice(18) !== "_") {
			setBtn_loading(true)
			let newClient = {
				clients_name: new_name.trim(),
				clients_nomer: new_number.replace(/\D/g, ""),
				clients_desc: desc,
			}
			if (objId) {
				// newClient.emerged_id = otherClient?.clients_id
				patch(`/clients/clients-patch/${objId}`, newClient).then((data) => {
					if (data?.status === 201) {
						dispatch(editData(data?.data))
						clearAndClose()
						toast.success("Mijoz muvoffaqiyatli o'zgartirildi")
					} else if (data?.response?.data?.error === "CLIENTS_ALREADY_EXIST") {
						toast.warn("Bunday mijoz allaqachon mavjud")
					} else {
						toast.error("Nomalum server xatolik")
					}
					setBtn_loading(false)
				})
			} else {
				post("/clients/clients-post", newClient).then((data) => {
					if (data?.status === 201) {
						dispatch(addData(data?.data))
						dispatch(setQuantity())
						clearAndClose()
						toast.success("Mijoz muvoffaqiyatli qo'shildi")
					} else if (data?.response?.data?.error === "CLIENTS_ALREADY_EXIST") {
						toast.warn("Bunday mijoz allaqachon mavjud")
					} else {
						toast.error("Nomalum server xatolik")
					}
					setBtn_loading(false)
				})
			}
		}
	}

	const editClient = (id) => {
		const index = state?.data.findIndex((item) => item?.clients_id === id)
		if (index !== -1) {
			setNew_name(state?.data[index]?.clients_name)
			setNew_number(state?.data[index]?.clients_nomer.slice(3))
			setDesc(state?.data[index]?.clients_desc)
			setObjId(id)
			setAddModalDisplay("block")
			setAddModalVisible(true)
		} else {
			toast.error("Nomalum server xatolik")
		}
	}

	const clearAndClose = () => {
		setNew_name("")
		setNew_number("")
		setDesc("")
		setObjId("")
		setSubmitted(false)
		setBtn_loading(false)
		setAddModalVisible(false)
		setTimeout(() => {
			setAddModalDisplay("none")
		}, 300)
	}

	const deleteClient = (id) => {
		dispatch(setLoading(true))
		remove(`/clients/clients-delete/${id}`).then((data) => {
			if (data?.status === 200) {
				dispatch(removeDebt(id))
				dispatch(setQuantity())
				toast.success("Mijoz muvoffaqiyatli o'chirildi")
				clearAndClose()
			} else if (data?.response?.data?.error === "DEBTS_EXIST") {
				toast.warn("Bu mijozda qarzdorlik mavjud")
			} else {
				toast.error("Nomalum server xatolik")
			}
			dispatch(setLoading(false))
		})
	}

	const clearOnly = () => {
		setNew_name("")
		setNew_number("")
		setDesc("")
		setObjId("")
		setSubmitted(false)
		setBtn_loading(false)
	}

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber)
		// if (
		// 	searchStoreId === "" &&
		// 	searchDeliverId === "" &&
		// 	inputRef.current.value === ""
		// ) {
		// 	setSearchSubmitted(false)
		// }
	}

	return (
		<>
			<AddModal name={objId ? "Mijoz tahrirlash" : "Mijoz qo'shish"}>
				{objId ? (
					<div
						className={`input-wrapper modal-form ${darkMode ? "dark" : null}`}
					>
						<label>Mijoz biriktirish</label>
						<Select
							showSearch
							allowClear
							placeholder="Mijoz tanlang"
							className="select"
							value={
								otherClient?.clients_name
									? `${otherClient.clients_name} - ${format_phone_number(
											otherClient.clients_nomer
									  )}`
									: null
							}
							onChange={(e) =>
								e ? setOtherClient(JSON.parse(e)) : setOtherClient({})
							}
						>
							{state?.data?.length
								? state?.data.map((item, idx) => {
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
								: null}
						</Select>
					</div>
				) : null}
				<div
					className={`input-wrapper modal-form regular 
					${submitted && stringCheck(new_name.trim()) !== null && "error"}  ${
						darkMode ? "dark" : null
					}`}
				>
					<label>Mijoz ismi</label>
					<input
						type="text"
						placeholder="Mijoz ismini kiriting"
						className="input"
						value={new_name}
						onChange={(e) => setNew_name(e.target.value)}
					/>
					{submitted && stringCheck(new_name.trim()) !== null && (
						<Info size={20} />
					)}
					<div className="validation-field">
						<span>
							{submitted &&
								stringCheck(new_name.trim(), "Ism kiritish majburiy")}
						</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form regular 
					${submitted && phoneNumberCheck(new_number) !== null && "error"} ${
						darkMode ? "dark" : null
					}`}
				>
					<label>Telefon raqam kiriting</label>
					<PatternFormat
						type="text"
						placeholder="+998(__) ___-__-__"
						className="input"
						format="+998 (##) ###-##-##"
						mask="_"
						value={new_number}
						onValueChange={(value) => setNew_number(value.formattedValue)}
					/>
					{submitted && phoneNumberCheck(new_number) !== null && (
						<Info size={20} />
					)}
					<div className="validation-field">
						<span>{submitted && phoneNumberCheck(new_number)}</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form regular ${
						darkMode ? "dark" : null
					}`}
				>
					<label>Izoh</label>
					<textarea
						placeholder="Izoh"
						className="desc-input"
						value={desc}
						onChange={(e) => setDesc(e.target.value)}
					></textarea>
				</div>
				<div className="modal-btn-group">
					<button
						className={`primary-btn ${darkMode ? "dark" : null}`}
						disabled={btn_loading}
						onClick={addNewClient}
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

			<div className="info-wrapper">
				<InfoItem
					value={searchSubmitted ? filteredData.length : state?.quantity}
					name="Mijozlar soni"
					icon={<UsersFour size={24} color="var(--color-primary)" />}
					iconBgColor={`${darkMode ? "var(--d-bg-icon)" : "var(--bg-icon)"}`}
					darkMode={darkMode}
				/>
			</div>

			<Search
				handleSearch={handleSearch}
				clearSearch={clearSearch}
				clearOnly={clearOnly}
				darkMode={darkMode}
			/>

			{state?.loading ? (
				<Loader />
			) : (
				<>
					<ClientList
						data={searchSubmitted ? filteredData : clientList}
						deleteClient={deleteClient}
						editClient={editClient}
						showDropdown={showDropdown}
						setshowDropdown={setshowDropdown}
						miniModal={miniModal}
						setMiniModal={setMiniModal}
						darkMode={darkMode}
						userInfo={userInfo}
					/>

					{searchSubmitted ? (
						<></>
					) : totalPages > 1 ? (
						<>
							<Pagination
								pages={totalPages}
								currentPage={currentPage}
								onPageChange={handlePageChange}
								darkMode={darkMode}
							/>

							<div
								className={`input-wrapper ${
									darkMode ? "dark" : null
								} pagination-limit`}
							>
								<Select
									placeholder="Kirim Chiqim"
									className="select"
									value={limit}
									onChange={(e) => {
										setLimit(e)
										setCurrentPage(1)
									}}
								>
									<Select.Option
										value="10"
										className={`${darkMode ? "dark" : null}`}
									>
										<div>
											<span>10</span>
										</div>
									</Select.Option>
									<Select.Option
										value="25"
										className={`${darkMode ? "dark" : null}`}
									>
										<div>
											<span>25</span>
										</div>
									</Select.Option>
									<Select.Option
										value="50"
										className={`${darkMode ? "dark" : null}`}
									>
										<div>
											<span>50</span>
										</div>
									</Select.Option>
									<Select.Option
										value="100"
										className={`${darkMode ? "dark" : null}`}
									>
										<div>
											<span>100</span>
										</div>
									</Select.Option>
								</Select>
							</div>
						</>
					) : null}
				</>
			)}
		</>
	)
}
