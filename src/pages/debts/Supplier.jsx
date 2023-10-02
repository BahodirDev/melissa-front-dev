import { Input, Select } from "antd"
import { Option } from "antd/es/mentions"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import DDebtTable from "../../components/d_debt_table/debt_table"
import { error_modal } from "../../components/error_modal/error_modal"
import Loader from "../../components/loader/Loader"
import {
	addData,
	deleteData,
	payDDebt,
	setData,
	setLoading,
} from "../../components/reducers/d-debt"
import { validation } from "../../components/validation"
import { patch, post, remove } from "../../customHook/api"

const Supplier = ({
	getData,
	good,
	currency,
	deliver,
	saerchInputValue,
	setAction,
}) => {
	const state = useSelector((state) => state.dDebt)
	const dispatch = useDispatch()

	const [submitted, setSubmitted] = useState(false)
	const [buttonLoader, setButtonLoader] = useState(false)
	const [modalAlert, setModalAlert] = useState("")
	const [modalMsg, setModalMsg] = useState("")
	const buttonRef = useRef(null)
	const [toggleClass, setToggleClass] = useState(false)
	const [searchSubmitted, setSearchSubmitted] = useState(false)
	const [filteredData, setFilteredData] = useState({})

	const [newDeliver, setNewDeliver] = useState({})
	const [newGood, setNewGood] = useState({})
	const [newCurrency, setNewCurrency] = useState({})
	const [newCount, setNewCount] = useState(0)
	const [newCost, setNewCost] = useState(0)
	const [deliverDate, setDeliverDate] = useState("")
	const [deliverDueDate, setDeliverDueDate] = useState("")

	useEffect(() => {
		setAction({
			url: "/deliver-debts/deliver-debts-filter",
			body: {
				search: saerchInputValue,
			},
			res: setFilteredData,
			submitted: setSearchSubmitted,
			clearValues: {},
			setLoading: setLoading,
		})
	}, [saerchInputValue])

	useEffect(() => {
		getData("deliver-debts", setData, setLoading)
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
		} else {
			content.style.maxHeight = content.scrollHeight + "px"
		}
	}

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
				dispatch(deleteData(id))
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
				dispatch(deleteData(id))
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
					dispatch(payDDebt({ id, sum }))
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

	return (
		<>
			{error_modal(modalAlert, modalMsg, modalMsg.length, setModalMsg)}

			<div className="return-info">
				<i className="fa-solid fa-user-tag"></i> Umumiy summa:{" "}
				{searchSubmitted ? filteredData?.amount : state.quantity} so'm
			</div>

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
						<div className="validation-field">
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
						<div className="validation-field">
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
									validation(!newCurrency.currency_name, "...tanlash majburiy")}
							</div>
						</div>
						<div className="validation-field">
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
						<div className="validation-field">
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
						<div className="validation-field">
							<label htmlFor="">Berilgan sana</label>
							<Input
								type="date"
								value={deliverDate}
								onChange={(e) => setDeliverDate(e.target.value)}
								onBlur={(e) => setDeliverDate(e.target.value)}
								onKeyUp={(e) => {
									if (e.key === "ArrowUp" || e.key === "ArrowDown") {
										setDeliverDate(e.target.value)
									}
								}}
							/>
							<div className="validation-field-error">
								{submitted &&
									validation(!deliverDate, "Sana belgilash majburiy")}
							</div>
						</div>
						<div className="validation-field">
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

			<div style={{ height: "10px" }}></div>

			{state?.loading ? (
				<Loader />
			) : (
				<DDebtTable
					data={searchSubmitted ? filteredData?.data : state.data}
					closeDeliverDebt={closeDeliverDebt}
					deleteDeliverDebt={deleteDeliverDebt}
					payDeliverDebt={payDeliverDebt}
				/>
			)}
		</>
	)
}
export default Supplier
