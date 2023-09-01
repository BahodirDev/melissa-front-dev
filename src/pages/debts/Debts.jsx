import { Input, Radio, Select } from "antd"
import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { Option } from "antd/es/mentions"
import DDebtTable from "../../components/d_debt_table/debt_table"
import DebtTable from "../../components/debt_table/debt_table"
import { error_modal } from "../../components/error_modal/error_modal"
import Loader from "../../components/loader/Loader"
import {
	addData,
	deleteData as deleteDeliverData,
	editData as editDeliverData,
	setData as setDeliverDebt,
} from "../../components/reducers/d-debt"
import {
	deleteData,
	editData,
	setData,
	setLoading,
} from "../../components/reducers/debt"
import { setData as setDataDeliver } from "../../components/reducers/deliver"
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
	const [showDeliver, setShowDeliver] = useState(false)

	// new data
	const [newDeliver, setNewDeliver] = useState({})
	const [newGood, setNewGood] = useState({})
	const [newCurrency, setNewCurrency] = useState({})
	const [newCount, setNewCount] = useState(0)
	const [newCost, setNewCost] = useState(0)

	const getData = (list, setList) => {
		request("GET", `${process.env.REACT_APP_URL}/${list}/${list}-list`)
			.then((data) => {
				dispatch(setList(data))
			})
			.catch((error) => {
				console.log(error)
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

	return (
		<>
			<Radio.Group
				value={showDeliver}
				onChange={(e) => setShowDeliver(e.target.value)}
				className="debt-page-toggle"
			>
				<Radio.Button value={false}>Mijoz</Radio.Button>
				<Radio.Button value={true}>Ta'minotchi</Radio.Button>
			</Radio.Group>

			{showDeliver ? (
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
									className="btn btn-melissa"
									onClick={addNewDebtDeliver}
									style={{ padding: "4px 10px" }}
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
				{showDeliver ? 1111 : 2222} ta
			</div>
			<div style={{ height: "10px" }}></div>

			{error_modal(modalAlert, modalMsg, modalMsg.length, setModalMsg)}
			{debt.data.loading ? (
				<Loader />
			) : showDeliver ? (
				<DDebtTable
					data={dDebt.data}
					closeDeliverDebt={closeDeliverDebt}
					deleteDeliverDebt={deleteDeliverDebt}
					payDeliverDebt={payDeliverDebt}
				/>
			) : (
				<DebtTable
					data={debt.data}
					closeDebt={closeDebt}
					payDebt={payDebt}
					deleteDebt={deleteDebt}
				/>
			)}
		</>
	)
}

export default Debts
