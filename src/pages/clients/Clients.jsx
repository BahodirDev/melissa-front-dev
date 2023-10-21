import { useEffect, useState } from "react"
import { PatternFormat } from "react-number-format"
import { useDispatch, useSelector } from "react-redux"
import { useOutletContext } from "react-router-dom"
import Loader from "../../components/loader/Loader"
import {
	addData,
	editData,
	removeDebt,
	setData,
	setLoading,
	setQuantity,
} from "../../components/reducers/client"
import {
	phoneNumberCheck,
	stringCheck,
} from "../../components/validation"
import { get, patch, post, remove } from "../../customHook/api"
import ClientList from "./ClientList"
import "./client.css"
import { toast } from "react-toastify"
import Search from "../../components/search/Search"
import InfoItem from "../../components/info_item/InfoItem"
import { Info, UsersFour } from "@phosphor-icons/react"
import AddModal from "../../components/add/AddModal"

export default function Employees() {
	const [
		inputRef,
		showDropdown,
		setshowDropdown,
		addModalVisible,
		setAddModalVisible,
		addModalDisplay,
		setAddModalDisplay,
		miniModal,
		setMiniModal,
	] = useOutletContext()

	const [new_name, setNew_name] = useState("")
	const [new_number, setNew_number] = useState("")
	const [desc, setDesc] = useState("")
	const [btn_loading, setBtn_loading] = useState(false)
	const [filteredData, setFilteredData] = useState([])
	const [objId, setObjId] = useState("")
	const [submitted, setSubmitted] = useState(false)
	const state = useSelector((state) => state.client)
	const dispatch = useDispatch()
	const [searchSubmitted, setSearchSubmitted] = useState(false)

	useEffect(() => {
		dispatch(setLoading(true))
		get("/clients/clients-list").then((data) => {
			if (data?.status === 201 || data?.status === 200) {
				dispatch(setData(data?.data))
				dispatch(setQuantity())
			} else {
				toast.error("Nomalur server xatolik")
			}
			dispatch(setLoading(false))
		})
	}, [])

	const handleSearch = () => {
		if (inputRef.current?.value.length > 0) {
			dispatch(setLoading(true))
			setSearchSubmitted(true)
			post("/clients/clients-search", {
				client_name: inputRef.current?.value,
			}).then((data) => {
				if (data.status === 200) {
					setFilteredData(data?.data)
				} else {
					toast.error("Nomalum server xatolik")
				}
				dispatch(setLoading(false))
			})
		} else {
			setSearchSubmitted(false)
			setFilteredData([])
		}
	}

	const clearSearch = () => {
		setSearchSubmitted(false)
		setFilteredData([])
		inputRef.current.value = ""
	}

	const addNewClient = () => {
		setSubmitted(true)
		if (new_name.length && new_number.slice(18) !== "_") {
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
						clearAndClose()
						toast.success("Mijoz muvoffaqiyatli o'zgartirildi")
					} else if (data?.response?.data?.error === "CLIENTS_ALREADY_EXIST") {
						toast.warn("Bunday mijoz allaqachon mavjud")
					} else {
						toast.error("Nomalum server xatolik")
					}
					setBtn_loading(false)
				})
			} else {
				post("/clients/clients-post", newClient).then((data) => {
					if (data?.status === 201) {
						dispatch(addData(data?.data))
						dispatch(setQuantity())
						clearAndClose()
						toast.success("Mijoz muvoffaqiyatli qo'shildi")
					} else if (data?.response?.data?.error === "CLIENTS_ALREADY_EXIST") {
						toast.warn("Bunday mijoz allaqachon mavjud")
					} else {
						toast.error("Nomalum server xatolik")
					}
					setBtn_loading(false)
				})
			}
		}
	}

	const editClient = (id) => {
		const index = state?.data.findIndex((item) => item?.clients_id === id)
		if (index !== -1) {
			setNew_name(state?.data[index]?.clients_name)
			setNew_number(state?.data[index]?.clients_nomer.slice(3))
			setDesc(state?.data[index]?.clients_desc)
			setObjId(id)
			setAddModalDisplay("block")
			setAddModalVisible(true)
		} else {
			toast.error("Nomalum server xatolik")
		}
	}

	const clearAndClose = () => {
		setNew_name("")
		setNew_number("")
		setDesc("")
		setObjId("")
		setSubmitted(false)
		setAddModalVisible(false)
		setTimeout(() => {
			setAddModalDisplay("none")
		}, 300)
	}

	const deleteClient = (id) => {
		dispatch(setLoading(true))
		remove(`/clients/clients-delete/${id}`).then((data) => {
			if (data?.status === 200) {
				dispatch(removeDebt(id))
				dispatch(setQuantity())
				toast.success("Mijoz muvoffaqiyatli o'chirildi")
			} else if (data?.response?.data?.error === "DEBTS_EXIST") {
				toast.warn("Bu mijozda qarzdorlik mavjud")
			} else {
				toast.error("Nomalum server xatolik")
			}
			dispatch(setLoading(false))
		})
		clearAndClose()
	}

	return (
		<>
			<AddModal
				addModalVisible={addModalVisible}
				setAddModalVisible={setAddModalVisible}
				addModalDisplay={addModalDisplay}
				setAddModalDisplay={setAddModalDisplay}
				name={objId ? "Mijoz tahrirlash" : "Mijoz qo'shish"}
			>
				<div
					className={`input-wrapper modal-form regular 
					${submitted && stringCheck(new_name) !== null && "error"}
					`}
				>
					<label>Mijoz ismi</label>
					<input
						type="text"
						placeholder="Mijoz ismini kiriting"
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
					<label>Telefon raqam kiriting</label>
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
				<div className="input-wrapper modal-form regular">
					<label>Izoh</label>
					<textarea
						placeholder="Izoh"
						className="desc-input"
						value={desc}
						onChange={(e) => setDesc(e.target.value)}
					></textarea>
				</div>
				<div className="modal-btn-group">
					<button
						className="primary-btn"
						disabled={btn_loading}
						onClick={addNewClient}
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
					value={searchSubmitted ? filteredData.length : state?.quantity}
					name="Mijozlar soni"
					icon={
						<UsersFour size={24} style={{ color: "var(--color-primary)" }} />
					}
					iconBgColor={"var(--bg-icon)"}
				/>
			</div>

			<Search handleSearch={handleSearch} clearSearch={clearSearch} />

			{state?.loading ? (
				<Loader />
			) : (
				<ClientList
					data={searchSubmitted ? filteredData : state?.data}
					deleteClient={deleteClient}
					editClient={editClient}
					showDropdown={showDropdown}
					setshowDropdown={setshowDropdown}
					miniModal={miniModal}
					setMiniModal={setMiniModal}
				/>
			)}
		</>
	)
}
