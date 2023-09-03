import { Input, Modal, Select } from "antd"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import useApiRequest from "../../customHook/useUrl"
import { addComma } from "../addComma"
import { error_modal } from "../error_modal/error_modal"
import { setData as setDataClient } from "../reducers/client"
import { setData as setDataCurrency } from "../reducers/currency"
import { setDataProduct } from "../reducers/product"
import { setData } from "../reducers/store"
import ProductModalList from "./ProductModalList"
import "./modal.css"
const { Option } = Select

export default function MyModal({ myModal, setMyModal }) {
	const [filteredProducts, setFilteredProducts] = useState([])
	const [filteredProductsCache, setFilteredProductsCache] = useState([])
	const [productList, setProductList] = useState([])
	const [store_id, setStore_id] = useState("")
	const [productId, setProductId] = useState({})
	const [productQ, setProductQ] = useState(0)
	const [productPrice, setProductPrice] = useState(0)
	const [buttonValid, setButtonValid] = useState(false)
	const [modalAlert, setModalAlert] = useState("")
	const [modalMsg, setModalMsg] = useState("")
	const [price_check, setPrice_check] = useState(false)
	const [price_bh, setPrice_bh] = useState(0)
	const request = useApiRequest()
	const [clientList2, setClientList2] = useState([])
	const [newClient, setNewClient] = useState("")
	const [btnLoading, setBtnloading] = useState(false)
	const { store, client, product, currency } = useSelector((state) => state)
	const dispatch = useDispatch()

	const getData = (name, dispatch1) => {
		request("GET", `${process.env.REACT_APP_URL}/${name}/${name}-list`)
			.then((data) => {
				dispatch(dispatch1(name === "products" ? data?.data : data))
			})
			.catch((error) => console.log(error?.response?.data))
	}

	useEffect(() => {
		getData("clients", setDataClient)
		getData("store", setData)
		getData("products", setDataProduct)
		getData("currency", setDataCurrency)
	}, [])

	useEffect(() => {
		let isValid = false
		price_check
			? (isValid = productId && productQ > 0 && price_bh > 0 && newClient)
			: (isValid = productId && productQ > 0 && productPrice > 0 && newClient)
		setButtonValid(isValid)
	}, [productId, productQ, productPrice, price_bh, price_check, newClient])

	const removeItem = (id) => {
		let leftItems = productList.filter((item) => item?.product_id != id)
		setProductList(leftItems)
		const obj = filteredProductsCache.filter(
			(item) => item.products_id === id
		)[0]
		setFilteredProducts([...filteredProducts, obj])
	}

	const handleStoreChange = (e) => {
		setProductId({})
		setStore_id(e)

		request(
			"GET",
			`${process.env.REACT_APP_URL}/products/products-by-storeid/${e}`
		)
			.then((data) => {
				setFilteredProducts(data)
			})
			.catch((error) => console.log(error?.response?.data))
	}

	const postSale = () => {
		setBtnloading(true)
		let newArr = productList.map((item) => {
			return {
				product_id: item?.product_id,
				count: item?.count,
				client: item?.client,
				cost: (item?.cost / item?.currency_amount).toFixed(2),
				price: (item?.price / item?.currency_amount).toFixed(2),
				code: item?.code,
				store_id: item?.store_id,
				deliver_id: item?.deliver_id,
				currency_amount: item?.currency_amount,
			}
		})

		request("PATCH", `${process.env.REACT_APP_URL}/products/products-sale`, {
			products: newArr,
		})
			.then((dataP) => {
				request("get", `${process.env.REACT_APP_URL}/products/products-list`)
					.then((data) => dispatch(setDataProduct(data)))
					.catch((err) => console.log(err?.response?.data))
				setMyModal(false)
				setProductList([])
				setStore_id("")
				setModalAlert("Xabar")
				setModalMsg("Mahsulot muvoffaqiyatli sotildi")
				setProductId({})
				setNewClient("")
				setFilteredProductsCache([])
				setFilteredProducts([])
				setPrice_bh(0)
				setProductPrice(0)
				setProductQ(0)
			})
			.catch((error) => {
				console.error(error?.response?.data)
				setModalAlert("Xatolik")
				setModalMsg("Mahsulot sotishda xatolik")
			})

		setBtnloading(false)
	}

	const sellProduct = () => {
		if (buttonValid) {
			let newObj = {
				product_id: productId?.products_id,
				product_name: productId?.goods_id?.goods_name,
				count: productQ,
				store_id: store_id,
				price: price_check
					? price_bh
					: productPrice * productId?.currency_id?.currency_amount,
				name: "default user",
				client: newClient,
				cost:
					productId?.products_count_cost *
					productId?.currency_id?.currency_amount,
				currency_amount: productId?.currency_id?.currency_amount,
				code: productId?.goods_id?.goods_code,
			}
			setProductList([newObj, ...productList])
			setProductQ(0)
			setProductPrice(0)
			setPrice_bh(0)
			setPrice_check(false)
			setProductId({})
			const index = filteredProducts.findIndex(
				(item) => item?.products_id === productId?.products_id
			)
			setFilteredProductsCache([
				...filteredProductsCache,
				...filteredProducts.splice(index, 1),
			])
			// setNewClient("")
			document.querySelector("#goods_name").value = ""
		}
	}

	return (
		<>
			{error_modal(modalAlert, modalMsg, modalMsg.length, setModalMsg)}

			<Modal
				centered
				closable={false}
				open={myModal}
				onOk={() => setMyModal(false)}
				onCancel={() => setMyModal(false)}
				width={1150}
				footer={[]}
			>
				<div className="my-modal" onClick={(e) => e.stopPropagation()}>
					{/* form */}
					<div className="row sell-modal">
						<div className="col">
							<label htmlFor="store-name">Omborlar</label>
							<Select
								allowClear
								name=""
								id="store-name"
								disabled={productList?.length}
								onChange={(e) => handleStoreChange(e)}
								value={store_id ? store_id : null}
								style={{ width: "100%" }}
								placeholder="Ombor tanlash"
							>
								{store?.data?.length
									? store?.data.map((store) => {
											return (
												<Option
													value={store?.store_id}
													label={store?.store_name}
												>
													{store?.store_name}
												</Option>
											)
									  })
									: null}
							</Select>
						</div>
						<div className="col">
							<label htmlFor="goods_name">Mahsulotlar</label>
							<Select
								showSearch
								id="goods_name"
								style={{ width: "100%" }}
								value={
									productId.goods_id
										? `${productId?.goods_id?.goods_name} - ${productId?.goods_id?.goods_code} - ${productId?.deliver_id?.deliver_name}`
										: null
								}
								placeholder="Qidiruv..."
								onChange={(e) => {
									setProductId(JSON.parse(e))
									setProductPrice(JSON.parse(e)?.products_count_price)
									setProductQ(0)
								}}
								optionLabelProp="label"
							>
								{filteredProducts.length
									? filteredProducts.map((item) => (
											<Option
												className="client-option"
												value={JSON.stringify(item)}
												label={`${productId?.goods_id?.goods_name} - ${productId?.goods_id?.goods_code} - ${productId?.deliver_id?.deliver_name}`}
											>
												<div>
													<span>
														{item?.goods_id?.goods_name} -{" "}
														{item?.goods_id.goods_code} -{" "}
													</span>
													<span>{`${item?.deliver_id?.deliver_name}`}</span>
												</div>
											</Option>
									  ))
									: null}
							</Select>
						</div>
						<div className="col">
							<label htmlFor="goods_name">Mijoz</label>
							<Select
								showSearch
								id="goods_name"
								style={{ width: "100%" }}
								placeholder="Qidiruv..."
								value={newClient ? newClient : null}
								onChange={(e) => setNewClient(e)}
								optionLabelProp="label"
								disabled={productList?.length}
							>
								<Option
									className="client-option"
									value={`Yangi mijoz`}
									label={`Yangi mijoz`}
								>
									<div>
										<span></span>
										<span>Yangi mijoz</span>
									</div>
								</Option>

								{client?.data?.length
									? client?.data.map((item, idx) => {
											if (!item?.isdelete) {
												return (
													<Option
														className="client-option"
														value={`${
															item?.clients_name
														} - ${item?.clients_nomer.replace(
															/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/,
															"+$1 ($2) $3-$4-$5"
														)}`}
														label={`${
															item?.clients_name
														} - ${item?.clients_nomer.replace(
															/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/,
															"+$1 ($2) $3-$4-$5"
														)}`}
													>
														<div>
															<span>{item?.clients_name} - </span>
															<span>
																{item?.clients_nomer.replace(
																	/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/,
																	"+$1 ($2) $3-$4-$5"
																)}
															</span>
														</div>
													</Option>
												)
											}
									  })
									: null}
							</Select>
						</div>
						<div className="col">
							<label htmlFor="product_q">
								Miqdor (
								{productId.products_count ? productId.products_count : 0})
							</label>
							<Input
								type="number"
								id="product_q"
								onChange={(e) => {
									let limit = +e.target.value
									productId?.products_count >= limit &&
										setProductQ(e.target.value)
								}}
								value={productQ ? productQ : ""}
								placeholder="20"
								// max={productId.products_count}
							/>
							{/* <input type="text" /> */}
						</div>
						<div className="col">
							<label htmlFor="product_price">Narx &nbsp;</label>
							<input
								type="checkbox"
								value={price_check}
								onChange={() => setPrice_check(!price_check)}
							/>
							{price_check ? (
								<Input
									type="number"
									id="product_price"
									placeholder="20,000.00"
									value={price_bh}
									onChange={(e) => setPrice_bh(e.target.value)}
								/>
							) : (
								<Input
									type="number"
									id="product_price"
									placeholder="20,000.00"
									readOnly
									value={
										productPrice > 0
											? (
													productPrice * productId?.currency_id?.currency_amount
											  ).toFixed(2) || 0
											: ""
									}
									// onChange={(e) => setProductPrice(e.target.value)}
									onChange={(e) => console.log(e.target.value)}
								/>
							)}
						</div>
						<div className="col">
							{/* <br /> */}
							<label htmlFor="">Umumiy narx</label>
							<br />
							<span className="totalPriceCheck">
								{price_check
									? price_bh
										? addComma((price_bh * productQ).toFixed(0).toString())
										: 0.0
									: productPrice
									? addComma(
											(
												productPrice *
												productQ *
												productId?.currency_id?.currency_amount
											)
												.toFixed(0)
												.toString()
									  )
									: 0.0}{" "}
								so'm
							</span>
							&nbsp;
							<button
								disabled={!buttonValid}
								onClick={sellProduct}
								className="btn modal-float__btn"
							>
								<i className="fas fa-plus"></i>
							</button>
						</div>
						<button
							className="btn btn-sell__modal"
							disabled={productList.length ? false : true}
							onClick={postSale}
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
					</div>

					{/* product list */}
					{productList.length ? (
						<ProductModalList
							productList={productList}
							removeItem={removeItem}
						/>
					) : null}
				</div>
			</Modal>
		</>
	)
}
