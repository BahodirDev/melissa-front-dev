import { Select } from "antd"
import { useEffect, useRef, useState } from "react"
import { PatternFormat } from "react-number-format"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useOutletContext } from "react-router-dom"
import Loader from "../../components/loader/Loader"
import {
	addData,
	editData,
	removeEmp,
	setData,
	setLoading,
	setQuantity,
} from "../../components/reducers/users"
import {
	passwordCheck,
	phoneNumberCheck,
	stringCheck,
} from "../../components/validation"
import { get, patch, post, remove } from "../../customHook/api"
import EmployeeList from "./EmployeeList"
import "./employee.css"
import InfoItem from "../../components/info_item/InfoItem"
import { CaretDown, Info, Users } from "@phosphor-icons/react"
import Search from "../../components/search/Search"
import AddModal from "../../components/add/AddModal"
import { toast } from "react-toastify"

export default function Employees() {
	const navigate = useNavigate()
	const [filteredUsers, setFilteredUsers] = useState([])
	const [btn_loading, setBtn_loading] = useState(false)

	const [new_name, setNew_name] = useState("")
	const [new_number, setNew_number] = useState("")
	const [new_job, setNew_job] = useState(0)
	const [new_login, setNew_login] = useState("")
	const [new_password, setNew_password] = useState("")

	const [objId, setObjId] = useState("")
	const [submitted, setSubmitted] = useState(false)
	const [searchSubmitted, setSearchSubmitted] = useState(false)
	const [
		inputRef,
		showDropdown,
		setshowDropdown,
		addModalVisible,
		setAddModalVisible,
		addModalDisplay,
		setAddModalDisplay,
	] = useOutletContext()
	const state = useSelector((state) => state.users)
	const dispatch = useDispatch()
	const [userId, setUserId] = useState()

	const getData = () => {
		dispatch(setLoading(true))
		get("/users/users-list").then((data) => {
			if (Array.isArray(data?.data)) {
				dispatch(setData(data?.data))
				dispatch(setQuantity())
			} else {
				toast.error("Nomalum server xatolik")
			}
			dispatch(setLoading(false))
		})
	}

	useEffect(() => {
		if (localStorage.getItem("role") !== "1") navigate("/*")
		setUserId(localStorage.getItem("id"))
		getData()
	}, [])

	const addNewUser = () => {
		setSubmitted(true)
		if (
			new_name.length &&
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
						clearAndClose()
						setSubmitted(false)
						toast.success("Hodim muvoffaqiyatli o'zgartirildi")
						setTimeout(() => {
							if (objId === userId) {
								// localStorage.clear()
								localStorage.removeItem("id")
								localStorage.removeItem("name")
								localStorage.removeItem("role")
								localStorage.removeItem("user")
								navigate("/login")
							}
						}, 1000)
					} else if (data?.response?.data?.error === "USER_ALREADY_EXIST") {
						toast.warn("Bunday xodim allaqachon mavjud")
					} else {
						toast.error("Nomalum server xatolik")
					}
					setBtn_loading(false)
				})
			} else {
				post("/users/users-post", newUser).then((data) => {
					if (data?.status === 201) {
						dispatch(addData(data?.data?.data))
						dispatch(setQuantity())
						toast.success("Hodim muvoffaqiyatli qo'shildi")
						clearAndClose()
					} else if (data?.response?.data?.error === "USER_ALREADY_EXIST") {
						toast.warn("Bunday xodim allaqachon mavjud")
					} else {
						toast.error("Nomalum server xatolik")
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
				toast.success("Hodim muvoffaqiyatli o'chirildi")
			} else {
				toast.error("Nomalum server xatolik")
			}
			dispatch(setLoading(false))
		})
	}

	const editEmp = (id) => {
		const data = state?.data.find((item) => item?.user_id === id)
		if (data.user_id) {
			setNew_name(data?.user_name)
			setNew_number(data?.user_nomer.slice(3))
			setNew_login(data?.user_login)
			setNew_password(data?.user_password)
			setNew_job(data?.user_role)
			setObjId(id)
			setAddModalDisplay("block")
			setAddModalVisible(true)
		} else {
			toast.error("Nomalum server xatolik")
		}
	}

	const handleSearch = () => {
		if (inputRef.current?.value.length > 0) {
			dispatch(setLoading(true))
			setSearchSubmitted(true)
			post("/users/users-search", { user_name: inputRef.current?.value }).then(
				(data) => {
					if (data.status === 200) {
						setFilteredUsers(data?.data)
					}
					dispatch(setLoading(false))
				}
			)
		} else {
			setSearchSubmitted(false)
			setFilteredUsers([])
		}
	}

	const clearSearch = () => {
		setSearchSubmitted(false)
		setFilteredUsers([])
		inputRef.current.value = ""
	}

	const clearAndClose = () => {
		setNew_name("")
		setNew_number("")
		setNew_job(0)
		setNew_login("")
		setNew_password("")
		setSubmitted(false)
		setAddModalVisible(false)
		setTimeout(() => {
			setAddModalDisplay("none")
		}, 300)
	}

	return (
		<>
			<AddModal
				addModalVisible={addModalVisible}
				setAddModalVisible={setAddModalVisible}
				addModalDisplay={addModalDisplay}
				setAddModalDisplay={setAddModalDisplay}
				name="Xodim qo'shish"
			>
				<div
					className={`input-wrapper modal-form regular 
					${submitted && stringCheck(new_name) !== null && "error"}
					`}
				>
					<label>Xodim ismi</label>
					<input
						type="text"
						placeholder="Xodim ismini kiriting"
						className="input"
						value={new_name}
						onChange={(e) => setNew_name(e.target.value)}
					/>
					{submitted && stringCheck(new_name) !== null && <Info size={20} />}
					<div className="validation-field">
						<span>
							{submitted && stringCheck(new_name, "Ism kiritish majburiy")}
						</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form regular 
					${submitted && phoneNumberCheck(new_number) !== null && "error"}
					`}
				>
					<label>Xodim ismi</label>
					<PatternFormat
						type="text"
						placeholder="+998(__) ___-__-__"
						className="input"
						format="+998 (##) ###-##-##"
						mask="_"
						value={new_number}
						onValueChange={(value) => setNew_number(value.formattedValue)}
					/>
					{submitted && phoneNumberCheck(new_number) !== null && (
						<Info size={20} />
					)}
					<div className="validation-field">
						<span>{submitted && phoneNumberCheck(new_number)}</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form ${
						submitted && stringCheck(new_job) !== null && "error"
					}`}
				>
					<label>Kasbi</label>
					<Select
						allowClear
						className="select"
						placeholder="Kasbini tanlang"
						suffixIcon={
							submitted && stringCheck(new_job) !== null ? (
								<Info size={20} />
							) : (
								<CaretDown size={16} />
							)
						}
						value={new_job?.length ? new_job : null}
						onChange={(e) => setNew_job(e)}
					>
						<Select.Option value="1">Admin</Select.Option>
						<Select.Option value="2">Sotuvchi</Select.Option>
						<Select.Option value="3">Kassir</Select.Option>
					</Select>
					<div className="validation-field">
						<span>
							{submitted && stringCheck(new_job, "Kasb tanlash majburiy")}
						</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form regular 
					${submitted && passwordCheck(new_login) !== null && "error"}
					`}
				>
					<label>Login</label>
					<input
						type="text"
						placeholder="Login"
						className="input"
						value={new_login}
						onChange={(e) => setNew_login(e.target.value)}
					/>
					{submitted && passwordCheck(new_login) !== null && <Info size={20} />}
					<div className="validation-field">
						<span>{submitted && passwordCheck(new_login, "Login")}</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form regular 
					${submitted && passwordCheck(new_password) !== null && "error"}
					`}
				>
					<label>Parol</label>
					<input
						type="text"
						placeholder="Parol"
						className="input"
						value={new_password}
						onChange={(e) => setNew_password(e.target.value)}
					/>
					{submitted && passwordCheck(new_password) !== null && (
						<Info size={20} />
					)}
					<div className="validation-field">
						<span>{submitted && passwordCheck(new_password, "Parol")}</span>
					</div>
				</div>
				<div className="modal-btn-group">
					<button
						className="primary-btn"
						disabled={btn_loading}
						onClick={addNewUser}
					>
						{objId ? "Saqlash" : "Qo'shish"}{" "}
						{btn_loading && (
							<span
								className="spinner-grow spinner-grow-sm"
								role="status"
								aria-hidden="true"
								style={{ marginLeft: "5px" }}
							></span>
						)}
					</button>
					<button className="secondary-btn" onClick={clearAndClose}>
						Bekor qilish
					</button>
				</div>
			</AddModal>

			<div className="info-wrapper">
				<InfoItem
					value={searchSubmitted ? filteredUsers.length : state?.quantity}
					name="Xodimlar soni"
					icon={<Users size={24} style={{ color: "var(--color-primary)" }} />}
					iconBgColor={"var(--bg-icon)"}
				/>
			</div>

			<Search handleSearch={handleSearch} clearSearch={clearSearch} />

			{state?.loading ? (
				<Loader />
			) : (
				<EmployeeList
					data={searchSubmitted ? filteredUsers : state?.data}
					deleteEmp={deleteUser}
					editEmp={editEmp}
					showDropdown={showDropdown}
					setshowDropdown={setshowDropdown}
				/>
			)}
		</>
	)
}
