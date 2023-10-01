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
import { get, patch, post, remove } from "../../customHook/api"
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
	const [
		saerchInputValue,
		setSearchInput,
		sidebar,
		userInfo,
		action,
		setAction,
	] = useOutletContext()
	const [filteredData, setFilteredData] = useState([])
	const [objId, setObjId] = useState("")
	const buttonRef = useRef(null)
	const [toggleDesc, setToggleDesc] = useState(0)
	const [submitted, setSubmitted] = useState(false)
	const state = useSelector((state) => state.deliver)
	const dispatch = useDispatch()
	const [searchSubmitted, setSearchSubmitted] = useState(false)

	useEffect(() => {
		setAction({
			url: "/deliver/deliver-search",
			body: {
				search: saerchInputValue,
			},
			res: setFilteredData,
			submitted: setSearchSubmitted,
			clearValues: {},
			setLoading: setLoading,
		})
	}, [saerchInputValue])

	const getData = () => {
		dispatch(setLoading(true))
		get("/deliver/deliver-list").then((data) => {
			if (data?.status === 201) {
				dispatch(setData(data?.data))
				dispatch(setQuantity())
			} else {
				setModal_alert("Nomalum server xatolik")
				setModal_msg("Malumot topilmadi")
			}
			dispatch(setLoading(false))
		})
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
		if (name.length >= 3 && phone.slice(18) !== "_" && loc) {
			setBtn_loading(true)
			if (objId) {
				patch(`/deliver/deliver-patch/${objId}`, {
					deliver_name: name,
					deliver_nomer: phone.replace(/\D/g, ""),
					deliver_place: loc,
				}).then((data) => {
					if (data?.status === 200) {
						dispatch(editData(data?.data?.data))
						buttonRef.current.click()
						setName("")
						setPhone("")
						setLoc("")
						setObjId("")
						setSubmitted(false)
						setModal_msg("Malumot muvoffaqiyatli o'zgartirildi")
						setModal_alert("Xabar")
					} else if (data?.response?.data?.error === "USER_ALREADY_EXIST") {
						setModal_alert("Malumot o'zgartirilmadi")
						setModal_msg("Bunday ta'minotchi allaqachon mavjud")
					} else {
						setModal_alert("Nomalum server xatolik")
						setModal_msg("Malumot o'zgartirib bo'lmadi")
					}
					setBtn_loading(false)
				})
			} else {
				let newDeliver = {
					deliver_name: name,
					deliver_nomer: phone.replace(/\D/g, ""),
					deliver_place: loc,
				}
				post("/deliver/deliver-post", newDeliver).then((data) => {
					if (data?.status === 201) {
						dispatch(addData(data?.data?.data))
						dispatch(setQuantity())
						buttonRef.current.click()
						setName("")
						setPhone("")
						setLoc("")
						setSubmitted(false)
						setModal_msg("Ta'minotchi muvoffaqiyatli qo'shildi")
						setModal_alert("Xabar")
					} else if (data?.response?.data?.error === "USER_ALREADY_EXIST") {
						setModal_alert("Malumot o'zgartirilmadi")
						setModal_msg("Bunday ta'minotchi allaqachon mavjud")
					} else {
						setModal_alert("Nomalum server xatolik")
						setModal_msg("Malumot o'zgartirib bo'lmadi")
					}
					setBtn_loading(false)
				})
			}
		}
	}

	const deleteDeliver = (id) => {
		dispatch(setLoading(true))
		remove(`/deliver/deliver-delete/${id}`).then((data) => {
			if (data?.status === 200) {
				getData()
				dispatch(setQuantity())
				setUser_id("")
				setModal_msg("Ta'minotchi o'chirildi")
				setModal_alert("Xabar")
			} else if (data?.response?.data?.error === "PRODUCT_FOUND") {
				setModal_alert("Ta'minotchi o'chirilmadi")
				setModal_msg("Bu ta'minotchida qarzdorlik mavjud")
			} else {
				setModal_alert("Nomalum server xatolik")
				setModal_msg("Malumot o'chirib bo'lmadi")
			}
			dispatch(setLoading(false))
		})
	}

	const editDeliver = (id) => {
		let divTop = document.querySelector(".content").scrollTop
		let scrollTop = setInterval(() => {
			divTop -= 20
			document.querySelector(".content").scrollTop = divTop

			if (divTop <= 0) {
				clearInterval(scrollTop)
			}
		}, 10)

		const index = state?.data.findIndex((item) => item.deliver_id === id)
		if (index !== -1) {
			setName(toggleClass ? "" : state?.data[index]?.deliver_name)
			setPhone(toggleClass ? "" : state?.data[index]?.deliver_nomer.slice(3))
			setLoc(toggleClass ? "" : state?.data[index]?.deliver_place)
			setObjId(id)
			buttonRef.current.click()
		}
	}

	return (
		<>
			{error_modal(modal_alert, modal_msg, modal_msg.length, setModal_msg)}

			<div className="deliverInfo">
				<i className="fa-solid fa-truck"></i> Ta'minotchilar soni:{" "}
				{searchSubmitted
					? filteredData?.length
					: state?.quantity
					? state?.quantity
					: 0}{" "}
				ta
			</div>

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
							{loc.length ? validation(!loc, "Manzil kiritish majburiy") : null}
						</div>
					</div>

					<div className="col p-0 mx-1">
						<br />
						<button
							className="btn btn-melissa"
							onClick={addNewDeliver}
							style={{ padding: "4px 10px" }}
							disabled={btn_loading}
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

			{state?.loading ? (
				<Loader />
			) : (
				<DeliverList
					data={searchSubmitted ? filteredData : state?.data}
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
