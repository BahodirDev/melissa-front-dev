import { Input, Select } from "antd"
import { Option } from "antd/es/mentions"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import BeforeDebtTable from "../../components/before_debt_table/before_debt_table"
import { error_modal } from "../../components/error_modal/error_modal"
import Loader from "../../components/loader/Loader"
import { setData, setLoading } from "../../components/reducers/orderDebt"
import { validation } from "../../components/validation"
import { patch, post, remove } from "../../customHook/api"

const Order = ({ getData, good, deliver, currency }) => {
	const state = useSelector((state) => state.oDebt)

	const [modalAlert, setModalAlert] = useState("")
	const [modalMsg, setModalMsg] = useState("")
	const [toggleClass, setToggleClass] = useState(false)
	const [submitted, setSubmitted] = useState(false)
	const buttonRef = useRef(null)
	const [buttonLoader, setButtonLoader] = useState(false)
	const dispatch = useDispatch()

	const [beforeGood, setBeforeGood] = useState({})
	const [beforeDeliver, setBeforeDeliver] = useState({})
	const [beforeCost, setBeforeCost] = useState(0)
	const [beforeCount, setBeforeCount] = useState(0)
	const [beforeCurrency, setBeforeCurrency] = useState({})
	const [beforeDate, setBeforeDate] = useState("")
	const [beforeDueDate, setBeforeDueDate] = useState("")

	useEffect(() => {
		getData("ordered", setData, setLoading)
	}, [])

	const collapse = (event) => {
		setSubmitted(false)
		setToggleClass(!toggleClass)
		let content = event.target.nextElementSibling
		if (content.style.maxHeight) {
			content.style.maxHeight = null
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
					getData("ordered", setData, setLoading)
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
				getData("ordered", setData, setLoading)
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
				getData("ordered", setData, setLoading)
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
				getData("ordered", setData, setLoading)
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
			{error_modal(modalAlert, modalMsg, modalMsg.length, setModalMsg)}

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
					<div className="sup-debt-form">
						<div className="validation-field">
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
						<div className="validation-field">
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
						<div className="validation-field">
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
						<div className="validation-field">
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
						<div className="validation-field">
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
										: validation(!beforeCost.length, "Miqdor kiritish majburiy")
									: null}
							</div>
						</div>
						<div className="validation-field">
							<label htmlFor="">Berilgan sana</label>
							<Input
								style={{ width: "100%" }}
								value={beforeDate ? beforeDate : null}
								onChange={(e) => setBeforeDate(e.target.value)}
								type="date"
							/>
							<div className="validation-field-error">
								{submitted && validation(!beforeDate, "Sana tanlash majburiy")}
							</div>
						</div>
						<div className="validation-field">
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

			<div className="return-info">
				<i className="fa-solid fa-user-tag"></i> Umumiy summa: {state?.quantity}{" "}
				so'm
			</div>
			<div style={{ height: "10px" }}></div>

			{state?.loading ? (
				<Loader />
			) : (
				<BeforeDebtTable
					data={state?.data}
					deleteDebt={deleteBeforeDebt}
					editDebt={beforeDebtPart}
					beforeDebtCloseAtOnce={beforeDebtCloseAtOnce}
				/>
			)}
		</>
	)
}
export default Order
