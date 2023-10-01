import { Input, Select } from "antd"
import { Option } from "antd/es/mentions"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useOutletContext } from "react-router-dom"
import { error_modal } from "../../components/error_modal/error_modal"
import Loader from "../../components/loader/Loader"
import { setData as setDataDeliver } from "../../components/reducers/deliver"
import { setData as setDataGoods } from "../../components/reducers/good"
import {
	addData,
	editData,
	setDataClient,
	setDataReturn,
	setDataStore,
	setLoading,
	setQuantity,
} from "../../components/reducers/return"
import ReturnTable from "../../components/return_table/ReturnTable"
import { validation } from "../../components/validation"
import { get, patch, post, remove } from "../../customHook/api"
import useApiRequest from "../../customHook/useUrl"
import "./return.css"

function Return() {
	const [filteredData, setFilteredData] = useState({})
	const [btnLoading, setBtnLoading] = useState(false)
	const request = useApiRequest()
	const [modalAlert, setModalAlert] = useState("")
	const [modalMsg, setModalMsg] = useState("")
	const [toggleClass, setToggleClass] = useState(false)
	const [objId, setObjId] = useState("")
	const buttonRef = useRef(null)
	const [submitted, setSubmitted] = useState(false)
	const [searchSubmitted, setSearchSubmitted] = useState(false)
	const state = useSelector((state) => state)
	const dispatch = useDispatch()
	const [
		saerchInputValue,
		setSearchInput,
		sidebar,
		userInfo,
		action,
		setAction,
	] = useOutletContext()
	const [searchStoreId, setSearchStoreId] = useState("")
	const [searchDeliverId, setSearchDeliverId] = useState("")
	const [searchGoodId, setSearchGoodId] = useState("")

	// new data
	const [name, setName] = useState("")
	const [count, setCount] = useState(0)
	const [cost, setCost] = useState(0)
	const [client, setClient] = useState({})
	const [store, setStore] = useState("")
	const [reason, setReason] = useState("")

	useEffect(() => {
		setAction({
			url: "/return/return-filter",
			body: {
				store_id: searchStoreId,
				goods_id: searchGoodId,
				deliver_id: searchDeliverId,
				goods_name: saerchInputValue,
				goods_code: saerchInputValue,
			},
			res: setFilteredData,
			submitted: setSearchSubmitted,
			clearValues: {
				first: setSearchStoreId,
				second: setSearchGoodId,
				third: setSearchDeliverId,
			},
			setLoading: setLoading,
		})
	}, [saerchInputValue, searchStoreId, searchGoodId, searchDeliverId])

	const getData = (list, action) => {
		dispatch(setLoading(true))
		get(`/${list}/${list}-list`).then((data) => {
			if (data?.status === 200 || data?.status === 201) {
				dispatch(action(data?.data))
				if (list === "return") {
					dispatch(setQuantity())
				}
			} else {
				setModalAlert("Nomalum server xatolik")
				setModalMsg("Malumot topilmadi")
			}
			dispatch(setLoading(false))
		})
	}

	useEffect(() => {
		getData("return", setDataReturn)
		getData("clients", setDataClient)
		getData("store", setDataStore)
		getData("deliver", setDataDeliver)
		getData("goods", setDataGoods)
	}, [])

	const collapse = (event) => {
		setSubmitted(false)
		setToggleClass(!toggleClass)
		let content = event.target.nextElementSibling
		if (content.style.maxHeight) {
			content.style.maxHeight = null
			setName("")
			setCount(0)
			setCost(0)
			setClient({})
			setStore("")
			setReason("")
			setObjId("")
		} else {
			content.style.maxHeight = content.scrollHeight + "px"
		}
	}

	const addNewReturn = () => {
		setSubmitted(true)
		if (name && client && store && count > 0 && cost > 0 && reason?.length) {
			setBtnLoading(true)
			let newObj = {
				return_name: name,
				return_count: count,
				return_cost: cost,
				client_id: client?.clients_id,
				return_store: store,
				return_case: reason,
			}
			if (objId) {
				patch(`/return/return-patch/${objId}`, newObj).then((data) => {
					// console.log(data)
					if (data?.status === 201) {
						dispatch(editData(data?.data))
						buttonRef.current.click()
						setModalAlert("Xabar")
						setModalMsg("Malumot muvoffaqiyatli o'zgartirildi")
						setName("")
						setCount(0)
						setCost(0)
						setClient({})
						setStore("")
						setReason("")
						setSubmitted(false)
					} else if (data?.response?.data?.error === "CLIENTS_NOT_FOUND") {
						setModalAlert("Xatolik")
						setModalMsg("Mijoz topilmadi")
					} else {
						setModalAlert("Nomalum server xatolik")
						setModalMsg("Mahsulot o'zgartirib bo'lmadi")
					}
					setBtnLoading(false)
				})
			} else {
				post("/return/return-post", newObj).then((data) => {
					if (data?.status === 200) {
						dispatch(addData(data?.data))
						dispatch(setQuantity())
						buttonRef.current.click()
						setModalAlert("Xabar")
						setModalMsg("Mahsulot muvoffaqiyatli qaytarildi")
						setName("")
						setCount(0)
						setCost(0)
						setClient({})
						setStore("")
						setReason("")
						setSubmitted(false)
					} else if (data?.response?.data?.error === "CLIENTS_NOT_FOUND") {
						setModalAlert("Xatolik")
						setModalMsg("Mijoz topilmadi")
					} else {
						setModalAlert("Nomalum server xatolik")
						setModalMsg("Malumot o'zgartirib bo'lmadi")
					}
					setBtnLoading(false)
				})
			}
		}
	}

	const deleteItem = (id) => {
		dispatch(setLoading(true))
		remove(`/return/return-delete/${id}`).then((data) => {
			if (data?.status === 200) {
				getData("return", setDataReturn)
				setModalAlert("Xabar")
				setModalMsg("Qaytgan mahsulot muvoffaqiyatli o'chirildi")
			} else {
				setModalAlert("Nomalum server xatolik")
				setModalMsg("Malumot o'chirib bo'lmadi")
			}
			dispatch(setLoading(false))
		})
	}

	const editItem = (id) => {
		let divTop = document.querySelector(".content").scrollTop
		let scrollTop = setInterval(() => {
			divTop -= 20
			document.querySelector(".content").scrollTop = divTop

			if (divTop <= 0) {
				clearInterval(scrollTop)
			}
		}, 10)

		get(`/return/return-list/${id}`).then((data) => {
			if (data?.status === 200) {
				setName(toggleClass ? "" : data?.data?.return_name)
				setCount(toggleClass ? "" : data?.data?.return_count)
				setCost(toggleClass ? "" : data?.data?.return_cost)
				const index = state?.return?.dataClient.findIndex(
					(item) => item.clients_id === data?.data?.client_id
				)
				setClient(toggleClass ? "" : state?.return?.dataClient[index])
				setStore(toggleClass ? "" : data?.data?.return_store)
				setReason(toggleClass ? "" : data?.data?.return_case)
				setObjId(id)
				buttonRef.current.click()
			}
		})
	}

	return state?.return?.loading ? (
		<Loader />
	) : (
		<>
			{error_modal(modalAlert, modalMsg, modalMsg.length, setModalMsg)}

			<div className="return-info">
				<i className="fa-solid fa-user-tag"></i> Qaytgan mahsulotlar soni:{" "}
				{searchSubmitted
					? filteredData?.length
					: state?.return?.quantity
					? state?.return?.quantity
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

			<div className="my-content my-2">
				<div className="row px-2">
					<div className="col p-0 mx-1 validation-field">
						<label className="mx-2" htmlFor="ism">
							Nomi
						</label>
						<Input
							type="text"
							placeholder="Sharik"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
						<div className="validation-field-error">
							{name.length
								? validation(name.length < 3, "Kamida 3 ta harf kerak")
								: null}
							{submitted && validation(!name.length, "Nom kiritish majburiy")}
						</div>
					</div>
					<div className="col p-0 mx-1 validation-field">
						<label className="mx-2" htmlFor="">
							Mijoz
						</label>
						<Select
							showSearch
							id="goods_name"
							style={{ width: "100%" }}
							value={
								client?.clients_name
									? `${client?.clients_name} - ${client?.clients_nomer.replace(
											/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/,
											"+$1 ($2) $3-$4-$5"
									  )}`
									: null
							}
							placeholder="Qidiruv..."
							onChange={(e) => setClient(JSON.parse(e))}
							optionLabelProp="label"
						>
							{state?.return?.dataClient?.length
								? state?.return?.dataClient.map((item) => {
										if (!item?.isdelete) {
											return (
												<Option
													className="return-option"
													value={JSON.stringify(item)}
													label={`${
														item?.clients_name
													} - ${item?.clients_nomer.replace(
														/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/,
														"+$1 ($2) $3-$4-$5"
													)}`}
												>
													<div>
														<span>{item?.clients_name} - </span>
														<span>
															{item?.clients_nomer.replace(
																/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/,
																"+$1 ($2) $3-$4-$5"
															)}
														</span>
													</div>
												</Option>
											)
										}
								  })
								: null}
						</Select>
						<div className="validation-field-error">
							{submitted &&
								validation(
									!client?.clients_name?.length,
									"Mijoz tanlash majburiy"
								)}
						</div>
					</div>
					<div className="col p-0 mx-1 validation-field">
						<label className="mx-2" htmlFor="">
							Ombor
						</label>
						<Select
							showSearch
							id="goods_name"
							value={store ? store : null}
							placeholder="Qidiruv..."
							onChange={(e) => setStore(e)}
							optionLabelProp="label"
							style={{ width: "100%" }}
						>
							{state?.return?.dataStore?.length
								? state?.return?.dataStore.map((item) => {
										return (
											<Option value={item?.store_name} label={item?.store_name}>
												{item?.store_name}
											</Option>
										)
								  })
								: null}
						</Select>
						<div className="validation-field-error">
							{submitted && validation(!store, "Ombor tanlash majburiy")}
						</div>
					</div>
					<div className="col p-0 mx-1 validation-field">
						<label className="mx-2" htmlFor="ism">
							Soni
						</label>
						<Input
							type="number"
							placeholder="20"
							value={count ? count : null}
							onChange={(e) => setCount(e.target.value)}
						/>
						<div className="validation-field-error">
							{submitted && validation(count < 1, "Son kiritish majburiy")}
						</div>
					</div>
					<div className="col p-0 mx-1 validation-field">
						<label className="mx-2" htmlFor="ism">
							Narx(so'm)
						</label>
						<Input
							type="number"
							placeholder="20,000.00"
							value={cost ? cost : null}
							onChange={(e) => setCost(e.target.value)}
						/>
						<div className="validation-field-error">
							{submitted && cost <= 0
								? validation(true, "Narx kiritish majburiy")
								: null}
						</div>
					</div>
					<div className="col p-0 mx-1 validation-field">
						<label className="mx-2" htmlFor="ism">
							Izoh
						</label>
						<Input
							type="text"
							placeholder="Siniq"
							value={reason}
							onChange={(e) => setReason(e.target.value)}
						/>
						<div className="validation-field-error">
							{submitted && validation(!reason, "Izoh kiritish majburiy")}
						</div>
					</div>
					<div className="col p-0 mx-1">
						<br />
						<button
							className="btn btn-melissa"
							onClick={addNewReturn}
							style={{ padding: "3px 10px" }}
							disabled={btnLoading}
						>
							<i className="fas fa-plus"></i>
							{btnLoading && (
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

			<div
				className="return-item-filter-row"
				style={{
					left: sidebar ? 370 : 200 + "px",
				}}
			>
				<Select
					style={{ width: "100%" }}
					id="store"
					value={searchStoreId ? searchStoreId : null}
					placeholder="Ombor 1"
					onChange={(e) => setSearchStoreId(e)}
					allowClear
				>
					{state?.store?.data?.length
						? state?.store?.data.map((item) => {
								return (
									<Option value={item?.store_id}>{item?.store_name}</Option>
								)
						  })
						: null}
				</Select>
				<Select
					showSearch
					style={{ width: "100%" }}
					id="store"
					value={searchDeliverId ? searchDeliverId : null}
					placeholder="Ta'minotchi"
					onChange={(e) => setSearchDeliverId(e)}
					allowClear
				>
					{state?.client?.data?.length
						? state?.client?.data.map((item) => {
								return (
									<Option className="client-option" value={item?.clients_id}>
										<div>
											<span>{item?.clients_name} - </span>
											<span>
												{item?.clients_nomer.replace(
													/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/,
													"+$1 ($2) $3-$4-$5"
												)}
											</span>
										</div>
									</Option>
								)
						  })
						: null}
				</Select>
				<Select
					style={{ width: "100%" }}
					id="store"
					value={searchGoodId ? searchGoodId : null}
					placeholder="Kategoriya"
					onChange={(e) => setSearchGoodId(e)}
					allowClear
				>
					{state?.good?.data?.length
						? state?.good?.data.map((item) => {
								return (
									<Option value={item?.goods_id}>{item?.goods_name}</Option>
								)
						  })
						: null}
				</Select>
			</div>

			<ReturnTable
				data={searchSubmitted ? filteredData : state?.return?.dataReturn}
				deleteItem={deleteItem}
				editItem={editItem}
			/>
		</>
	)
}

export default Return
