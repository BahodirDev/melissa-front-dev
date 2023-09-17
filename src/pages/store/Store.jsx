import { Input } from "antd"
import { useEffect, useRef, useState } from "react"
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
} from "../../components/reducers/store"
import { validation } from "../../components/validation"
import { patch, post } from "../../customHook/api"
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
	const [saerchInputValue] = useOutletContext()
	const request = useApiRequest()
	const buttonRef = useRef(null)
	const [objId, setObjId] = useState("")
	const [submitted, setSubmitted] = useState(false)
	const state = useSelector((state) => state.store)
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(setLoading(true))
		let stores =
			state?.data?.length &&
			state?.data.filter((item) =>
				item?.store_name.toLowerCase().includes(saerchInputValue.toLowerCase())
			)
		setFilteredStores(stores)
		dispatch(setLoading(false))
	}, [saerchInputValue])

	const getData = () => {
		dispatch(setLoading(true))
		request("GET", `${process.env.REACT_APP_URL}/store/store-list`)
			.then((data) => {
				dispatch(setData(data))
				dispatch(setQuantity())
			})
			.catch((error) => {
				console.log(error)
			})

		dispatch(setLoading(false))
	}

	useEffect(getData, [])

	const addNewStore = () => {
		setSubmitted(true)
		if (newStoreName.length) {
			setButtonLoader(true)
			if (objId) {
				// patch(`/store/store-patch/${objId}`, { store_name: newStoreName }).then(
				// 	(data) => console.log(data)
				// )
				request(
					"PATCH",
					`${process.env.REACT_APP_URL}/store/store-patch/${objId}`,
					{
						store_name: newStoreName,
					}
				)
					.then((data) => {
						dispatch(editData(data))
						buttonRef.current.click()
						setModal_alert("Xabar")
						setModal_msg("Ombor muvoffaqiyatli o'zgartirildi")
						setNewStoreName("")
						setObjId("")
						setSubmitted(false)
					})
					.catch((err) => {
						if (err?.response?.data?.error === "STORE_ALREADY_EXIST") {
							setModal_alert("Xatolik")
							setModal_msg("Ombor allaqachon mavjud")
						} else {
							setModal_alert("Xatolik")
							setModal_msg("Ombor o'zgartirishda xatolik")
						}
					})
			} else {
				// post("/store/store-post", { store_name: newStoreName }).then((data) =>
				// 	console.log(data)
				// )
				request("POST", `${process.env.REACT_APP_URL}/store/store-post`, {
					store_name: newStoreName,
				})
					.then((data) => {
						dispatch(addData(data))
						dispatch(setQuantity())
						buttonRef.current.click()
						setModal_alert("Xabar")
						setModal_msg("Ombor muvoffaqiyatli qo'shildi")
						setNewStoreName("")
						setSubmitted(false)
					})
					.catch((err) => {
						if (err?.response?.data?.error === "STORE_ALREADY_EXIST") {
							setModal_alert("Xatolik")
							setModal_msg("Ombor allaqachon mavjud")
						} else {
							setModal_alert("Xatolik")
							setModal_msg("Ombor qo'shishda xatolik")
						}
					})
			}
			setButtonLoader(false)
		}
	}

	const deleteStore = (id) => {
		request("DELETE", `${process.env.REACT_APP_URL}/store/store-delete/${id}`)
			.then((data) => {
				if (data?.data?.error === "PRODUCT_FOUND") {
					setModal_alert("Xatolik")
					setModal_msg("Omborda maxsulot borligi uchun o'chirilmadi")
				} else {
					getData()
					setModal_alert("Xabar")
					setModal_msg("Ombor muvoffaqiyatli o'chirildi")
				}
			})
			.catch((err) => {
				setModal_alert("Xatolik")
				setModal_msg("Omborni o'chirishda xatolik")
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
		// const obj = store.find((item) => item.store_id === id)
		request("GET", `${process.env.REACT_APP_URL}/store/store-list/${id}`)
			.then((data) => {
				setNewStoreName(toggleClass ? "" : data[0]?.store_name)
				setObjId(id)
				buttonRef.current.click()
			})
			.catch((error) => {
				console.log(error?.response?.data)
				if (error?.response?.data?.error === "STORE_NOT_FOUND") {
					setModal_alert("Xatolik")
					setModal_msg("Ombor topilmadi")
				} else {
					setModal_alert("Xatolik")
					setModal_msg("Nomalum server xatolik")
				}
			})
	}

	return (
		<div>
			{error_modal(modal_alert, modal_msg, modal_msg.length, setModal_msg)}

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
							// disabled={!buttonValid}
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

			<div className="store-info">
				<i className="fa-solid fa-warehouse"></i> Omborlar soni:{" "}
				{state?.quantity ? state?.quantity : 0} ta
			</div>
			{/* <AntTable data={store} tableName="store" /> */}
			{state?.loading ? (
				<Loader />
			) : (
				<StoreList
					store={saerchInputValue.length ? filteredStores : state?.data}
					deleteStore={deleteStore}
					editStore={editStore}
				/>
			)}
		</div>
	)
}
