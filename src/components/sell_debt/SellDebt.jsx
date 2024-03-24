import {
	setAmount,
	setDataProduct,
	setQuantity,
	setSum,
} from "../reducers/product"
import { addDebt as addDebtToClient } from "../reducers/client"
import "./sell debt.css"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { downloadFile, get, patch, post } from "../../customHook/api"
import { setData as setDataClient } from "../reducers/client"
import { setData as setDataCurrency } from "../reducers/currency"
import { setData as setDataDeliver } from "../reducers/deliver"
import { setData } from "../reducers/store"
import { CaretDown, Info, X, XCircle } from "@phosphor-icons/react"
import { dateCompare, numberCheck, stringCheck } from "../validation"
import { Select, Spin } from "antd"
import format_phone_number from "../format_phone_number/format_phone_number"
import {
	addComma,
	roundToNearestHundred,
	roundToNearestThousand,
} from "../addComma"
import { EmptyList } from "../noData/NoData"
import { toast } from "react-toastify"
import {
	setCapital,
	setData as setDataReport,
	setIncome,
	setOutcome,
} from "../reducers/report"
import moment from "moment"
import { confirmDownloadModal } from "../confirm_download_modal/confirmDownloadModal"
import { addData } from "../reducers/debt"
import {
	confirmApproveModal,
	confirmCloseModal,
} from "../confirm/confirm_modal"

