import { Input } from "antd"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useOutletContext } from "react-router-dom"
import { error_modal } from "../../components/error_modal/error_modal"
import Loader from "../../components/loader/Loader"
import {
	addData,
	editData,
	removeStore,
	setData,
	setLoading,
	setQuantity,
} from "../../components/reducers/store"
import { validation } from "../../components/validation"
import { get, patch, post, remove } from "../../customHook/api"
import useApiRequest from "../../customHook/useUrl"
import StoreList from "./StoreList"
import "./store.css"

export default function Store() {
	const [filteredStores, setFilteredStores] = useState([])
	const [newStoreName, setNewStoreName] = useState("")
	const [buttonLoader, setButtonLoader] = useState(false)
	const [toggleClass, setToggleClass] = useState(false)
	const [modal_msg, setModal_msg] = useState("")
	const [modal_alert, setModal_alert] = useState("")
	const request = useApiRequest()
	const buttonRef = useRef(null)
	const [objId, setObjId] = useState("")
	const [submitted, setSubmitted] = useState(false)
	const state = useSelector((state) => state.store)
	const dispatch = useDispatch()
	const [
		saerchInputValue,
		setSearchInput,
		sidebar,
		userInfo,
		action,
		setAction,
	] = useOutletContext()
	const [searchSubmitted, setSearchSubmitted] = useState(false)

	useEffect(() => {
		setAction({
			url: "/store/store-search",
			body: {
				store_name: saerchInputValue,
			},
			res: setFilteredStores,
			submitted: setSearchSubmitted,
			clearValues: {},
			setLoading: setLoading,
		})
	}, [saerchInputValue])

	const getData = () => {
		dispatch(setLoading(true))
		get("/store/store-list").then((data) => {
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

	const addNewStore = () => {
		setSubmitted(true)
		if (newStoreName.length) {
			setButtonLoader(true)
			if (objId) {
				patch(`/store/store-patch/${objId}`, { store_name: newStoreName }).then(
					(data) => {
						if (data?.status === 201) {
							dispatch(editData(data?.data))
							buttonRef.current.click()
							setModal_alert("Xabar")
							setModal_msg("Malumot muvoffaqiyatli o'zgartirildi")
							setNewStoreName("")
							setObjId("")
							setSubmitted(false)
						} else if (data?.response?.data?.error === "STORE_ALREADY_EXIST") {
							setModal_alert("Xatolik")
							setModal_msg("Bunday ombor allaqachon mavjud")
						} else {
							setModal_alert("Nomalum server xatolik")
							setModal_msg("Malumot o'zgartirib bo'lmadi")
						}
						setButtonLoader(false)
					}
				)
			} else {
				post("/store/store-post", { store_name: newStoreName }).then((data) => {
					if (data?.status === 201) {
						dispatch(addData(data?.data))
						dispatch(setQuantity())
						buttonRef.current.click()
						setModal_alert("Xabar")
						setModal_msg("Ombor muvoffaqiyatli qo'shildi")
						setNewStoreName("")
						setSubmitted(false)
					} else if (data?.response?.data?.error === "STORE_ALREADY_EXIST") {
						setModal_alert("Xatolik")
						setModal_msg("Ombor allaqachon mavjud")
					} else {
						setModal_alert("Nomalum server xatolik")
						setModal_msg("Ombor qo'shib bo'lmadi")
					}
					setButtonLoader(false)
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
				setModal_alert("Xabar")
				setModal_msg("Ombor muvoffaqiyatli o'chirildi")
			} else if (data?.response?.data?.error === "PRODUCT_FOUND") {
				setModal_alert("Xatolik")
				setModal_msg("Omborda maxsulot borligi uchun o'chirilmadi")
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
			setNewStoreName("")
			setObjId("")
		} else {
			content.style.maxHeight = content.scrollHeight + "px"
		}
	}

	const editStore = (id) => {
		let divTop = document.querySelector(".content").scrollTop
		let scrollTop = setInterval(() => {
			divTop -= 20
			document.querySelector(".content").scrollTop = divTop

			if (divTop <= 0) {
				clearInterval(scrollTop)
			}
		}, 10)

		const index = state?.data.findIndex((item) => item.store_id === id)
		if (index !== -1) {
			setNewStoreName(toggleClass ? "" : state?.data[index]?.store_name)
			setObjId(id)
			buttonRef.current.click()
		}
	}

	return (
		<div>
			{error_modal(modal_alert, modal_msg, modal_msg.length, setModal_msg)}

			<div className="store-info">
				<i className="fa-solid fa-warehouse"></i> Omborlar soni:{" "}
				{searchSubmitted
					? filteredStores?.length
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
				<div className="form-group d-flex mb-3">
					<div className="col-2 mx-1 validation-field">
						<label htmlFor="">Ombor nomi</label>
						<Input
							type="text"
							className=""
							placeholder="Ombor 1"
							value={newStoreName}
							onChange={(e) => setNewStoreName(e.target.value)}
						/>
						<div className="validation-field-error">
							{submitted && validation(!newStoreName, "Nom kiritish majburiy")}
						</div>
					</div>
					<div className="col">
						<br />
						<button
							disabled={buttonLoader}
							className="btn btn-melissa"
							onClick={addNewStore}
							style={{ padding: "4px 10px" }}
						>
							<i className="fas fa-plus"></i>
							{buttonLoader && (
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
				<StoreList
					store={searchSubmitted ? filteredStores : state?.data}
					deleteStore={deleteStore}
					editStore={editStore}
				/>
			)}
		</div>
	)
}
