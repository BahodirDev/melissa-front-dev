import { useEffect, useRef, useState } from "react"
import { PatternFormat } from "react-number-format"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useOutletContext } from "react-router-dom"
import Loader from "../../components/loader/Loader"
import {
	addData,
	editData,
	removeDeliver,
	setData,
	setLoading,
	setQuantity,
} from "../../components/reducers/deliver"
import { phoneNumberCheck, stringCheck } from "../../components/validation"
import { get, patch, post, remove } from "../../customHook/api"
import DeliverList from "./DeliverList"
import "./deliver.css"
import AddModal from "../../components/add/AddModal"
import InfoItem from "../../components/info_item/InfoItem"
import { Info, Truck } from "@phosphor-icons/react"
import Search from "../../components/search/Search"
import { toast } from "react-toastify"
import { Select } from "antd"
import Pagination from "../../components/pagination/Pagination"

function Deliver() {
	const navigate = useNavigate()
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
	const state = useSelector((state) => state.deliver)
	const dispatch = useDispatch()

	const [filteredData, setFilteredData] = useState([])
	const [btn_loading, setBtn_loading] = useState(false)
	const [objId, setObjId] = useState("")
	const [submitted, setSubmitted] = useState(false)
	const [searchSubmitted, setSearchSubmitted] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)
	const [limit, setLimit] = useState(20)
	const [totalPage, setTotalPage] = useState(1)
	const didMount = useRef(false)

	// new data
	const [name, setName] = useState("")
	const [phone, setPhone] = useState("")
	const [loc, setLoc] = useState("")

	const getData = () => {
		dispatch(setLoading(true))
		if (inputRef.current?.value.length > 0) {
			handleSearch()
		} else {
			get(`/deliver/deliver-list?limit=${limit}&page=${currentPage}`).then(
				(data) => {
					if (data?.status === 200 || data?.status === 201) {
						setTotalPage(Math.ceil(data?.data?.deliver / limit))
						dispatch(setData(data?.data?.data))
						dispatch(setQuantity(data?.data?.deliver))
					} else {
						setTotalPage(1)
						toast.error("Nomalum server xatolik")
					}
					dispatch(setLoading(false))
				}
			)
		}
	}

	useEffect(() => {
		if (localStorage.getItem("role") !== "1") navigate("/*")
		getData()
	}, [])

	useEffect(getData, [currentPage])

	const handleSearch = () => {
		dispatch(setLoading(true))
		setSearchSubmitted(true)

		post(`/deliver/deliver-search?limit=${limit}&page=${currentPage}`, {
			search: inputRef.current?.value,
		}).then((response) => {
			if (response.status === 200) {
				const { data } = response

				setTotalPage(Math.ceil(data?.deliver / limit))
				setFilteredData(data?.data)
				dispatch(setQuantity(data?.deliver))

				if (!data?.data?.length) setCurrentPage(1)
			} else {
				setTotalPage(1)
				toast.error("Nomalum server xatolik")
			}
			dispatch(setLoading(false))
		})
	}

	const clearSearch = () => {
		inputRef.current.value = ""
	}

	useEffect(() => {
		setCurrentPage(1)
		if (didMount.current) {
			handleSearch()
		} else {
			didMount.current = true
		}
	}, [limit])

	const addNewDeliver = () => {
		setSubmitted(true)
		if (name.length && phone.slice(18) !== "_") {
			setBtn_loading(true)
			let obj = {
				deliver_name: name.trim(),
				deliver_nomer: phone.replace(/\D/g, ""),
				deliver_place: loc,
			}
			if (objId) {
				patch(`/deliver/deliver-patch/${objId}`, obj).then((data) => {
					if (data?.status === 200) {
						dispatch(editData(data?.data?.data))
						clearAndClose()
						toast.success("Malumot muvoffaqiyatli o'zgartirildi")
					} else if (data?.response?.data?.error === "USER_ALREADY_EXIST") {
						toast.warn("Bunday ta'minotchi allaqachon mavjud")
					} else {
						toast.error("Nomalum server xatolik")
					}
					setBtn_loading(false)
				})
			} else {
				post("/deliver/deliver-post", obj).then((data) => {
					if (data?.status === 201) {
						dispatch(addData(data?.data?.data))
						dispatch(setQuantity())
						clearAndClose()
						toast.success("Ta'minotchi muvoffaqiyatli qo'shildi")
					} else if (data?.response?.data?.error === "USER_ALREADY_EXIST") {
						toast.warn("Bunday ta'minotchi allaqachon mavjud")
					} else {
						toast.error("Nomalum server xatolik")
					}
					setBtn_loading(false)
				})
			}
		}
	}

	const deleteSup = (id) => {
		dispatch(setLoading(true))
		remove(`/deliver/deliver-delete/${id}`).then((data) => {
			if (data?.status === 200) {
				dispatch(removeDeliver(id))
				dispatch(setQuantity())
				toast.success("Ta'minotchi muvoffaqiyatli o'chirildi")
				clearAndClose()
			} else if (data?.response?.data?.error === "PRODUCT_FOUND") {
				toast.warn("Bu ta'minotchida mahsulot mavjud")
			} else {
				toast.error("Nomalum server xatolik")
			}
			dispatch(setLoading(false))
		})
	}

	const editSup = (id) => {
		const index = state?.data.findIndex((item) => item.deliver_id === id)
		if (index !== -1) {
			setName(state?.data[index]?.deliver_name)
			setPhone(state?.data[index]?.deliver_nomer.slice(3))
			setLoc(state?.data[index]?.deliver_place)
			setObjId(id)
			setAddModalDisplay("block")
			setAddModalVisible(true)
		} else {
			toast.error("Nomalum server xatolik")
		}
	}

	const clearAndClose = () => {
		setName("")
		setPhone("")
		setLoc("")
		setObjId("")
		setSubmitted(false)
		setBtn_loading(false)
		setAddModalVisible(false)
		setTimeout(() => {
			setAddModalDisplay("none")
		}, 300)
	}

	const clearOnly = () => {
		setName("")
		setPhone("")
		setLoc("")
		setObjId("")
		setSubmitted(false)
		setBtn_loading(false)
	}

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber)
		if (inputRef.current.value === "") {
			setSearchSubmitted(false)
		}
	}

	return (
		<>
			<AddModal
				name={objId ? "Ta'minotchi tahrirlash" : "Ta'minotchi qo'shish"}
			>
				<div
					className={`input-wrapper modal-form regular 
					${submitted && stringCheck(name.trim()) !== null && "error"} ${
						darkMode ? "dark" : null
					}`}
				>
					<label>Ta'minotchi ismi</label>
					<input
						type="text"
						placeholder="Ta'minotchi ismini kiriting"
						className="input"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					{submitted && stringCheck(name.trim()) !== null && <Info size={20} />}
					<div className="validation-field">
						<span>
							{submitted && stringCheck(name.trim(), "Ism kiritish majburiy")}
						</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form regular 
					${submitted && phoneNumberCheck(phone) !== null && "error"} ${
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
						value={phone}
						onValueChange={(value) => setPhone(value.formattedValue)}
					/>
					{submitted && phoneNumberCheck(phone) !== null && <Info size={20} />}
					<div className="validation-field">
						<span>{submitted && phoneNumberCheck(phone)}</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form regular ${
						darkMode ? "dark" : null
					}`}
				>
					<label>Manzil kiriting</label>
					<textarea
						placeholder="Manzil"
						className="desc-input"
						value={loc}
						onChange={(e) => setLoc(e.target.value)}
					></textarea>
				</div>
				<div className="modal-btn-group">
					<button
						className={`primary-btn ${darkMode ? "dark" : null}`}
						disabled={btn_loading}
						onClick={addNewDeliver}
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
					value={state?.quantity}
					name="Ta'minotchilar soni"
					icon={<Truck size={24} color="var(--color-primary)" />}
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
					<DeliverList
						data={searchSubmitted ? filteredData : state?.data}
						deleteSup={deleteSup}
						editSup={editSup}
						showDropdown={showDropdown}
						setshowDropdown={setshowDropdown}
						miniModal={miniModal}
						setMiniModal={setMiniModal}
						darkMode={darkMode}
					/>

					{totalPage > 1 ? (
						<>
							<Pagination
								pages={totalPage}
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
									placeholder="Miqdor"
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
export default Deliver
