import { Input, Radio, Select } from "antd"
import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { Option } from "antd/es/mentions"
import BeforeDebtTable from "../../components/before_debt_table/before_debt_table"
import DDebtTable from "../../components/d_debt_table/debt_table"
import DebtTable from "../../components/debt_table/debt_table"
import { error_modal } from "../../components/error_modal/error_modal"
import Loader from "../../components/loader/Loader"
import {
	addData,
	deleteData as deleteDeliverData,
	editData as editDeliverData,
	setData as setDeliverDebt,
	setQuantity as setQuantityD,
} from "../../components/reducers/d-debt"
import {
	deleteData,
	editData,
	setData,
	setLoading,
	setQuantity,
} from "../../components/reducers/debt"
import { setData as setDataDeliver } from "../../components/reducers/deliver"
import TotalDebtTable from "../../components/total_debt_table/total_debt_table"
import { validation } from "../../components/validation"
import useApiRequest from "../../customHook/useUrl"
import "./debts.css"

function Debts() {
	const { debt, deliver, currency, dDebt } = useSelector((state) => state)
	const [buttonLoader, setButtonLoader] = useState(false)
	const buttonRef = useRef(null)
	const dispatch = useDispatch()
	const request = useApiRequest()
	const [modalAlert, setModalAlert] = useState("")
	const [modalMsg, setModalMsg] = useState("")
	const [submitted, setSubmitted] = useState(false)
	const [toggleClass, setToggleClass] = useState(false)
	const [goods, setGoods] = useState([])
	const [showDeliver, setShowDeliver] = useState("client")
	const [beforeData, setBeforeData] = useState([])

	// new data deliver
	const [newDeliver, setNewDeliver] = useState({})
	const [newGood, setNewGood] = useState({})
	const [newCurrency, setNewCurrency] = useState({})
	const [newCount, setNewCount] = useState(0)
	const [newCost, setNewCost] = useState(0)

	// new data total
	const [totalName, setTotalName] = useState("")
	const [totalCost, setTotalCost] = useState(0)
	const [totalComment, setTotalComment] = useState("")
	const [totalDate, setTotalDate] = useState("")
	const [totalDueDate, setTotalDueDate] = useState("")

	// new data before
	const [beforeGood, setBeforeGood] = useState({})
	const [beforeDeliver, setBeforeDeliver] = useState({})
	const [beforeCost, setBeforeCost] = useState(0)
	const [beforeCount, setBeforeCount] = useState(0)
	const [beforeCurrency, setBeforeCurrency] = useState({})
	const [beforeDate, setBeforeDate] = useState("")
	const [beforeDueDate, setBeforeDueDate] = useState("")

	const getData = (list, setList) => {
		request("GET", `${process.env.REACT_APP_URL}/${list}/${list}-list`)
			.then((data) => {
				// console.log(data)
				if (list === "debts" || list === "deliver-debts") {
					dispatch(setList(data.data))
					if (list === "debts") {
						dispatch(setQuantity(data.amount))
					} else {
						dispatch(setQuantityD(data.amount))
					}
				} else {
					dispatch(setList(data))
				}
			})
			.catch((error) => {
				// console.log(error)
			})
	}

	useEffect(() => {
		dispatch(setLoading(true))
		getData("debts", setData)
		getData("deliver", setDataDeliver)
		getData("deliver-debts", setDeliverDebt)

		request("GET", `${process.env.REACT_APP_URL}/goods/goods-list`)
			.then((data) => {
				setGoods(data)
			})
			.catch((error) => {
				console.log(error)
			})

		request("GET", `${process.env.REACT_APP_URL}/ordered/ordered-products-list`)
			.then((data) => {
				setBeforeData(data)
			})
			.catch((error) => {
				console.log(error)
			})
		dispatch(setLoading(true))
	}, [])

	const collapse = (event) => {
		setSubmitted(false)
		setToggleClass(!toggleClass)
		let content = event.target.nextElementSibling
		if (content.style.maxHeight) {
			content.style.maxHeight = null
			// setNewStoreName("")
			// setObjId("")
			setNewDeliver({})
			setNewGood({})
			setNewCurrency({})
			setNewCount(0)
			setNewCost(0)
		} else {
			content.style.maxHeight = content.scrollHeight + "px"
		}
	}

	// client
	const closeDebt = (id) => {
		request(
			"PATCH",
			`${process.env.REACT_APP_URL}/debts/debts-patch-done/${id}`
		)
			.then((data) => {
				dispatch(deleteData(id))
				// dispatch(removeDebt(id, ))
				// console.log(data, id)
				setModalAlert("Xabar")
				setModalMsg("Qarzdorlik muvoffaqiyatli yopildi")
			})
			.catch((error) => {
				console.log(error?.response?.data)
				if (error?.response?.data?.error === "DEBTS_NOT_FOUND") {
					setModalAlert("Xatolik")
					setModalMsg("Qarzdorlik topilmadi")
				} else {
					setModalAlert("Xatolik")
					setModalMsg("Qarzdorlik yopishda xatolik")
				}
			})
	}

	const payDebt = (id, sum) => {
		dispatch(editData({ id, sum }))
	}

	const deleteDebt = (id) => {
		request("DELETE", `${process.env.REACT_APP_URL}/debts/debts-delete/${id}`)
			.then((data) => {
				setModalAlert("Xabar")
				setModalMsg("Qarzdorlik muvoffaqiyatli o'chirildi")
				dispatch(deleteData(data.debts_id))
			})
			.catch((err) => {
				setModalAlert("Xatolik")
				setModalMsg("Qarzdorlik o'chirishda xatolik")
				console.log(err?.response?.data)
			})
	}

	// deliver
	const addNewDebtDeliver = () => {
		setSubmitted(true)
		if (
			newDeliver?.deliver_name &&
			newGood?.goods_name &&
			newCurrency?.currency_name &&
			newCount > 1 &&
			newCost > 1
		) {
			setButtonLoader(true)
			let newObj = {
				goods_name: newGood?.goods_name,
				goods_id: newGood?.goods_id,
				goods_code: newGood?.goods_code,
				deliver_id: newDeliver?.deliver_id,
				deliver_name: newDeliver?.deliver_name,
				deliver_nomer: newDeliver?.deliver_nomer,
				debts_cost: newCost,
				debts_count: newCount,
				debts_currency: newCurrency?.currency_symbol,
				debts_currency_amount: newCurrency?.currency_amount,
			}
			request(
				"POST",
				`${process.env.REACT_APP_URL}/deliver-debts/deliver-debts-post`,
				newObj
			)
				.then((data) => {
					buttonRef.current.click()
					setModalAlert("Xabar")
					setModalMsg("Qarzdorlik muvoffaqiyatli qo'shildi")
					dispatch(
						addData({
							...data,
							goods_name: newObj?.goods_name,
							goods_code: newObj?.goods_code,
							deliver_name: newObj?.deliver_name,
							deliver_nomer: newObj?.deliver_nomer,
						})
					)
				})
				.catch((err) => {
					console.log(err?.response?.data)
					setModalAlert("Xatolik")
					setModalMsg("Qarzdorlik qo'shishda xatolik")
				})
			setButtonLoader(false)
		}
	}

	const closeDeliverDebt = (id) => {
		request(
			"PATCH",
			`${process.env.REACT_APP_URL}/deliver-debts/deliver-debts-patch-done/${id}`
		)
			.then((data) => {
				dispatch(deleteDeliverData(id))
				setModalAlert("Xabar")
				setModalMsg("Qarzdorlik muvoffaqiyatli yopildi")
			})
			.catch((error) => {
				console.log(error?.response?.data)
				if (error?.response?.data?.error === "DEBTS_NOT_FOUND") {
					setModalAlert("Xatolik")
					setModalMsg("Qarzdorlik mavjud emas")
				} else {
					setModalAlert("Xatolik")
					setModalMsg("Qarzdorlik yopishda xatolik")
				}
			})
	}

	const deleteDeliverDebt = (id) => {
		request(
			"DELETE",
			`${process.env.REACT_APP_URL}/deliver-debts/deliver-debts-delete/${id}`
		)
			.then((data) => {
				setModalAlert("Xabar")
				setModalMsg("Qarzdorlik muvoffaqiyatli o'chirildi")
				dispatch(deleteDeliverData(id))
			})
			.catch((err) => {
				setModalAlert("Xatolik")
				setModalMsg("Qarzdorlik o'chirishda xatolik")
				console.log(err?.response?.data)
			})
	}

	const payDeliverDebt = (id, sum) => {
		dispatch(editDeliverData({ id, sum }))
	}

	// total
	const addNewTotalDebt = () => {
		setSubmitted(true)
	}

	// before
	const addBeforeDebt = () => {
		setSubmitted(true)
		if (
			beforeGood?.goods_id &&
			beforeDeliver?.deliver_id &&
			beforeCost > 0 &&
			beforeCount > 0 &&
			beforeCurrency?.currency_name &&
			beforeDate &&
			beforeDueDate
		) {
			setButtonLoader(true)
			let newObj = {
				goods_id: beforeGood?.goods_id,
				deliver_id: beforeDeliver?.deliver_id,
				debts_cost: beforeCost,
				debts_count: beforeCount,
				debts_currency: beforeCurrency?.currency_symbol,
				debts_currency_amount: beforeCurrency.currency_amount,
				debts_due_date: new Date(beforeDueDate).toISOString(),
				debts_selected_date: new Date(beforeDate).toISOString(),
			}
			request(
				"POST",
				`${process.env.REACT_APP_URL}/ordered/ordered-products-post`,
				newObj
			)
				.then((data) => {
					buttonRef.current.click()
					setModalAlert("Xabar")
					setModalMsg("Oldindan to'lov muvoffaqiyatli kiritildi")
					console.log(data)
					// clear input values
				})
				.catch((err) => {
					console.log(err?.response?.data)
					setModalAlert("Xatolik")
					setModalMsg("Oldindan to'lov kiritishda xatolik")
				})
			setButtonLoader(false)
		}
	}

	return (
		<>
			<Radio.Group
				value={showDeliver}
				onChange={(e) => {
					setSubmitted(false)
					setShowDeliver(e.target.value)
				}}
				className="debt-page-toggle"
			>
				<Radio.Button value="client">Mijoz</Radio.Button>
				<Radio.Button value="supplier">Ta'minotchi</Radio.Button>
				<Radio.Button value="total">Umumiy qarzdorlik</Radio.Button>
				<Radio.Button value="before">Oldindan to'lov</Radio.Button>
			</Radio.Group>

			{showDeliver === "supplier" ? (
				<>
					<button
						className={`btn btn-melissa mb-1 mx-2 ${
							toggleClass && "collapseActive"
						}`}
						style={{ padding: "3px 10px" }}
						onClick={collapse}
						ref={buttonRef}
					>
						Qo'shish
					</button>
					<div className="my-content">
						<div className="form-group d-flex mb-3">
							<div className="debt-input-col validation-field">
								<label htmlFor="">Ta'minotchi</label>
								<Select
									showSearch
									style={{ width: "100%" }}
									placeholder="Qidiruv..."
									value={
										newDeliver?.deliver_name ? newDeliver?.deliver_name : null
									}
									onChange={(e) => {
										setNewDeliver(JSON.parse(e))
									}}
									optionLabelProp="label"
								>
									{deliver?.data.length
										? deliver?.data.map((item, idx) => {
												if (!item?.isdelete) {
													return (
														<Option
															className="client-option"
															value={JSON.stringify(item)}
															label={`${
																item?.deliver_name
															} - ${item?.deliver_nomer.replace(
																/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/,
																"+$1 ($2) $3-$4-$5"
															)}`}
														>
															<div>
																<span>{item?.deliver_name} - </span>
																<span>
																	{item?.deliver_nomer.replace(
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
								<div className="validation-field-error">
									{submitted &&
										validation(!newDeliver.deliver_name, "...tanlash majburiy")}
								</div>
							</div>
							<div className="debt-input-col validation-field">
								<label htmlFor="">Kategoriya</label>
								<Select
									showSearch
									style={{ width: "100%" }}
									placeholder="Qidiruv..."
									value={
										newGood?.goods_name
											? `${newGood?.goods_name} - ${newGood?.goods_code}`
											: null
									}
									onChange={(e) => {
										setNewGood(JSON.parse(e))
									}}
									optionLabelProp="label"
								>
									{goods.length
										? goods.map((item, idx) => {
												return (
													<Option
														className="client-option"
														value={JSON.stringify(item)}
														label={item?.goods_name}
													>
														<div>
															<span>{item?.goods_name} - </span>
															<span>{item?.goods_code}</span>
														</div>
													</Option>
												)
										  })
										: null}
								</Select>
								<div className="validation-field-error">
									{submitted &&
										validation(!newGood.goods_name, "...tanlash majburiy")}
								</div>
							</div>
							<div className="debt-input-col validation-field">
								<label htmlFor="">Pul birligi</label>
								<Select
									showSearch
									style={{ width: "100%" }}
									placeholder="Qidiruv..."
									value={
										newCurrency?.currency_name
											? `${newCurrency.currency_name} - ${newCurrency.currency_amount}`
											: null
									}
									onChange={(e) => setNewCurrency(JSON.parse(e))}
									optionLabelProp="label"
								>
									{currency.data.length
										? currency.data.map((item, idx) => {
												return (
													<Option
														className="client-option"
														value={JSON.stringify(item)}
														label={item?.currency_name}
													>
														<div>
															<span></span>
															<span>
																{item?.currency_name} - {item?.currency_amount}
															</span>
														</div>
													</Option>
												)
										  })
										: null}
								</Select>
								<div className="validation-field-error">
									{submitted &&
										validation(
											!newCurrency.currency_name,
											"...tanlash majburiy"
										)}
								</div>
							</div>
							<div className="debt-input-col validation-field">
								<label htmlFor="">Miqdor</label>
								<Input
									style={{ width: "100%" }}
									placeholder="200"
									value={newCount ? newCount : null}
									onChange={(e) => setNewCount(e.target.value)}
									optionLabelProp="label"
									type="number"
								/>
								<div className="validation-field-error">
									{submitted
										? newCount.length
											? validation(newCount < 0.01, "Noto'g'ri qiymat")
											: validation(!newCount.length, "Miqdor kiritish majburiy")
										: null}
								</div>
							</div>
							<div className="debt-input-col validation-field">
								<label htmlFor="">Narx</label>
								<Input
									style={{ width: "100%" }}
									placeholder="20,000.00	"
									value={newCost ? newCost : null}
									onChange={(e) => setNewCost(e.target.value)}
									optionLabelProp="label"
									type="number"
								/>
								<div className="validation-field-error">
									{submitted
										? newCost.length
											? validation(newCost < 0.01, "Noto'g'ri qiymat")
											: validation(!newCost.length, "Miqdor kiritish majburiy")
										: null}
								</div>
							</div>

							<div className="col">
								<br />
								<button
									className="btn btn-melissa mx-1"
									onClick={addNewDebtDeliver}
									style={{ padding: "3px 10px" }}
								>
									<i className="fas fa-plus"></i>
									{buttonLoader && (
										<span
											className="spinner-grow spinner-grow-sm"
											role="status"
											aria-hidden="true"
											style={{ marginLeft: "5px" }}
										></span>
									)}
								</button>
							</div>
						</div>
					</div>
				</>
			) : showDeliver === "total" ? (
				<>
					<button
						className={`btn btn-melissa mb-1 mx-2 ${
							toggleClass && "collapseActive"
						}`}
						style={{ padding: "3px 10px" }}
						onClick={collapse}
						ref={buttonRef}
					>
						Qo'shish
					</button>
					<div className="my-content">
						<div className="form-group d-flex mb-3">
							<div className="debt-input-col validation-field">
								<label htmlFor="">Haridor</label>
								<Input
									placeholder="Alisher"
									value={totalName}
									onChange={(e) => setTotalName(e.target.value)}
								/>
								<div className="validation-field-error">
									{submitted && validation(!totalName, "Ism kiritish majburiy")}
									{totalName.length
										? validation(totalName.length < 3, "Kamida 3 ta harf kerak")
										: null}
								</div>
							</div>
							<div className="debt-input-col validation-field">
								<label htmlFor="">Narx</label>
								<Input
									type="number"
									placeholder="20,000.00 so'm"
									value={totalCost > 0.01 ? totalCost : null}
									onChange={(e) => setTotalCost(e.target.value)}
								/>
								<div className="validation-field-error">
									{submitted && validation(!totalCost, "Son kiritish majburiy")}
									{totalCost
										? validation(totalCost < 0.01, "Noto'g'ri qiymat")
										: null}
								</div>
							</div>
							<div className="debt-input-col validation-field">
								<label htmlFor="">Izoh</label>
								<Input
									placeholder="Izoh"
									value={totalComment}
									onChange={(e) => setTotalComment(e.target.value)}
								/>
								<div className="validation-field-error">
									{submitted &&
										validation(!totalComment, "Izoh kiritish majburiy")}
								</div>
							</div>
							<div className="debt-input-col validation-field">
								<label htmlFor="">Berilgan sana</label>
								<Input
									type="date"
									value={totalDate}
									onChange={(e) => setTotalDate(e.target.value)}
								/>
								<div className="validation-field-error">
									{submitted && validation(!totalDate, "Sana tanlash majburiy")}
								</div>
							</div>
							<div className="debt-input-col validation-field">
								<label htmlFor="">To'lanadigan sana</label>
								<Input
									type="date"
									value={totalDueDate}
									onChange={(e) => setTotalDueDate(e.target.value)}
								/>
								<div className="validation-field-error">
									{submitted &&
										validation(!totalDueDate, "Sana belgilash majburiy")}
								</div>
							</div>

							<div className="col">
								<br />
								<button
									className="btn btn-melissa mx-1"
									onClick={addNewTotalDebt}
									style={{ padding: "3px 10px" }}
								>
									<i className="fas fa-plus"></i>
									{buttonLoader && (
										<span
											className="spinner-grow spinner-grow-sm"
											role="status"
											aria-hidden="true"
											style={{ marginLeft: "5px" }}
										></span>
									)}
								</button>
							</div>
						</div>
					</div>
				</>
			) : showDeliver === "before" ? (
				<>
					<button
						className={`btn btn-melissa mb-1 mx-2 ${
							toggleClass && "collapseActive"
						}`}
						style={{ padding: "3px 10px" }}
						onClick={collapse}
						ref={buttonRef}
					>
						Qo'shish
					</button>
					<div className="my-content">
						<div className="form-group d-flex mb-3">
							<div className="debt-input-col debt-order-input-col validation-field">
								<label htmlFor="">Kategoriya</label>
								<Select
									showSearch
									style={{ width: "100%" }}
									placeholder="Qidiruv..."
									value={
										beforeGood?.goods_name
											? `${beforeGood?.goods_name} - ${beforeGood?.goods_code}`
											: null
									}
									onChange={(e) => {
										setBeforeGood(JSON.parse(e))
									}}
									optionLabelProp="label"
								>
									{goods.length
										? goods.map((item, idx) => {
												return (
													<Option
														className="client-option"
														value={JSON.stringify(item)}
														label={item?.goods_name}
													>
														<div>
															<span>{item?.goods_name} - </span>
															<span>{item?.goods_code}</span>
														</div>
													</Option>
												)
										  })
										: null}
								</Select>
								<div className="validation-field-error">
									{submitted &&
										validation(
											!beforeGood?.goods_name,
											"Kategoriya tanlash majburiy"
										)}
								</div>
							</div>
							<div className="debt-input-col debt-order-input-col validation-field">
								<label htmlFor="">Ta'minotchi</label>
								<Select
									showSearch
									style={{ width: "100%" }}
									placeholder="Qidiruv..."
									value={
										beforeDeliver?.deliver_name
											? beforeDeliver?.deliver_name
											: null
									}
									onChange={(e) => {
										setBeforeDeliver(JSON.parse(e))
									}}
									optionLabelProp="label"
								>
									{deliver?.data.length
										? deliver?.data.map((item, idx) => {
												if (!item?.isdelete) {
													return (
														<Option
															className="client-option"
															value={JSON.stringify(item)}
															label={`${
																item?.deliver_name
															} - ${item?.deliver_nomer.replace(
																/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/,
																"+$1 ($2) $3-$4-$5"
															)}`}
														>
															<div>
																<span>{item?.deliver_name} - </span>
																<span>
																	{item?.deliver_nomer.replace(
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
								<div className="validation-field-error">
									{submitted &&
										validation(
											!beforeDeliver.deliver_name,
											"Ta'minotchi tanlash majburiy"
										)}
								</div>
							</div>
							<div className="debt-input-col debt-order-input-col validation-field">
								<label htmlFor="">Miqdor</label>
								<Input
									style={{ width: "100%" }}
									placeholder="200"
									value={beforeCount ? beforeCount : null}
									onChange={(e) => setBeforeCount(e.target.value)}
									optionLabelProp="label"
									type="number"
								/>
								<div className="validation-field-error">
									{submitted
										? beforeCount.length
											? validation(beforeCount < 0.01, "Noto'g'ri qiymat")
											: validation(
													!beforeCount.length,
													"Miqdor kiritish majburiy"
											  )
										: null}
								</div>
							</div>
							<div className="debt-input-col debt-order-input-col validation-field">
								<label htmlFor="">Pul birligi</label>
								<Select
									showSearch
									style={{ width: "100%" }}
									placeholder="Qidiruv..."
									value={
										beforeCurrency?.currency_name
											? `${beforeCurrency.currency_name} - ${beforeCurrency.currency_amount}`
											: null
									}
									onChange={(e) => setBeforeCurrency(JSON.parse(e))}
									optionLabelProp="label"
								>
									{currency.data.length
										? currency.data.map((item, idx) => {
												return (
													<Option
														className="client-option"
														value={JSON.stringify(item)}
														label={item?.currency_name}
													>
														<div>
															<span></span>
															<span>
																{item?.currency_name} - {item?.currency_amount}
															</span>
														</div>
													</Option>
												)
										  })
										: null}
								</Select>
								<div className="validation-field-error">
									{submitted &&
										validation(
											!beforeCurrency.currency_name,
											"Valyuta tanlash majburiy"
										)}
								</div>
							</div>
							<div className="debt-input-col debt-order-input-col validation-field">
								<label htmlFor="">Narx</label>
								<Input
									style={{ width: "100%" }}
									placeholder="20,000.00	"
									value={beforeCost ? beforeCost : null}
									onChange={(e) => setBeforeCost(e.target.value)}
									optionLabelProp="label"
									type="number"
								/>
								<div className="validation-field-error">
									{submitted
										? beforeCost.length
											? validation(beforeCost < 0.01, "Noto'g'ri qiymat")
											: validation(
													!beforeCost.length,
													"Miqdor kiritish majburiy"
											  )
										: null}
								</div>
							</div>
							<div className="debt-input-col debt-order-input-col validation-field">
								<label htmlFor="">Berilgan sana</label>
								<Input
									style={{ width: "100%" }}
									value={beforeDate ? beforeDate : null}
									onChange={(e) => setBeforeDate(e.target.value)}
									type="date"
								/>
								<div className="validation-field-error">
									{submitted &&
										validation(!beforeDate, "Sana tanlash majburiy")}
								</div>
							</div>
							<div className="debt-input-col debt-order-input-col validation-field">
								<label htmlFor="">To'lanadigan sana</label>
								<Input
									style={{ width: "100%" }}
									value={beforeDueDate ? beforeDueDate : null}
									onChange={(e) => setBeforeDueDate(e.target.value)}
									type="date"
								/>
								<div className="validation-field-error">
									{submitted &&
										validation(!beforeDueDate, "Sana belgilash majburiy")}
								</div>
							</div>

							<div className="col">
								<br />
								<button
									className="btn btn-melissa mx-1"
									onClick={addBeforeDebt}
									style={{ padding: "3px 10px" }}
								>
									<i className="fas fa-plus"></i>
									{buttonLoader && (
										<span
											className="spinner-grow spinner-grow-sm"
											role="status"
											aria-hidden="true"
											style={{ marginLeft: "5px" }}
										></span>
									)}
								</button>
							</div>
						</div>
					</div>
				</>
			) : null}

			<div className="return-info">
				<i className="fa-solid fa-user-tag"></i> Umumiy summa:{" "}
				{showDeliver === "client"
					? debt.quantity
					: showDeliver === "supplier"
					? dDebt.quantity
					: showDeliver === "total"
					? "0"
					: beforeData?.amount}
				so'm
			</div>
			<div style={{ height: "10px" }}></div>

			{error_modal(modalAlert, modalMsg, modalMsg.length, setModalMsg)}
			{debt.data.loading ? (
				<Loader />
			) : showDeliver === "client" ? (
				<DebtTable
					data={debt.data}
					closeDebt={closeDebt}
					payDebt={payDebt}
					deleteDebt={deleteDebt}
				/>
			) : showDeliver === "supplier" ? (
				<DDebtTable
					data={dDebt.data}
					closeDeliverDebt={closeDeliverDebt}
					deleteDeliverDebt={deleteDeliverDebt}
					payDeliverDebt={payDeliverDebt}
				/>
			) : showDeliver === "total" ? (
				<TotalDebtTable data={[]} />
			) : (
				<BeforeDebtTable data={beforeData?.data} />
			)}
		</>
	)
}

export default Debts
