import { Input, Modal, Select } from "antd"
import { Option } from "antd/es/mentions"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import useApiRequest from "../../customHook/useUrl"
import { addComma } from "../addComma"
import { error_modal } from "../error_modal/error_modal"
import { addDebt as addDebtToClient } from "../reducers/client"
import { addData } from "../reducers/debt"
import { setDataProduct } from "../reducers/product"
import "./debts-modal.css"

function DebtsModal({ debtsModal, setDebtsModal }) {
	const { client, product } = useSelector((state) => state)
	const dispatch = useDispatch()
	const [modalAlert, setModalAlert] = useState("")
	const [modalMsg, setModalMsg] = useState("")
	const [btnValid, setBtnValid] = useState(false)
	const [btnLoading, setBtnLoading] = useState(false)
	const [priceCheck, setPriceCheck] = useState(false)
	const [debtList, setDebtList] = useState([])
	const [productsList, setProductsList] = useState([])
	const [productsCache, setProductsCache] = useState([])
	const request = useApiRequest()

	// new data
	const [clientId, setClientId] = useState({})
	const [productObj, setProductObj] = useState({})
	const [debtsCount, setDebtsCount] = useState(0)
	const [debtsPrice, setDebtsPrice] = useState(0)
	const [debtsPriceCheck, setDebtsPriceCheck] = useState(0)

	useEffect(() => {
		let isValid
		if (priceCheck) {
			isValid =
				clientId &&
				productObj?.products_id &&
				debtsCount > 0 &&
				debtsPriceCheck > 0
		} else {
			isValid = clientId && productObj && debtsCount > 0 && debtsPrice > 0
		}
		setBtnValid(isValid)
	}, [
		clientId,
		productObj,
		debtsCount,
		debtsPrice,
		debtsPriceCheck,
		priceCheck,
	])

	const addDebtToList = () => {
		if (btnValid) {
			let newDebtObj = {
				client_id: clientId?.clients_id,
				clients_name: clientId?.clients_name,
				clients_nomer: clientId?.clients_nomer,
				product_id: productObj?.products_id,
				product_name: productObj?.goods_id?.goods_name,
				product_code: productObj?.goods_id?.goods_code,
				debts_cost: productObj?.products_count_cost,
				debts_count: debtsCount,
				debts_currency: productObj?.currency_id?.currency_symbol,
				debts_currency_amount: productObj?.currency_id?.currency_amount,
				debts_price: priceCheck ? debtsPriceCheck : debtsPrice,
			}
			setDebtList([newDebtObj, ...debtList])

			const index = productsList.findIndex(
				(item) => item?.products_id === productObj?.products_id
			)

			setProductsList((prevList) => {
				const newList = [...prevList]
				setProductsCache([...productsCache, newList.splice(index, 1)[0]])
				return newList
			})
			setProductObj({})
			setDebtsCount(0)
			setDebtsPrice(0)
			setDebtsPriceCheck(0)
		}
	}

	const removeItem = (id) => {
		let newDebtList = debtList?.filter((item) => item.product_id !== id)
		setDebtList(newDebtList)
		const obj = productsCache.filter((item) => item.products_id === id)[0]
		setProductsList([...productsList, obj])
	}

	const addDebt = () => {
		setBtnLoading(true)
		let debtArr = debtList?.map((item) => {
			return {
				client_id: item?.client_id,
				clients_name: item?.clients_name,
				clients_nomer: item?.clients_nomer,
				debts_cost: item?.debts_cost,
				debts_count: item?.debts_count,
				debts_currency: item?.debts_currency,
				debts_currency_amount: item?.debts_currency_amount,
				debts_price: item?.debts_price / item?.debts_currency_amount,
				product_id: item?.product_id,
				product_name: item?.product_name,
				product_code: item?.product_code,
			}
		})
		request("POST", `${process.env.REACT_APP_URL}/debts/debts-post`, {
			debts: debtArr,
		})
			.then((dataDebt) => {
				// update reducer
				const updatedData = debtArr.map((obj, index) => ({
					...obj,
					debts_id: dataDebt[index].debts_id,
				}))
				dispatch(addData(updatedData))
				dispatch(addDebtToClient(updatedData))

				request("GET", `${process.env.REACT_APP_URL}/products/products-list`)
					.then((data) => {
						// console.log(data)
						dispatch(setDataProduct(data))
						setDebtsModal(false)
						setModalAlert("Xabar")
						setModalMsg("Qarzdorlik muvoffaqiyatli qo'shildi")
						setProductObj({})
						setDebtsCount(0)
						setDebtsPrice(0)
						setDebtsPriceCheck(0)
						setDebtList([])
						setClientId({})
					})
					.catch((err) => console.log(err?.response?.data))
			})
			.catch((err) => {
				console.log(err?.response?.data)
				setModalAlert("Xatolik")
				setModalMsg("Qarzdorlik qo'shib bo'lmadi")
			})
		setBtnLoading(false)
	}

	return (
		<>
			{error_modal(modalAlert, modalMsg, modalMsg.length, setModalMsg)}

			<Modal
				keyboard={false}
				centered
				closable={false}
				open={debtsModal}
				onOk={() => setDebtsModal(false)}
				onCancel={() => setDebtsModal(false)}
				width={1100}
				footer={[]}
			>
				<div className="debt-modal">
					<div
						className="my-modal debts-modal-wrapper"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="debt-input-col">
							<label htmlFor="">Mijoz</label>
							<Select
								showSearch
								id="goods_name"
								style={{ width: "100%" }}
								placeholder="Qidiruv..."
								value={clientId?.clients_name ? clientId?.clients_name : null}
								onChange={(e) => {
									setClientId(JSON.parse(e))
									setProductsList(product?.dataProduct)
								}}
								optionLabelProp="label"
								disabled={debtList?.length}
							>
								{client?.data?.length
									? client?.data.map((item, idx) => {
											if (!item?.isdelete) {
												return (
													<Option
														className="client-option"
														value={JSON.stringify(item)}
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
						<div className="debt-input-col">
							<label htmlFor="">Mahsulot</label>
							<Select
								showSearch
								placeholder="Qidiruv..."
								style={{ width: "100%" }}
								value={
									productObj?.products_id
										? productObj?.goods_id?.goods_name
										: null
								}
								onChange={(e) => {
									setDebtsPrice(
										JSON.parse(e)?.products_count_price *
											JSON.parse(e)?.currency_id?.currency_amount
									)
									setProductObj(JSON.parse(e))
								}}
								optionLabelProp="label"
								// disabled={productList.length}
							>
								{product?.dataProduct?.length
									? product?.dataProduct.map((item, idx) => {
											return (
												<Option
													className="client-option"
													value={JSON.stringify(item)}
													label={`${item?.goods_id?.goods_name} - ${item?.goods_id?.goods_code} - ${item?.deliver_id?.deliver_name}`}
												>
													<div>
														<span>
															{item?.goods_id?.goods_name} -{" "}
															{item?.goods_id?.goods_code} -{" "}
														</span>
														<span>
															{item?.deliver_id?.deliver_name} -{" "}
															{item?.store_id?.store_name}
														</span>
													</div>
												</Option>
											)
									  })
									: null}
							</Select>
						</div>
						<div className="debt-input-col">
							<label htmlFor="">
								Miqdor (
								{productObj?.products_count ? productObj?.products_count : 0})
							</label>
							<Input
								type="number"
								onChange={(e) => {
									let limit = +e.target.value
									productObj?.products_count >= limit &&
										setDebtsCount(e.target.value)
								}}
								value={debtsCount ? debtsCount : null}
								placeholder="20"
							/>
						</div>
						<div className="debt-input-col">
							<label htmlFor="">Narx</label>{" "}
							<input
								type="checkbox"
								value={priceCheck}
								onChange={() => setPriceCheck(!priceCheck)}
							/>
							{priceCheck ? (
								<Input
									type="number"
									onChange={(e) => setDebtsPriceCheck(e.target.value)}
									value={debtsPriceCheck ? debtsPriceCheck : null}
									placeholder="20,000.00"
								/>
							) : (
								<Input
									type="number"
									onChange={(e) => setDebtsPrice(e.target.value)}
									value={debtsPrice ? debtsPrice : null}
									placeholder="20,000.00"
									readOnly
								/>
							)}
						</div>
						<div className="debt-input-col-btn">
							<label>Umumiy narx:</label>
							<br />
							<span>
								{priceCheck
									? addComma(debtsCount * debtsPriceCheck)
									: addComma(debtsCount * debtsPrice)}{" "}
								so'm
							</span>
							<button
								disabled={!btnValid}
								className="btn product-add__btn"
								onClick={addDebtToList}
							>
								<i className="fas fa-plus"></i>
							</button>
						</div>
					</div>

					<div className="debts-list-wrapper">
						{debtList.length
							? debtList.map((item) => {
									return (
										<div className="product-modal__item">
											<h6>{item?.clients_name}</h6>
											<h6>
												{item?.product_name} - {item?.product_code}
											</h6>
											<h6>{item?.debts_count} ta</h6>
											<h6>{item?.client}</h6>
											<h6>{addComma(item?.debts_price)} so'm</h6>
											<h6>
												{addComma(item?.debts_price * item?.debts_count)} so'm
											</h6>
											<button
												className="btn btn-sm btn-melissa"
												onClick={() => removeItem(item?.product_id)}
												style={{ float: "right" }}
											>
												<i className="fas fa-remove"></i>
											</button>
										</div>
									)
							  })
							: null}
					</div>
				</div>
				<button
					className="btn btn-sell__modal"
					disabled={debtList.length ? false : true}
					onClick={addDebt}
				>
					Qarz qo'shish
					{btnLoading && (
						<span
							className="spinner-grow spinner-grow-sm"
							role="status"
							aria-hidden="true"
							style={{ marginLeft: "5px" }}
						></span>
					)}
				</button>
			</Modal>
		</>
	)
}

export default DebtsModal
