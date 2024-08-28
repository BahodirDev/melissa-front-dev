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
import moment from "moment"
import Pagination from "../../components/pagination/Pagination"

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
	const { store, client } = useSelector((state) => state)
	const dispatch = useDispatch()

	const [btnLoading, setBtnLoading] = useState(false)
	const [objId, setObjId] = useState("")
	const [submitted, setSubmitted] = useState(false)
	const [productListLoading, setProductListLoading] = useState(false)
	const [activeElementIndex, setActiveElementIndex] = useState(0)
	const nextInputRef = useRef(null)

	const [returnList, setReturnList] = useState([])
	const [loading, setLoading] = useState(false)
	const [returnQ, setReturnQ] = useState(0)
	const [currentPage, setCurrentPage] = useState(1)
	const [limit, setLimit] = useState(20)
	const [totalPages, setTotalPage] = useState(1)

	// filter
	const [filteredData, setFilteredData] = useState({})
	const [searchSubmitted, setSearchSubmitted] = useState(false)
	const [searchStoreId, setSearchStoreId] = useState("")
	const [searchDeliverId, setSearchDeliverId] = useState("")
	const [searchGoodId, setSearchGoodId] = useState("")
	const [products, setProducts] = useState([])
	const didMount = useRef(false)

	// new
	const [productObj, setProductObj] = useState({})
	const [clientObj, setClientObj] = useState({})
	const [storeObj, setStoreObj] = useState({})
	const [count, setCount] = useState(0)
	const [cost, setCost] = useState(0)
	const [reason, setReason] = useState("")
	const [status, setStatus] = useState("KUTILMOQDA")
	const [createdAt, setCreatedAt] = useState("")
	const [newDate, setNewDate] = useState("")

	const getData = (list, action) => {
		setLoading(true)
		get(`/${list}/${list}-list`).then((data) => {
			if (data?.status === 200 || data?.status === 201) {
				dispatch(action(data?.data))
			} else {
				toast.error("Nomalum server xatolik", { toastId: "" })
			}
			setLoading(false)
		})
	}

	const getReturnData = () => {
		setLoading(true)
		if (
			searchStoreId ||
			searchDeliverId ||
			inputRef.current?.value.length > 0
		) {
			handleSearch()
		} else {
			get(`/return/return-list?limit=${limit}&page=${currentPage}`).then(
				(data) => {
					if (data?.status === 200 || data?.status === 201) {
						setReturnList(data?.data?.data)
						setReturnQ(data?.data?.return)
						setTotalPage(Math.ceil(data?.data?.return / limit))
					} else {
						toast.error("Nomalum server xatolik", { toastId: "" })
						setTotalPage(1)
					}
					setLoading(false)
				}
			)
		}
	}

	useEffect(() => {
		if (nextInputRef.current) {
			nextInputRef.current.focus()
		}
	}, [activeElementIndex])

	useEffect(() => {
		if (localStorage.getItem("role") !== "1") navigate("/*")
		getReturnData()
		getData("deliver", setDataDeliver)
	}, [])

	useEffect(() => {
		setCurrentPage(1)
		if (didMount.current) {
			handleSearch()
		} else {
			didMount.current = true
		}
	}, [searchStoreId, searchDeliverId, limit])

	useEffect(getReturnData, [currentPage])

	const addNewReturn = () => {
		setSubmitted(true)
		if (productObj && storeObj && count > 0 && cost > 0) {
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
				from_product: false,
			}
			if (objId) {
				patch(`/return/return-patch/${objId}`, newObj).then((data) => {
					if (data?.status === 200 || data?.status === 201) {
						patch(`/return/return-pass/${objId}`, { status }).then((datai) => {
							if (datai?.status === 200 || datai?.status === 201) {
								let newArr = [...returnList]
								let objIndex = newArr.findIndex(
									(item) => item?.return_id === objId
								)
								let modifiedObj = {
									...newArr[objIndex],
									return_count: data?.data?.return_count,
									return_cost: data?.data?.return_cost,
									return_case: data?.data?.return_case,
									item_status: status,
									return_createdat: data?.data?.return_createdat,
								}
								newArr[objIndex] = modifiedObj
								setReturnList(newArr)

								if (objId) setFilteredData(newArr)
								clearAndClose()
								toast.success("Malumot muvoffaqiyatli o'zgartirildi")
							} else {
								toast.error("Nomalum server xatolik")
							}
							setBtnLoading(false)
						})
					} else if (data?.response?.data?.error === "CLIENTS_NOT_FOUND") {
						toast.warn("Bunday mijoz topilmadi")
					} else {
						toast.error("Nomalum server xatolik")
					}
					setBtnLoading(false)
				})
			} else {
				post("/return/return-post", newObj).then((data) => {
					if (data?.status === 200 || data?.status === 201) {
						let modifiedObj = {
							return_id: data?.data?.return_id,
							return_count: data?.data?.return_count,
							return_cost: data?.data?.return_cost,
							return_case: data?.data?.return_case,
							item_status: data?.data?.item_status,
							return_createdat: data?.data?.return_createdat
								? data?.data?.return_createdat
								: new Date(),
							pack: {
								store_name: storeObj?.store_name,
								client_name: clientObj?.clients_name,
								client_nomer: clientObj?.clients_nomer,
								product_code: productObj?.goods_id?.goods_code,
								product_name: productObj?.goods_id?.goods_name,
							},
						}
						setReturnList([modifiedObj, ...returnList])
						setReturnQ((prev) => prev + 1)

						if (objId) setFilteredData([modifiedObj, ...filteredData])
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
		setLoading(true)
		remove(`/return/return-delete/${id}`).then((data) => {
			if (data?.status === 200) {
				setReturnList((prev) => prev?.filter((item) => item?.return_id !== id))
				searchSubmitted &&
					setFilteredData((prev) =>
						prev?.filter((item) => item?.return_id !== id)
					)
				setReturnQ((prev) => prev - 1)
				toast.success("Mahsulot muvoffaqiyatli o'chirildi")
				clearAndClose()
			} else {
				toast.error("Nomalum server xatolik")
			}
			setLoading(false)
		})
	}

	const handleSearch = () => {
		setLoading(true)
		setSearchSubmitted(true)
		post(`/return/return-filter?limit=${limit}&page=${currentPage}`, {
			search: inputRef.current?.value,
		}).then((data) => {
			if (data.status === 200) {
				setTotalPage(Math.ceil(data?.data?.count / limit))
				setFilteredData(data?.data?.data)
				setReturnQ(data?.data?.count)
				if (!data?.data?.data?.length) setCurrentPage(1)
			} else {
				setTotalPage(1)
				toast.error("Nomalum server xatolik")
			}
			setLoading(false)
		})
	}

	const clearSearch = () => {
		setSearchSubmitted(false)
		setFilteredData([])
		inputRef.current.value = ""
	}

	const editItem = (id) => {
		setProductObj({})
		setObjId(id)
		setAddModalDisplay("block")
		setAddModalVisible(true)
		get(`/return/return-list/${id}`).then((data) => {
			if (data?.status === 200) {
				const storeIndex = store?.data?.findIndex(
					(item) => item?.store_id === data?.data?.return_store_id
				)
				const clientIndex = client?.data?.findIndex(
					(item) => item?.clients_id === data?.data?.client_id
				)
				get(`/products/products-list/${data?.data?.return_item_id}`).then(
					(data) => {
						if (data?.status === 200) setProductObj(data?.data)
					}
				)

				setClientObj(client?.data[clientIndex])
				setStoreObj(store?.data[storeIndex])
				setReason(data?.data?.return_case)
				setCount(data?.data?.return_count)
				setStatus(data?.data?.item_status)
				setCost(data?.data?.return_cost)
				setCreatedAt(moment(data?.data?.return_createdat).format("YYYY-MM-DD"))
			} else {
				clearAndClose()
				toast.error("Nomalum server xatolik")
			}
		})
	}

	const clearAndClose = () => {
		setProductObj({})
		setClientObj({})
		setStoreObj({})
		setCount(0)
		setCost(0)
		setReason("")
		setCreatedAt("")

		setActiveElementIndex(0)
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
		setBtnLoading(false)

		setActiveElementIndex(1)
		setSubmitted(false)
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

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber)
		if (
			searchStoreId === "" &&
			searchDeliverId === "" &&
			inputRef.current.value === ""
		) {
			setSearchSubmitted(false)
		}
	}

	return (
		<>
			<AddModal
				name={
					objId ? "Qaytgan mahsulot tahrirlash" : "Qaytgan mahsulot qo'shish"
				}
			>
				<div
					className={`input-wrapper modal-form ${
						submitted && stringCheck(storeObj?.store_name) !== null && "error"
					} ${darkMode ? "dark" : null}`}
				>
					<label>Ombor</label>
					<Select
						showSearch
						allowClear={!objId}
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
						onChange={(e) => {
							handleStoreChange(e)
							setActiveElementIndex(2)
						}}
						ref={activeElementIndex === 1 ? nextInputRef : null}
					>
						{store?.data.length
							? store?.data.map((item, idx) => {
									if (objId) {
										if (idx < 1)
											return (
												<Select.Option
													key={idx}
													value={JSON.stringify(item)}
													className={`${darkMode ? "dark" : null}`}
													disabled
												>
													<div>
														<span>{item?.store_name}</span>
													</div>
												</Select.Option>
											)
									} else {
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
									}
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
						allowClear={!objId}
						placeholder={
							storeObj?.store_name ? "Mahsulot tanlang" : "Ombor tanlanmagan"
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
								  } - ${Math.round(
										productObj?.products_count_price *
											productObj?.currency_id?.currency_amount
								  ).toLocaleString()}so'm`
								: null
						}
						onChange={(e) => {
							setActiveElementIndex(3)
							if (e) {
								setProductObj(JSON.parse(e))
								// setCost(JSON.parse(e)?.products_count_price)
								setCost(
									(
										JSON.parse(e).products_count_price *
										JSON.parse(e).currency_id.currency_amount
									).toFixed(0)
								)
							} else setProductObj({})
						}}
						ref={activeElementIndex === 2 ? nextInputRef : null}
						notFoundContent={productListLoading ? <Spin size="small" /> : null}
					>
						{products?.length
							? products?.map((item, idx) => {
									if (objId) {
										if (idx < 1)
											return (
												<Select.Option
													key={idx}
													value={JSON.stringify(item)}
													className={`option-shrink ${
														darkMode ? "dark" : null
													}`}
													disabled
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
															{Math.round(
																item?.products_count_price *
																	item?.currency_id?.currency_amount
															).toLocaleString()}
															so'm - {item?.deliver_id?.deliver_name}
														</span>
													</div>
												</Select.Option>
											)
									} else {
										return (
											<Select.Option
												key={idx}
												value={JSON.stringify(item)}
												className={`option-shrink ${darkMode ? "dark" : null}`}
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
														{Math.round(
															item?.products_count_price *
																item?.currency_id?.currency_amount
														).toLocaleString()}
														so'm - {item?.deliver_id?.deliver_name}
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
									productObj?.goods_id?.goods_name,
									"Mahsulot tanlash majburiy"
								)}
						</span>
					</div>
				</div>
				<div className={`input-wrapper modal-form ${darkMode ? "dark" : null}`}>
					<label>Mijoz</label>
					<Select
						showSearch
						allowClear
						placeholder="Mijoz tanlang"
						className="select"
						value={
							clientObj?.clients_name
								? `${clientObj.clients_name} - ${format_phone_number(
										clientObj.clients_nomer
								  )}`
								: null
						}
						onChange={(e) => {
							setActiveElementIndex(4)
							e ? setClientObj(JSON.parse(e)) : setClientObj({})
						}}
						ref={activeElementIndex === 3 ? nextInputRef : null}
					>
						{client?.data?.length
							? client?.data?.map((item, idx) => {
									if (!item?.isdelete) {
										if (objId) {
											if (idx < 1)
												return (
													<Select.Option
														key={idx}
														className={`option-shrink ${
															darkMode ? "dark" : null
														}`}
														value={JSON.stringify(item)}
														disabled
													>
														<div>
															<span>{item?.clients_name} - </span>
															<span>
																{format_phone_number(item?.clients_nomer)}
															</span>
														</div>
													</Select.Option>
												)
										} else {
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
									}
							  })
							: null}
					</Select>
				</div>
				<div
					className={`input-wrapper modal-form regular ${
						submitted && numberCheck(count) !== null && "error"
					} ${darkMode ? "dark" : null} ${objId ? "disabled" : null}`}
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
						ref={activeElementIndex === 4 ? nextInputRef : null}
						disabled={objId}
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
						{productObj?.products_count_price
							? Math.round(
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
				{objId ? (
					<div
						className={`input-wrapper modal-form ${
							submitted && stringCheck(status) !== null && "error"
						} ${darkMode ? "dark" : null}`}
					>
						<label>Status</label>
						<Select
							placeholder="Status tanlang"
							className={`select`}
							// suffixIcon={
							// 	submitted && stringCheck(storeObj?.store_name) !== null ? (
							// 		<Info size={20} />
							// 	) : (
							// 		<CaretDown size={16} />
							// 	)
							// }
							value={status ? status : null}
							onChange={(e) => setStatus(e)}
						>
							<Select.Option
								value="KUTILMOQDA"
								className={`${darkMode ? "dark" : null}`}
							>
								<div>
									<span>Kutilmoqda</span>
								</div>
							</Select.Option>
							<Select.Option
								value="FIXING"
								className={`${darkMode ? "dark" : null}`}
							>
								<div>
									<span>Tuzatilmoqda</span>
								</div>
							</Select.Option>
							<Select.Option
								value="FIXED"
								className={`${darkMode ? "dark" : null}`}
							>
								<div>
									<span>Tuzatildi</span>
								</div>
							</Select.Option>
							<Select.Option
								value="RETURNED_TOCLIENT"
								className={`${darkMode ? "dark" : null}`}
							>
								<div>
									<span>Klientga qaytib berildi</span>
								</div>
							</Select.Option>
							<Select.Option
								value="RETURNED_TODELIVER"
								className={`${darkMode ? "dark" : null}`}
							>
								<div>
									<span>Dillerga qaytib berildi</span>
								</div>
							</Select.Option>
							<Select.Option
								value="NOT FIXED"
								className={`${darkMode ? "dark" : null}`}
							>
								<div>
									<span>Yaroqsiz</span>
								</div>
							</Select.Option>
						</Select>
						<div className="validation-field">
							<span>
								{submitted &&
									stringCheck(storeObj?.store_name, "Ombor tanlash majburiy")}
							</span>
						</div>
					</div>
				) : null}
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
						{store?.data.length
							? store?.data.map((item, idx) => (
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
						{client?.data.length
							? client?.data.map((item, idx) => {
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
					value={searchSubmitted ? filteredData.length : returnQ}
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

			{loading ? (
				<Loader />
			) : (
				<>
					<ReturnTable
						data={searchSubmitted ? filteredData : returnList}
						deleteItem={deleteItem}
						editItem={editItem}
						showDropdown={showDropdown}
						setshowDropdown={setshowDropdown}
						sidebar={sidebar}
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
			)}
		</>
	)
}

export default Return
