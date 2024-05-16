import { Select, Spin } from "antd"
import { Option } from "antd/es/mentions"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useOutletContext } from "react-router-dom"
import Loader from "../../components/loader/Loader"
import { setData as setDataDeliver } from "../../components/reducers/deliver"
import { setData as setDataGoods } from "../../components/reducers/good"
import { setDataProduct } from "../../components/reducers/product"
import {
	addData,
	editData,
	removeReturn,
	setDataReturn,
	setLoading,
	setQuantity,
} from "../../components/reducers/return"
import ReturnTable from "../../components/return_table/ReturnTable"
import { numberCheck, stringCheck } from "../../components/validation"
import { get, patch, post, remove } from "../../customHook/api"
import "./return.css"
import { toast } from "react-toastify"
import Search from "../../components/search/Search"
import AddModal from "../../components/add/AddModal"
import InfoItem from "../../components/info_item/InfoItem"
import { ArrowCounterClockwise, CaretDown, Info } from "@phosphor-icons/react"
import format_phone_number from "../../components/format_phone_number/format_phone_number"

function Return() {
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
	const state = useSelector((state) => state)
	const dispatch = useDispatch()

	const [btnLoading, setBtnLoading] = useState(false)
	const [objId, setObjId] = useState("")
	const [submitted, setSubmitted] = useState(false)
	const [productListLoading, setProductListLoading] = useState(false)

	// filter
	const [filteredData, setFilteredData] = useState({})
	const [searchSubmitted, setSearchSubmitted] = useState(false)
	const [searchStoreId, setSearchStoreId] = useState("")
	const [searchDeliverId, setSearchDeliverId] = useState("")
	const [searchGoodId, setSearchGoodId] = useState("")
	const [products, setProducts] = useState([])

	// new
	const [productObj, setProductObj] = useState({})
	const [clientObj, setClientObj] = useState({})
	const [storeObj, setStoreObj] = useState({})
	const [count, setCount] = useState(0)
	const [cost, setCost] = useState(0)
	const [reason, setReason] = useState("")
	const [createdAt, setCreatedAt] = useState("")
	const [newDate, setNewDate] = useState("")

	const getData = (list, action) => {
		dispatch(setLoading(true))
		get(`/${list}/${list}-list`).then((data) => {
			if (data?.status === 200 || data?.status === 201) {
				dispatch(action(data?.data))
				if (list === "return") {
					dispatch(setQuantity())
				}
			} else {
				toast.error("Nomalum server xatolik", { toastId: "" })
			}
			dispatch(setLoading(false))
		})
	}

	useEffect(() => {
		if (localStorage.getItem("role") !== "1") navigate("/*")
		getData("return", setDataReturn)
		getData("deliver", setDataDeliver)
	}, [])

	const addNewReturn = () => {
		setSubmitted(true)
		if (productObj && clientObj && storeObj && count > 0 && cost > 0) {
			setBtnLoading(true)
			let newObj = {
				return_item_id: productObj?.products_id,
				return_store_id: storeObj?.store_id,
				client_id: clientObj?.clients_id,
				return_count: count,
				return_cost: cost,
				return_case: reason,
				return_createdat: createdAt
					? new Date(createdAt).toISOString()
					: new Date().toISOString(),
			}
			if (objId) {
				console.log("patch")
				// patch(`/return/return-patch/${objId}`, newObj).then((data) => {
				// 	if (data?.status === 201) {
				// 		// dispatch(editData({ ...data?.data, ...clientObj }))
				// 		toast.success("Malumot muvoffaqiyatli o'zgartirildi")
				// 		clearAndClose()
				// 	} else if (data?.response?.data?.error === "CLIENTS_NOT_FOUND") {
				// 		toast.warn("Bunday mijoz topilmadi")
				// 	} else {
				// 		toast.error("Nomalum server xatolik")
				// 	}
				// 	setBtnLoading(false)
				// })
			} else {
				post("/return/return-post", newObj).then((data) => {
					if (data?.status === 200) {
						// dispatch(addData({ ...data?.data, ...clientObj }))
						// dispatch(setQuantity())
						clearAndClose()
						toast.success("Mahsulot muvoffaqiyatli qaytarildi")
					} else if (data?.response?.data?.error === "CLIENTS_NOT_FOUND") {
						toast.warn("Bunday mijoz topilmadi")
					} else {
						toast.error("Nomalum server xatolik")
					}
					setBtnLoading(false)
				})
			}
		}
	}

	const deleteItem = (id) => {
		dispatch(setLoading(true))
		remove(`/return/return-delete/${id}`).then((data) => {
			if (data?.status === 200) {
				dispatch(removeReturn(id))
				dispatch(setQuantity())
				toast.success("Mahsulot muvoffaqiyatli o'chirildi")
				clearAndClose()
			} else {
				toast.error("Nomalum server xatolik")
			}
			dispatch(setLoading(false))
		})
	}

	const handleSearch = () => {
		dispatch(setLoading(true))
		setSearchSubmitted(true)

		get(`/return/return-list`).then((data) => {
			if (data.status === 200 || data?.status === 201) {
				setFilteredData(data?.data)
			} else {
				toast.error("Nomalum server xatolik")
			}
			dispatch(setLoading(false))
		})
	}

	const clearSearch = () => {
		setSearchSubmitted(false)
		setFilteredData([])
		inputRef.current.value = ""
	}

	const editItem = (id) => {
		// setProductObj({})
		// setObjId(id)
		// setAddModalDisplay("block")
		// setAddModalVisible(true)

		// get(`/return/return-list/${id}`).then((data) => {
		// 	if (data?.status === 200) {
		// 		const index = state?.client?.data.findIndex(
		// 			(item) => item.clients_id === data?.data?.client_id
		// 		)
		// 		setProductObj(data?.data?.return_name)
		// 		setClientObj(state?.client?.data[index])
		// 		setStoreObj(data?.data?.return_store)
		// 		setCount(data?.data?.return_count)
		// 		setCost(data?.data?.return_cost)
		// 		setReason(data?.data?.return_case)
		// 	} else {
		// 		clearAndClose()
		// 		toast.error("Nomalum server xatolik")
		// 	}
		// })
	}

	const clearAndClose = () => {
		setProductObj({})
		setClientObj({})
		setStoreObj({})
		setCount(0)
		setCost(0)
		setReason("")

		setObjId("")
		setSubmitted(false)
		setBtnLoading(false)

		setAddModalVisible(false)
		setTimeout(() => {
			setAddModalDisplay("none")
		}, 300)
	}

	const clearOnly = () => {
		setProductObj({})
		setClientObj({})
		setStoreObj({})
		setCount(0)
		setCost(0)
		setReason("")

		setObjId("")
		setSubmitted(false)
		setBtnLoading(false)
	}

	const handleStoreChange = (id) => {
		setProductObj({})

		if (id) {
			const obj = JSON.parse(id)
			setStoreObj(obj)
			setProductListLoading(true)

			get(`/products/products-by-storeid/${obj?.store_id}`).then((data) => {
				if (data?.status === 200) {
					setProducts(data?.data)
				} else {
					setProducts([])
				}
				setProductListLoading(false)
			})
		} else {
			setProductListLoading(false)
			setStoreObj({})
			setProducts([])
		}
	}

	function filterOption(inputValue, option) {
		const goodsData = JSON.parse(option.props.value)?.goods_id
		const goodsNameFirst = goodsData?.goods_name + " " + goodsData?.goods_code
		const goodsCodeFirst = goodsData?.goods_code + " " + goodsData?.goods_name
		const goodsNameFirstDashRemoved = goodsData?.goods_name
			.replace(/\s|-/g, "")
			.toLowerCase()
		const goodsCodeFirstDashRemoved = goodsData?.goods_code
			.replace(/\s|-/g, "")
			.toLowerCase()

		const inputValueLowerCase = inputValue.toLowerCase()
		const inputWords = inputValueLowerCase.split(" ")

		const allWordsMatch = inputWords.every(
			(word) =>
				goodsNameFirst.toLowerCase().includes(word) ||
				goodsCodeFirst.toLowerCase().includes(word) ||
				goodsNameFirstDashRemoved.toLowerCase().includes(word) ||
				goodsCodeFirstDashRemoved.toLowerCase().includes(word)
		)

		return allWordsMatch
	}

	return (
		<>
			<AddModal
				name={
					objId ? "Qaytgan mahsulot tahrirlash" : "Qaytgan mahsulot qo'shish"
				}
			>
				{objId && !productObj ? (
					<Loader />
				) : (
					<>
						<div
							className={`input-wrapper modal-form ${
								submitted &&
								stringCheck(storeObj?.store_name) !== null &&
								"error"
							} ${darkMode ? "dark" : null}`}
						>
							<label>Ombor</label>
							<Select
								showSearch
								allowClear
								placeholder="Ombor tanlang"
								className={`select`}
								suffixIcon={
									submitted && stringCheck(storeObj?.store_name) !== null ? (
										<Info size={20} />
									) : (
										<CaretDown size={16} />
									)
								}
								value={storeObj?.store_name ? storeObj?.store_name : null}
								onChange={handleStoreChange}
							>
								{state?.store?.data.length
									? state?.store?.data.map((item, idx) => {
											return (
												<Select.Option
													key={idx}
													value={JSON.stringify(item)}
													className={`${darkMode ? "dark" : null}`}
												>
													<div>
														<span>{item?.store_name}</span>
													</div>
												</Select.Option>
											)
									  })
									: null}
							</Select>
							<div className="validation-field">
								<span>
									{submitted &&
										stringCheck(storeObj?.store_name, "Ombor tanlash majburiy")}
								</span>
							</div>
						</div>
						<div
							className={`input-wrapper modal-form ${
								submitted &&
								stringCheck(productObj?.goods_id?.goods_name) !== null &&
								"error"
							} ${darkMode ? "dark" : null}`}
						>
							<label>Mahsulot</label>
							<Select
								showSearch
								allowClear
								placeholder={
									storeObj?.store_name
										? "Mahsulot tanlang"
										: "Ombor tanlanmagan"
								}
								className="select"
								filterOption={filterOption}
								suffixIcon={
									submitted &&
									stringCheck(productObj?.goods_id?.goods_name) !== null ? (
										<Info size={20} />
									) : (
										<CaretDown size={16} />
									)
								}
								value={
									productObj?.goods_id?.goods_name
										? `${productObj.goods_id.goods_name} - ${
												productObj.goods_id.goods_code
										  } - ${(
												productObj?.products_count_price *
												productObj?.currency_id?.currency_amount
										  ).toLocaleString()}so'm`
										: null
								}
								onChange={(e) => {
									if (e) {
										setProductObj(JSON.parse(e))
										setCost(JSON.parse(e)?.products_count_price)
									} else setProductObj({})
								}}
								notFoundContent={
									productListLoading ? <Spin size="small" /> : null
								}
							>
								{products?.length
									? products?.map((item, idx) => {
											return (
												<Select.Option
													key={idx}
													value={JSON.stringify(item)}
													className={`option-shrink ${
														darkMode ? "dark" : null
													}`}
												>
													<div>
														<span>
															<img
																src={item?.img_url}
																width={40}
																height={40}
																alt=""
																onClick={() => window.open(item?.img_url)}
															/>{" "}
															{item?.goods_id?.goods_name} -{" "}
															{item?.goods_id?.goods_code} -{" "}
														</span>
														<span>
															{(
																item?.products_count_price *
																item?.currency_id?.currency_amount
															).toLocaleString()}
															so'm - {item?.deliver_id?.deliver_name}
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
											productObj?.goods_id?.goods_name,
											"Mahsulot tanlash majburiy"
										)}
								</span>
							</div>
						</div>
						<div
							className={`input-wrapper modal-form ${
								submitted &&
								stringCheck(clientObj?.clients_name) !== null &&
								"error"
							} ${darkMode ? "dark" : null}`}
						>
							<label>Mijoz</label>
							<Select
								showSearch
								allowClear
								placeholder="Mijoz tanlang"
								className="select"
								suffixIcon={
									submitted && stringCheck(clientObj?.clients_name) !== null ? (
										<Info size={20} />
									) : (
										<CaretDown size={16} />
									)
								}
								value={
									clientObj?.clients_name
										? `${clientObj.clients_name} - ${format_phone_number(
												clientObj.clients_nomer
										  )}`
										: null
								}
								onChange={(e) => {
									e ? setClientObj(JSON.parse(e)) : setClientObj({})
								}}
							>
								{state?.client?.data?.length
									? state?.client?.data.map((item, idx) => {
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
							<div className="validation-field">
								<span>
									{submitted &&
										stringCheck(
											clientObj?.clients_name,
											"Mijoz tanlash majburiy"
										)}
								</span>
							</div>
						</div>
						<div
							className={`input-wrapper modal-form regular ${
								submitted && numberCheck(count) !== null && "error"
							} ${darkMode ? "dark" : null}`}
						>
							<label>Dona</label>
							<input
								type="text"
								placeholder="Qiymat kiriting"
								className="input"
								value={count ? count : ""}
								onKeyPress={(e) => {
									if (isNaN(e.key)) {
										e.preventDefault()
									}
								}}
								onChange={(e) => {
									setCount(e.target.value)
								}}
							/>
							{submitted && numberCheck(count) !== null && <Info size={20} />}
							<div className="validation-field">
								<span>{submitted && numberCheck(count)}</span>
							</div>
						</div>
						<div
							className={`input-wrapper modal-form regular ${
								submitted && numberCheck(cost) !== null && "error"
							} ${darkMode ? "dark" : null}`}
						>
							<label>
								Narx (
								{productObj.products_count_price
									? (
											productObj.products_count_price *
											productObj.currency_id.currency_amount
									  ).toLocaleString()
									: 0}
								so'm )
							</label>
							<input
								type="text"
								placeholder="Qiymat kiriting"
								className="input"
								value={cost ? cost : ""}
								onKeyPress={(e) => {
									if (isNaN(e.key)) {
										e.preventDefault()
									}
								}}
								onChange={(e) => setCost(e.target.value)}
							/>
							{submitted && numberCheck(cost) !== null && <Info size={20} />}
							<div className="validation-field">
								<span>{submitted && numberCheck(cost)}</span>
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
								value={reason}
								onChange={(e) => setReason(e.target.value)}
							></textarea>
						</div>
						<div
							className={`input-wrapper modal-form regular ${
								submitted && stringCheck(createdAt) !== null && "error"
							} ${darkMode ? "dark" : null}`}
						>
							<label>Qayd qilingan sana</label>
							<input
								type="date"
								placeholder="Sana kiriting"
								className="input date"
								value={createdAt ? createdAt : ""}
								onChange={(e) => setCreatedAt(e.target.value)}
							/>
							<div className="validation-field">
								<span>{submitted && stringCheck(createdAt)}</span>
							</div>
						</div>

						<div className="modal-btn-group">
							<button
								className={`primary-btn ${darkMode ? "dark" : null}`}
								disabled={btnLoading}
								onClick={addNewReturn}
							>
								{objId ? "Saqlash" : "Qo'shish"}{" "}
								{btnLoading && (
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
					</>
				)}
			</AddModal>

			<div className={`filter-wrapper ${darkMode ? "dark" : null}`}>
				<div className={`input-wrapper ${darkMode ? "dark" : null}`}>
					<Select
						showSearch
						allowClear
						placeholder="Ombor"
						className="select"
						value={searchStoreId ? searchStoreId : null}
						onChange={(e) => setSearchStoreId(e)}
						disabled
					>
						{state.store?.data.length
							? state.store?.data.map((item, idx) => (
									<Select.Option
										key={idx}
										value={item.store_id}
										className={` ${darkMode ? "dark" : null}`}
									>
										<div>
											<span>{item?.store_name}</span>
										</div>
									</Select.Option>
							  ))
							: null}
					</Select>
				</div>
				<div className={`input-wrapper ${darkMode ? "dark" : null}`}>
					<Select
						showSearch
						allowClear
						placeholder="Mijoz"
						className="select"
						value={searchDeliverId ? searchDeliverId : null}
						onChange={(e) => setSearchDeliverId(e)}
						disabled
					>
						{state.client?.data.length
							? state.client?.data.map((item, idx) => {
									if (!item?.isdelete)
										return (
											<Select.Option
												key={idx}
												value={item.clients_id}
												className={`option-shrink ${darkMode ? "dark" : null}`}
											>
												<div>
													<span>{item?.clients_name} - </span>
													<span>
														{format_phone_number(item?.clients_nomer)}
													</span>
												</div>
											</Select.Option>
										)
							  })
							: null}
					</Select>
				</div>
				<div className="filter-btn-group">
					<button
						type="button"
						className={`filter-btn ${darkMode ? "dark" : null}`}
						disabled
					>
						Tozalash
					</button>
				</div>
			</div>

			<div className="info-wrapper">
				<InfoItem
					value={
						searchSubmitted ? filteredData.length : state?.return?.quantity
					}
					name="Qaytgan mahsulotlar soni"
					icon={
						<ArrowCounterClockwise size={24} color="var(--color-primary)" />
					}
					iconBgColor={`${darkMode ? "var(--d-bg-icon)" : "var(--bg-icon)"}`}
					darkMode={darkMode}
				/>
			</div>

			<Search
				handleSearch={handleSearch}
				clearSearch={clearSearch}
				className={"table-m"}
				clearOnly={clearOnly}
				darkMode={darkMode}
			/>

			{state.return?.loading ? (
				<Loader />
			) : (
				<ReturnTable
					data={searchSubmitted ? filteredData : state.return.dataReturn}
					deleteItem={deleteItem}
					editItem={editItem}
					showDropdown={showDropdown}
					setshowDropdown={setshowDropdown}
					sidebar={sidebar}
					darkMode={darkMode}
				/>
			)}
		</>
	)
}

export default Return
