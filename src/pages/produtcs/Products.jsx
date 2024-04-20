import { Input, Select } from "antd"
import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useOutletContext } from "react-router-dom"
import {
	addComma,
	addSpace,
	formatSumma,
	roundToNearestThousand,
} from "../../components/addComma"
import { error_modal } from "../../components/error_modal/error_modal"
import Loader from "../../components/loader/Loader"
import { setData as setDataDeliver } from "../../components/reducers/deliver"
import { setData as setDataGood } from "../../components/reducers/good"
import {
	addData,
	editData,
	removeProduct,
	setAmount,
	setDataProduct,
	setLoading,
	setQuantity,
	setSum,
} from "../../components/reducers/product"
import AntTable from "../../components/table/Table"
import {
	numberCheck,
	numberCheckAllow0,
	stringCheck,
	validation,
} from "../../components/validation"
import { get, patch, post, remove } from "../../customHook/api"
import { mapOptionList } from "./mapOptionList"
import "./product.css"
import { toast } from "react-toastify"
import AddModal from "../../components/add/AddModal"
import InfoItem from "../../components/info_item/InfoItem"
import {
	ArrowCounterClockwise,
	CaretDown,
	CurrencyDollar,
	Info,
	Package,
	SquaresFour,
} from "@phosphor-icons/react"
import Search from "../../components/search/Search"
import format_phone_number from "../../components/format_phone_number/format_phone_number"
import moment from "moment"
import Pagination from "../../components/pagination/Pagination"

