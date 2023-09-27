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
	setData as setDeliverDebt,
	setQuantity as setQuantityD,
} from "../../components/reducers/d-debt"
import {
	deleteData,
	setData,
	setLoading,
	setQuantity,
} from "../../components/reducers/debt"
import { setData as setDataDeliver } from "../../components/reducers/deliver"
import { setData as setDataGood } from "../../components/reducers/good"
import {
	setData as setDebtNote,
	setQuantity as setQuantityN,
} from "../../components/reducers/noteDebt"
import {
	setData as setDebtOrder,
	setQuantity as setQuantityO,
} from "../../components/reducers/orderDebt"
import TotalDebtTable from "../../components/total_debt_table/total_debt_table"
import { validation } from "../../components/validation"
import { get, patch, post, remove } from "../../customHook/api"
import useApiRequest from "../../customHook/useUrl"
import "./debts.css"

function Debts() {
	const [showDeliver, setShowDeliver] = useState("client")
	const { debt, dDebt, nDebt, oDebt, deliver, currency, good } = useSelector(
		(state) => state
	)
	const dispatch = useDispatch()
	const [submitted, setSubmitted] = useState(false)
	const request = useApiRequest()

	const [buttonLoader, setButtonLoader] = useState(false)
	const buttonRef = useRef(null)
	const [modalAlert, setModalAlert] = useState("")
	const [modalMsg, setModalMsg] = useState("")
	const [toggleClass, setToggleClass] = useState(false)

	// new data deliver
	const [newDeliver, setNewDeliver] = useState({})
	const [newGood, setNewGood] = useState({})
	const [newCurrency, setNewCurrency] = useState({})
	const [newCount, setNewCount] = useState(0)
	const [newCost, setNewCost] = useState(0)
	const [deliverDate, setDeliverDate] = useState("")
	const [deliverDueDate, setDeliverDueDate] = useState("")

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
		dispatch(setLoading(true))
		get(`/${list}/${list}-list`).then((data) => {
			if (data?.status === 200 || data?.status === 201) {
				if (
					list === "debts" ||
					list === "deliver-debts" ||
					list === "debts-note" ||
					list === "ordered"
				) {
					dispatch(setList(data.data?.data))
					if (list === "debts") {
						dispatch(setQuantity(data?.data.amount))
					} else if (list === "deliver-debts") {
						dispatch(setQuantityD(data?.data.amount))
					} else if (list === "debts-note") {
						dispatch(setQuantityN(data?.data.amount))
					} else if (list === "ordered") {
						dispatch(setQuantityO(data?.data.amount))
					}
				} else {
					dispatch(setList(data?.data))
				}
			}
			dispatch(setLoading(false))
		})
	}

	useEffect(() => {
		getData("debts", setData)
		getData("deliver-debts", setDeliverDebt)
		getData("debts-note", setDebtNote)
		getData("ordered", setDebtOrder)

		getData("deliver", setDataDeliver)
		getData("goods", setDataGood)
	}, [])

	const collapse = (event) => {
		setSubmitted(false)
		setToggleClass(!toggleClass)
		let content = event.target.nextElementSibling
		if (content.style.maxHeight) {
			content.style.maxHeight = null
			setNewDeliver({})
			setNewGood({})
			setNewCurrency({})
			setNewCount(0)
			setNewCost(0)
			setDeliverDate("")
			setDeliverDueDate("")

			setTotalName("")
			setTotalCost(0)
			setTotalComment("")
			setTotalDate("")
			setTotalDueDate("")

			setBeforeGood({})
			setBeforeDeliver({})
			setBeforeCost(0)
			setBeforeCount(0)
			setBeforeCurrency({})
			setBeforeDate("")
			setBeforeDueDate("")
		} else {
			content.style.maxHeight = content.scrollHeight + "px"
		}
	}

	// client
	const closeDebt = (id) => {
		dispatch(setLoading(true))
		patch(`/debts/debts-patch-done/${id}`).then((data) => {
			if (data?.status === 200) {
				dispatch(deleteData(id))
				setModalAlert("Xabar")
				setModalMsg("Qarzdorlik muvoffaqiyatli yopildi")
			} else if (data?.response?.data?.error === "DEBTS_NOT_FOUND") {
				setModalAlert("Xatolik")
				setModalMsg("Bunday qarzdorlik topilmadi")
			} else {
				setModalAlert("Nomalum server xatolik")
				setModalMsg("Qarzdorlik yopib bo'lmadi")
			}
			dispatch(setLoading(false))
		})
	}

	const payDebt = (id, sum) => {
		dispatch(setLoading(true))
		patch(`/debts/debts-patch-change/${id}`, { price: sum }).then((data) => {
			if (data?.status === 200) {
				getData("debts", setData)
				setModalAlert("Xabar")
				setModalMsg("Qarzdorlik muvoffaqiyatli kiritildi")
			} else {
				setModalAlert("Nomalum server xatolik")
				setModalMsg("Qarzdorlik kiritib bo'lmadi")
			}
			dispatch(setLoading(false))
		})
	}

	const deleteDebt = (id) => {
		dispatch(setLoading(true))
		remove(`/debts/debts-delete/${id}`).then((data) => {
			if (data?.status === 200) {
				setModalAlert("Xabar")
				setModalMsg("Qarzdorlik muvoffaqiyatli o'chirildi")
				dispatch(deleteData(data.debts_id))
			} else {
				setModalAlert("Nomalum server xatolik")
				setModalMsg("Qarzdorlikni o'chirib bo'lmadi")
			}
			dispatch(setLoading(false))
		})
	}

	// deliver
	const addNewDebtDeliver = () => {
		setSubmitted(true)
		if (
			newDeliver?.deliver_name &&
			newGood?.goods_name &&
			newCurrency?.currency_name &&
			newCount > 0 &&
			newCost > 0 &&
			deliverDate &&
			deliverDueDate &&
			new Date(deliverDate) <= new Date(deliverDueDate)
		) {
			setButtonLoader(true)
			let newObj = {
				goods_id: newGood?.goods_id,
				deliver_id: newDeliver?.deliver_id,
				debts_cost: newCost,
				debts_count: newCount,
				debts_currency: newCurrency?.currency_symbol,
				debts_currency_amount: newCurrency?.currency_amount,
				debts_selected_date: new Date(deliverDate).toISOString(),
				debts_due_date: new Date(deliverDueDate).toISOString(),

				goods_name: newGood?.goods_name,
				goods_code: newGood?.goods_code,
				deliver_name: newDeliver?.deliver_name,
				deliver_nomer: newDeliver?.deliver_nomer,
			}

			post("/deliver-debts/deliver-debts-post", newObj).then((data) => {
				if (data?.status === 200) {
					setModalAlert("Xabar")
					setModalMsg("Qarzdorlik muvoffaqiyatli qo'shildi")
					buttonRef.current.click()
					dispatch(
						addData({
							...data?.data,
							goods_name: newObj?.goods_name,
							goods_code: newObj?.goods_code,
							deliver_name: newObj?.deliver_name,
							deliver_nomer: newObj?.deliver_nomer,
						})
					)
				} else {
					setModalAlert("Nomalum server xatolik")
					setModalMsg("Qarzdorlik qo'shib bo'lmadi")
				}
				setButtonLoader(false)
			})
		}
	}

	const closeDeliverDebt = (id) => {
		dispatch(setLoading(true))
		patch(`/deliver-debts/deliver-debts-patch-done/${id}`).then((data) => {
			if (data?.status === 200) {
				dispatch(deleteDeliverData(id))
				setModalAlert("Xabar")
				setModalMsg("Qarzdorlik muvoffaqiyatli yopildi")
			} else if (data?.response?.data?.error === "DEBTS_NOT_FOUND") {
				setModalAlert("Xatolik")
				setModalMsg("Bunday qarzdorlik mavjud emas")
			} else {
				setModalAlert("Nomalum server xatolik")
				setModalMsg("Qarzdorlikni yopib bo'lmadi")
			}
			dispatch(setLoading(false))
		})
	}

	const deleteDeliverDebt = (id) => {
		dispatch(setLoading(true))
		remove(`/deliver-debts/deliver-debts-delete/${id}`).then((data) => {
			if (data?.status === 200) {
				dispatch(deleteDeliverData(id))
				setModalAlert("Xabar")
				setModalMsg("Qarzdorlik muvoffaqiyatli o'chirildi")
			} else {
				setModalAlert("Xatolik")
				setModalMsg("Qarzdorlik o'chirishda xatolik")
			}
			dispatch(setLoading(false))
		})
	}

	const payDeliverDebt = (id, sum) => {
		dispatch(setLoading(true))
		patch(`/deliver-debts/deliver-debts-change/${id}`, { price: sum }).then(
			(data) => {
				if (data?.status === 200) {
					getData("deliver-debts", setDeliverDebt)
					setModalAlert("Xabar")
					setModalMsg("Qarzdorlik muvoffaqiyatli kiritildi")
				} else {
					setModalAlert("Nomalum server xatolik")
					setModalMsg("Qarzdorlik kiritib bo'lmadi")
				}
				dispatch(setLoading(false))
			}
		)
	}

	// total
	const addNewTotalDebt = () => {
		setSubmitted(true)
		if (
			totalName.length >= 3 &&
			totalCost > 0 &&
			totalComment.length &&
			totalDate &&
			totalDueDate &&
			new Date(totalDate) <= new Date(totalDueDate)
		) {
			setButtonLoader(true)
			let newTotalDebtObj = {
				client_name: totalName,
				price: totalCost,
				description: totalComment,
				debts_due_date: new Date(totalDate).toISOString(),
				selectedDate: new Date(totalDueDate).toISOString(),
			}
			post("/debts-note/debts-note-post", newTotalDebtObj).then((data) => {
				if (data?.status === 200) {
					getData("debts-note", setDebtNote)
					buttonRef.current.click()
					setModalAlert("Xabar")
					setModalMsg("Qarzdorlik muvoffaqiyatli qo'shildi")
				} else {
					setModalAlert("Nomalum server xatolik")
					setModalMsg("Qarzdorlik qo'shib bo'lmadi")
				}
				setButtonLoader(false)
			})
		}
	}

	const deleteTotalDebt = (id) => {
		dispatch(setLoading(true))
		remove(`/debts-note/debts-note-delete/${id}`).then((data) => {
			if (data?.status === 200) {
				setModalAlert("Xabar")
				setModalMsg("Qarzdorlik muvoffaqiyatli o'chirildi")
				getData("debts-note", setDebtNote)
			} else {
				setModalAlert("Nomalum server xatolik")
				setModalMsg("Qarzdorlik o'chirib bo'lmadi")
			}
			dispatch(setLoading(false))
		})
	}

	const totalDebtPart = (id, price) => {
		dispatch(setLoading(true))
		patch(`/debts-note/debts-note-change/${id}`, { price }).then((data) => {
			if (data?.status === 200) {
				getData("debts-note", setDebtNote)
				setModalAlert("Xabar")
				setModalMsg("To'lov muvoffaqiyatli kiritildi")
			} else {
				setModalAlert("Nomalum server xatolik")
				setModalMsg("To'lov kiritib bo'lmadi")
			}
			dispatch(setLoading(false))
		})
	}

	const totalDebtCloseAtOnce = (id) => {
		dispatch(setLoading(true))
		patch(`/debts-note/debts-note-patch-done/${id}`).then((data) => {
			if (data?.status === 200) {
				getData("debts-note", setDebtNote)
				setModalAlert("Xabar")
				setModalMsg("Qarzdorlik muvoffaqiyatli yopildi")
			} else {
				setModalAlert("Nomalum server xatolik")
				setModalMsg("Qarzdorlikni yopib bo'lmadi")
			}
			dispatch(setLoading(false))
		})
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
			beforeDueDate &&
			new Date(beforeDate) <= new Date(beforeDueDate)
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
			post("/ordered/ordered-post", newObj).then((data) => {
				if (data?.status === 200) {
					buttonRef.current.click()
					getData("ordered", setDebtOrder)
					setModalAlert("Xabar")
					setModalMsg("Oldindan to'lov muvoffaqiyatli kiritildi")
				} else {
					setModalAlert("Nomalum server xatolik")
					setModalMsg("Oldindan to'lov kiritib bo'lmadi")
				}
				setButtonLoader(false)
			})
		}
	}

	const deleteBeforeDebt = (id) => {
		dispatch(setLoading(true))
		remove(`/ordered/ordered-delete/${id}`).then((data) => {
			if (data?.status === 200) {
				getData("ordered", setDebtOrder)
				setModalAlert("Xabar")
				setModalMsg("Oldindan to'lov muvoffaqiyatli o'chirildi")
			} else {
				setModalAlert("Nomalum server xatolik")
				setModalMsg("Malumot o'chirib bo'lmadi")
			}
			dispatch(setLoading(false))
		})
	}

	const beforeDebtPart = (id, amount) => {
		dispatch(setLoading(true))
		patch(`/ordered/ordered-change/${id}`, { amount }).then((data) => {
			if (data?.status === 200) {
				getData("ordered", setDebtOrder)
				setModalAlert("Xabar")
				setModalMsg("To'lov muvoffaqiyatli kiritildi")
			} else {
				setModalAlert("Nomalum server xatolik")
				setModalMsg("Malumot o'zgartirib bo'lmadi")
			}
			dispatch(setLoading(false))
		})
	}

	const beforeDebtCloseAtOnce = (id) => {
		dispatch(setLoading(true))
		patch(`/ordered/ordered-patch-done/${id}`).then((data) => {
			if (data?.status === 200) {
				getData("ordered", setDebtOrder)
				setModalAlert("Xabar")
				setModalMsg("To'lov muvoffaqiyatli yopildi")
			} else {
				setModalAlert("Nomalum server xatolik")
				setModalMsg("To'lovni yopib bo'lmadi")
			}
			dispatch(setLoading(false))
		})
	}

	return (
		<>
			<Radio.Group
				value={showDeliver}
				onChange={(e) => {
					setSubmitted(false)
					setShowDeliver(e.target.value)
					// localStorage.setItem("debt", JSON.stringify(e.target.value))
				}}
				className="debt-page-toggle"
			>
				<Radio.Button value="client">Mijoz</Radio.Button>
				<Radio.Button value="supplier">Ta'minotchi</Radio.Button>
				<Radio.Button value="total">Umumiy qarzdorlik</Radio.Button>
				<Radio.Button value="order">Oldindan to'lov</Radio.Button>
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
									{good?.data.length
										? good?.data.map((item, idx) => {
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
							<div className="debt-input-col validation-field">
								<label htmlFor="">Berilgan sana</label>
								<Input
									type="date"
									value={deliverDate}
									onChange={(e) => setDeliverDate(e.target.value)}
								/>
								<div className="validation-field-error">
									{submitted &&
										validation(!deliverDate, "Sana belgilash majburiy")}
								</div>
							</div>
							<div className="debt-input-col validation-field">
								<label htmlFor="">To'lanadigan sana</label>
								<Input
									type="date"
									value={deliverDueDate}
									onChange={(e) => setDeliverDueDate(e.target.value)}
								/>
								<div className="validation-field-error">
									{submitted
										? deliverDueDate
											? validation(
													new Date(deliverDueDate) < new Date(deliverDate),
													"Noto'g'ri sana"
											  )
											: validation(!deliverDueDate, "Sana belgilash majburiy")
										: null}
								</div>
							</div>

							<div className="col">
								<br />
								<button
									className="btn btn-melissa mx-1"
									onClick={addNewDebtDeliver}
									style={{ padding: "3px 10px" }}
									disabled={buttonLoader}
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
									{submitted
										? totalDueDate
											? validation(
													new Date(totalDueDate) < new Date(totalDate),
													"Noto'g'ri sana"
											  )
											: validation(!totalDueDate, "Sana belgilash majburiy")
										: null}
								</div>
							</div>

							<div className="col">
								<br />
								<button
									className="btn btn-melissa mx-1"
									onClick={addNewTotalDebt}
									style={{ padding: "3px 10px" }}
									disabled={buttonLoader}
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
			) : showDeliver === "order" ? (
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
									onChange={(e) => setBeforeGood(JSON.parse(e))}
									optionLabelProp="label"
								>
									{good?.data.length
										? good?.data.map((item, idx) => {
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
									{submitted
										? beforeDueDate
											? validation(
													new Date(beforeDueDate) < new Date(beforeDate),
													"Noto'g'ri sana"
											  )
											: validation(!beforeDueDate, "Sana belgilash majburiy")
										: null}
								</div>
							</div>

							<div className="col">
								<br />
								<button
									className="btn btn-melissa mx-1"
									onClick={addBeforeDebt}
									style={{ padding: "3px 10px" }}
									disabled={buttonLoader}
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
					? nDebt?.quantity
					: oDebt?.quantity}
				so'm
			</div>
			<div style={{ height: "10px" }}></div>

			{error_modal(modalAlert, modalMsg, modalMsg.length, setModalMsg)}
			{debt.loading ? (
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
				<TotalDebtTable
					data={nDebt?.data}
					deleteTotalDebt={deleteTotalDebt}
					totalDebtPart={totalDebtPart}
					totalDebtCloseAtOnce={totalDebtCloseAtOnce}
				/>
			) : (
				<BeforeDebtTable
					data={oDebt?.data}
					deleteDebt={deleteBeforeDebt}
					// editDebt={openEditBeforeDebt}
					editDebt={beforeDebtPart}
					beforeDebtCloseAtOnce={beforeDebtCloseAtOnce}
				/>
			)}
		</>
	)
}

export default Debts
