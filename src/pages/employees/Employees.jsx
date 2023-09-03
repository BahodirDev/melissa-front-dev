import { Input, Select } from "antd"
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
} from "../../components/reducers/users"
import { validation } from "../../components/validation"
import useApiRequest from "../../customHook/useUrl"
import EmployeeList from "./EmployeeList"
import "./employee.css"
const { Option } = Select

export default function Employees() {
	const request = useApiRequest()
	const [filteredUsers, setFilteredUsers] = useState([])
	const [btn_loading, setBtn_loading] = useState(false)
	const [modal_msg, setModal_msg] = useState("")
	const [modal_alert, setModal_alert] = useState("")
	const [user_id, setUser_id] = useState("")
	const [toggleClass, setToggleClass] = useState(false)
	const [new_name, setNew_name] = useState("")
	const [new_number, setNew_number] = useState("")
	const [new_job, setNew_job] = useState(0)
	const [new_login, setNew_login] = useState("")
	const [new_password, setNew_password] = useState("")
	const [objId, setObjId] = useState("")
	const buttonRef = useRef(null)
	const [submitted, setSubmitted] = useState(false)
	const [saerchInputValue] = useOutletContext()
	const state = useSelector((state) => state.users)
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(setLoading(true))
		let stores = state?.data.filter((item) =>
			item?.user_name.toLowerCase().includes(saerchInputValue.toLowerCase())
		)
		setFilteredUsers(stores)
		dispatch(setLoading(false))
	}, [saerchInputValue])

	const getData = () => {
		dispatch(setLoading(true))
		request("GET", `${process.env.REACT_APP_URL}/users/users-list`)
			.then((data) => {
				dispatch(setData(data))
				dispatch(setQuantity())
			})
			.catch((err) => console.error(err))
		dispatch(setLoading(false))
	}

	useEffect(getData, [])

	const addNewUser = () => {
		setSubmitted(true)
		if (
			new_name.length >= 3 &&
			new_job &&
			new_number.slice(18) !== "_" &&
			new_login.length >= 6 &&
			new_password.length >= 6
		) {
			setBtn_loading(true)
			let newUser = {
				user_name: new_name,
				user_nomer: new_number.replace(/\D/g, ""),
				user_role: new_job,
				user_login: new_login,
				user_password: new_password,
			}
			if (objId) {
				request(
					"PATCH",
					`${process.env.REACT_APP_URL}/users/users-patch/${objId}`,
					newUser
				)
					.then((data) => {
						dispatch(editData(data))
						buttonRef.current.click()
						setModal_alert("Xabar")
						setModal_msg("Hodim muvoffaqiyatli o'zgartirildi")
						setNew_name("")
						setNew_number("")
						setNew_job(0)
						setNew_login("")
						setNew_password("")
						setObjId("")
						setSubmitted(false)
					})
					.catch((err) => {
						console.log(err?.response?.data)
						if (err?.response?.data?.error === "USER_ALREADY_EXIST") {
							// if emp already exists
							setModal_alert("Xatolik")
							setModal_msg("Xodim allaqachon mavjud")
						} else {
							setModal_alert("Xatolik")
							setModal_msg("Xodim o'zgartirishda xatolik")
						}
					})
			} else {
				request(
					"POST",
					`${process.env.REACT_APP_URL}/users/users-post`,
					newUser
				)
					.then((data) => {
						dispatch(addData(data?.data))
						dispatch(setQuantity())
						buttonRef.current.click()
						setModal_alert("Xabar")
						setModal_msg("Hodim muvoffaqiyatli qo'shildi")
						setNew_name("")
						setNew_number("")
						setNew_job(0)
						setNew_login("")
						setNew_password("")
						setSubmitted(false)
					})
					.catch((err) => {
						console.log(err?.response?.data)
						if (err?.response?.data?.error === "USER_ALREADY_EXIST") {
							// if emp already exists
							setModal_alert("Xatolik")
							setModal_msg("Xodim allaqachon mavjud")
						} else {
							setModal_alert("Xatolik")
							setModal_msg("Xodim qo'shib bo'lmadi")
						}
					})
			}
			setBtn_loading(false)
		}
	}

	const deleteUser = (id) => {
		request("DELETE", `${process.env.REACT_APP_URL}/users/users-delete/${id}`)
			.then((data) => {
				getData()
				dispatch(setQuantity())
				setModal_alert("Xabar")
				setModal_msg("Hodim muvoffaqiyatli o'chirildi")
				setUser_id("")
			})
			.catch((err) => {
				// if (err.response.data.error === "") {
				// 	setModal_alert("Xatolik")
				// 	setModal_msg("Xodim o'chirib bo'lmadi")
				// } else {
				setModal_alert("Xatolik")
				setModal_msg("Xodim o'chirib bo'lmadi")
				// }
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
			setNew_job(0)
			setNew_login("")
			setNew_password("")
			setObjId("")
		} else {
			content.style.maxHeight = content.scrollHeight + "px"
		}
	}

	const editEmp = (id) => {
		// const obj = users.find((item) => item?.user_id === id)
		request("GET", `${process.env.REACT_APP_URL}/users/users-list/${id}`)
			.then((data) => {
				setNew_name(toggleClass ? "" : data[0]?.user_name)
				setNew_number(toggleClass ? "" : data[0]?.user_nomer.slice(3))
				setNew_login(toggleClass ? "" : data[0]?.user_login)
				setNew_password(toggleClass ? "" : data[0]?.user_password)
				setNew_job(toggleClass ? "" : data[0]?.user_role)
				setObjId(id)
				buttonRef.current.click()
			})
			.catch((error) => {
				console.log(error?.response?.data)
				if (error?.response?.data?.error === "USER_NOT_FOUND") {
					setModal_alert("Xatolik")
					setModal_msg("Hodim topilmadi")
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
				<div className="row px-2">
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
							type="text"
							format="+998 (##) ###-##-##"
							mask="_"
							value={new_number}
							onValueChange={(value) => setNew_number(value.formattedValue)}
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
							Kasb
						</label>

						<Select
							id="user-role"
							className="form-control__search"
							style={{ width: "100%" }}
							value={new_job.length ? new_job : null}
							placeholder="Kasblar"
							onChange={(e) => setNew_job(e)}
							optionLabelProp="label"
						>
							<Option value="1" label="Admin">
								Admin
							</Option>
							<Option value="2" label="Sotuvchi">
								Sotuvchi
							</Option>
							<Option value="3" label="Kassir">
								Kassir
							</Option>
						</Select>
						<div className="validation-field-error">
							{submitted && validation(!new_job, "Kasb tanlash majburiy")}
						</div>
					</div>
					<div className="col-2 p-0 mx-1 validation-field">
						<label className="mx-2" htmlFor="">
							Login
						</label>

						<Input
							type="text"
							placeholder="User123"
							value={new_login}
							onChange={(e) => setNew_login(e.target.value)}
						/>
						<div className="validation-field-error">
							{submitted && validation(!new_login, "Login kiritish majburiy")}
							{new_login.length
								? validation(
										new_login.length < 6,
										"Kamida 6 ta harf/belgi kerak"
								  )
								: null}
						</div>
					</div>
					<div className="col-2 p-0 mx-1 validation-field">
						<label className="mx-2" htmlFor="">
							Parol
						</label>
						<Input
							type="password"
							placeholder="user1234"
							value={new_password}
							onChange={(e) => setNew_password(e.target.value)}
						/>
						<div className="validation-field-error">
							{submitted &&
								validation(!new_password, "Parol kiritish majburiy")}
							{new_password.length
								? validation(new_password.length < 6, "Kuchsiz parol")
								: null}
						</div>
					</div>
					<div className="col p-0 mx-1">
						<br />
						<button
							className="btn btn-melissa"
							onClick={addNewUser}
							style={{ padding: "3px 10px" }}
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
			<div className="emp-info">
				<i className="fa-solid fa-user-tag"></i> Xodimlar soni:{" "}
				{state?.quantity ? state?.quantity : 0} ta
			</div>
			{state?.loading ? (
				<Loader />
			) : (
				<EmployeeList
					users={saerchInputValue.length ? filteredUsers : state?.data}
					user_id={user_id}
					setUser_id={setUser_id}
					deleteUser={deleteUser}
					editEmp={editEmp}
				/>
			)}
		</>
	)
}
