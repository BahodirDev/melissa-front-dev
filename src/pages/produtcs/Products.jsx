import { Button, Input, Select } from "antd"
import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useOutletContext } from "react-router-dom"
import { addComma } from "../../components/addComma"
import { error_modal } from "../../components/error_modal/error_modal"
import Loader from "../../components/loader/Loader"
import {
	addData,
	editData,
	setAmount,
	setDataCurrency,
	setDataDeliver,
	setDataGood,
	setDataProduct,
	setDataStore,
	setLoading,
	setQuantity,
	setSum,
} from "../../components/reducers/product"
import AntTable from "../../components/table/Table"
import { validation } from "../../components/validation"
import useApiRequest from "../../customHook/useUrl"
import { mapOptionList } from "./mapOptionList"
import "./product.css"
const { Option } = Select

export default function Products() {
	const [filteredProducts, setFilteredProducts] = useState([])
	const [buttonLoader, setButtonLoader] = useState(false)
	const [modal_msg, setModal_msg] = useState("")
	const [modal_alert, setModal_alert] = useState("")
	const [sn, setSn] = useState("")
	const [toggleClass, setToggleClass] = useState(false)
	const request = useApiRequest()
	const [searchInputValue, setSearchInputValue] = useOutletContext()
	const [objId, setObjId] = useState("")
	const buttonRef = useRef(null)
	const [submitted, setSubmitted] = useState(false)
	const state = useSelector((state) => state.product)
	const { good, currency, deliver, store } = useSelector((state) => state)
	const dispatch = useDispatch()
	const [productId, setProductId] = useState("")
	const [buttonValid, setButtonValid] = useState(false)

	// new data
	const [newGoodsId, setNewGoodsId] = useState({})
	const [newDeliverId, setNewDeliverId] = useState({})
	const [newStoreId, setNewStoreId] = useState({})
	const [newBoxQ, setNewBoxQ] = useState()
	const [newProductQ, setNewProductQ] = useState()
	const [newProductCost, setNewProductCost] = useState()
	const [newProductPrice, setNewProductPrice] = useState()
	const [newPercentId, setNewPercentId] = useState({})

	useEffect(() => {
		let isValid = searchInputValue.length || productId?.length
		setButtonValid(isValid)
	}, [productId, searchInputValue])

	const getData = () => {
		request("GET", `${process.env.REACT_APP_URL}/products/products-list`)
			.then((data) => {
				dispatch(setDataProduct(data?.data))
				dispatch(setQuantity(data?.hisob?.kategoriya))
				dispatch(setAmount(data?.hisob?.soni))
				dispatch(setSum(data?.hisob?.umumiyQiymati))
			})
			.catch((error) => {
				console.error(error)
			})
	}

	const getData1 = (name, dispatch1) => {
		request("GET", `${process.env.REACT_APP_URL}/${name}/${name}-list`)
			.then((data) => {
				dispatch(dispatch1(data))
			})
			.catch((error) => console.log(error))
	}

	useEffect(() => {
		dispatch(setLoading(true))

		getData()
		getData1("store", setDataStore)
		getData1("goods", setDataGood)
		getData1("deliver", setDataDeliver)
		getData1("currency", setDataCurrency)

		dispatch(setLoading(false))
	}, [])

	const addNewProduct = () => {
		setSubmitted(true)
		if (
			newGoodsId &&
			newDeliverId &&
			newStoreId &&
			newBoxQ > 0 &&
			newProductQ > 0 &&
			newProductPrice > 0 &&
			newProductCost > 0 &&
			newPercentId
		) {
			setButtonLoader(true)
			let newProductObj = {
				goods_id: newGoodsId?.goods_id,
				deliver_id: newDeliverId?.deliver_id,
				store_id: newStoreId?.store_id,
				products_count_cost: +newProductCost,
				products_count: +newProductQ,
				products_box_count: +newBoxQ,

				currency_id: newPercentId?.currency_id,
				products_count_price: +newProductPrice,
			}
			if (objId) {
				request(
					"PATCH",
					`${process.env.REACT_APP_URL}/products/products-patch/${objId}`,
					newProductObj
				)
					.then((data) => {
						dispatch(
							editData({ products_id: data?.products_id, ...newProductObj })
						)
						setNewGoodsId({})
						setNewDeliverId({})
						setNewStoreId({})
						setNewBoxQ(0)
						setNewProductQ(0)
						setNewPercentId({})
						setNewProductCost(0)
						setNewProductPrice(0)
						setModal_alert("Xabar")
						setModal_msg("Maxsulot muvoffaqiyatli o'zgartirildi")
						buttonRef.current.click()
						setSubmitted(false)
					})
					.catch((err) => {
						console.log(err?.response?.data)
						setModal_alert("Xatolik")
						setModal_msg("Mahsulot o'zgartirishda xatolik")
					})
			} else {
				// console.log(newProductObj)
				request(
					"POST",
					`${process.env.REACT_APP_URL}/products/products-post`,
					newProductObj
				)
					.then((dataP) => {
						dispatch(addData(dataP))
						dispatch(setQuantity())
						getData()
						setNewGoodsId({})
						setNewDeliverId({})
						setNewStoreId({})
						setNewBoxQ(0)
						setNewProductQ(0)
						setNewPercentId({})
						setNewProductCost(0)
						setNewProductPrice(0)
						setModal_alert("Xabar")
						setModal_msg("Maxsulot muvoffaqiyatli qo'shildi")
						buttonRef.current.click()
						setSubmitted(false)
					})
					.catch((err) => {
						setModal_alert("Xatolik")
						setModal_msg("Mahsulot qo'shib bo'lmadi")
					})
			}

			setButtonLoader(false)
		}
	}

	const deleteProduct = (id) => {
		request(
			"DELETE",
			`${process.env.REACT_APP_URL}/products/products-delete/${id}`
		)
			.then((data) => {
				if (data?.data?.error === "PRODUCT_FOUND") {
					setModal_alert("Xatolik")
					setModal_msg("Mahsulot omborda mavjud")
				} else if (data?.data?.error === "DEBTS_EXIST") {
					setModal_alert("Xatolik")
					setModal_msg("Mahsulotda qarzdorlik mavjud")
				} else {
					getData()
					setModal_msg("Mahsulot muvoffaqiyatli o'chirildi")
					setModal_alert("Xabar")
					setSn("")
				}
			})
			.catch((err) => {
				setModal_alert("Xatolik")
				setModal_msg("Mahsulot o'chirib bo'lmadi")
			})
	}

	const collapse = (event) => {
		setSubmitted(false)
		setToggleClass(!toggleClass)
		let content = event.target.nextElementSibling
		if (content.style.maxHeight) {
			content.style.maxHeight = null
			setNewGoodsId({})
			setNewDeliverId({})
			setNewStoreId({})
			setNewBoxQ(0)
			setNewProductQ(0)
			setNewPercentId({})
			setNewProductCost(0)
			setNewProductPrice(0)
			setObjId("")
		} else {
			content.style.maxHeight = content.scrollHeight + "px"
		}
	}

	const editProduct = (id) => {
		request("GET", `${process.env.REACT_APP_URL}/products/products-list/${id}`)
			.then((data) => {
				setNewGoodsId(toggleClass ? "" : data?.goods_id)
				setNewDeliverId(toggleClass ? "" : data?.deliver_id)
				setNewStoreId(toggleClass ? "" : data?.store_id)
				setNewBoxQ(
					data?.products_box_count < 1
						? ""
						: toggleClass
						? ""
						: data?.products_box_count
				)
				setNewProductQ(
					data?.products_count < 1
						? ""
						: toggleClass
						? ""
						: data?.products_count
				)
				setNewPercentId(toggleClass ? "" : data?.currency_id)
				setNewProductCost(toggleClass ? "" : data?.products_count_cost)
				setNewProductPrice(toggleClass ? "" : data?.products_count_price)
				setObjId(id)
				buttonRef.current.click()
			})
			.catch((error) => {
				console.log(error?.response?.data)
				if (error?.response?.data?.error === "PRODUCT_NOT_FOUND") {
					setModal_alert("Xatolik")
					setModal_msg("Mahsulot topilmadi")
				} else {
					setModal_alert("Xatolik")
					setModal_msg("Nomalum server xatolik")
				}
			})
	}

	const setFilters = () => {
		request(
			"GET",
			`${process.env.REACT_APP_URL}/products/products-by-storeid/${productId}`
		)
			.then((data) => setFilteredProducts(data))
			.catch((err) => console.log(err))
	}

	const clearFilters = () => {
		setFilteredProducts([])
		setProductId("")
		setSearchInputValue("")
	}

	return (
		<div>
			{error_modal(modal_alert, modal_msg, modal_msg?.length, setModal_msg)}
			<button
				className={`btn btn-melissa mb-2 ${toggleClass && "collapseActive"}`}
				onClick={collapse}
				ref={buttonRef}
				style={{ float: "left", padding: "3px 10px" }}
			>
				Qo'shish
			</button>

			<div className="product-filter-row">
				<Select
					style={{ width: "100%" }}
					id="store"
					value={productId ? productId : null}
					placeholder="Ombor 1"
					onChange={(e) => setProductId(e)}
					allowClear
				>
					{store?.data?.length
						? store.data.map((item) => {
								return (
									<Option value={item?.store_id}>{item?.store_name}</Option>
								)
						  })
						: null}
				</Select>

				<Button disabled={!buttonValid} onClick={clearFilters}>
					Tozalash
				</Button>
				<Button onClick={setFilters} disabled={!productId}>
					Filterlash
				</Button>
			</div>

			<div className="my-content">
				<div action="" className="form-group row mb-2 px-2">
					<div className="product-add__input">
						<label htmlFor="">Mahsulot nomi</label>
						<Select
							showSearch
							id="category"
							className="form-control__search"
							style={{ width: "100%" }}
							value={
								newGoodsId.goods_name
									? `${newGoodsId?.goods_name} - ${newGoodsId?.goods_code}`
									: null
							}
							placeholder="Qidiruv..."
							onChange={(e) => setNewGoodsId(JSON.parse(e))}
							optionLabelProp="label"
						>
							{state?.dataGood?.length
								? state?.dataGood.map((item) => (
										<Option
											className="client-option"
											value={JSON.stringify(item)}
											label={`${item?.goods_name} - ${item?.goods_code}`}
										>
											<div>
												<span>{item?.goods_name} - </span>
												<span>{item?.goods_code}</span>
											</div>
										</Option>
								  ))
								: null}
						</Select>
						<div className="validation-field-error">
							{submitted &&
								validation(!newGoodsId?.goods_name, "Ombor tanlash majburiy")}
						</div>
					</div>
					<div className="product-add__input">
						<label htmlFor="">Ta'minotchi</label>
						<Select
							placeholder="Ali - (90) 123 45 67"
							id="deliver"
							style={{ width: "100%" }}
							value={
								newDeliverId.deliver_name
									? `${
											newDeliverId?.deliver_name
									  } - ${newDeliverId?.deliver_nomer.replace(
											/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/,
											"+$1 ($2) $3-$4-$5"
									  )}`
									: null
							}
							onChange={(e) => setNewDeliverId(JSON.parse(e))}
						>
							{state?.dataDeliver?.length
								? mapOptionList("courier", state?.dataDeliver)
								: null}
						</Select>
						<div className="validation-field-error">
							{submitted &&
								validation(!newDeliverId?.deliver_name, "... tanlash majburiy")}
						</div>
					</div>
					<div className="product-add__input">
						<label htmlFor="">Ombor</label>
						<Select
							id="store"
							value={newStoreId ? newStoreId?.store_name : ""}
							placeholder="Ombor 1"
							style={{ width: "100%" }}
							onChange={(e) => setNewStoreId(JSON.parse(e))}
						>
							{store?.data?.length ? mapOptionList("store", store?.data) : null}
						</Select>
						<div className="validation-field-error">
							{submitted &&
								validation(!newStoreId?.store_name, "Ombor tanlash majburiy")}
						</div>
					</div>
					<div className="product-add__input">
						<label htmlFor="">Quti soni</label>
						<Input
							type="number"
							placeholder="20"
							value={newBoxQ ? newBoxQ : ""}
							onChange={(e) => setNewBoxQ(e.target.value)}
						/>
						<div className="validation-field-error">
							{submitted && validation(!newBoxQ, "Son kiritish majburiy")}
							{newBoxQ ? validation(newBoxQ < 0.01, "Noto'g'ri qiymat") : null}
						</div>
					</div>
					<div className="product-add__input">
						<label htmlFor="Mahsulot soni">Mahsulot soni</label>
						<Input
							type="number"
							placeholder="120"
							value={newProductQ ? newProductQ : ""}
							onChange={(e) => setNewProductQ(e.target.value)}
						/>
						<div className="validation-field-error">
							{submitted && validation(!newProductQ, "Son kiritish majburiy")}
							{newProductQ
								? validation(newProductQ < 0.01, "Noto'g'ri qiymat")
								: null}
						</div>
					</div>
					<div className="product-add__input">
						<label htmlFor="">Valyuta</label>
						<Select
							id="currency"
							value={newPercentId ? newPercentId?.currency_name : null}
							placeholder="So'm"
							style={{ width: "100%" }}
							onChange={(e) => setNewPercentId(JSON.parse(e))}
						>
							{currency?.data?.length
								? mapOptionList("currency", currency?.data)
								: null}
						</Select>
						<div className="validation-field-error">
							{submitted &&
								validation(!newPercentId?.name, "Valyuta tanlashh majburiy")}
						</div>
					</div>
					<div className="product-add__input">
						<label htmlFor="">Olingan narx</label>
						<Input
							type="number"
							placeholder="20,000.00"
							value={newProductCost ? newProductCost : ""}
							onChange={(e) => setNewProductCost(e.target.value)}
						/>
						<div className="validation-field-error">
							{submitted &&
								validation(!newProductCost, "Narx kiritish majburiy")}
							{newProductCost
								? validation(newProductCost < 0.01, "Noto'g'ri qiymat")
								: null}
						</div>
					</div>
					<div className="product-add__input">
						<label htmlFor="">Sotiladigan narx</label>
						<Input
							type="number"
							placeholder="20,000.00"
							value={newProductPrice ? newProductPrice : ""}
							onChange={(e) => setNewProductPrice(e.target.value)}
						/>
						<div className="validation-field-error">
							{submitted &&
								validation(!newProductPrice, "Narx kiritish majburiy")}
							{newProductPrice
								? validation(newProductPrice < 0.01, "Noto'g'ri qiymat")
								: null}
						</div>
					</div>
					<div className="col">
						<br />
						<button
							// disabled={!buttonValid}
							className="btn product-add__btn"
							onClick={addNewProduct}
						>
							<i className="fas fa-plus"></i>
							{buttonLoader ? (
								<span
									className="spinner-grow spinner-grow-sm"
									role="status"
									aria-hidden="true"
									style={{ marginLeft: "5px" }}
								></span>
							) : null}
						</button>
					</div>
				</div>
			</div>

			{state?.loading ? (
				<Loader />
			) : (
				<>
					<div className="products-info">
						<span>
							<i className="fa-solid fa-tags"></i> Kategoriya: {state?.quantity}{" "}
							ta
						</span>
						<span>
							<i className="fa-solid fa-bookmark"></i> Soni: {state?.amount} ta
						</span>
						<span>
							<i className="fa-solid fa-sack-dollar"></i> Summasi:{" "}
							{addComma(state?.sum)} so'm
						</span>
					</div>
					<AntTable
						data={
							filteredProducts.length ? filteredProducts : state?.dataProduct
						}
						deleteItem={deleteProduct}
						editProduct={editProduct}
					/>
				</>
			)}
		</div>
	)
}
