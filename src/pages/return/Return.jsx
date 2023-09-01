import { Input, Select } from "antd"
import { Option } from "antd/es/mentions"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { error_modal } from "../../components/error_modal/error_modal"
import Loader from "../../components/loader/Loader"
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
import useApiRequest from "../../customHook/useUrl"
import "./return.css"

function Return() {
	const [btnLoading, setBtnLoading] = useState(false)
	const request = useApiRequest()
	const [modalAlert, setModalAlert] = useState("")
	const [modalMsg, setModalMsg] = useState("")
	const [toggleClass, setToggleClass] = useState(false)
	const [objId, setObjId] = useState("")
	const buttonRef = useRef(null)
	const [submitted, setSubmitted] = useState(false)
	const state = useSelector((state) => state.return)
	const dispatch = useDispatch()

	// new data
	const [name, setName] = useState("")
	const [count, setCount] = useState(0)
	const [cost, setCost] = useState(0)
	const [client, setClient] = useState({})
	const [store, setStore] = useState("")
	const [reason, setReason] = useState("")

	const getData = () => {
		request("GET", `${process.env.REACT_APP_URL}/return/return-list`)
			.then((data) => {
				dispatch(setDataReturn(data))
				dispatch(setQuantity())
			})
			.catch((err) => console.error(err))
	}

	useEffect(() => {
		dispatch(setLoading(true))
		getData()

		request("GET", `${process.env.REACT_APP_URL}/clients/clients-list`)
			.then((data) => {
				dispatch(setDataClient(data))
			})
			.catch((err) => console.error(err))

		request("GET", `${process.env.REACT_APP_URL}/store/store-list`)
			.then((data) => {
				dispatch(setDataStore(data))
			})
			.catch((err) => console.error(err))
		dispatch(setLoading(false))
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
		if (
			name &&
			client &&
			store &&
			count > 0 &&
			cost > 0 &&
			reason?.length > 4
		) {
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
				request(
					"PATCH",
					`${process.env.REACT_APP_URL}/return/return-patch/${objId}`,
					newObj
				)
					.then((data) => {
						dispatch(editData(data))
						buttonRef.current.click()
						setModalAlert("Xabar")
						setModalMsg("Mahsulot muvoffaqiyatli o'zgartirildi.")
						setName("")
						setCount(0)
						setCost(0)
						setClient({})
						setStore("")
						setReason("")
						setSubmitted(false)
					})
					.catch((err) => {
						console.log(err?.response?.data)
						if (err?.response?.data?.error === "CLIENTS_NOT_FOUND") {
							setModalAlert("Xatolik")
							setModalMsg("Mijoz topilmadi.")
						} else {
							setModalAlert("Xatolik")
							setModalMsg("Mahsulot o'zgartirishda xatolik.")
						}
					})
			} else {
				request(
					"POST",
					`${process.env.REACT_APP_URL}/return/return-post`,
					newObj
				)
					.then((data) => {
						dispatch(addData(data))
						dispatch(setQuantity())
						buttonRef.current.click()
						setModalAlert("Xabar")
						setModalMsg("Mahsulot muvoffaqiyatli qaytarildi.")
						setName("")
						setCount(0)
						setCost(0)
						setClient({})
						setStore("")
						setReason("")
						setSubmitted(false)
					})
					.catch((err) => {
						console.log(err?.response?.data)
						if (err?.response?.data?.error === "CLIENTS_NOT_FOUND") {
							setModalAlert("Xatolik")
							setModalMsg("Mijoz topilmadi.")
						} else {
							setModalAlert("Xatolik")
							setModalMsg("Mahsulot qaytarishda xatolik.")
						}
					})
			}
			setBtnLoading(false)
		}
	}

	const deleteItem = (id) => {
		request("DELETE", `${process.env.REACT_APP_URL}/return/return-delete/${id}`)
			.then((data) => {
				getData()
				setModalAlert("Xabar")
				setModalMsg("Qaytgan mahsulot muvoffaqiyatli o'chirildi")
			})
			.catch((err) => {
				console.log(err?.response?.data?.error)
				setModalAlert("Xatolik")
				setModalMsg("Qaytgan mahsulotni o'chirib bo'lmadi")
			})
	}

	const editItem = (id) => {
		request("GET", `${process.env.REACT_APP_URL}/return/return-list/${id}`)
			.then((data) => {
				setName(toggleClass ? "" : data?.return_name)
				setCount(toggleClass ? "" : data?.return_count)
				setCost(toggleClass ? "" : data?.return_cost)
				const index = state?.dataClient.findIndex(
					(item) => item.clients_id === data?.client_id
				)
				setClient(toggleClass ? "" : state?.dataClient[index])
				setStore(toggleClass ? "" : data?.return_store)
				setReason(toggleClass ? "" : data?.return_case)
				setObjId(id)
				buttonRef.current.click()
			})
			.catch((error) => {
				console.log(error?.response?.data)
				if (error?.response?.data?.error === "RETURN_ITEM_NOT_FOUND") {
					setModalAlert("Xatolik")
					setModalMsg("Qaytgan mahsuot topilmadi")
				} else {
					setModalAlert("Xatolik")
					setModalMsg("Nomalum server xatolik")
				}
			})
	}

	return state?.loading ? (
		<Loader />
	) : (
		<>
			{error_modal(modalAlert, modalMsg, modalMsg.length, setModalMsg)}

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
							{state?.dataClient?.length
								? state?.dataClient.map((item) => {
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
							{state?.dataStore?.length
								? state?.dataStore.map((item) => {
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
							{reason.length
								? validation(reason.length < 5, "Kamida 5 ta harf kerak")
								: null}
						</div>
					</div>
					<div className="col p-0 mx-1">
						<br />
						<button
							className="btn btn-melissa"
							onClick={addNewReturn}
							style={{ padding: "3px 10px" }}
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

			<div className="return-info">
				<i className="fa-solid fa-user-tag"></i> Qaytgan mahsulotlar soni:{" "}
				{state?.quantity} ta
			</div>

			<ReturnTable
				data={state?.dataReturn}
				deleteItem={deleteItem}
				editItem={editItem}
			/>
		</>
	)
}

export default Return
