import { Input } from "antd"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useOutletContext } from "react-router-dom"
import { error_modal } from "../../components/error_modal/error_modal"
import Loader from "../../components/loader/Loader"
import {
	addData,
	editData,
	removeGood,
	setData,
	setLoading,
	setQuantity,
} from "../../components/reducers/good"
import { validation } from "../../components/validation"
import { get, patch, post, remove } from "../../customHook/api"
import useApiRequest from "../../customHook/useUrl"
import GoodsList from "./GoodsList"
import "./goods.css"

export default function Goods() {
	const [buttonLoader, setButtonLoader] = useState(false)
	const [filteredProducts, setFilteredProducts] = useState([])
	const [modal_alert, setModal_alert] = useState("")
	const [modal_msg, setModal_msg] = useState("")
	const [toggleClass, setToggleClass] = useState(false)
	const [objId, setObjId] = useState("")
	const buttonRef = useRef(null)
	const [submitted, setSubmitted] = useState(false)
	const request = useApiRequest()
	const [
		saerchInputValue,
		setSearchInput,
		sidebar,
		userInfo,
		action,
		setAction,
	] = useOutletContext()
	const state = useSelector((state) => state.good)
	const dispatch = useDispatch()
	const [searchSubmitted, setSearchSubmitted] = useState(false)

	// form values
	const [newGoodName, setNewGoodName] = useState("")
	const [newGoodCode, setNewGoodCode] = useState("")

	useEffect(() => {
		setAction({
			url: "/goods/goods-search",
			body: {
				category_name: saerchInputValue,
			},
			res: setFilteredProducts,
			submitted: setSearchSubmitted,
			clearValues: {},
			setLoading: setLoading,
		})
	}, [saerchInputValue])

	const getData = () => {
		dispatch(setLoading(true))
		get("/goods/goods-list").then((data) => {
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

	const postNewGood = () => {
		setSubmitted(true)
		if (newGoodName && newGoodCode) {
			setButtonLoader(true)
			if (objId) {
				patch(`/goods/goods-patch/${objId}`, {
					goods_name: newGoodName,
					goods_code: newGoodCode,
				}).then((data) => {
					if (data?.status === 201) {
						dispatch(editData(data?.data))
						buttonRef.current.click()
						setModal_alert("Xabar")
						setModal_msg("Kategoriya muvoffaqiyatli o'zgartirildi")
						setNewGoodName("")
						setNewGoodCode("")
						setObjId("")
						setSubmitted(false)
						setButtonLoader(false)
					} else if (data?.response?.data?.error === "GOODS_ALREADY_EXIST") {
						setModal_alert("Xatolik")
						setModal_msg("Bunday kategoriya allaqachon mavjud")
					} else {
						setModal_alert("Nomalum server xatolik")
						setModal_msg("Malumot o'zgartirib bo'lmadi")
					}
					setButtonLoader(false)
				})
			} else {
				post("/goods/goods-post", {
					goods_name: newGoodName,
					goods_code: newGoodCode,
				}).then((data) => {
					if (data?.status === 201) {
						dispatch(addData(data?.data))
						dispatch(setQuantity())
						buttonRef.current.click()
						setModal_alert("Xabar")
						setModal_msg("Kategoriya muvoffaqiyatli qo'shildi")
						setNewGoodName("")
						setNewGoodCode("")
						setSubmitted(false)
						setButtonLoader(false)
					} else if (data?.response?.data?.error === "GOODS_ALREADY_EXIST") {
						setModal_alert("Xatolik")
						setModal_msg("Bunday kategoriya allaqachon mavjud")
					} else {
						setModal_alert("Nomalum server xatolik")
						setModal_msg("Kategoriya qo'shib bo'lmadi")
					}
					setButtonLoader(false)
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
				setModal_alert("Xabar")
				setModal_msg("Kategoriya muvoffaqiyatli o'chirildi")
			} else if (data?.response?.data?.error === "GOODS_ALREADY_EXIST") {
				setModal_alert("Kategoriya o'chirilmadi")
				setModal_msg("Bu kategoriyada mahsulot mavjud")
			} else {
				setModal_alert("Nomalum server xatolik")
				setModal_msg("Kategoriya o'chiril bo'lmadi")
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
			setNewGoodName("")
			setNewGoodCode("")
			setObjId("")
		} else {
			content.style.maxHeight = content.scrollHeight + "px"
		}
	}

	const updateGood = (id) => {
		let divTop = document.querySelector(".content").scrollTop
		let scrollTop = setInterval(() => {
			divTop -= 20
			document.querySelector(".content").scrollTop = divTop

			if (divTop <= 0) {
				clearInterval(scrollTop)
			}
		}, 10)

		get(`/goods/goods-list/${id}`).then((data) => {
			if (data?.status === 201) {
				setNewGoodName(toggleClass ? "" : data?.data[0]?.goods_name)
				setNewGoodCode(toggleClass ? "" : data?.data[0]?.goods_code)
				setObjId(id)
				buttonRef.current.click()
			}
		})
	}

	return (
		<div id="cardWrapperTop">
			{error_modal(modal_alert, modal_msg, modal_msg.length, setModal_msg)}

			<div className="goods-info">
				<i className="fa-solid fa-tags"></i> Kategoriyalar soni:{" "}
				{searchSubmitted
					? filteredProducts?.length
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

			<div className="my-content px-2">
				<div className="form-group row mb-2">
					<div className="product-add__input good-input validation-field">
						<label htmlFor="">Mahsulot nomi</label>
						<Input
							type="text"
							placeholder="Kubik rubik"
							value={newGoodName}
							onChange={(e) => setNewGoodName(e.target.value)}
						/>
						<div className="validation-field-error">
							{submitted &&
								validation(!newGoodName.trim(), "Nom kiritish majburiy")}
						</div>
					</div>
					<div className="product-add__input good-input validation-field">
						<label htmlFor="">Mahsulot kodi</label>
						<Input
							type="text"
							placeholder="fr-231"
							value={newGoodCode}
							onChange={(e) => setNewGoodCode(e.target.value)}
						/>
						<div className="validation-field-error">
							{submitted &&
								validation(!newGoodCode.trim(), "Kod kiritish majburiy")}
						</div>
					</div>
					<div className="col-1">
						<br />
						<button
							className="btn btn-melissa"
							disabled={buttonLoader}
							onClick={() => postNewGood()}
							style={{ padding: "4px 10px" }}
						>
							<i className="fas fa-plus"></i>
							{buttonLoader ? (
								<span
									className="spinner-grow spinner-grow-sm"
									role="status"
									aria-hidden="true"
									style={{ marginLeft: "5px" }}
								></span>
							) : null}
						</button>
					</div>
				</div>
			</div>

			{state?.loading ? (
				<Loader />
			) : (
				<GoodsList
					goods={searchSubmitted ? filteredProducts : state?.data}
					deleteGood={deleteGood}
					updateGood={updateGood}
				/>
			)}
			{/* {loader ? <Loader /> : <AntTable data={products} tableName="goods" />} */}
		</div>
	)
}
