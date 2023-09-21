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
} from "../../components/reducers/client"
import { validation } from "../../components/validation"
import { get, patch, post, remove } from "../../customHook/api"
import useApiRequest from "../../customHook/useUrl"
import ClientList from "./ClientList"
import "./client.css"

export default function Employees() {
	const request = useApiRequest()
	const [
		saerchInputValue,
		setSearchInput,
		sidebar,
		userInfo,
		action,
		setAction,
	] = useOutletContext()
	const [modal_alert, setModal_alert] = useState("")
	const [modal_msg, setModal_msg] = useState("")
	const [toggleClass, setToggleClass] = useState(false)
	const [new_name, setNew_name] = useState("")
	const [new_number, setNew_number] = useState("")
	const [desc, setDesc] = useState("")
	const [btn_loading, setBtn_loading] = useState(false)
	const [userId, setUserId] = useState(0)
	const [filteredData, setFilteredData] = useState([])
	const [toggleDesc, setToggleDesc] = useState(0)
	const [objId, setObjId] = useState("")
	const buttonRef = useRef(null)
	const [submitted, setSubmitted] = useState(false)
	const state = useSelector((state) => state.client)
	const dispatch = useDispatch()
	const [searchSubmitted, setSearchSubmitted] = useState(false)

	// search by name or number. !!!should be moved to backend
	useEffect(() => {
		setAction({
			url: "/clients/clients-search",
			body: {
				client_name: saerchInputValue,
			},
			res: setFilteredData,
			submitted: setSearchSubmitted,
			clearValues: {},
			setLoading: setLoading,
		})
	}, [saerchInputValue])

	const getData = () => {
		dispatch(setLoading(true))
		get("/clients/clients-list").then((data) => {
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

	const addNewClient = () => {
		setSubmitted(true)
		if (new_name.length >= 3 && desc && new_number.slice(18) !== "_") {
			setBtn_loading(true)
			let newClient = {
				clients_name: new_name,
				clients_nomer: new_number.replace(/\D/g, ""),
				clients_desc: desc,
			}
			if (objId) {
				patch(`/clients/clients-patch/${objId}`, newClient).then((data) => {
					if (data?.status === 201) {
						dispatch(editData(data?.data))
						buttonRef.current.click()
						setModal_alert("Xabar")
						setModal_msg("Mijoz muvoffaqiyatli o'zgartirildi")
						setNew_name("")
						setNew_number("")
						setDesc("")
						setObjId("")
						setSubmitted(false)
					} else if (data?.response?.data?.error === "CLIENTS_ALREADY_EXIST") {
						setModal_alert("Xatolik")
						setModal_msg("Mijoz allaqachon mavjud")
					} else {
						setModal_alert("Nomalum server xatolik")
						setModal_msg("Malumot o'zgartirib bo'lmadi")
					}
					setBtn_loading(false)
				})
			} else {
				post("/clients/clients-post", newClient).then((data) => {
					if (data?.status === 201) {
						dispatch(addData(data?.data))
						dispatch(setQuantity())
						buttonRef.current.click()
						setModal_alert("Xabar")
						setModal_msg("Mijoz muvoffaqiyatli qo'shildi")
						setNew_name("")
						setNew_number("")
						setDesc("")
						setSubmitted(false)
					} else if (data?.response?.data?.error === "CLIENTS_ALREADY_EXIST") {
						setModal_alert("Xatolik")
						setModal_msg("Mijoz allaqachon mavjud")
					} else {
						setModal_alert("Nomalum server xatolik")
						setModal_msg("Malumot qo'shib bo'lmadi")
					}
					setBtn_loading(false)
				})
			}
		}
	}

	const deleteClient = (id) => {
		dispatch(setLoading(true))
		remove(`/clients/clients-delete/${id}`).then((data) => {
			if (data?.status === 200) {
				getData()
				dispatch(setQuantity())
				setModal_alert("Xabar")
				setModal_msg("Mijoz muvoffaqiyatli o'chirildi")
				setUserId(0)
			} else {
				setModal_alert("Nomalum server xatolik")
				setModal_msg("Malumot o'chirib bo'lmadi")
			}
			dispatch(setLoading(false))
		})
	}

	const collapse = (event) => {
		setSubmitted(false)
		setToggleClass(!toggleClass)
		let content = event.target.nextElementSibling
		if (content.style.maxHeight) {
			content.style.maxHeight = null
			setNew_name("")
			setNew_number("")
			setDesc("")
			setObjId("")
		} else {
			content.style.maxHeight = content.scrollHeight + "px"
		}
	}

	const editClient = (id) => {
		let divTop = document.querySelector(".content").scrollTop
		let scrollTop = setInterval(() => {
			divTop -= 20
			document.querySelector(".content").scrollTop = divTop

			if (divTop <= 0) {
				clearInterval(scrollTop)
			}
		}, 10)

		const index = state?.data.findIndex((item) => item?.clients_id === id)
		if (index !== -1) {
			setNew_name(state?.data[index]?.clients_name)
			setNew_number(state?.data[index]?.clients_nomer.slice(3))
			setDesc(state?.data[index]?.clients_desc)
			setObjId(id)
			buttonRef.current.click()
		}
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
							placeholder="Ism"
							value={new_name}
							onChange={(e) => setNew_name(e.target.value)}
						/>
						<div className="validation-field-error">
							{submitted && validation(!new_name, "Ism kiritish majburiy")}
							{new_name.length
								? validation(new_name.length < 3, "Kamida 3 ta harf kerak")
								: null}
						</div>
					</div>
					<div className="col-2 p-0 mx-1 validation-field">
						<label className="mx-2" htmlFor="">
							Tel nomer
						</label>
						<PatternFormat
							className="phone-number-input"
							placeholder="+998(__) ___-__-__"
							type="tel"
							format="+998 (##) ###-##-##"
							mask="_"
							value={new_number}
							onValueChange={(value) => setNew_number(value.formattedValue)}
							required
						/>
						<div className="validation-field-error">
							{submitted && validation(!new_number, "Raqam kiritish majburiy")}
							{new_number.length
								? validation(new_number.slice(-1) === "_", "Noto'g'ri raqam")
								: null}
						</div>
					</div>
					<div className="col-2 p-0 mx-1 validation-field">
						<label className="mx-2" htmlFor="">
							Izoh
						</label>
						<Input
							type="text"
							placeholder="Izoh"
							value={desc}
							onChange={(e) => setDesc(e.target.value)}
						/>
						<div className="validation-field-error">
							{submitted && validation(!desc, "Izoh kiritish majburiy")}
							{desc.length
								? validation(!desc.length, "Izoh kiritish majburiy")
								: null}
						</div>
					</div>

					<div className="col p-0 mx-1">
						<br />
						<button
							disabled={btn_loading}
							className="btn btn-melissa"
							onClick={addNewClient}
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
			<div className="clients-info">
				<i className="fa-solid fa-users"></i> Mijozlar soni:{" "}
				{state?.quantity ? state?.quantity : 0} ta
			</div>
			{state?.loading ? (
				<Loader />
			) : (
				<ClientList
					data={searchSubmitted ? filteredData : state?.data}
					deleteClient={deleteClient}
					toggleDesc={toggleDesc}
					setToggleDesc={setToggleDesc}
					editClient={editClient}
				/>
			)}
		</>
	)
}
