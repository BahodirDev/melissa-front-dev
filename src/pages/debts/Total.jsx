import { Input } from "antd"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { error_modal } from "../../components/error_modal/error_modal"
import Loader from "../../components/loader/Loader"
import { setData, setLoading } from "../../components/reducers/noteDebt"
import AntTable from "../../components/total_debt_table/total_debt_table"
import { validation } from "../../components/validation"
import { patch, post, remove } from "../../customHook/api"

const Total = ({ getData, saerchInputValue, setAction }) => {
	const state = useSelector((state) => state.nDebt)

	const [toggleClass, setToggleClass] = useState(false)
	const [submitted, setSubmitted] = useState(false)
	const buttonRef = useRef(null)
	const [buttonLoader, setButtonLoader] = useState(false)
	const [modalAlert, setModalAlert] = useState("")
	const [modalMsg, setModalMsg] = useState("")
	const dispatch = useDispatch()
	const [searchSubmitted, setSearchSubmitted] = useState(false)
	const [filteredData, setFilteredData] = useState({})

	const [totalName, setTotalName] = useState("")
	const [totalCost, setTotalCost] = useState(0)
	const [totalComment, setTotalComment] = useState("")
	const [totalDate, setTotalDate] = useState("")
	const [totalDueDate, setTotalDueDate] = useState("")

	useEffect(() => {
		setAction({
			url: "/debts-note/debts-note-filter",
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
		getData("debts-note", setData, setLoading)
	}, [])

	const collapse = (event) => {
		setSubmitted(false)
		setToggleClass(!toggleClass)
		let content = event.target.nextElementSibling
		if (content.style.maxHeight) {
			content.style.maxHeight = null
			setTotalName("")
			setTotalCost(0)
			setTotalComment("")
			setTotalDate("")
			setTotalDueDate("")
		} else {
			content.style.maxHeight = content.scrollHeight + "px"
		}
	}

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
					getData("debts-note", setData, setLoading)
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
				getData("debts-note", setData, setLoading)
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
				getData("debts-note", setData, setLoading)
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
				getData("debts-note", setData, setLoading)
				setModalAlert("Xabar")
				setModalMsg("Qarzdorlik muvoffaqiyatli yopildi")
			} else {
				setModalAlert("Nomalum server xatolik")
				setModalMsg("Qarzdorlikni yopib bo'lmadi")
			}
			dispatch(setLoading(false))
		})
	}

	return (
		<>
			{error_modal(modalAlert, modalMsg, modalMsg.length, setModalMsg)}

			<div className="return-info">
				<i className="fa-solid fa-user-tag"></i> Umumiy summa:{" "}
				{searchSubmitted ? filteredData?.amount : state?.quantity} so'm
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
						<div className="validation-field">
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
						<div className="validation-field">
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
						<div className="validation-field">
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
						<div className="validation-field">
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

			<div style={{ height: "10px" }}></div>

			{state?.loading ? (
				<Loader />
			) : (
				<AntTable
					data={searchSubmitted ? filteredData?.data : state?.data}
					deleteTotalDebt={deleteTotalDebt}
					totalDebtPart={totalDebtPart}
					totalDebtCloseAtOnce={totalDebtCloseAtOnce}
				/>
			)}
		</>
	)
}

export default Total
