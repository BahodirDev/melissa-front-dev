import { useEffect, useState } from "react"
import { PatternFormat } from "react-number-format"
import { useDispatch, useSelector } from "react-redux"
import { useOutletContext } from "react-router-dom"
import Loader from "../../components/loader/Loader"
import {
	addData,
	editData,
	removeDeliver,
	setData,
	setLoading,
	setQuantity,
} from "../../components/reducers/deliver"
import { phoneNumberCheck, stringCheck } from "../../components/validation"
import { get, patch, post, remove } from "../../customHook/api"
import DeliverList from "./DeliverList"
import "./deliver.css"
import AddModal from "../../components/add/AddModal"
import InfoItem from "../../components/info_item/InfoItem"
import { Info, Truck } from "@phosphor-icons/react"
import Search from "../../components/search/Search"
import { toast } from "react-toastify"

function Deliver() {
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
	const state = useSelector((state) => state.deliver)
	const dispatch = useDispatch()

	const [filteredData, setFilteredData] = useState([])
	const [btn_loading, setBtn_loading] = useState(false)
	const [objId, setObjId] = useState("")
	const [submitted, setSubmitted] = useState(false)
	const [searchSubmitted, setSearchSubmitted] = useState(false)
	// new data
	const [name, setName] = useState("")
	const [phone, setPhone] = useState("")
	const [loc, setLoc] = useState("")

	useEffect(() => {
		dispatch(setLoading(true))
		get("/deliver/deliver-list").then((data) => {
			if (data?.status === 201) {
				dispatch(setData(data?.data))
				dispatch(setQuantity())
			} else {
				toast.error("Nomalum server xatolik")
			}
			dispatch(setLoading(false))
		})
	}, [])

	const handleSearch = () => {
		if (inputRef.current?.value.length > 0) {
			dispatch(setLoading(true))
			setSearchSubmitted(true)
			post("/deliver/deliver-search", {
				search: inputRef.current?.value,
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

	const addNewDeliver = () => {
		setSubmitted(true)
		if (name.length && phone.slice(18) !== "_") {
			setBtn_loading(true)
			let obj = {
				deliver_name: name.trim(),
				deliver_nomer: phone.replace(/\D/g, ""),
				deliver_place: loc,
			}
			if (objId) {
				patch(`/deliver/deliver-patch/${objId}`, obj).then((data) => {
					if (data?.status === 200) {
						dispatch(editData(data?.data?.data))
						clearAndClose()
						toast.success("Malumot muvoffaqiyatli o'zgartirildi")
					} else if (data?.response?.data?.error === "USER_ALREADY_EXIST") {
						toast.warn("Bunday ta'minotchi allaqachon mavjud")
					} else {
						toast.error("Nomalum server xatolik")
					}
					setBtn_loading(false)
				})
			} else {
				post("/deliver/deliver-post", obj).then((data) => {
					if (data?.status === 201) {
						dispatch(addData(data?.data?.data))
						dispatch(setQuantity())
						clearAndClose()
						toast.success("Ta'minotchi muvoffaqiyatli qo'shildi")
					} else if (data?.response?.data?.error === "USER_ALREADY_EXIST") {
						toast.warn("Bunday ta'minotchi allaqachon mavjud")
					} else {
						toast.error("Nomalum server xatolik")
					}
					setBtn_loading(false)
				})
			}
		}
	}

	const deleteSup = (id) => {
		dispatch(setLoading(true))
		remove(`/deliver/deliver-delete/${id}`).then((data) => {
			if (data?.status === 200) {
				dispatch(removeDeliver(id))
				dispatch(setQuantity())
				toast.success("Ta'minotchi muvoffaqiyatli o'chirildi")
				clearAndClose()
			} else if (data?.response?.data?.error === "PRODUCT_FOUND") {
				toast.warn("Bu ta'minotchida qarzdorlik mavjud")
			} else {
				toast.error("Nomalum server xatolik")
			}
			dispatch(setLoading(false))
		})
	}

	const editSup = (id) => {
		const index = state?.data.findIndex((item) => item.deliver_id === id)
		if (index !== -1) {
			setName(state?.data[index]?.deliver_name)
			setPhone(state?.data[index]?.deliver_nomer.slice(3))
			setLoc(state?.data[index]?.deliver_place)
			setObjId(id)
			setAddModalDisplay("block")
			setAddModalVisible(true)
		} else {
			toast.error("Nomalum server xatolik")
		}
	}

	const clearAndClose = () => {
		setName("")
		setPhone("")
		setLoc("")
		setObjId("")
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
				name={objId ? "Ta'minotchi tahrirlash" : "Ta'minotchi qo'shish"}
			>
				<div
					className={`input-wrapper modal-form regular 
					${submitted && stringCheck(name.trim()) !== null && "error"}
					`}
				>
					<label>Ta'minotchi ismi</label>
					<input
						type="text"
						placeholder="Ta'minotchi ismini kiriting"
						className="input"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					{submitted && stringCheck(name.trim()) !== null && <Info size={20} />}
					<div className="validation-field">
						<span>
							{submitted && stringCheck(name.trim(), "Ism kiritish majburiy")}
						</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form regular 
					${submitted && phoneNumberCheck(phone) !== null && "error"}
					`}
				>
					<label>Telefon raqam kiriting</label>
					<PatternFormat
						type="text"
						placeholder="+998(__) ___-__-__"
						className="input"
						format="+998 (##) ###-##-##"
						mask="_"
						value={phone}
						onValueChange={(value) => setPhone(value.formattedValue)}
					/>
					{submitted && phoneNumberCheck(phone) !== null && <Info size={20} />}
					<div className="validation-field">
						<span>{submitted && phoneNumberCheck(phone)}</span>
					</div>
				</div>
				<div className="input-wrapper modal-form regular">
					<label>Manzil kiriting</label>
					<textarea
						placeholder="Manzil"
						className="desc-input"
						value={loc}
						onChange={(e) => setLoc(e.target.value)}
					></textarea>
				</div>
				<div className="modal-btn-group">
					<button
						className="primary-btn"
						disabled={btn_loading}
						onClick={addNewDeliver}
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
					name="Ta'minotchilar soni"
					icon={<Truck size={24} style={{ color: "var(--color-primary)" }} />}
					iconBgColor={"var(--bg-icon)"}
				/>
			</div>

			<Search handleSearch={handleSearch} clearSearch={clearSearch} />

			{state?.loading ? (
				<Loader />
			) : (
				<DeliverList
					data={searchSubmitted ? filteredData : state?.data}
					deleteSup={deleteSup}
					editSup={editSup}
					showDropdown={showDropdown}
					setshowDropdown={setshowDropdown}
					miniModal={miniModal}
					setMiniModal={setMiniModal}
				/>
			)}
		</>
	)
}
export default Deliver
