import { Input, Select } from "antd"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useOutletContext } from "react-router-dom"
import currency from "../../assets/currency.json"
import { error_modal } from "../../components/error_modal/error_modal"
import Loader from "../../components/loader/Loader"
import {
	addData,
	editData,
	setData,
	setLoading,
	setQuantity,
} from "../../components/reducers/currency"
import { validation } from "../../components/validation"
import useApiRequest from "../../customHook/useUrl"
import CurrencyList from "./CurrencyList"
import "./currency.css"

export default function Currency() {
	const [filteredProducts, setFilteredProducts] = useState([])
	const request = useApiRequest()
	// new values
	const [newName, setNewName] = useState({})
	const [newAmount, setNewAmount] = useState(0)
	const [buttonLoader, setButtonLoader] = useState(false)
	const [toggleClass, setToggleClass] = useState(false)
	const [modal_msg, setModal_msg] = useState("")
	const [modal_alert, setModal_alert] = useState("")
	const [user_id, setUser_id] = useState("")
	const [saerchInputValue] = useOutletContext()
	const [objId, setObjId] = useState("")
	const buttonRef = useRef(null)
	const [submitted, setSubmitted] = useState(false)
	const state = useSelector((state) => state.currency)
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(setLoading(true))
		let stores = state?.data?.filter((item) =>
			item?.currency_name.toLowerCase().includes(saerchInputValue.toLowerCase())
		)
		setFilteredProducts(stores)
		dispatch(setLoading(false))
	}, [saerchInputValue])

	const getData = () => {
		dispatch(setLoading(true))
		request("GET", `${process.env.REACT_APP_URL}/currency/currency-list`)
			.then((data) => {
				dispatch(setData(data))
				dispatch(setQuantity())
			})
			.catch((error) => {
				console.log(error)
			})
		dispatch(setLoading(false))
	}

	useEffect(getData, [])

	const addNewCurrency = () => {
		setSubmitted(true)
		if (newName.name && newAmount >= 0.01) {
			setButtonLoader(true)
			if (objId) {
				request(
					"PATCH",
					`${process.env.REACT_APP_URL}/currency/currency-patch/${objId}`,
					{
						currency_name: newName?.currency?.name,
						currency_code: newName?.currency?.code,
						currency_symbol: newName?.currency?.symbol,
						currency_amount: newAmount,
						name: newName?.name,
						flag: newName?.flag,
					}
				)
					.then((data) => {
						// console.log(data);
						dispatch(editData(data))
						setNewName({})
						setNewAmount(0)
						setModal_msg("Pul birligi muvoffaqiyatli o'zgartirildi")
						setModal_alert("Xabar")
						setUser_id("")
						setObjId("")
						setSubmitted(false)
						buttonRef.current.click()
					})
					.catch((err) => {
						// console.log(err)
						if (err.response.data.error === "CURRENCY_ALREADY_EXIST") {
							setModal_msg("Pul birligi allaqachon mavjud")
							setModal_alert("Xatolik")
							setUser_id("")
						} else {
							setModal_msg("Pul birligi o'zgartirishda xatolik")
							setModal_alert("Xatolik")
							setUser_id("")
						}
					})
			} else {
				let newCurrency = {
					currency_name: newName?.currency?.name,
					currency_code: newName?.currency?.code,
					currency_symbol: newName?.currency?.symbol,
					currency_amount: newAmount,
					name: newName?.name,
					flag: newName?.flag,
				}
				request(
					"POST",
					`${process.env.REACT_APP_URL}/currency/currency-post`,
					newCurrency
				)
					.then((data) => {
						if (data?.response?.data?.error === "CURRENCY_ALREADY_EXIST") {
							setModal_msg("Pul birligi allaqachon mavjud")
							setModal_alert("Xatolik")
							setUser_id("")
						} else {
							dispatch(addData(data))
							dispatch(setQuantity())
							setNewName({})
							setNewAmount(0)
							setModal_msg("Pul birligi muvoffaqiyatli qo'shildi")
							setModal_alert("Xabar")
							setUser_id("")
							setSubmitted(false)
							buttonRef.current.click()
						}
					})
					.catch((err) => {
						setModal_msg("Pul birligi qo'shib bo'lmadi")
						setModal_alert("Xatolik")
						setUser_id("")
					})
			}
			setButtonLoader(false)
		}
	}

	const deleteCurrency = (id) => {
		request(
			"DELETE",
			`${process.env.REACT_APP_URL}/currency/currency-delete/${id}`
		)
			.then((data) => {
				getData()
				dispatch(setQuantity())
				setModal_msg("Pul birligi o'chirildi")
				setModal_alert("Xabar")
				setUser_id("")
			})
			.catch((err) => {
				// console.log(err.response.data)
				if (err?.response?.data?.error === "PRODUCT_FOUND") {
					setModal_msg("Bu valyutada mahsulot bor!")
					setModal_alert("Xatolik")
					setUser_id("")
				} else {
					setModal_msg("Pul birligi o'chirib bo'lmadi")
					setModal_alert("Xatolik")
					setUser_id("")
				}
			})
	}

	const collapse = (event) => {
		setSubmitted(false)
		setToggleClass(!toggleClass)
		let content = event.target.nextElementSibling
		if (content.style.maxHeight) {
			content.style.maxHeight = null
			setNewName({})
			setNewAmount(0)
			setObjId("")
		} else {
			content.style.maxHeight = content.scrollHeight + "px"
		}
	}

	const editCurrency = (id) => {
		// const obj = products.find((item) => item?.currency_id === id)
		request("GET", `${process.env.REACT_APP_URL}/currency/currency-list/${id}`)
			.then((data) => {
				setNewName(
					toggleClass
						? ""
						: {
								currency: {
									name: data?.currency_name,
									code: data?.currency_code,
									symbol: data?.currency_symbol,
								},
								name: data?.name,
								flag: data?.flag,
						  }
				)
				setNewAmount(toggleClass ? "" : data?.currency_amount)
				setObjId(id)
				buttonRef.current.click()
			})
			.catch((error) => {
				console.log(error?.response?.data)
				if (error?.response?.data?.error === "CURRENCY_NOT_FOUND") {
					setModal_alert("Xatolik")
					setModal_msg("Valyuta topilmadi")
				} else {
					setModal_alert("Xatolik")
					setModal_msg("Nomalum server xatolik")
				}
			})
	}

	return (
		<div>
			{error_modal(modal_alert, modal_msg, modal_msg.length, setModal_msg)}

			<button
				className={`btn btn-melissa mb-2 ${toggleClass && "collapseActive"}`}
				onClick={collapse}
				ref={buttonRef}
			>
				Qo'shish
			</button>
			<div className="my-content" id="my-content currency-content">
				<div className="form-group d-flex mb-3">
					<div className="validation-field" style={{ width: "210px" }}>
						<label htmlFor="currency">Valyuta nomi</label>
						<Select
							showSearch
							id="currency"
							className="form-control__search currency-content-select"
							style={{ width: "100%" }}
							value={
								newName.currency
									? `${newName?.currency?.name} - ${newName?.name}`
									: null
							}
							placeholder="Qidiruv..."
							onChange={(e) => setNewName(JSON.parse(e))}
							optionLabelProp="label"
						>
							{currency.list.length
								? currency.list.map((item) => (
										<option
											value={JSON.stringify(item)}
											className="currency-option"
										>
											<div>
												<span>{item?.currency?.name} - </span>
												<span>{item?.name}</span>
											</div>
										</option>
								  ))
								: null}
						</Select>
						<div className="validation-field-error">
							{submitted &&
								validation(!newName.name, "Valyuta tanlash majburiy")}
						</div>
					</div>
					<div className="validation-field" style={{ width: "210px" }}>
						<label htmlFor="">Qiymat</label>
						<Input
							type="number"
							placeholder="10 000"
							className="currency-content-input"
							value={newAmount ? newAmount : ""}
							onChange={(e) => setNewAmount(e.target.value)}
						/>
						<div className="validation-field-error">
							{submitted &&
								validation(newAmount < 0.01, "Qiymat kiritish majburiy")}
						</div>
					</div>
					<div className="">
						<br />
						<button
							className="btn btn-melissa"
							onClick={addNewCurrency}
							style={{ padding: "4px 10px" }}
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
			<div className="currency-info">
				<i className="fa-solid fa-money-bill-transfer"></i> Valyutalar soni:{" "}
				{state?.quantity ? state?.quantity : 0} ta
			</div>
			{state?.loading ? (
				<Loader />
			) : (
				<CurrencyList
					products={saerchInputValue.length ? filteredProducts : state?.data}
					deleteCurrency={deleteCurrency}
					editCurrency={editCurrency}
				/>
			)}
		</div>
	)
}
