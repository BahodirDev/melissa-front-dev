import { Input } from "antd"
import { useEffect, useRef, useState } from "react"
import { PatternFormat } from "react-number-format"
import { useDispatch, useSelector } from "react-redux"
import { useOutletContext } from "react-router-dom"
import { error_modal } from "../../components/error_modal/error_modal"
import Loader from "../../components/loader/Loader"
import {
	addData,
	editData,
	setData,
	setLoading,
	setQuantity,
} from "../../components/reducers/deliver"
import { validation } from "../../components/validation"
import useApiRequest from "../../customHook/useUrl"
import DeliverList from "./DeliverList"
import "./deliver.css"

function Deliver() {
	const [toggleClass, setToggleClass] = useState(false)
	const [btn_loading, setBtn_loading] = useState(false)
	const request = useApiRequest()
	const [name, setName] = useState("")
	const [phone, setPhone] = useState("")
	const [loc, setLoc] = useState("")
	const [modal_msg, setModal_msg] = useState("")
	const [modal_alert, setModal_alert] = useState("")
	const [user_id, setUser_id] = useState("")
	const [saerchInputValue] = useOutletContext()
	const [filteredData, setFilteredData] = useState([])
	const [objId, setObjId] = useState("")
	const buttonRef = useRef(null)
	const [toggleDesc, setToggleDesc] = useState(0)
	const [submitted, setSubmitted] = useState(false)
	const state = useSelector((state) => state.deliver)
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(setLoading(true))
		let deliver = state?.data.filter((item) =>
			item?.deliver_name.toLowerCase().includes(saerchInputValue.toLowerCase())
		)
		setFilteredData(deliver)
		dispatch(setLoading(false))
	}, [saerchInputValue])

	const getData = () => {
		dispatch(setLoading(true))
		request("GET", `${process.env.REACT_APP_URL}/deliver/deliver-list`)
			.then((data) => {
				dispatch(setData(data))
				dispatch(setQuantity())
			})
			.catch((err) => console.error(err))
		dispatch(setLoading(false))
	}

	useEffect(getData, [])

	const collapse = (event) => {
		setSubmitted(false)
		setToggleClass(!toggleClass)
		let content = event.target.nextElementSibling
		if (content.style.maxHeight) {
			content.style.maxHeight = null
			setName("")
			setPhone("")
			setLoc("")
			setObjId("")
		} else {
			content.style.maxHeight = content.scrollHeight + "px"
		}
	}

	const addNewDeliver = () => {
		setSubmitted(true)
		if (name.length >= 3 && phone.slice(18) !== "_" && loc.length >= 3) {
			setBtn_loading(true)
			if (objId) {
				request(
					"PATCH",
					`${process.env.REACT_APP_URL}/deliver/deliver-patch/${objId}`,
					{
						deliver_name: name,
						deliver_nomer: phone.replace(/\D/g, ""),
						deliver_place: loc,
					}
				)
					.then((data) => {
						dispatch(editData(data.data))
						buttonRef.current.click()
						setModal_msg("Ta'minotchi muvoffaqiyatli o'zgartirildi")
						setModal_alert("Xabar")
						setName("")
						setPhone("")
						setLoc("")
						setObjId("")
						setSubmitted(false)
					})
					.catch((err) => {
						console.log(err?.response?.data)
						if (err?.response?.data?.error === "USER_ALREADY_EXIST") {
							setModal_msg("Ta'minotchi allaqachon bor")
							setModal_alert("Xatolik")
						} else {
							setModal_msg("Ta'minotchi o'zgartirishda xatolik")
							setModal_alert("Xatolik")
						}
					})
			} else {
				let newDeliver = {
					deliver_name: name,
					deliver_nomer: phone.replace(/\D/g, ""),
					deliver_place: loc,
				}
				request(
					"POST",
					`${process.env.REACT_APP_URL}/deliver/deliver-post`,
					newDeliver
				)
					.then((data) => {
						dispatch(addData(data?.data))
						dispatch(setQuantity())
						buttonRef.current.click()
						setModal_msg("Ta'minotchi muvoffaqiyatli qo'shildi")
						setModal_alert("Xabar")
						setName("")
						setPhone("")
						setLoc("")
						setSubmitted(false)
					})
					.catch((err) => {
						console.log(err?.response?.data)
						if (err?.response?.data?.error === "USER_ALREADY_EXIST") {
							setModal_msg("Ta'minotchi allaqachon bor")
							setModal_alert("Xatolik")
						} else {
							setModal_msg("Ta'minotchi qo'shishda xatolik")
							setModal_alert("Xatolik")
						}
					})
			}
			setBtn_loading(false)
		}
	}

	const deleteDeliver = (id) => {
		request(
			"DELETE",
			`${process.env.REACT_APP_URL}/deliver/deliver-delete/${id}`
		)
			.then((data) => {
				getData()
				dispatch(setQuantity())
				setModal_msg("Ta'minotchi o'chirildi")
				setModal_alert("Xabar")
				setUser_id("")
			})
			.catch((err) => {
				setModal_msg("Ta'minotchi o'chirib bo'lmadi")
				setModal_alert("Xatolik")
				setUser_id("")
			})
	}

	const editDeliver = (id) => {
		// const obj = data.find((item) => item.deliver_id === id)
		request("GET", `${process.env.REACT_APP_URL}/deliver/deliver-list/${id}`)
			.then((data) => {
				setName(toggleClass ? "" : data?.deliver_name)
				setPhone(toggleClass ? "" : data?.deliver_nomer.slice(3))
				setLoc(toggleClass ? "" : data?.deliver_place)
				setObjId(id)
				buttonRef.current.click()
			})
			.catch((error) => {
				console.log(error?.response?.data)
				if (error?.response?.data?.error === "DELIVER_NOT_FOUND") {
					setModal_alert("Xatolik")
					setModal_msg("Ta'minotchi topilmadi")
				} else {
					setModal_alert("Xatolik")
					setModal_msg("Nomalum server xatolik")
				}
			})
	}

	return (
		<>
			{error_modal(modal_alert, modal_msg, modal_msg.length, setModal_msg)}

			<button
				className={`btn btn-melissa mb-2 ${toggleClass && "collapseActive"}`}
				onClick={collapse}
				ref={buttonRef}
			>
				Qo'shish
			</button>
			<div className="my-content">
				<div className="row mb-3 px-2">
					<div className="col-2 p-0 mx-1 validation-field">
						<label className="mx-2" htmlFor="ism">
							Ism
						</label>
						<Input
							type="text"
							placeholder="Alisher"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
						<div className="validation-field-error">
							{submitted && validation(!name, "Ism kiritish majburiy")}
							{name.length
								? validation(name.length < 3, "Kamida 3 ta harf kerak")
								: null}
						</div>
					</div>
					<div className="col-2 p-0 mx-1 validation-field">
						<label className="mx-2" htmlFor="ism">
							Tel nomer
						</label>
						<PatternFormat
							className="phone-number-input"
							placeholder="+998(__) ___-__-__"
							type="tel"
							format="+998 (##) ###-##-##"
							mask="_"
							value={phone}
							onValueChange={(value) => setPhone(value.formattedValue)}
							required
						/>
						<div className="validation-field-error">
							{submitted &&
								validation(!phone, "Telefon raqam kiritish majburiy")}
							{phone.length
								? validation(phone.slice(-1) === "_", "Noto'g'ri telefon raqam")
								: null}
						</div>
					</div>
					<div className="col-2 p-0 mx-1 validation-field">
						<label className="mx-2" htmlFor="ism">
							Manzil
						</label>
						<Input
							type="text"
							placeholder="Toshkent 1"
							value={loc}
							onChange={(e) => setLoc(e.target.value)}
						/>
						<div className="validation-field-error">
							{submitted && validation(!loc, "Manzil kiritish majburiy")}
							{loc.length
								? validation(loc.length < 3, "Kamida 3 ta harf kerak")
								: null}
						</div>
					</div>
					<div className="col p-0 mx-1">
						<br />
						<button
							className="btn btn-melissa"
							onClick={addNewDeliver}
							style={{ padding: "4px 10px" }}
						>
							<i className="fas fa-plus"></i>
							{btn_loading && (
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
			<div className="deliverInfo">
				<i className="fa-solid fa-truck"></i> Ta'minotchilar soni:{" "}
				{state?.quantity ? state?.quantity : 0} ta
			</div>

			{state?.loading ? (
				<Loader />
			) : (
				<DeliverList
					data={saerchInputValue.length ? filteredData : state?.data}
					deleteDeliver={deleteDeliver}
					editDeliver={editDeliver}
					toggleDesc={toggleDesc}
					setToggleDesc={setToggleDesc}
				/>
			)}
		</>
	)
}
export default Deliver
