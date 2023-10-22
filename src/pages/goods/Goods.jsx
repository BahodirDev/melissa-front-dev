import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useOutletContext } from "react-router-dom"
import Loader from "../../components/loader/Loader"
import {
	addData,
	editData,
	removeGood,
	setData,
	setLoading,
	setQuantity,
} from "../../components/reducers/good"
import { stringCheck } from "../../components/validation"
import { get, patch, post, remove } from "../../customHook/api"
import GoodsList from "./GoodsList"
import "./goods.css"
import { toast } from "react-toastify"
import Search from "../../components/search/Search"
import AddModal from "../../components/add/AddModal"
import InfoItem from "../../components/info_item/InfoItem"
import { Info, SquaresFour } from "@phosphor-icons/react"

export default function Goods() {
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
	const state = useSelector((state) => state.good)
	const dispatch = useDispatch()

	// filter
	const [filteredData, setFilteredData] = useState([])
	const [btn_loading, setBtn_loading] = useState(false)
	const [objId, setObjId] = useState("")
	const [submitted, setSubmitted] = useState(false)
	const [searchSubmitted, setSearchSubmitted] = useState(false)

	// new
	const [newGoodName, setNewGoodName] = useState("")
	const [newGoodCode, setNewGoodCode] = useState("")

	useEffect(() => {
		dispatch(setLoading(true))
		get("/goods/goods-list").then((data) => {
			if (data?.status === 201) {
				dispatch(setData(data?.data))
				dispatch(setQuantity())
			} else {
				toast.error("Nomalum server xatolik")
			}
			dispatch(setLoading(false))
		})
	}, [])

	const addGood = () => {
		setSubmitted(true)
		if (newGoodName && newGoodCode) {
			setBtn_loading(true)
			let newObj = {
				goods_name: newGoodName.trim(),
				goods_code: newGoodCode.trim(),
			}
			if (objId) {
				patch(`/goods/goods-patch/${objId}`, newObj).then((data) => {
					if (data?.status === 201) {
						dispatch(editData(data?.data))
						clearAndClose()
						toast.success("Kategoriya muvoffaqiyatli o'zgartirildi")
					} else if (data?.response?.data?.error === "GOODS_ALREADY_EXIST") {
						toast.warn("Bunday kategoriya allaqachon mavjud")
					} else {
						toast.error("Nomalum server xatolik")
					}
					setBtn_loading(false)
				})
			} else {
				post("/goods/goods-post", newObj).then((data) => {
					if (data?.status === 201) {
						dispatch(addData(data?.data))
						dispatch(setQuantity())
						clearAndClose()
						toast.success("Kategoriya muvoffaqiyatli qo'shildi")
					} else if (data?.response?.data?.error === "GOODS_ALREADY_EXIST") {
						toast.warn("Bunday kategoriya allaqachon mavjud")
					} else {
						toast.error("Nomalum server xatolik")
					}
					setBtn_loading(false)
				})
			}
		}
	}

	const deleteGood = (id) => {
		dispatch(setLoading(true))
		remove(`/goods/goods-delete/${id}`).then((data) => {
			if (data?.status === 200) {
				dispatch(removeGood(id))
				dispatch(setQuantity())
				toast.success("Kategoriya muvoffaqiyatli o'chirildi")
				clearAndClose()
			} else if (data?.response?.data?.error === "GOODS_ALREADY_EXIST") {
				toast.warn("Bu kategoriyada mahsulot mavjud")
			} else {
				toast.error("Nomalum server xatolik")
			}
			dispatch(setLoading(false))
		})
	}

	const editGood = (id) => {
		get(`/goods/goods-list/${id}`).then((data) => {
			if (data?.status === 201) {
				setNewGoodName(data?.data[0]?.goods_name)
				setNewGoodCode(data?.data[0]?.goods_code)
				setObjId(id)
				setAddModalDisplay("block")
				setAddModalVisible(true)
			} else {
				toast.error("Nomalum server xatolik")
			}
		})
	}

	const clearAndClose = () => {
		setNewGoodName("")
		setNewGoodCode("")

		setObjId("")
		setSubmitted(false)
		setAddModalVisible(false)
		setTimeout(() => {
			setAddModalDisplay("none")
		}, 300)
	}

	const handleSearch = () => {
		if (inputRef.current?.value.length > 0) {
			dispatch(setLoading(true))
			setSearchSubmitted(true)
			post("/goods/goods-search", {
				category_name: inputRef.current?.value,
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

	return (
		<>
			<AddModal
				addModalVisible={addModalVisible}
				setAddModalVisible={setAddModalVisible}
				addModalDisplay={addModalDisplay}
				setAddModalDisplay={setAddModalDisplay}
				name={objId ? "Kategoriya tahrirlash" : "Kategoriya qo'shish"}
			>
				<div
					className={`input-wrapper modal-form regular 
					${submitted && stringCheck(newGoodName.trim()) !== null && "error"}
					`}
				>
					<label>Kategoriya nomi</label>
					<input
						type="text"
						placeholder="Kategoriya nomini kiriting"
						className="input"
						value={newGoodName}
						onChange={(e) => setNewGoodName(e.target.value)}
					/>
					{submitted && stringCheck(newGoodName.trim()) !== null && (
						<Info size={20} />
					)}
					<div className="validation-field">
						<span>
							{submitted &&
								stringCheck(newGoodName.trim(), "Nom kiritish majburiy")}
						</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form regular 
					${submitted && stringCheck(newGoodCode.trim()) !== null && "error"}
					`}
				>
					<label>Kategoriya kodi</label>
					<input
						type="text"
						placeholder="Kategoriya kodi kiriting"
						className="input"
						value={newGoodCode}
						onChange={(e) => setNewGoodCode(e.target.value)}
					/>
					{submitted && stringCheck(newGoodCode.trim()) !== null && (
						<Info size={20} />
					)}
					<div className="validation-field">
						<span>
							{submitted &&
								stringCheck(newGoodCode.trim(), "Kod kiritish majburiy")}
						</span>
					</div>
				</div>
				<div className="modal-btn-group">
					<button
						className="primary-btn"
						disabled={btn_loading}
						onClick={addGood}
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
					icon={<SquaresFour size={24} color="var(--color-primary)" />}
					iconBgColor={"var(--bg-icon)"}
				/>
			</div>

			<Search handleSearch={handleSearch} clearSearch={clearSearch} />

			{state?.loading ? (
				<Loader />
			) : (
				<GoodsList
					data={searchSubmitted ? filteredData : state?.data}
					deleteGood={deleteGood}
					editGood={editGood}
					showDropdown={showDropdown}
					setshowDropdown={setshowDropdown}
				/>
			)}
		</>
	)
}