export default function Products() {
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
	const { product, good, currency, deliver, store } = useSelector(
		(state) => state
	)
	const dispatch = useDispatch()

	const [btnLoading, setBtnLoading] = useState(false)
	const [submitted, setSubmitted] = useState(false)
	// const [userInfo, setUserInfo] = useState()
	const [goodList, setGoodList] = useState([])
	const [objId, setObjId] = useState("")

	// filter
	const [filteredData, setFilteredData] = useState({})
	const [searchSubmitted, setSearchSubmitted] = useState(false)
	const [searchStoreId, setSearchStoreId] = useState("")
	const [searchDeliverId, setSearchDeliverId] = useState("")

	const [currentPage, setCurrentPage] = useState(1)
	const [limit, setLimit] = useState(20)
	const [totalPages, setTotalPage] = useState(1)
	const didMount = useRef(false)
	const [activeElementIndex, setActiveElementIndex] = useState(0)
	const nextInputRef = useRef(null)

	// new
	const [newGoodsId, setNewGoodsId] = useState({})
	const [newDeliverId, setNewDeliverId] = useState({})
	const [newStoreId, setNewStoreId] = useState({})
	const [newBoxQ, setNewBoxQ] = useState()
	const [newPerBox, setNewPerBox] = useState(0)
	const [newProductQ, setNewProductQ] = useState()
	const [newProductCost, setNewProductCost] = useState()
	const [newProductPrice, setNewProductPrice] = useState()
	const [newPercentId, setNewPercentId] = useState({})
	const [newDate, setNewDate] = useState("")

	useEffect(() => {
		if (nextInputRef.current) {
			nextInputRef.current.focus()
		}
	}, [activeElementIndex])

	const getData1 = (name, dispatch1) => {
		get(`/${name}/${name}-list`).then((data) => {
			dispatch(dispatch1(data?.data))
		})
	}

	const getData = () => {
		dispatch(setLoading(true))
		if (
			searchStoreId ||
			searchDeliverId ||
			inputRef.current?.value.length > 0
		) {
			handleSearch()
		} else {
			get(`/products/products-list?limit=${limit}&page=${currentPage}`).then(
				(data) => {
					if (data?.status === 200 || data?.status === 201) {
						setTotalPage(Math.ceil(data?.data?.data[0]?.full_count / limit))
						dispatch(setDataProduct(data?.data?.data))
						dispatch(setQuantity(data?.data?.hisob?.kategoriya))
						dispatch(setAmount(data?.data?.hisob?.soni))
						dispatch(setSum(data?.data?.hisob?.umumiyQiymati))
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
		getData1("deliver", setDataDeliver)
		getData1("goods", setDataGood)
	}, [])

	const clearFilter = () => {
		setSearchStoreId("")
		setSearchDeliverId("")
		setSearchSubmitted(false)
		setFilteredData([])
		inputRef.current.value = ""
		getData()
	}

	const handleSearch = () => {
		dispatch(setLoading(true))
		setSearchSubmitted(true)
		const storeObj = searchStoreId && JSON.parse(searchStoreId)
		const deliverObj = searchDeliverId && JSON.parse(searchDeliverId)
		let filterObj = {
			store_id: storeObj?.store_id,
			deliver_id: deliverObj?.deliver_id,
			search: inputRef.current?.value,
		}
		post(
			`/products/products-filter?limit=${limit}&page=${currentPage}`,
			filterObj
		).then((data) => {
			if (data.status === 200) {
				setTotalPage(Math.ceil(data?.data?.data[0]?.full_count / limit))
				setFilteredData(data?.data)
				if (!data?.data?.data?.length) setCurrentPage(1)
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
	}, [searchStoreId, searchDeliverId, limit])

	const addNewProduct = () => {
		setSubmitted(true)
		if (
			newGoodsId.goods_id &&
			newDeliverId.deliver_id &&
			newStoreId.store_id &&
			newPercentId.currency_name &&
			newProductPrice > 0 &&
			newProductCost > 0 &&
			newPerBox > 0
		) {
			let newProductObj = {
				goods_id: newGoodsId?.goods_id,
				deliver_id: newDeliverId?.deliver_id,
				store_id: newStoreId?.store_id,
				products_count_cost: +newProductCost,
				products_box_count: newBoxQ ? +newBoxQ : 0,

				each_box_count: +newPerBox,
				out_of_box: +newProductQ,
				currency_id: newPercentId?.currency_id,
				products_count_price: +newProductPrice,
				products_count: +newProductQ,
			}
			if (objId) {
				if (newDate) {
					setBtnLoading(true)
					newProductObj.products_createdat = newDate
					patch(`/products/products-patch/${objId}`, newProductObj).then(
						(data) => {
							if (data?.status === 200 || data?.status === 201) {
								// dispatch(
								// 	editData({
								// 		...data?.data,
								// 		...newGoodsId,
								// 		...newDeliverId,
								// 		...newStoreId,
								// 		...currency?.data[0],
								// 	})
								// )
								clearAndClose()
								toast.success("Mahsulot muvoffaqiyatli o'zgartirildi")
							} else {
								toast.error("Nomalum server xatolik")
							}
							setBtnLoading(false)
						}
					)
				}
			} else {
				if (newProductQ > 0) {
					setBtnLoading(true)
					post("/products/products-post", newProductObj).then((data) => {
						if (data?.status === 201) {
							// dispatch(
							// 	addData({
							// 		...data?.data,
							// 		...newGoodsId,
							// 		...newDeliverId,
							// 		...newStoreId,
							// 		...currency?.data[0],
							// 	})
							// )
							clearAndClose()
							toast.success("Mahsulot muvoffaqiyatli qo'shildi")
						} else {
							toast.error("Nomalum server xatolik")
						}
						setBtnLoading(false)
					})
				}
			}
		}
	}

	const deleteProduct = (id) => {
		remove(`/products/products-delete/${id}`).then((data) => {
			if (data?.status === 200 || data?.status === 201) {
				dispatch(removeProduct(id))
				toast.success("Mahsulot muvoffaqiyatli o'chirildi")
				if (searchSubmitted) {
					setFilteredData((prevState) => ({
						...prevState,
						data: prevState.data.filter((item) => item.products_id !== id),
					}))
				}
			} else if (data?.response?.data?.error === "PRODUCT_NOT_FOUND") {
				toast.error("Bunday mahsulot topilmadi")
			} else if (data?.response?.data?.error === "DEBTS_EXIST") {
				toast.warn("Bu mahsulotda qarzdorlik mavjud")
			} else {
				toast.error("Nomalum server xatolik")
			}
		})
	}

	const clearAndClose = () => {
		setNewGoodsId({})
		setNewDeliverId({})
		setNewStoreId({})
		setNewBoxQ(0)
		setNewPerBox(0)
		setNewProductQ(0)
		// setNewPercentId({})
		setNewProductCost(0)
		setNewProductPrice(0)
		setNewDate("")
		setObjId("")
		setActiveElementIndex(0)

		setBtnLoading(false)
		setSubmitted(false)

		setAddModalVisible(false)
		setTimeout(() => {
			setAddModalDisplay("none")
		}, 300)
	}

	const getGoodsList = (id) => {
		if (id) {
			get(`/goods/deliver-goods-list/${id}`).then((data) => {
				setGoodList(data?.data)
			})
			setNewGoodsId({})
		}
	}

	const editProduct = (id) => {
		// setNewGoodName("")

		setshowDropdown("")
		setAddModalVisible(true)
		setAddModalDisplay("block")

		get(`/products/products-list/${id}`).then((data) => {
			if (data?.status === 200) {
				setObjId(id)

				getGoodsList(data?.data?.deliver_id?.deliver_id)
				setNewGoodsId(data?.data?.goods_id)
				setNewDeliverId(data?.data?.deliver_id)
				setNewStoreId(data?.data?.store_id)
				setNewBoxQ(data?.data?.products_box_count)
				setNewProductQ(data?.data?.products_count)
				setNewProductCost(data?.data?.products_count_cost)
				setNewPerBox(data?.data?.each_box_count)
				setNewProductPrice(data?.data?.products_count_price)
				setNewPercentId(data?.data?.currency_id)
				setNewDate(moment(data?.data?.products_createdat).format("YYYY-MM-DD"))
			} else {
				clearAndClose()
				toast.error("Nomalum server xatolik")
			}
		})
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

	const clearOnly = () => {
		setNewGoodsId({})
		setNewDeliverId({})
		setNewStoreId({})
		setNewBoxQ(0)
		setNewPerBox(0)
		setNewProductQ(0)
		// setNewPercentId({})
		const defaultCurrency = currency?.data.filter(
			(item) => item?.currency_name === "So'm"
		)[0]
		setNewPercentId(defaultCurrency)
		setNewProductCost(0)
		setNewProductPrice(0)
		setBtnLoading(false)
		setObjId("")
		setNewDate("")
		setActiveElementIndex(1)

		setSubmitted(false)
	}

	function filterOptionStore(inputValue, option) {
		const data = JSON.parse(option.props.value)?.store_name
		return data.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
	}

	function filterOptionDeliver(inputValue, option) {
		const data = JSON.parse(option.props.value)?.deliver_name
		return data.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
	}

	function filterOption(inputValue, option) {
		const goodsData = JSON.parse(option.props.value)
		console.log(goodsData)
		const goodsNameFirst = goodsData?.goods_name + " " + goodsData?.goods_code
		const goodsCodeFirst = goodsData?.goods_code + " " + goodsData?.goods_name
		const inputValueLowerCase = inputValue.toLowerCase()

		const inputWords = inputValueLowerCase.split(" ")

		const allWordsMatch = inputWords.every(
			(word) =>
				goodsNameFirst.toLowerCase().includes(word) ||
				goodsCodeFirst.toLowerCase().includes(word)
		)

		return allWordsMatch
	}

	const addOnTop = (id) => {
		clearOnly()
		setshowDropdown("")
		setAddModalVisible(true)
		setAddModalDisplay("block")

		get(`/products/products-list/${id}`).then((data) => {
			if (data?.status === 200) {
				setNewGoodsId(data?.data?.goods_id)
				setNewDeliverId(data?.data?.deliver_id)
				setNewStoreId(data?.data?.store_id)
				setNewBoxQ(0)
				setNewProductQ(0)
				setNewProductCost(data?.data?.products_count_cost)
				setNewPerBox(data?.data?.each_box_count)
				setNewProductPrice(data?.data?.products_count_price)
				setNewPercentId(data?.data?.currency_id)
				setNewDate(moment(data?.data?.products_createdat).format("YYYY-MM-DD"))
			} else {
				clearAndClose()
				toast.error("Nomalum server xatolik")
			}
		})
	}

	return (
		<>
			<AddModal name={objId ? "Mahsulot tahrirlash" : "Mahsulot qo'shish"}>
				<div
					className={`input-wrapper modal-form ${
						submitted &&
						stringCheck(newDeliverId?.deliver_name) !== null &&
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
							submitted && stringCheck(newDeliverId?.deliver_name) !== null ? (
								<Info size={20} />
							) : (
								<CaretDown size={16} />
							)
						}
						value={
							newDeliverId.deliver_name
								? `${newDeliverId?.deliver_name} - ${format_phone_number(
										newDeliverId?.deliver_nomer
								  )}`
								: null
						}
						onChange={(e) => {
							e ? setNewDeliverId(JSON.parse(e)) : setNewDeliverId({})
							getGoodsList(e ? JSON.parse(e)?.deliver_id : null)
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
									newDeliverId?.deliver_nomer,
									"Ta'minotchi tanlash majburiy"
								)}
						</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form ${
						submitted && stringCheck(newGoodsId?.goods_name) !== null && "error"
					} ${darkMode ? "dark" : null}`}
				>
					<label>Kategoriya</label>
					<Select
						showSearch
						allowClear
						placeholder="Kategoriya tanlang"
						className="select"
						suffixIcon={
							submitted && stringCheck(newGoodsId?.goods_name) !== null ? (
								<Info size={20} />
							) : (
								<CaretDown size={16} />
							)
						}
						value={
							newGoodsId.goods_name
								? `${newGoodsId?.goods_name} - ${newGoodsId?.goods_code}`
								: null
						}
						onChange={(e) => {
							e ? setNewGoodsId(JSON.parse(e)) : setNewGoodsId({})
							setActiveElementIndex(3)
						}}
						ref={activeElementIndex === 2 ? nextInputRef : null}
						filterOption={filterOption}
					>
						{goodList?.length
							? goodList.map((item, idx) => {
									return (
										<Select.Option
											key={idx}
											className={`option-shrink ${darkMode ? "dark" : null}`}
											value={JSON.stringify(item)}
										>
											<div>
												<span>{item?.goods_name} - </span>
												<span>{item?.goods_code}</span>
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
									newGoodsId?.goods_name,
									"Kategoriya tanlash majburiy"
								)}
						</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form ${
						submitted && stringCheck(newGoodsId?.goods_name) !== null && "error"
					} ${darkMode ? "dark" : null}`}
				>
					<label>Pul birligi</label>
					<Select
						showSearch
						allowClear
						placeholder="Pul birligi tanlang"
						className="select"
						suffixIcon={
							submitted && stringCheck(newPercentId?.currency_name) !== null ? (
								<Info size={20} />
							) : (
								<CaretDown size={16} />
							)
						}
						value={
							newPercentId?.currency_name
								? `${newPercentId?.currency_name} - ${newPercentId?.currency_amount} so'm`
								: null
						}
						onChange={(e) => {
							e ? setNewPercentId(JSON.parse(e)) : setNewPercentId({})
							setActiveElementIndex(3)
						}}
						// ref={activeElementIndex === 3 ? nextInputRef : null}
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
									newPercentId?.currency_name,
									"Valyuta tanlash majburiy"
								)}
						</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form ${
						submitted && stringCheck(newStoreId?.store_name) !== null && "error"
					} ${darkMode ? "dark" : null}`}
				>
					<label>Ombor</label>
					<Select
						showSearch
						allowClear
						placeholder="Ombor tanlang"
						className="select"
						suffixIcon={
							submitted && stringCheck(newStoreId?.store_name) !== null ? (
								<Info size={20} />
							) : (
								<CaretDown size={16} />
							)
						}
						value={newStoreId?.store_name ? newStoreId?.store_name : null}
						onChange={(e) => {
							e ? setNewStoreId(JSON.parse(e)) : setNewStoreId({})
							setActiveElementIndex(4)
						}}
						ref={activeElementIndex === 3 ? nextInputRef : null}
					>
						{store?.data.length
							? store?.data.map((item, idx) => {
									return (
										<Select.Option
											key={idx}
											value={JSON.stringify(item)}
											className={` ${darkMode ? "dark" : null}`}
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
								stringCheck(newStoreId?.store_name, "Ombor tanlash majburiy")}
						</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form regular ${
						darkMode ? "dark" : null
					}`}
				>
					<label>Quti</label>
					<input
						type="text"
						placeholder="Qiymat kiriting"
						className="input"
						value={newBoxQ ? newBoxQ : ""}
						onChange={(e) => {
							setNewBoxQ(e.target.value.replace(/[^0-9]/g, ""))
							setNewProductQ(newPerBox * e.target.value)
						}}
						ref={activeElementIndex === 4 ? nextInputRef : null}
					/>
					{/* {submitted && numberCheckAllow0(newBoxQ) !== null && (
						<Info size={20} />
					)}
					<div className="validation-field">
						<span>{submitted && numberCheckAllow0(newBoxQ)}</span>
					</div> */}
				</div>
				<div
					className={`input-wrapper modal-form regular ${
						submitted && numberCheck(newPerBox) !== null && "error"
					} ${darkMode ? "dark" : null}`}
				>
					<label>Har bir qutida</label>
					<input
						type="text"
						placeholder="Qiymat kiriting"
						className="input"
						value={newPerBox ? newPerBox : ""}
						onChange={(e) => {
							setNewPerBox(e.target.value.replace(/[^0-9]/g, ""))
							setNewProductQ(newBoxQ * e.target.value)
						}}
					/>
					{submitted && numberCheck(newPerBox) !== null && <Info size={20} />}
					<div className="validation-field">
						<span>{submitted && numberCheck(newPerBox)}</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form regular ${
						!objId && submitted && numberCheck(newProductQ) !== null && "error"
					} ${darkMode ? "dark" : null}`}
				>
					<label>Jami</label>
					<input
						type="text"
						placeholder="Qiymat kiriting"
						className="input"
						value={newProductQ ? newProductQ : ""}
						onChange={(e) =>
							setNewProductQ(e.target.value.replace(/[^0-9]/g, ""))
						}
					/>
					{!objId && submitted && numberCheck(newProductQ) !== null && (
						<Info size={20} />
					)}
					<div className="validation-field">
						<span>{!objId && submitted && numberCheck(newProductQ)}</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form regular ${
						submitted && numberCheck(newProductCost) !== null && "error"
					} ${darkMode ? "dark" : null}`}
				>
					<label>Narx</label>
					<input
						type="text"
						placeholder="Qiymat kiriting"
						className="input"
						value={newProductCost ? newProductCost : ""}
						onChange={(e) => {
							setNewProductCost(e.target.value.replace(/[^0-9.]/g, ""))
							setNewProductPrice(
								parseFloat(e.target.value) + parseFloat(e.target.value) * 0.1
							)
						}}
					/>
					{submitted && numberCheck(newProductCost) !== null && (
						<Info size={20} />
					)}
					<div className="validation-field">
						<span>{submitted && numberCheck(newProductCost)}</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form regular ${
						submitted && numberCheck(newProductPrice) !== null && "error"
					} ${darkMode ? "dark" : null}`}
				>
					<label>Sotuv narx</label>
					<input
						type="text"
						placeholder="Qiymat kiriting"
						className="input"
						value={newProductPrice ? newProductPrice : ""}
						onChange={(e) =>
							setNewProductPrice(e.target.value.replace(/[^0-9.]/g, ""))
						}
					/>
					{submitted && numberCheck(newProductPrice) !== null && (
						<Info size={20} />
					)}
					<div className="validation-field">
						<span>{submitted && numberCheck(newProductPrice)}</span>
					</div>
				</div>
				{objId ? (
					<div
						className={`input-wrapper modal-form regular ${
							submitted && stringCheck(newDate) !== null && "error"
						} ${darkMode ? "dark" : null}`}
					>
						<label>Qabul qilingan sana</label>
						<input
							type="date"
							placeholder="Sana kiriting"
							className="input date"
							value={newDate ? newDate : ""}
							onChange={(e) => setNewDate(e.target.value)}
						/>
						{/* {submitted && stringCheck(newDate) !== null && <Info size={20} />} */}
						<div className="validation-field">
							<span>{submitted && stringCheck(newDate)}</span>
						</div>
					</div>
				) : null}
				<div className="modal-btn-group">
					<button
						className={`primary-btn ${darkMode ? "dark" : null}`}
						disabled={btnLoading}
						onClick={addNewProduct}
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

			<div className={`filter-wrapper product ${darkMode ? "dark" : null}`}>
				<div className={`input-wrapper ${darkMode ? "dark" : null}`}>
					<Select
						showSearch
						allowClear
						placeholder="Ombor"
						className="select"
						value={searchStoreId ? searchStoreId : null}
						onChange={(e) => setSearchStoreId(e)}
						filterOption={filterOptionStore}
					>
						{store?.data.length
							? store?.data.map((item, idx) => (
									<Select.Option
										key={idx}
										value={JSON.stringify(item)}
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
						placeholder="Ta'minotchi"
						className="select"
						value={searchDeliverId ? searchDeliverId : null}
						onChange={(e) => setSearchDeliverId(e)}
						filterOption={filterOptionDeliver}
					>
						{deliver.data?.length
							? deliver.data.map((item, idx) => {
									if (!item?.isdelete)
										return (
											<Select.Option
												key={idx}
												value={JSON.stringify(item)}
												className={` ${darkMode ? "dark" : null}`}
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
				<div className="filter-btn-group">
					<button type="button" className="filter-btn" onClick={clearFilter}>
						Tozalash
					</button>
				</div>
			</div>

			{userInfo?.role === 1 ? (
				<div className="info-wrapper">
					<InfoItem
						value={
							searchSubmitted
								? addSpace(filteredData?.hisob?.kategoriya)
								: addSpace(product?.quantity)
						}
						name="Kategoriyalar soni"
						icon={<SquaresFour size={24} color="var(--color-primary)" />}
						iconBgColor={`${darkMode ? "var(--d-bg-icon)" : "var(--bg-icon)"}`}
						darkMode={darkMode}
					/>
					<InfoItem
						value={
							searchSubmitted
								? addSpace(filteredData?.hisob?.soni)
								: addSpace(product?.amount)
						}
						name="Mahsulotlar soni"
						icon={<Package size={24} color="var(--color-primary)" />}
						iconBgColor={`${darkMode ? "var(--d-bg-icon)" : "var(--bg-icon)"}`}
						darkMode={darkMode}
					/>
					<InfoItem
						value={
							addSpace(
								roundToNearestThousand(
									searchSubmitted
										? +filteredData?.hisob?.umumiyQiymati
										: product?.sum
								)
							) + " so'm"
						}
						name="Umumiy summa"
						icon={<CurrencyDollar size={24} color="var(--color-primary)" />}
						iconBgColor={`${darkMode ? "var(--d-bg-icon)" : "var(--bg-icon)"}`}
						darkMode={darkMode}
					/>
				</div>
			) : null}

			<Search
				handleSearch={handleSearch}
				clearSearch={() => (inputRef.current.value = "")}
				showAddBtn={userInfo?.role === 1}
				className={"table-m"}
				clearOnly={clearOnly}
				darkMode={darkMode}
			/>

			{product?.loading ? (
				<Loader />
			) : (
				<>
					<AntTable
						data={searchSubmitted ? filteredData?.data : product?.dataProduct}
						deleteItem={deleteProduct}
						sidebar={sidebar}
						userRole={userInfo?.role}
						showDropdown={showDropdown}
						setshowDropdown={setshowDropdown}
						editProduct={editProduct}
						setAddModalVisible={setAddModalVisible}
						setAddModalDisplay={setAddModalDisplay}
						addOnTop={addOnTop}
						darkMode={darkMode}
						currentPage={currentPage}
						limit={limit}
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
