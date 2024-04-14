import product, {
	productSlice,
	setAmount,
	setDataProduct,
	setQuantity,
	setSum,
} from "../reducers/product"
import { addDebt as addDebtToClient } from "../reducers/client"
import "./sell debt.css"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react"
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
	confirmReturnTF,
} from "../confirm/confirm_modal"

const SellDebt = ({
	SDModalVisible,
	setSDModalVisible,
	SDModalDisplay,
	setSDModalDisplay,
	activeElementIndex,
	setActiveElementIndex,
	darkMode,
}) => {
	const { store, client, deliver } = useSelector((state) => state)
	const dispatch = useDispatch()

	const nextInputRef = useRef(null)

	const [btnLoading, setBtnLoading] = useState(false)
	const [submitted, setSubmitted] = useState(false)
	const [productList, setProductList] = useState([])
	const [products, setProducts] = useState([])
	const [totalPriceSellList, setTotalPriceSellList] = useState(0)
	const [productListLoading, setProductListLoading] = useState(false)

	// new sell
	const [storeObj, setStoreObj] = useState({})
	const [deliverObj, setDeliverObj] = useState({})
	const [productObj, setProductObj] = useState({})
	const [clientObj, setClientObj] = useState({})
	const [productQ, setProductQ] = useState(0)
	const [productP, setProductP] = useState(0)

	useEffect(() => {
		if (nextInputRef.current) {
			nextInputRef.current.focus()
		}
	}, [activeElementIndex])

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
			handleStoreChange(JSON.stringify(oldSellInfo?.store))
			setStoreObj(oldSellInfo?.store)
			setClientObj(oldSellInfo?.client)
			setProductList(oldSellInfo?.productList)

			const sumOfOldList = oldSellInfo?.productList?.reduce(
				(totalPrice, product) => totalPrice + product?.price * product?.count,
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
		if (productList?.length < 1) {
			localStorage.setItem("sellInfo", "")
		}
	}, [productList])

	const handleStoreChange = (id) => {
		setProductObj({})
		setProductQ(0)
		setDeliverObj({})

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

			if (storeObj?.store_id) {
				get(
					`products/products-by-params?store_id=${storeObj?.store_id}&deliver_id=${obj?.deliver_id}`
				).then((data) => {
					if (data?.status === 200) {
						setProducts(data?.data)
					} else {
						setProducts([])
					}
				})
			} else {
				get(`products/products-by-deliverId/${obj?.deliver_id}`).then(
					(data) => {
						if (data?.status === 200) {
							setProducts(data?.data)
						} else {
							setProducts([])
						}
					}
				)
			}
		} else {
			setDeliverObj({})
			setProducts([])
			handleStoreChange(JSON.stringify(storeObj))
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
			const existingProduct = productList.find(
				(item) => item?.product_id === productObj?.products_id
			)

			if (existingProduct) {
				confirmReturnTF(
					"Mahsulot ro'yxatda mavjud. Qo'shishni istaysizmi?",
					() => {
						let newObj = {
							product_id: productObj?.products_id,
							product_name: productObj?.goods_id?.goods_name,
							count: +productQ + existingProduct?.count,
							store_id: storeObj,
							price: productP,
							client: clientObj,
							cost:
								productObj?.products_count_cost *
								productObj?.currency_id?.currency_amount,
							currency_amount: productObj?.currency_id?.currency_amount,
							code: productObj?.goods_id?.goods_code,
						}
						const prevList = productList.filter(
							(item) => item?.product_id !== productObj?.products_id
						)
						setProductList([newObj, ...prevList])
						setTotalPriceSellList(
							(prev) =>
								prev -
								existingProduct?.count * existingProduct?.price +
								(existingProduct?.count + +productQ) * productP
						)
						clear()
					},
					darkMode
				)
				setActiveElementIndex(3)
			} else {
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
				setActiveElementIndex(3)
			}
		}
	}

	const clearAndClose = () => {
		setStoreObj({})
		setDeliverObj({})
		setProductObj({})
		setClientObj({})
		setProductQ(0)
		setProductP(0)
		setActiveElementIndex(0)

		setProductList([])
		setProducts([])

		setTotalPriceSellList(0)
		setBtnLoading(false)
		setSDModalVisible(false)
		setTimeout(() => {
			setSDModalDisplay("none")
		}, 300)
	}

	const clear = () => {
		setProductObj({})
		setProductQ(0)
		setProductP(0)
		setActiveElementIndex(4)

		setSubmitted(false)
	}

	const removeItemFromList = (id) => {
		let arr = productList.filter((item) => item?.product_id !== id)
		setProductList(arr)

		const removedItem = productList.findIndex((item) => item?.product_id === id)
		if (removedItem !== -1) {
			setTotalPriceSellList(
				(prev) =>
					prev -
					productList[removedItem]?.count * productList[removedItem]?.price
			)
		}
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

					confirmDownloadModal(downloadFile, data?.data?.report_id, darkMode)
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

	const addKey = (arr1, arr2) => {
		arr1.forEach((obj1) => {
			const match = arr2.find((obj2) => obj1.product_id === obj2.id)
			if (match) {
				obj1.highlight = true
			}
		})
	}

	function filterOption(inputValue, option) {
		const goodsData = JSON.parse(option.props.value)?.goods_id
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

	return (
		<div className="sell-modal-wrapper" style={{ display: SDModalDisplay }}>
			<div
				className={`modal-list ${SDModalVisible ? "bounce-in" : "bounce-out"} ${
					darkMode ? "dark" : null
				}`}
				onClick={(e) => e.stopPropagation()}
			>
				<>
					<div className={`modal-list-head ${darkMode ? "dark" : null}`}>
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
										} ${darkMode ? "dark" : null}`}
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
										<h6>{addComma(item.count * item.price)}</h6>
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
						className={`primary-btn sell ${darkMode ? "dark" : null}`}
						disabled={btnLoading || !productList?.length}
						onClick={(e) =>
							confirmApproveModal("Savdoni tasdiqlaysizmi?", postP, darkMode)
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
			</div>

			<div
				className={`sell-modal ${
					SDModalVisible ? "fade-in-sd" : "fade-out-sd"
				} ${darkMode ? "dark" : null}`}
				onClick={(e) => e.stopPropagation()}
			>
				<div className={`sell-modal-top ${darkMode ? "dark" : null}`}>
					<button
						onClick={() => {
							setSDModalVisible(false)
							setTimeout(() => {
								setSDModalDisplay("none")
							}, 300)
						}}
					>
						<X size={20} className={`${darkMode ? "phosphor-icon" : null}`} />
					</button>
					<div>
						<h4 className={"active"}>Sotish</h4>
					</div>
				</div>
				<div className="sell-modal-bottom">
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
								disabled={productList?.length}
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
								disabled={productList?.length}
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
									setActiveElementIndex(3)
								}}
								ref={activeElementIndex === 2 ? nextInputRef : null}
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
								{client?.data?.length
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
							className={`input-wrapper modal-form ${darkMode ? "dark" : null}`}
						>
							<label>Ta'minotchi tanlang</label>
							<Select
								showSearch
								allowClear
								placeholder="Ta'minotchi tanlang"
								className="select"
								value={
									deliverObj?.deliver_name ? deliverObj?.deliver_name : null
								}
								onChange={(e) => {
									handleDeliverChange(e)
									setActiveElementIndex(3)
								}}
							>
								{deliver?.data?.length
									? deliver?.data.map((item, idx) => {
											if (!item?.isdelete)
												return (
													<Select.Option
														className={`${darkMode ? "dark" : null}`}
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
									setProductQ(0)

									if (e) {
										setActiveElementIndex(4)
										setProductObj(JSON.parse(e))
										setProductP(
											roundToNearestHundred(
												JSON.parse(e).products_count_price *
													JSON.parse(e).currency_id.currency_amount
											)
										)
									} else setProductObj({})
								}}
								ref={activeElementIndex === 3 ? nextInputRef : null}
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
														</span>
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
						<div
							className={`input-wrapper modal-form regular ${
								darkMode ? "dark" : null
							}`}
						>
							<label>
								Quti (
								{productObj.products_box_count
									? productObj.products_box_count
									: 0}
								) - [{productObj.each_box_count ? productObj.each_box_count : 0}
								]
							</label>
						</div>
						<div
							className={`input-wrapper modal-form regular ${
								submitted && numberCheck(productQ) !== null && "error"
							} ${darkMode ? "dark" : null}`}
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
								ref={activeElementIndex === 4 ? nextInputRef : null}
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
						<div
							className={`input-wrapper modal-form regular ${
								darkMode ? "dark" : null
							}`}
						>
							<label>Umumiy narx: </label>
							<span>{addComma(productQ * productP)} so'm</span>
						</div>
						<div className="modal-btn-group">
							<button
								className={`primary-btn ${darkMode ? "dark" : null}`}
								onClick={handelAddToList}
							>
								Qo'shish
							</button>
							{/* <button className="secondary-btn" onClick={clearAndClose}> */}
							<button
								className={`secondary-btn ${darkMode ? "dark" : null}`}
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
											clearAndClose,
											darkMode
										)
									else clearAndClose()
								}}
							>
								Bekor qilish
							</button>
						</div>
					</>
				</div>
			</div>
		</div>
	)
}

export default SellDebt
