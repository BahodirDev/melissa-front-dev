import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useOutletContext } from "react-router-dom"
import { setData as setDataDeliver } from "../../components/reducers/deliver"
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
import { CaretDown, Info, SquaresFour } from "@phosphor-icons/react"
import { Select } from "antd"
import format_phone_number from "../../components/format_phone_number/format_phone_number"

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
		sidebar,
		userInfo,
	] = useOutletContext()
	const state = useSelector((state) => state.good)
	const deliver = useSelector((state) => state.deliver)
	const dispatch = useDispatch()

	// filter
	const [filteredData, setFilteredData] = useState([])
	const [btn_loading, setBtn_loading] = useState(false)
	const [objId, setObjId] = useState("")
	const [submitted, setSubmitted] = useState(false)
	const [searchSubmitted, setSearchSubmitted] = useState(false)
	const [imageValidationError, setImageValidationError] = useState(false)

	// new
	const [newGoodName, setNewGoodName] = useState("")
	const [newGoodCode, setNewGoodCode] = useState("")
	const [newDeliver, setNewDeliver] = useState("")
	const [imageFile, setImageFile] = useState(null)

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
		get(`/deliver/deliver-list`).then((data) => {
			dispatch(setDataDeliver(data?.data))
		})
	}, [])

	const handleImageChange = (e) => {
		const allowedExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"]
		const maxSize = 1024 * 1024

		const selectedImage = e.target.files[0]
		const fileName = selectedImage.name
		const fileExtension = fileName.split(".").pop().toLowerCase()

		if (!allowedExtensions.includes(fileExtension)) {
			setImageValidationError(true)
			toast.error(
				"Fayl turi yaroqsiz. Iltimos, jpg, jpeg, png, gif, bmp yoki webp faylini yuklang.",
				{ toastId: "" }
			)
			return false
		}
		if (selectedImage.size > maxSize) {
			setImageValidationError(true)
			toast.error(
				"Fayl hajmi chegaradan oshib ketdi (1MB). Iltimos, kichikroq fayl yuklang.",
				{ toastId: "" }
			)
			return false
		}

		setImageValidationError(false)
		setImageFile(selectedImage)

		let formData = new FormData()
		formData.append("id", objId)
		formData.append("file", selectedImage)

		post("/goods/goods-imgupload", formData).then((data) => {
			if (data?.status === 201 || data?.status === 200) {
				toast.success("Rasm muvoffaqiyatli kiritildi", { toastId: "" })
			} else {
				toast.error("Nomalum server xatolik", { toastId: "" })
			}
		})
	}

	const addGood = () => {
		setSubmitted(true)
		if (newGoodName && newGoodCode && newDeliver) {
			setBtn_loading(true)
			let newObj = {
				goods_name: newGoodName.trim(),
				goods_code: newGoodCode.trim(),
				delivery_id: newDeliver?.deliver_id,
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
		setObjId(id)
		setAddModalDisplay("block")
		setAddModalVisible(true)

		get(`/goods/goods-list/${id}`).then((data) => {
			if (data?.status === 201) {
				setNewGoodName(data?.data[0]?.goods_name)
				setNewGoodCode(data?.data[0]?.goods_code)
				setNewDeliver({
					deliver_name: data?.data[0]?.deliver_name,
					deliver_nomer: data?.data[0]?.deliver_nomer,
					deliver_id: data?.data[0]?.delivery_id,
				})
				setImageFile(data?.data[0]?.img_url)
			} else {
				clearAndClose()
				toast.error("Nomalum server xatolik")
			}
		})
	}

	const clearAndClose = () => {
		setNewGoodName("")
		setNewGoodCode("")
		setNewDeliver("")
		setImageFile(null)

		setObjId("")
		setBtn_loading(false)
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

	const clearOnly = () => {
		setNewGoodName("")
		setNewGoodCode("")
		setNewDeliver("")

		setObjId("")
		setBtn_loading(false)
		setSubmitted(false)
	}

	document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
		const dropZoneElement = inputElement.closest(".drop-zone")
		dropZoneElement.addEventListener("click", (e) => {
			inputElement.click()
		})
		inputElement.addEventListener("change", (e) => {
			if (inputElement.files.length) {
				updateThumbnail(dropZoneElement, inputElement.files[0])
			}
		})
		dropZoneElement.addEventListener("dragover", (e) => {
			e.preventDefault()
			dropZoneElement.classList.add("drop-zone--over")
		})
		;["dragleave", "dragend"].forEach((type) => {
			dropZoneElement.addEventListener(type, (e) => {
				dropZoneElement.classList.remove("drop-zone--over")
			})
		})
		let changeEventTriggered = false
		dropZoneElement.addEventListener("drop", (e) => {
			e.preventDefault()
			if (e.dataTransfer.files.length && !changeEventTriggered) {
				inputElement.files = e.dataTransfer.files
				updateThumbnail(dropZoneElement, e.dataTransfer.files[0])

				const event = new Event("change", { bubbles: true })
				inputElement.dispatchEvent(event)
				changeEventTriggered = true
			}
			dropZoneElement.classList.remove("drop-zone--over")
		})
	})
	function updateThumbnail(dropZoneElement, file) {
		let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb")

		// First time - remove the prompt
		if (dropZoneElement.querySelector(".drop-zone__prompt")) {
			dropZoneElement.querySelector(".drop-zone__prompt").remove()
		}

		// First time - there is no thumbnail element, so lets create it
		if (!thumbnailElement) {
			thumbnailElement = document.createElement("div")
			thumbnailElement.classList.add("drop-zone__thumb")
			dropZoneElement.appendChild(thumbnailElement)
		}

		thumbnailElement.dataset.label = file.name

		// Show thumbnail for image files
		if (file.type.startsWith("image/")) {
			const reader = new FileReader()

			reader.readAsDataURL(file)
			reader.onload = () => {
				thumbnailElement.style.backgroundImage = `url('${reader.result}')`
			}
		} else {
			thumbnailElement.style.backgroundImage = null
		}
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
					className={`input-wrapper modal-form ${
						submitted &&
						stringCheck(newDeliver?.deliver_name) !== null &&
						"error"
					}`}
				>
					<label>Ta'minotchi</label>
					<Select
						showSearch
						allowClear
						placeholder="Ta'minotchi tanlang"
						className="select"
						suffixIcon={
							submitted && stringCheck(newDeliver?.deliver_name) !== null ? (
								<Info size={20} />
							) : (
								<CaretDown size={16} />
							)
						}
						value={
							newDeliver?.deliver_name
								? `${newDeliver?.deliver_name} - ${format_phone_number(
										newDeliver?.deliver_nomer
								  )}`
								: null
						}
						onChange={(e) =>
							e ? setNewDeliver(JSON.parse(e)) : setNewDeliver({})
						}
					>
						{deliver.data?.length
							? deliver.data.map((item, idx) => {
									if (!item?.isdelete) {
										return (
											<Select.Option
												key={idx}
												className="option-shrink"
												value={JSON.stringify(item)}
											>
												<div>
													<span>{item?.deliver_name} - </span>
													<span>
														{format_phone_number(item?.deliver_nomer)}
													</span>
												</div>
											</Select.Option>
										)
									}
							  })
							: null}
					</Select>
					<div className="validation-field">
						<span>
							{submitted &&
								stringCheck(
									newDeliver?.deliver_nomer,
									"Ta'minotchi tanlash majburiy"
								)}
						</span>
					</div>
				</div>
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
				{objId ? (
					<div
						className={`input-wrapper modal-form regular ${
							imageValidationError ? "error" : null
						}`}
					>
						<label>Rasm</label>
						<div class="drop-zone">
							{imageFile === null || imageFile === "Unknown" ? (
								<span class="drop-zone__prompt">
									Rasm yuklang yoki tashlang
								</span>
							) : (
								<div
									className="drop-zone__thumb"
									style={{ backgroundImage: `url('${imageFile}')` }}
								></div>
							)}
							<input
								className="input"
								onChange={handleImageChange}
								type="file"
								name="myFile"
								class="drop-zone__input"
							/>
						</div>
						{imageValidationError ? <Info size={20} /> : null}
						<div className="validation-field">
							<span>
								{imageValidationError
									? "Iltimos yaroqli faylni kiriting"
									: null}
							</span>
						</div>
					</div>
				) : null}
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
					name="Kategoriyalar soni"
					icon={<SquaresFour size={24} color="var(--color-primary)" />}
					iconBgColor={"var(--bg-icon)"}
				/>
			</div>

			<Search
				handleSearch={handleSearch}
				clearSearch={clearSearch}
				showAddBtn={userInfo?.role === 1}
				clearOnly={clearOnly}
			/>

			{state?.loading ? (
				<Loader />
			) : (
				<GoodsList
					data={searchSubmitted ? filteredData : state?.data}
					deleteGood={deleteGood}
					editGood={editGood}
					showDropdown={showDropdown}
					setshowDropdown={setshowDropdown}
					userInfo={userInfo?.role}
				/>
			)}
		</>
	)
}
