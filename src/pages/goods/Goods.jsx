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
} from "../../components/reducers/good"
import { validation } from "../../components/validation"
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
	const [saerchInputValue, setSearchInput, sidebar, userInfo, setAction] =
		useOutletContext()
	const state = useSelector((state) => state.good)
	const dispatch = useDispatch()

	// form values
	const [newGoodName, setNewGoodName] = useState("")
	const [newGoodCode, setNewGoodCode] = useState("")

	useEffect(() => {
		dispatch(setLoading(true))
		let stores =
			state?.data?.length &&
			state?.data?.filter(
				(item) =>
					item?.goods_name
						.toLowerCase()
						.includes(saerchInputValue.toLowerCase()) ||
					item?.goods_code
						.toLowerCase()
						.includes(saerchInputValue.toLowerCase())
			)
		setFilteredProducts(stores)
		dispatch(setLoading(false))
	}, [saerchInputValue])

	const getData = () => {
		dispatch(setLoading(true))
		request("GET", `${process.env.REACT_APP_URL}/goods/goods-list`)
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

	const postNewGood = () => {
		setSubmitted(true)
		if (newGoodName && newGoodCode) {
			setButtonLoader(true)
			if (objId) {
				request(
					"PATCH",
					`${process.env.REACT_APP_URL}/goods/goods-patch/${objId}`,
					{
						goods_name: newGoodName,
						goods_code: newGoodCode,
					}
				)
					.then((data) => {
						dispatch(editData(data))
						buttonRef.current.click()
						setModal_alert("Xabar")
						setModal_msg("Kategoriya muvoffaqiyatli o'zgartirildi")
						setNewGoodName("")
						setNewGoodCode("")
						setObjId("")
						setSubmitted(false)
						setButtonLoader(false)
					})
					.catch((error) => {
						if (error?.response?.data?.error === "GOODS_ALREADY_EXIST") {
							setModal_alert("Xatolik")
							setModal_msg("Kategoriya allaqachon mavjud")
						} else {
							setModal_alert("Xatolik")
							setModal_msg("Kategoriya o'zgartirishda xatolik")
						}
						setButtonLoader(false)
					})
			} else {
				request("post", `${process.env.REACT_APP_URL}/goods/goods-post`, {
					goods_name: newGoodName,
					goods_code: newGoodCode,
				})
					.then((data) => {
						dispatch(addData(data))
						dispatch(setQuantity())
						buttonRef.current.click()
						setModal_alert("Xabar")
						setModal_msg("Kategoriya muvoffaqiyatli qo'shildi")
						setNewGoodName("")
						setNewGoodCode("")
						setSubmitted(false)
						setButtonLoader(false)
					})
					.catch((error) => {
						if (error?.response?.data?.error === "GOODS_ALREADY_EXIST") {
							setModal_alert("Xatolik")
							setModal_msg("Kategoriya allaqachon mavjud")
						} else {
							setModal_alert("Xatolik")
							setModal_msg("Kategoriya qo'shib bo'lmadi")
						}
						setButtonLoader(false)
					})
			}
		}
	}

	const deleteGood = (id) => {
		request("DELETE", `${process.env.REACT_APP_URL}/goods/goods-delete/${id}`)
			.then((data) => {
				console.log(data?.response?.data)
				if (data?.data?.error === "GOODS_ALREADY_EXIST") {
					setModal_alert("Xatolik")
					setModal_msg("Kategoriyada mahsulot mavjud")
				} else {
					getData()
					setModal_alert("Xabar")
					setModal_msg("Kategoriya muvoffaqiyatli o'chirildi")
				}
			})
			.catch((err) => {
				setModal_alert("Xatolik")
				setModal_msg("Kategoriyani o'chirib bo'lmadi")
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
			divTop -= 10
			document.querySelector(".content").scrollTop = divTop

			if (divTop <= 0) {
				clearInterval(scrollTop)
			}
		}, 1)
		request("GET", `${process.env.REACT_APP_URL}/goods/goods-list/${id}`)
			.then((data) => {
				setNewGoodName(toggleClass ? "" : data[0]?.goods_name)
				setNewGoodCode(toggleClass ? "" : data[0]?.goods_code)
				setObjId(id)
				buttonRef.current.click()
			})
			.catch((error) => {
				console.log(error?.response?.data)
				if (error?.response?.data?.error === "GOODS_NOT_FOUND") {
					setModal_alert("Xatolik")
					setModal_msg("Kategoriya topilmadi")
				} else {
					setModal_alert("Xatolik")
					setModal_msg("Nomalum server xatolik")
				}
			})
	}

	// setAction({ url: "good/ fiter path", body: {} })

	return (
		<div id="cardWrapperTop">
			{error_modal(modal_alert, modal_msg, modal_msg.length, setModal_msg)}
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
			<div className="goods-info">
				<i className="fa-solid fa-tags"></i> Kategoriyalar soni:{" "}
				{state?.quantity ? state?.quantity : 0} ta
			</div>
			{state?.loading ? (
				<Loader />
			) : (
				<GoodsList
					goods={saerchInputValue.length ? filteredProducts : state?.data}
					deleteGood={deleteGood}
					updateGood={updateGood}
				/>
			)}
			{/* {loader ? <Loader /> : <AntTable data={products} tableName="goods" />} */}
		</div>
	)
}
