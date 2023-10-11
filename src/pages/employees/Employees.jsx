import { Input, Select } from "antd"
import { useEffect, useRef, useState } from "react"
import { PatternFormat } from "react-number-format"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useOutletContext } from "react-router-dom"
import { error_modal } from "../../components/error_modal/error_modal"
import Loader from "../../components/loader/Loader"
import {
	addData,
	editData,
	removeEmp,
	setData,
	setLoading,
	setQuantity,
} from "../../components/reducers/users"
import { validation } from "../../components/validation"
import { get, patch, post, remove } from "../../customHook/api"
import EmployeeList from "./EmployeeList"
import "./employee.css"
const { Option } = Select

export default function Employees() {
	const navigate = useNavigate()
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
	const [searchSubmitted, setSearchSubmitted] = useState(false)
	const [
		userInfo,
		action,
		setAction,
		showDropdown,
		setshowDropdown,
		setAddModalVisible,
		inputRef,
	] = useOutletContext()
	const state = useSelector((state) => state.users)
	const dispatch = useDispatch()

	useEffect(() => {
		setAction({
			url: "/users/users-search",
			body: {
				user_name: inputRef,
			},
			res: setFilteredUsers,
			submitted: setSearchSubmitted,
			clearValues: {},
			setLoading: setLoading,
		})
		// let stores = state?.data.filter((item) =>
		// 	item?.user_name.toLowerCase().includes(saerchInputValue.toLowerCase())
		// )
		// setFilteredUsers(stores)
	}, [inputRef.current?.value])

	const getData = () => {
		dispatch(setLoading(true))
		get("/users/users-list").then((data) => {
			if (Array.isArray(data?.data)) {
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
				patch(`/users/users-patch/${objId}`, newUser).then((data) => {
					if (data?.status === 200) {
						dispatch(editData(data?.data))
						buttonRef.current.click()
						setNew_name("")
						setNew_number("")
						setNew_job(0)
						setNew_login("")
						setNew_password("")
						setObjId("")
						setSubmitted(false)
						setModal_alert("Xabar")
						setModal_msg("Hodim muvoffaqiyatli o'zgartirildi")
						setTimeout(() => {
							if (objId === userInfo?.id) {
								// localStorage.clear()
								localStorage.removeItem("id")
								localStorage.removeItem("name")
								localStorage.removeItem("role")
								localStorage.removeItem("user")
								navigate("/login")
							}
						}, 1000)
					} else if (data?.response?.data?.error === "USER_ALREADY_EXIST") {
						setModal_alert("Malumot o'zgartirilmadi")
						setModal_msg("Bunday xodim allaqachon mavjud")
					} else {
						setModal_alert("Nomalum server xatolik")
						setModal_msg("Xodim o'zgartirib bo'lmadi")
					}
					setBtn_loading(false)
				})
			} else {
				post("/users/users-post", newUser).then((data) => {
					if (data?.status === 201) {
						dispatch(addData(data?.data?.data))
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
					} else if (data?.response?.data?.error === "USER_ALREADY_EXIST") {
						setModal_alert("Xodim qo'shilmadi")
						setModal_msg("Xodim allaqachon mavjud")
					} else {
						setModal_alert("Nomalum server xatolik")
						setModal_msg("Xodim qo'shib bo'lmadi")
					}
					setBtn_loading(false)
				})
			}
		}
	}

	const deleteUser = (id) => {
		dispatch(setLoading(true))
		remove(`/users/users-delete/${id}`).then((data) => {
			if (data?.status === 200) {
				dispatch(removeEmp(id))
				dispatch(setQuantity())
				setModal_alert("Xabar")
				setModal_msg("Hodim muvoffaqiyatli o'chirildi")
				setUser_id("")
			} else {
				setModal_alert("Nomalum server xatolik")
				setModal_msg("Xodim o'chirib bo'lmadi")
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
			setNew_job(0)
			setNew_login("")
			setNew_password("")
			setObjId("")
		} else {
			content.style.maxHeight = content.scrollHeight + "px"
		}
	}

	const editEmp = (id) => {
		let divTop = document.querySelector(".content").scrollTop
		let scrollTop = setInterval(() => {
			divTop -= 20
			document.querySelector(".content").scrollTop = divTop

			if (divTop <= 0) {
				clearInterval(scrollTop)
			}
		}, 10)

		const data = state?.data.find((item) => item?.user_id === id)
		if (data.user_id) {
			setNew_name(toggleClass ? "" : data?.user_name)
			setNew_number(toggleClass ? "" : data?.user_nomer.slice(3))
			setNew_login(toggleClass ? "" : data?.user_login)
			setNew_password(toggleClass ? "" : data?.user_password)
			setNew_job(toggleClass ? "" : data?.user_role)
			setObjId(id)
			buttonRef.current.click()
		}
	}

	return (
		<>
			{error_modal(modal_alert, modal_msg, modal_msg.length, setModal_msg)}

			<div className="emp-info">
				<i className="fa-solid fa-user-tag"></i> Xodimlar soni:{" "}
				{searchSubmitted
					? filteredUsers?.length
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
				<EmployeeList
					users={searchSubmitted ? filteredUsers : state?.data}
					user_id={user_id}
					setUser_id={setUser_id}
					deleteUser={deleteUser}
					editEmp={editEmp}
				/>
			)}
		</>
	)
}
