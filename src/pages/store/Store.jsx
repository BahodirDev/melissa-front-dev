import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useOutletContext } from "react-router-dom"
import Loader from "../../components/loader/Loader"
import {
	addData,
	editData,
	removeStore,
	setData,
	setLoading,
	setQuantity,
} from "../../components/reducers/store"
import { stringCheck } from "../../components/validation"
import { get, patch, post, remove } from "../../customHook/api"
import StoreList from "./StoreList"
import "./store.css"
import { toast } from "react-toastify"
import AddModal from "../../components/add/AddModal"
import { Factory, Info } from "@phosphor-icons/react"
import InfoItem from "../../components/info_item/InfoItem"
import Search from "../../components/search/Search"

export default function Store() {
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
	const state = useSelector((state) => state.store)
	const dispatch = useDispatch()

	const [filteredData, setFilteredData] = useState([])
	const [btn_loading, setBtn_loading] = useState(false)
	const [objId, setObjId] = useState("")
	const [submitted, setSubmitted] = useState(false)
	const [searchSubmitted, setSearchSubmitted] = useState(false)

	// new data
	const [storeName, setStoreName] = useState("")

	useEffect(() => {
		dispatch(setLoading(true))
		get("/store/store-list").then((data) => {
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
			post("/store/store-search", {
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

	const addNewStore = () => {
		setSubmitted(true)
		if (storeName.length) {
			setBtn_loading(true)
			if (objId) {
				patch(`/store/store-patch/${objId}`, {
					store_name: storeName.trim(),
				}).then((data) => {
					if (data?.status === 201) {
						dispatch(editData(data?.data))
						clearAndClose()
						toast.success("Malumot muvoffaqiyatli o'zgartirildi")
					} else if (data?.response?.data?.error === "STORE_ALREADY_EXIST") {
						toast.warn("Bunday ombor allaqachon mavjud")
					} else {
						toast.error("Nomalum server xatolik")
					}
					setBtn_loading(false)
				})
			} else {
				post("/store/store-post", { store_name: storeName }).then((data) => {
					if (data?.status === 201) {
						dispatch(addData(data?.data))
						dispatch(setQuantity())
						clearAndClose()
						toast.success("Ombor muvoffaqiyatli qo'shildi")
					} else if (data?.response?.data?.error === "STORE_ALREADY_EXIST") {
						toast.warn("Bunday ombor allaqachon mavjud")
					} else {
						toast.error("Nomalum server xatolik")
					}
					setBtn_loading(false)
				})
			}
		}
	}

	const deleteStore = (id) => {
		dispatch(setLoading(true))
		remove(`/store/store-delete/${id}`).then((data) => {
			if (data?.status === 200) {
				dispatch(removeStore(id))
				dispatch(setQuantity())
				toast.success("Ombor muvoffaqiyatli o'chirildi")
				clearAndClose()
			} else if (data?.response?.data?.error === "PRODUCT_FOUND") {
				toast.warn("Omborda maxsulot borligi uchun o'chirilmadi")
			} else {
				toast.error("Nomalum server xatolik")
			}
			dispatch(setLoading(false))
		})
	}

	const editStore = (id) => {
		const index = state?.data.findIndex((item) => item.store_id === id)
		if (index !== -1) {
			setStoreName(state?.data[index]?.store_name)
			setObjId(id)
			setAddModalDisplay("block")
			setAddModalVisible(true)
		} else {
			toast.error("Nomalum server xatolik")
		}
	}

	const clearAndClose = () => {
		setStoreName("")
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
				name={objId ? "Ombor tahrirlash" : "Ombor qo'shish"}
			>
				<div
					className={`input-wrapper modal-form regular 
					${submitted && stringCheck(storeName.trim()) !== null && "error"}
					`}
				>
					<label>Ombor nomi</label>
					<input
						type="text"
						placeholder="Ombor nomini kiriting"
						className="input"
						value={storeName}
						onChange={(e) => setStoreName(e.target.value)}
					/>
					{submitted && stringCheck(storeName.trim()) !== null && (
						<Info size={20} />
					)}
					<div className="validation-field">
						<span>
							{submitted &&
								stringCheck(storeName.trim(), "Nom kiritish majburiy")}
						</span>
					</div>
				</div>
				<div className="modal-btn-group">
					<button
						className="primary-btn"
						disabled={btn_loading}
						onClick={addNewStore}
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
					name="Omborlar soni"
					icon={<Factory size={24} color="var(--color-primary)" />}
					iconBgColor={"var(--bg-icon)"}
				/>
			</div>

			<Search handleSearch={handleSearch} clearSearch={clearSearch} />

			{state?.loading ? (
				<Loader />
			) : (
				<StoreList
					data={searchSubmitted ? filteredData : state?.data}
					deleteStore={deleteStore}
					editStore={editStore}
					showDropdown={showDropdown}
					setshowDropdown={setshowDropdown}
				/>
			)}
		</>
	)
}
