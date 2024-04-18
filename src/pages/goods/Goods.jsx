import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useOutletContext } from "react-router-dom"
import { setData as setDataDeliver } from "../../components/reducers/deliver"
import Loader from "../../components/loader/Loader"
import {
	addData,
	editData,
	removeGood,
	setData,
	setLoading,
	setQuantity,
} from "../../components/reducers/good"
import { stringCheck } from "../../components/validation"
import { get, patch, post, remove } from "../../customHook/api"
import GoodsList from "./GoodsList"
import "./goods.css"
import { toast } from "react-toastify"
import Search from "../../components/search/Search"
import AddModal from "../../components/add/AddModal"
import InfoItem from "../../components/info_item/InfoItem"
import { CaretDown, Info, SquaresFour } from "@phosphor-icons/react"
import { Select } from "antd"
import format_phone_number from "../../components/format_phone_number/format_phone_number"
import Pagination from "../../components/pagination/Pagination"

export default function Goods() {
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
	const navigate = useNavigate()
	const state = useSelector((state) => state.good)
	const deliver = useSelector((state) => state.deliver)
	const dispatch = useDispatch()
	const [activeElementIndex, setActiveElementIndex] = useState(0)
	const nextInputRef = useRef(null)

	// filter
	const [filteredData, setFilteredData] = useState([])
	const [btn_loading, setBtn_loading] = useState(false)
	const [objId, setObjId] = useState("")
	const [submitted, setSubmitted] = useState(false)
	const [searchSubmitted, setSearchSubmitted] = useState(false)
	const [imageValidationError, setImageValidationError] = useState(false)
	const [deliverId, setDeliverId] = useState("")
	const [currentPage, setCurrentPage] = useState(1)
	const [limit, setLimit] = useState(20)
	const [totalPages, setTotalPage] = useState(1)
	const didMount = useRef(false)

	// new
	const [newGoodName, setNewGoodName] = useState("")
	const [newGoodCode, setNewGoodCode] = useState("")
	const [newDeliver, setNewDeliver] = useState("")
	const [imageFile, setImageFile] = useState(null)

	useEffect(() => {
		if (nextInputRef.current) {
			nextInputRef.current.focus()
		}
	}, [activeElementIndex])

	const getData = () => {
		dispatch(setLoading(true))
		if (deliverId || inputRef.current?.value.length > 0) {
			handleSearch()
		} else {
			get(`/goods/goods-list?limit=${limit}&page=${currentPage}`).then(
				(data) => {
					if (data?.status === 200 || data?.status === 201) {
						setTotalPage(Math.ceil(data?.data[0]?.full_count / limit))
						dispatch(setData(data?.data))
						dispatch(setQuantity())
					} else {
						setTotalPage(1)
						toast.error("Nomalum server xatolik")
					}
					dispatch(setLoading(false))
				}
			)
		}
	}

	useEffect(getData, [currentPage])

	useEffect(() => {
		if (localStorage.getItem("role") !== "1") navigate("/*")
		get(`/deliver/deliver-list`).then((data) => {
			dispatch(setDataDeliver(data?.data))
		})
	}, [])

	const addGood = () => {
		setSubmitted(true)
		if (newGoodName && newGoodCode && newDeliver) {
			setBtn_loading(true)
			let newObj = {
				goods_name: newGoodName.trim(),
				goods_code: newGoodCode.trim(),
				delivery_id: newDeliver?.deliver_id,
			}
			if (objId) {
				patch(`/goods/goods-patch/${objId}`, newObj).then((data) => {
					if (data?.status === 201) {
						dispatch(
							editData({
								...data?.data,
								deliver_name: newDeliver?.deliver_name,
							})
						)

						if (searchSubmitted) {
							setFilteredData((prevFilteredData) => {
								return prevFilteredData.map((item) => {
									if (item.goods_id === data?.data.goods_id) {
										return {
											...item,
											deliver_name: newDeliver?.deliver_name,
											goods_name: data?.data?.goods_name,
											goods_code: data?.data?.goods_code,
										}
									}
									return item
								})
							})
						}
						clearAndClose()
						toast.success("Kategoriya muvoffaqiyatli o'zgartirildi")
					} else if (data?.response?.data?.error === "GOODS_ALREADY_EXIST") {
						toast.warn("Bunday kategoriya allaqachon mavjud")
					} else {
						toast.error("Nomalum server xatolik")
					}
					setBtn_loading(false)
				})
			} else {
				post("/goods/goods-post", newObj).then((data) => {
					if (data?.status === 201) {
						dispatch(addData(data?.data))
						dispatch(setQuantity())
						clearAndClose()
						toast.success("Kategoriya muvoffaqiyatli qo'shildi")
						if (searchSubmitted) {
							setFilteredData([data?.data, ...filteredData])
						}
					} else if (data?.response?.data?.error === "GOODS_ALREADY_EXIST") {
						toast.warn("Bunday kategoriya allaqachon mavjud")
					} else {
						toast.error("Nomalum server xatolik")
					}
					setBtn_loading(false)
				})
			}
		}
	}

	const deleteGood = (id) => {
		dispatch(setLoading(true))
		remove(`/goods/goods-delete/${id}`).then((data) => {
			if (data?.status === 200) {
				dispatch(removeGood(id))
				dispatch(setQuantity())
				if (searchSubmitted) {
					setFilteredData([
						...filteredData?.filter((item) => item.goods_id !== id),
					])
				}
				toast.success("Kategoriya muvoffaqiyatli o'chirildi")
				clearAndClose()
			} else if (data?.response?.data?.error === "GOODS_ALREADY_EXIST") {
				toast.warn("Bu kategoriyada mahsulot mavjud")
			} else {
				toast.error("Nomalum server xatolik")
			}
			dispatch(setLoading(false))
		})
	}

	const editGood = (id) => {
		setObjId(id)
		setAddModalDisplay("block")
		setAddModalVisible(true)

		get(`/goods/goods-list/${id}`).then((data) => {
			if (data?.status === 201) {
				setNewGoodName(data?.data[0]?.goods_name)
				setNewGoodCode(data?.data[0]?.goods_code)
				setNewDeliver({
					deliver_name: data?.data[0]?.deliver_name,
					deliver_nomer: data?.data[0]?.deliver_nomer,
					deliver_id: data?.data[0]?.delivery_id,
				})
				setImageFile(data?.data[0]?.img_url)
			} else {
				clearAndClose()
				toast.error("Nomalum server xatolik")
			}
		})
	}

	const clearAndClose = () => {
		setNewGoodName("")
		setNewGoodCode("")
		setNewDeliver("")
		setImageFile(null)
		setActiveElementIndex(0)

		setObjId("")
		setBtn_loading(false)
		setSubmitted(false)
		setAddModalVisible(false)
		setTimeout(() => {
			setAddModalDisplay("none")
		}, 300)
	}

	const handleSearch = () => {
		dispatch(setLoading(true))
		setSearchSubmitted(true)
		const deliverObj = deliverId && JSON.parse(deliverId)
		let filterObj = {
			deliver_id: deliverObj?.deliver_id,
			search: inputRef.current?.value,
		}
		post(
			`/goods/goods-search?limit=${limit}&page=${currentPage}`,
			filterObj
		).then((data) => {
			if (data.status === 200) {
				setTotalPage(Math.ceil(data?.data[0]?.full_count / limit))
				setFilteredData(data?.data)
				if (!data?.data?.length) setCurrentPage(1)
			} else {
				setTotalPage(1)
				toast.error("Nomalum server xatolik")
			}
			dispatch(setLoading(false))
		})
	}

	useEffect(() => {
		setCurrentPage(1)
		if (didMount.current) {
			handleSearch()
		} else {
			didMount.current = true
		}
	}, [deliverId, limit])

	const clearOnly = () => {
		setNewGoodName("")
		setNewGoodCode("")
		setNewDeliver("")
		setActiveElementIndex(1)

		setObjId("")
		setBtn_loading(false)
		setSubmitted(false)
	}

	function filterOptionDeliver(inputValue, option) {
		const data = JSON.parse(option.props.value)?.deliver_name
		return data.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
	}

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber)
		if (deliverId === "" && inputRef.current.value === "") {
			setSearchSubmitted(false)
		}
	}

	return (
		<>
			<AddModal name={objId ? "Kategoriya tahrirlash" : "Kategoriya qo'shish"}>
				<div
					className={`input-wrapper modal-form ${
						submitted &&
						stringCheck(newDeliver?.deliver_name) !== null &&
						"error"
					} ${darkMode ? "dark" : null}`}
				>
					<label>Ta'minotchi</label>
					<Select
						showSearch
						allowClear
						placeholder="Ta'minotchi tanlang"
						className="select"
						suffixIcon={
							submitted && stringCheck(newDeliver?.deliver_name) !== null ? (
								<Info size={20} />
							) : (
								<CaretDown size={16} />
							)
						}
						value={
							newDeliver?.deliver_name
								? `${newDeliver?.deliver_name} - ${format_phone_number(
										newDeliver?.deliver_nomer
								  )}`
								: null
						}
						onChange={(e) => {
							e ? setNewDeliver(JSON.parse(e)) : setNewDeliver({})
							setActiveElementIndex(2)
						}}
						ref={activeElementIndex === 1 ? nextInputRef : null}
					>
						{deliver.data?.length
							? deliver.data.map((item, idx) => {
									if (!item?.isdelete) {
										return (
											<Select.Option
												key={idx}
												className={`option-shrink ${darkMode ? "dark" : null}`}
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
							: null}
					</Select>
					<div className="validation-field">
						<span>
							{submitted &&
								stringCheck(
									newDeliver?.deliver_nomer,
									"Ta'minotchi tanlash majburiy"
								)}
						</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form regular ${
						submitted && stringCheck(newGoodName.trim()) !== null && "error"
					} ${darkMode ? "dark" : null}`}
				>
					<label>Kategoriya nomi</label>
					<input
						type="text"
						placeholder="Kategoriya nomini kiriting"
						className="input"
						value={newGoodName}
						onChange={(e) => setNewGoodName(e.target.value)}
						ref={activeElementIndex === 2 ? nextInputRef : null}
					/>
					{submitted && stringCheck(newGoodName.trim()) !== null && (
						<Info size={20} />
					)}
					<div className="validation-field">
						<span>
							{submitted &&
								stringCheck(newGoodName.trim(), "Nom kiritish majburiy")}
						</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form regular 
					${submitted && stringCheck(newGoodCode.trim()) !== null && "error"}  ${
						darkMode ? "dark" : null
					}`}
				>
					<label>Kategoriya kodi</label>
					<input
						type="text"
						placeholder="Kategoriya kodi kiriting"
						className="input"
						value={newGoodCode}
						onChange={(e) => setNewGoodCode(e.target.value)}
					/>
					{submitted && stringCheck(newGoodCode.trim()) !== null && (
						<Info size={20} />
					)}
					<div className="validation-field">
						<span>
							{submitted &&
								stringCheck(newGoodCode.trim(), "Kod kiritish majburiy")}
						</span>
					</div>
				</div>

				{/* {objId ? (
					<div
						className={`input-wrapper modal-form regular ${
							imageValidationError ? "error" : null
						}`}
					>
						<label>Rasm</label>
						<div class="drop-zone">
							{imageFile === null || imageFile === "Unknown" ? (
								<span class="drop-zone__prompt">
									Rasm yuklang yoki tashlang
								</span>
							) : (
								<div
									className="drop-zone__thumb"
									style={{ backgroundImage: `url('${imageFile}')` }}
								></div>
							)}
							<input
								className="input"
								onChange={handleImageChange}
								type="file"
								name="myFile"
								class="drop-zone__input"
							/>
						</div>
						{imageValidationError ? <Info size={20} /> : null}
						<div className="validation-field">
							<span>
								{imageValidationError
									? "Iltimos yaroqli faylni kiriting"
									: null}
							</span>
						</div>
					</div>
				) : null} */}
				<div className="modal-btn-group">
					<button
						className={`primary-btn ${darkMode ? "dark" : null}`}
						disabled={btn_loading}
						onClick={addGood}
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

			<div className={`filter-wrapper good ${darkMode ? "dark" : null}`}>
				<div className={`input-wrapper ${darkMode ? "dark" : null}`}>
					<Select
						showSearch
						allowClear
						placeholder="Ta'minotchi"
						className="select"
						value={deliverId ? deliverId : null}
						onChange={(e) => {
							setDeliverId(e)
							handleSearch(e && JSON.parse(e))
						}}
						filterOption={filterOptionDeliver}
					>
						{deliver.data?.length
							? deliver.data.map((item, idx) => {
									if (!item?.isdelete)
										return (
											<Select.Option
												key={idx}
												value={JSON.stringify(item)}
												className={`${darkMode ? "dark" : null}`}
											>
												<div>
													<span>{item?.deliver_name}</span>
												</div>
											</Select.Option>
										)
							  })
							: null}
					</Select>
				</div>
			</div>

			<div className="info-wrapper">
				<InfoItem
					value={searchSubmitted ? filteredData.length : state?.quantity}
					name="Kategoriyalar soni"
					icon={<SquaresFour size={24} color="var(--color-primary)" />}
					iconBgColor={`${darkMode ? "var(--d-bg-icon)" : "var(--bg-icon)"}`}
					darkMode={darkMode}
				/>
			</div>

			<Search
				handleSearch={() => handleSearch(deliverId && JSON.parse(deliverId))}
				clearSearch={() => (inputRef.current.value = "")}
				showAddBtn={userInfo?.role === 1}
				clearOnly={clearOnly}
				darkMode={darkMode}
			/>

			{state?.loading ? (
				<Loader />
			) : (
				<>
					<GoodsList
						data={searchSubmitted ? filteredData : state?.data}
						deleteGood={deleteGood}
						editGood={editGood}
						showDropdown={showDropdown}
						setshowDropdown={setshowDropdown}
						userInfo={userInfo?.role}
						darkMode={darkMode}
					/>

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
							onChange={(e) => setLimit(e)}
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
			)}
		</>
	)
}