const SellDebt = ({
	SDModalVisible,
	setSDModalVisible,
	SDModalDisplay,
	setSDModalDisplay,
}) => {
	const { store, client, deliver } = useSelector((state) => state)
	const dispatch = useDispatch()

	const [isDebtVisible, setIsDebtVisible] = useState(false)

	const [btnLoading, setBtnLoading] = useState(false)
	const [submitted, setSubmitted] = useState(false)
	const [productList, setProductList] = useState([])
	const [products, setProducts] = useState([])
	const [productsCache, setProductsCache] = useState([])
	const [totalPriceSellList, setTotalPriceSellList] = useState(0)
	const [productListLoading, setProductListLoading] = useState(false)

	const [btnLoadingD, setBtnLoadingD] = useState(false)
	const [submittedD, setSubmittedD] = useState(false)
	const [productListD, setProductListD] = useState([])
	const [productsD, setProductsD] = useState([])
	const [productsCacheD, setProductsCacheD] = useState([])

	// new sell
	const [storeObj, setStoreObj] = useState({})
	const [deliverObj, setDeliverObj] = useState({})
	const [productObj, setProductObj] = useState({})
	const [clientObj, setClientObj] = useState({})
	const [productQ, setProductQ] = useState(0)
	const [productP, setProductP] = useState(0)

	// new debt
	const [productObjD, setProductObjD] = useState({})
	const [clientObjD, setClientObjD] = useState({})
	const [productQD, setProductQD] = useState(0)
	const [productPD, setProductPD] = useState(0)
	const [givenDate, setGivenDate] = useState("")
	const [paidDate, setPaidDate] = useState("")

	const getData = (name, dispatch1) => {
		get(`/${name}/${name}-list`).then((data) => {
			if (data?.status === 200 || data?.status === 201) {
				dispatch(dispatch1(data?.data))
			}
		})
	}

	useEffect(() => {
		getData("clients", setDataClient)
		getData("store", setData)
		getData("currency", setDataCurrency)
		getData("deliver", setDataDeliver)

		let storage = localStorage.getItem("sellInfo")
		let oldSellInfo
		if (storage) {
			oldSellInfo = JSON.parse(storage)
			setStoreObj(oldSellInfo?.store)
			setClientObj(oldSellInfo?.client)
			setProductList(oldSellInfo?.productList)

			const sumOfOldList = oldSellInfo?.productList?.reduce(
				(totalPrice, product) => totalPrice + product?.price,
				0
			)
			setTotalPriceSellList(sumOfOldList)
		}
	}, [])

	useEffect(() => {
		localStorage.setItem(
			"sellInfo",
			JSON.stringify({
				store: storeObj,
				client: clientObj,
				productList,
			})
		)
	}, [productList])

	const handleStoreChange = (id) => {
		setProductObj({})
		setProductQ(0)

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

	const handleDeliverChange = (e) => {
		setProductObj({})
		setProductQ(0)

		if (e) {
			const obj = JSON.parse(e)
			setDeliverObj(obj)

			get(`products/products-by-deliverId/${obj?.deliver_id}`).then((data) => {
				if (data?.status === 200) {
					setProducts(data?.data)
				} else {
					setProducts([])
				}
			})
		} else {
			setDeliverObj({})
			setProducts([])
			handleStoreChange(JSON.stringify(storeObj))
		}
	}

	const handelAddToListDebt = () => {
		setSubmittedD(true)
		if (
			productObjD.products_count_price &&
			clientObjD.clients_name &&
			productQD > 0 &&
			productPD > 0 &&
			givenDate &&
			paidDate &&
			new Date(givenDate) <= new Date(paidDate)
		) {
			let newObj = {
				client: clientObjD,
				product: productObjD,
				quantity: productQD,
				price: productPD,
				date: givenDate,
				dueDate: paidDate,
			}
			setProductListD([newObj, ...productListD])
			const index = productsD.findIndex(
				(item) => item?.products_id === productObjD?.products_id
			)
			if (index !== -1)
				setProductsCacheD([...productsCacheD, ...productsD.splice(index, 1)])
			clearD()
		}
	}

	const handelAddToList = () => {
		setSubmitted(true)
		if (
			storeObj.store_id &&
			clientObj.clients_name &&
			productObj.products_count_price &&
			productQ > 0 &&
			productP > 0
		) {
			let newObj = {
				product_id: productObj?.products_id,
				product_name: productObj?.goods_id?.goods_name,
				count: +productQ,
				store_id: storeObj,
				price: productP,
				client: clientObj,
				cost:
					productObj?.products_count_cost *
					productObj?.currency_id?.currency_amount,
				currency_amount: productObj?.currency_id?.currency_amount,
				code: productObj?.goods_id?.goods_code,
			}
			setProductList([newObj, ...productList])

			setTotalPriceSellList((prev) => prev + productP * productQ)

			clear()
		}
	}

	const clearAndClose = () => {
		setStoreObj({})
		setDeliverObj({})
		setProductObj({})
		setClientObj({})
		setProductQ(0)
		setProductP(0)

		setProductList([])
		// setProductsCache([])
		setProducts([])

		setProductObjD({})
		setClientObjD({})
		setProductQD(0)
		setProductPD(0)
		setGivenDate("")
		setPaidDate("")

		setProductListD([])
		setProductsCacheD([])
		setProductsD([])

		setTotalPriceSellList(0)
		// localStorage.setItem("productList", JSON.stringify([]))
		setSubmittedD(false)
		setBtnLoading(false)
		setBtnLoadingD(false)
		setSDModalVisible(false)
		setTimeout(() => {
			setSDModalDisplay("none")
		}, 300)
	}

	const clear = () => {
		setProductObj({})
		setProductQ(0)
		setProductP(0)

		setSubmitted(false)
	}

	const clearD = () => {
		setProductObjD({})
		setProductQD(0)
		setProductPD(0)
		setGivenDate("")
		setPaidDate("")
		setProductsCacheD([])

		setSubmittedD(false)
	}

	const removeItemFromList = (id) => {
		// remove from the list
		let arr = productList.filter((item) => item?.product_id !== id)
		setProductList(arr)

		// remove from cache and add back to products
		// const newObj = productsCache.filter((item) => item.products_id === id)[0]
		// setProducts([newObj, ...products])

		const removedItem = productList.findIndex((item) => item.product_id === id)
		if (removedItem !== -1) {
			setTotalPriceSellList(
				(prev) =>
					prev -
					productList[removedItem]?.count * productList[removedItem]?.price
			)
		}
	}

	const removeItemFromListD = (id) => {
		// remove from the list
		let arr = productListD.filter((item) => item?.product.products_id !== id)
		setProductListD(arr)

		// remove from cache and add back to products
		const newObj = productsCacheD.filter((item) => item.products_id === id)[0]
		setProductsD([newObj, ...productsD])
	}

	const postP = () => {
		if (productList.length) {
			setBtnLoading(true)
			let newArr = productList.map((item) => {
				return {
					product_id: item?.product_id,
					count: item?.count,
					client: item?.client.clients_name,
					client_nomer: item?.client.clients_nomer,
					client_id: item?.client.clients_id,
					cost: (item?.cost / item?.currency_amount).toFixed(2),
					price: (item?.price / item?.currency_amount).toFixed(2),
					code: item?.code,
					store_id: item?.store_id.store_id,
					currency_amount: item?.currency_amount,
				}
			})
			patch("/products/products-sale", { products: newArr }).then((data) => {
				if (data?.status === 200 || data?.status === 201) {
					get("/products/products-list").then((dataP) => {
						if (dataP?.status === 200) {
							dispatch(setDataProduct(dataP?.data?.data))
							dispatch(setQuantity(dataP?.data?.hisob?.kategoriya))
							dispatch(setAmount(dataP?.data?.hisob?.soni))
							dispatch(setSum(dataP?.data?.hisob?.umumiyQiymati))
						}
					})
					get("/reports/reports-list").then((dataR) => {
						if (dataR?.status === 200) {
							dispatch(setDataReport(dataR?.data?.data))
							dispatch(setCapital(dataR?.data?.hisob?.totalProductCost))
							dispatch(setIncome(dataR?.data?.hisob?.totalCostPilus))
							dispatch(setOutcome(dataR?.data?.hisob?.totalCostMinus))
						}
					})
					clearAndClose()
					toast.success("Mahsulot muvoffaqiyatli sotildi")

					confirmDownloadModal(downloadFile, data?.data?.report_id)
				} else if (data?.response?.data?.message === "Mahsulot kam") {
					let productNames = ""
					data?.response?.data?.data.forEach((item, idx) => {
						productNames += item?.name
						if (idx + 1 < data?.response?.data?.data.length)
							productNames += ", "
					})
					toast.error(`${productNames} mahsuloti kam`, { autoClose: false })

					// highlight not enough products
					addKey(productList, data?.response?.data?.data)
				} else {
					toast.error("Nomalum server xatolik")
				}
				setBtnLoading(false)
			})
		}
	}

	const postD = () => {
		if (productListD.length) {
			setBtnLoadingD(true)
			let newArr = productListD.map((item) => {
				return {
					clients_nomer: item?.client.clients_nomer,
					clients_name: item?.client.clients_name,
					goods_code: item?.product.goods_id.goods_code,
					goods_name: item?.product.goods_id.goods_name,

					client_id: item?.client.clients_id,
					product_id: item?.product.products_id,
					debts_cost: item?.product.products_count_cost,
					debts_count: item?.quantity,
					debts_currency: item?.product.currency_id.currency_symbol,
					debts_currency_amount: item?.product.currency_id.currency_amount,
					debts_price: item?.price / item?.product.currency_id.currency_amount,
					debts_due_date: new Date(item?.dueDate).toISOString(),
					debts_selected_date: new Date(item?.date).toISOString(),
				}
			})

			post("/debts/debts-post", { debts: newArr }).then((data) => {
				if (data?.status === 200 || data?.status === 201) {
					get("/products/products-list").then((dataP) => {
						if (dataP?.status === 200) {
							dispatch(setDataProduct(dataP?.data?.data))
							dispatch(setQuantity(dataP?.data?.hisob?.kategoriya))
							dispatch(setAmount(dataP?.data?.hisob?.soni))
							dispatch(setSum(dataP?.data?.hisob?.umumiyQiymati))
						}
					})
					get("/reports/reports-list").then((dataR) => {
						if (dataR?.status === 200) {
							dispatch(setDataReport(dataR?.data?.data))
							dispatch(setCapital(dataR?.data?.hisob?.totalProductCost))
							dispatch(setIncome(dataR?.data?.hisob?.totalCostPilus))
							dispatch(setOutcome(dataR?.data?.hisob?.totalCostMinus))
						}
					})
					const updatedData = newArr.map((obj, index) => ({
						...obj,
						debts_id: data?.data[index].debts_id,
						debts_total_price: data?.data[index].debts_total_price,
					}))
					dispatch(addData(updatedData))
					dispatch(addDebtToClient(updatedData))
					clearAndClose()
					toast.success("Mahsulot muvoffaqiyatli sotildi")
				} else {
					toast.error("Nomalum server xatolik")
				}
				setBtnLoadingD(false)
			})
		}
	}

	const addKey = (arr1, arr2) => {
		arr1.forEach((obj1) => {
			const match = arr2.find((obj2) => obj1.product_id === obj2.id)
			if (match) {
				obj1.highlight = true
			}
		})
	}


	return (
		<div className="sell-modal-wrapper" style={{ display: SDModalDisplay }}>
			<div
				className={`modal-list ${SDModalVisible ? "bounce-in" : "bounce-out"}`}
				onClick={(e) => e.stopPropagation()}
			>
				{isDebtVisible ? (
					<>
						<div className="modal-list-head debt">
							<h5>Mijoz</h5>
							<h5>Mahsulot</h5>
							<h5>Miqdor</h5>
							<h5>Narx</h5>
							<h5>Umumiy narx</h5>
							<h5>Sana</h5>
						</div>
						<div className="modal-list-body">
							{productListD.length ? (
								productListD.map((item, idx) => {
									return (
										<div className="modal-list-item debt" key={idx}>
											<h6>{item?.client.clients_name}</h6>
											<h6>
												{item.product.goods_id.goods_name} -{" "}
												{item.product.goods_id.goods_code}
											</h6>
											<h6>{item.quantity}</h6>
											<h6>{addComma(item.price)}</h6>
											<h6>{addComma(item.quantity * item.price)} so'm</h6>
											<h6>
												{moment(item?.date).format("MM/DD")} -{" "}
												{moment(item?.dueDate).format("MM/DD")}
											</h6>
											<button
												type="button"
												onClick={() =>
													removeItemFromListD(item.product.products_id)
												}
											>
												<XCircle size={24} />
											</button>
										</div>
									)
								})
							) : (
								<EmptyList />
							)}
						</div>
						<button
							type="button"
							className="primary-btn sell"
							disabled={btnLoadingD}
							onClick={postD}
						>
							Sotish
							{btnLoadingD && (
								<span
									className="spinner-grow spinner-grow-sm"
									role="status"
									aria-hidden="true"
									style={{ marginLeft: "5px" }}
								></span>
							)}
						</button>
					</>
				) : (
					<>
						<div className="modal-list-head">
							<h5>Mijoz</h5>
							<h5>Mahsulot</h5>
							<h5>Miqdor ({productList?.length})</h5>
							<h5>Narx</h5>
							<h5>Umumiy narx</h5>
							<h5>{addComma(totalPriceSellList)}</h5>
						</div>
						<div className="modal-list-body">
							{productList.length ? (
								productList.map((item, idx) => {
									return (
										<div
											className={`modal-list-item ${
												item?.highlight ? "highlight" : null
											}`}
											key={idx}
										>
											<h6>
												{idx + 1} {item?.client.clients_name}
											</h6>
											<h6>
												{item.product_name} - {item.code}
											</h6>
											<h6>{item.count}</h6>
											<h6>{addComma(item.price)}</h6>
											<h6>{addComma(item.count * item.price)} so'm</h6>
											<button
												type="button"
												onClick={() => removeItemFromList(item.product_id)}
											>
												<XCircle size={24} />
											</button>
										</div>
									)
								})
							) : (
								<EmptyList />
							)}
						</div>
						<button
							type="button"
							className="primary-btn sell"
							disabled={btnLoading}
							onClick={(e) =>
								confirmApproveModal("Savdoni tasdiqlaysizmi?", postP)
							}
						>
							Sotish
							{btnLoading && (
								<span
									className="spinner-grow spinner-grow-sm"
									role="status"
									aria-hidden="true"
									style={{ marginLeft: "5px" }}
								></span>
							)}
						</button>
					</>
				)}
			</div>

			<div
				className={`sell-modal ${
					SDModalVisible ? "fade-in-sd" : "fade-out-sd"
				}`}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="sell-modal-top">
					<button
						onClick={() => {
							setSDModalVisible(false)
							setTimeout(() => {
								setSDModalDisplay("none")
							}, 300)
						}}
					>
						<X size={20} />
					</button>
					<div>
						<h4
							className={isDebtVisible ? null : "active"}
							onClick={() => setIsDebtVisible(false)}
						>
							Sotish
						</h4>
						<h4
							className={isDebtVisible ? "active" : null}
							onClick={() => setIsDebtVisible(true)}
						>
							Qarz qo'shish
						</h4>
					</div>
				</div>
				<div className="sell-modal-bottom">
					{isDebtVisible ? (
						<>
							<div
								className={`input-wrapper modal-form ${
									submittedD &&
									stringCheck(clientObjD?.clients_name) !== null &&
									"error"
								}`}
							>
								<label>Mijoz</label>
								<Select
									showSearch
									allowClear
									placeholder="Mijoz tanlang"
									className="select"
									disabled={productListD?.length}
									suffixIcon={
										submittedD &&
										stringCheck(clientObjD?.clients_name) !== null ? (
											<Info size={20} />
										) : (
											<CaretDown size={16} />
										)
									}
									value={
										clientObjD?.clients_name
											? `${clientObjD.clients_name} - ${format_phone_number(
													clientObjD.clients_nomer
											  )}`
											: null
									}
									onChange={(e) =>
										e ? setClientObjD(JSON.parse(e)) : setClientObjD({})
									}
								>
									{client?.data.length
										? client?.data.map((item, idx) => {
												if (!item?.isdelete) {
													return (
														<Select.Option
															key={idx}
															className="option-shrink"
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
										{submittedD &&
											stringCheck(
												clientObjD?.clients_name,
												"Mijoz tanlash majburiy"
											)}
									</span>
								</div>
							</div>
							<div
								className={`input-wrapper modal-form ${
									submittedD &&
									stringCheck(productObjD?.goods_id?.goods_name) !== null &&
									"error"
								}`}
							>
								<label>Mahsulot</label>
								<Select
									showSearch
									allowClear
									placeholder="Mahsulot tanlang"
									className="select"
									suffixIcon={
										submittedD &&
										stringCheck(productObjD?.goods_id?.goods_name) !== null ? (
											<Info size={20} />
										) : (
											<CaretDown size={16} />
										)
									}
									value={
										productObjD?.goods_id?.goods_name
											? `${productObjD.goods_id.goods_name} - ${productObjD.goods_id.goods_code} - ${productObjD.deliver_id.deliver_name}`
											: null
									}
									onChange={(e) => {
										setProductQD(0)

										if (e) {
											setProductObjD(JSON.parse(e))
											setProductPD(
												JSON.parse(e).products_count_price *
													JSON.parse(e).currency_id.currency_amount
											)
										} else setProductObjD({})
									}}
								>
									{productsD?.length
										? productsD.map((item, idx) => {
												return (
													<Select.Option
														key={idx}
														value={JSON.stringify(item)}
														className="option-shrink"
													>
														<div>
															<span>{item?.goods_id?.goods_name} - </span>
															<span>
																{item?.goods_id?.goods_code} -{" "}
																{item?.deliver_id?.deliver_name}
															</span>
														</div>
													</Select.Option>
												)
										  })
										: null}
								</Select>
								<div className="validation-field">
									<span>
										{submittedD &&
											stringCheck(
												productObjD?.goods_id?.goods_name,
												"Mahsulot tanlash majburiy"
											)}
									</span>
								</div>
							</div>
							<div
								className={`input-wrapper modal-form regular ${
									submittedD && numberCheck(productQD) !== null && "error"
								}`}
							>
								<label>
									Miqdor (
									{productObjD.products_count ? productObjD.products_count : 0})
								</label>
								<input
									type="text"
									placeholder="Qiymat kiriting"
									className="input"
									value={productQD ? productQD : ""}
									onKeyPress={(e) => {
										if (isNaN(e.key)) {
											e.preventDefault()
										}
									}}
									onChange={(e) => {
										let maxValue = productObjD.products_count
											? productObjD.products_count
											: 0
										if (+e.target.value > +maxValue) {
											setProductQD(maxValue)
										} else {
											setProductQD(e.target.value)
										}
									}}
								/>
								{submittedD && numberCheck(productQD) !== null && (
									<Info size={20} />
								)}
								<div className="validation-field">
									<span>{submittedD && numberCheck(productQD)}</span>
								</div>
							</div>
							<div
								className={`input-wrapper modal-form regular ${
									submittedD && numberCheck(productPD) !== null && "error"
								}`}
							>
								<label>
									Narx (
									{productObjD.products_count_price
										? addComma(
												productObjD.products_count_price *
													productObjD.currency_id.currency_amount
										  )
										: 0}{" "}
									so'm )
								</label>
								<input
									type="text"
									placeholder="Qiymat kiriting"
									className="input"
									value={productPD ? productPD : ""}
									onKeyPress={(e) => {
										if (isNaN(e.key)) {
											e.preventDefault()
										}
									}}
									onChange={(e) => setProductPD(e.target.value)}
								/>
								{submittedD && numberCheck(productPD) !== null && (
									<Info size={20} />
								)}
								<div className="validation-field">
									<span>{submittedD && numberCheck(productPD)}</span>
								</div>
							</div>
							<div
								className={`input-wrapper modal-form regular ${
									submittedD && stringCheck(givenDate) !== null && "error"
								}`}
							>
								<label>Berilgan sana</label>
								<input
									type="date"
									placeholder="Sana kiriting"
									className="input date"
									value={givenDate ? givenDate : ""}
									onChange={(e) => setGivenDate(e.target.value)}
								/>
								<div className="validation-field">
									<span>
										{submittedD &&
											stringCheck(givenDate, "Sana kiritish majburiy")}
									</span>
								</div>
							</div>
							<div
								className={`input-wrapper modal-form regular ${
									(submittedD && stringCheck(paidDate) !== null && "error") ||
									(dateCompare(givenDate, paidDate) !== null && "error")
								}`}
							>
								<label>To'lanadigan sana</label>
								<input
									type="date"
									placeholder="Sana kiriting"
									className="input date"
									value={paidDate ? paidDate : ""}
									onChange={(e) => setPaidDate(e.target.value)}
								/>
								<div className="validation-field">
									<span>
										{(submittedD &&
											stringCheck(paidDate, "Sana kiritish majburiy")) ||
											dateCompare(givenDate, paidDate)}
									</span>
								</div>
							</div>
							<div className="input-wrapper modal-form regular">
								<label>Umumiy narx: </label>
								<span>{addComma(productQD * productPD)} so'm</span>
							</div>
							<div className="modal-btn-group">
								<button className="primary-btn" onClick={handelAddToListDebt}>
									Qo'shish
								</button>
								<button className="secondary-btn" onClick={clearAndClose}>
									Bekor qilish
								</button>
							</div>
						</>
					) : (
						<>
							<div
								className={`input-wrapper modal-form ${
									submitted &&
									stringCheck(storeObj?.store_name) !== null &&
									"error"
								}`}
							>
								<label>Ombor</label>
								<Select
									showSearch
									allowClear
									placeholder="Ombor tanlang"
									className="select"
									disabled={productList?.length}
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
									{store?.data.length
										? store?.data.map((item, idx) => {
												return (
													<Select.Option key={idx} value={JSON.stringify(item)}>
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
											stringCheck(
												storeObj?.store_name,
												"Ombor tanlash majburiy"
											)}
									</span>
								</div>
							</div>
							<div
								className={`input-wrapper modal-form ${
									submitted &&
									stringCheck(clientObj?.clients_name) !== null &&
									"error"
								}`}
							>
								<label>Mijoz</label>
								<Select
									showSearch
									allowClear
									placeholder="Mijoz tanlang"
									className="select"
									disabled={productList?.length}
									suffixIcon={
										submitted &&
										stringCheck(clientObj?.clients_name) !== null ? (
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
									onChange={(e) =>
										e ? setClientObj(JSON.parse(e)) : setClientObj({})
									}
								>
									{/* <Select.Option
										value={JSON.stringify({
											clients_name: "Yangi mijoz",
											clients_nomer: "000000000000",
											clients_id: "",
										})}
									>
										Yangi mijoz - (00) 000 00 00
									</Select.Option> */}
									{client?.data.length
										? client?.data.map((item, idx) => {
												if (!item?.isdelete) {
													return (
														<Select.Option
															key={idx}
															className="option-shrink"
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
							<div className={`input-wrapper modal-form`}>
								<label>Ta'minotchi tanlang</label>
								<Select
									showSearch
									allowClear
									placeholder="Ta'minotchi tanlang"
									className="select"
									value={
										deliverObj?.deliver_name ? deliverObj?.deliver_name : null
									}
									onChange={handleDeliverChange}
								>
									{deliver?.data?.length
										? deliver?.data.map((item, idx) => {
												if (!item?.isdelete)
													return (
														<Select.Option
															key={idx}
															value={JSON.stringify(item)}
														>
															<div>
																<span>
																	{item?.deliver_name} -{" "}
																	{format_phone_number(item?.deliver_nomer)}
																</span>
															</div>
														</Select.Option>
													)
										  })
										: null}
								</Select>
							</div>
							<div
								className={`input-wrapper modal-form ${
									submitted &&
									stringCheck(productObj?.goods_id?.goods_name) !== null &&
									"error"
								}`}
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
										setProductQ(0)

										if (e) {
											setProductObj(JSON.parse(e))
											setProductP(
												roundToNearestHundred(
													JSON.parse(e).products_count_price *
														JSON.parse(e).currency_id.currency_amount
												)
											)
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
														className="option-shrink"
													>
														<div>
															<span>{item?.goods_id?.goods_name} - </span>
															<span>
																{item?.goods_id?.goods_code} -{" "}
																{(
																	item?.products_count_price *
																	item?.currency_id?.currency_amount
																).toLocaleString()}
																so'm
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
							<div className={`input-wrapper modal-form regular`}>
								<label>
									Quti (
									{productObj.products_box_count
										? productObj.products_box_count
										: 0}
									) - [
									{productObj.each_box_count ? productObj.each_box_count : 0}]
								</label>
							</div>
							<div
								className={`input-wrapper modal-form regular ${
									submitted && numberCheck(productQ) !== null && "error"
								}`}
							>
								<label>
									Dona (
									{productObj.products_count ? productObj.products_count : 0})
								</label>
								<input
									type="text"
									placeholder="Qiymat kiriting"
									className="input"
									value={productQ ? productQ : ""}
									onKeyPress={(e) => {
										if (isNaN(e.key)) {
											e.preventDefault()
										}
									}}
									onChange={(e) => {
										let maxValue = productObj.products_count
											? productObj.products_count
											: 0
										if (+e.target.value > +maxValue) {
											setProductQ(maxValue)
										} else {
											setProductQ(e.target.value)
										}
									}}
								/>
								{submitted && numberCheck(productQ) !== null && (
									<Info size={20} />
								)}
								<div className="validation-field">
									<span>{submitted && numberCheck(productQ)}</span>
								</div>
							</div>
							<div
								className={`input-wrapper modal-form regular ${
									submitted && numberCheck(productP) !== null && "error"
								}`}
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
									value={productP ? productP : ""}
									onKeyPress={(e) => {
										if (isNaN(e.key)) {
											e.preventDefault()
										}
									}}
									onChange={(e) => setProductP(e.target.value)}
								/>
								{submitted && numberCheck(productP) !== null && (
									<Info size={20} />
								)}
								<div className="validation-field">
									<span>{submitted && numberCheck(productP)}</span>
								</div>
							</div>
							<div className="input-wrapper modal-form regular">
								<label>Umumiy narx: </label>
								<span>{addComma(productQ * productP)} so'm</span>
							</div>
							<div className="modal-btn-group">
								<button className="primary-btn" onClick={handelAddToList}>
									Qo'shish
								</button>
								{/* <button className="secondary-btn" onClick={clearAndClose}> */}
								<button
									className="secondary-btn"
									onClick={(e) => {
										if (productList?.length >= 1)
											confirmCloseModal(
												"Ro'yxat o'chirib yuborilsinmi?",
												() => {
													setSDModalVisible(false)
													setTimeout(() => {
														setSDModalDisplay("none")
													}, 300)
												},
												clearAndClose
											)
										else clearAndClose()
									}}
								>
									Bekor qilish
								</button>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	)
}

export default SellDebt
