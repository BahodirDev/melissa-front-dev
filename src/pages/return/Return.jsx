import { Select } from "antd"
import { Option } from "antd/es/mentions"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useOutletContext } from "react-router-dom"
import Loader from "../../components/loader/Loader"
import { setData as setDataDeliver } from "../../components/reducers/deliver"
import { setData as setDataGoods } from "../../components/reducers/good"
import {
	addData,
	editData,
	removeReturn,
	setDataReturn,
	setLoading,
	setQuantity,
} from "../../components/reducers/return"
import ReturnTable from "../../components/return_table/ReturnTable"
import { numberCheck, stringCheck } from "../../components/validation"
import { get, patch, post, remove } from "../../customHook/api"
import "./return.css"
import { toast } from "react-toastify"
import Search from "../../components/search/Search"
import AddModal from "../../components/add/AddModal"
import InfoItem from "../../components/info_item/InfoItem"
import { ArrowCounterClockwise, CaretDown, Info } from "@phosphor-icons/react"
import format_phone_number from "../../components/format_phone_number/format_phone_number"

function Return() {
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
	] = useOutletContext()
	const state = useSelector((state) => state)
	const dispatch = useDispatch()

	const [btnLoading, setBtnLoading] = useState(false)
	const [objId, setObjId] = useState("")
	const [submitted, setSubmitted] = useState(false)

	// filter
	const [filteredData, setFilteredData] = useState({})
	const [searchSubmitted, setSearchSubmitted] = useState(false)
	const [searchStoreId, setSearchStoreId] = useState("")
	const [searchDeliverId, setSearchDeliverId] = useState("")
	const [searchGoodId, setSearchGoodId] = useState("")

	// new
	const [name, setName] = useState("")
	const [count, setCount] = useState(0)
	const [cost, setCost] = useState(0)
	const [client, setClient] = useState({})
	const [store, setStore] = useState("")
	const [reason, setReason] = useState("")

	const getData = (list, action) => {
		dispatch(setLoading(true))
		get(`/${list}/${list}-list`).then((data) => {
			if (data?.status === 200 || data?.status === 201) {
				dispatch(action(data?.data))
				if (list === "return") {
					dispatch(setQuantity())
				}
			} else {
				toast.error("Nomalum server xatolik", { toastId: "" })
			}
			dispatch(setLoading(false))
		})
	}

	useEffect(() => {
		getData("return", setDataReturn)
		getData("deliver", setDataDeliver)
		getData("goods", setDataGoods)
	}, [])

	const addNewReturn = () => {
		setSubmitted(true)
		if (name && client && store && count > 0 && cost > 0) {
			setBtnLoading(true)
			let newObj = {
				return_name: name.trim(),
				return_count: count,
				return_cost: cost,
				client_id: client?.clients_id,
				return_store: store,
				return_case: reason,
			}
			if (objId) {
				patch(`/return/return-patch/${objId}`, newObj).then((data) => {
					if (data?.status === 201) {
						dispatch(editData({ ...data?.data, ...client }))
						toast.success("Malumot muvoffaqiyatli o'zgartirildi")
						clearAndClose()
					} else if (data?.response?.data?.error === "CLIENTS_NOT_FOUND") {
						toast.warn("Bunday mijoz topilmadi")
					} else {
						toast.error("Nomalum server xatolik")
					}
					setBtnLoading(false)
				})
			} else {
				post("/return/return-post", newObj).then((data) => {
					if (data?.status === 200) {
						dispatch(addData({ ...data?.data, ...client }))
						dispatch(setQuantity())
						clearAndClose()
						toast.success("Mahsulot muvoffaqiyatli qaytarildi")
					} else if (data?.response?.data?.error === "CLIENTS_NOT_FOUND") {
						toast.warn("Bunday mijoz topilmadi")
					} else {
						toast.error("Nomalum server xatolik")
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
				dispatch(removeReturn(id))
				dispatch(setQuantity())
				toast.success("Mahsulot muvoffaqiyatli o'chirildi")
				clearAndClose()
			} else {
				toast.error("Nomalum server xatolik")
			}
			dispatch(setLoading(false))
		})
	}

	const editItem = (id) => {
		setName("")
		setObjId(id)
		setAddModalDisplay("block")
		setAddModalVisible(true)

		get(`/return/return-list/${id}`).then((data) => {
			if (data?.status === 200) {
				const index = state?.client?.data.findIndex(
					(item) => item.clients_id === data?.data?.client_id
				)
				setName(data?.data?.return_name)
				setCount(data?.data?.return_count)
				setCost(data?.data?.return_cost)
				setClient(state?.client?.data[index])
				setStore(data?.data?.return_store)
				setReason(data?.data?.return_case)
			} else {
				clearAndClose()
				toast.error("Nomalum server xatolik")
			}
		})
	}

	const clearAndClose = () => {
		setName("")
		setCount(0)
		setCost(0)
		setClient({})
		setStore("")
		setReason("")
		// clear new data
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
			post("/return/return-filter", {
				goods_name: inputRef.current?.value,
				goods_code: inputRef.current?.value,
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
				name={
					objId ? "Qaytgan mahsulot tahrirlash" : "Qaytgan mahsulot qo'shish"
				}
			>
				{objId && !name ? (
					<Loader />
				) : (
					<>
						<div
							className={`input-wrapper modal-form regular 
					${submitted && stringCheck(name.trim()) !== null && "error"}
					`}
						>
							<label>Mahsulot nomi</label>
							<input
								type="text"
								placeholder="Mahsulot nomini kiriting"
								className="input"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
							{submitted && stringCheck(name) !== null && <Info size={20} />}
							<div className="validation-field">
								<span>{submitted && stringCheck(name, "Nom majburiy")}</span>
							</div>
						</div>
						<div
							className={`input-wrapper modal-form ${
								submitted &&
								stringCheck(client?.clients_name) !== null &&
								"error"
							}`}
						>
							<label>Mijoz</label>
							<Select
								showSearch
								allowClear
								placeholder="Mijoz tanlang"
								className="select"
								suffixIcon={
									submitted && stringCheck(client?.clients_name) !== null ? (
										<Info size={20} />
									) : (
										<CaretDown size={16} />
									)
								}
								value={
									client?.clients_name
										? `${client?.clients_name} - ${format_phone_number(
												client?.clients_nomer
										  )}`
										: null
								}
								onChange={(e) => (e ? setClient(JSON.parse(e)) : setClient({}))}
							>
								{state.client?.data.length
									? state.client?.data.map((item, idx) => {
											if (!item?.isdelete) {
												return (
													<Select.Option
														key={idx}
														className="option-shrink"
														value={JSON.stringify(item)}
													>
														<div>
															<span>{item?.clients_name} - </span>
															<span>
																{format_phone_number(item?.clients_nomer)}
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
										stringCheck(client?.clients_name, "Mijoz tanlash majburiy")}
								</span>
							</div>
						</div>
						<div
							className={`input-wrapper modal-form ${
								submitted && stringCheck(store) !== null && "error"
							}`}
						>
							<label>Ombor</label>
							<Select
								showSearch
								allowClear
								placeholder="Ombor tanlang"
								className="select"
								suffixIcon={
									submitted && stringCheck(store) !== null ? (
										<Info size={20} />
									) : (
										<CaretDown size={16} />
									)
								}
								value={store ? store : null}
								onChange={(e) => setStore(e)}
							>
								{state.store?.data.length
									? state.store?.data.map((item, idx) => {
											return (
												<Select.Option key={idx} value={item?.store_name}>
													<div>
														<span>{item?.store_name}</span>
													</div>
												</Select.Option>
											)
									  })
									: null}
							</Select>
							<div className="validation-field">
								<span>
									{submitted && stringCheck(store, "Ombor tanlash majburiy")}
								</span>
							</div>
						</div>
						<div
							className={`input-wrapper modal-form regular ${
								submitted && numberCheck(count) !== null && "error"
							}`}
						>
							<label>Soni</label>
							<input
								type="text"
								placeholder="Qiymat kiriting"
								className="input"
								value={count ? count : ""}
								onChange={(e) => setCount(e.target.value)}
							/>
							{submitted && numberCheck(count) !== null && <Info size={20} />}
							<div className="validation-field">
								<span>{submitted && numberCheck(count)}</span>
							</div>
						</div>
						<div
							className={`input-wrapper modal-form regular ${
								submitted && numberCheck(cost) !== null && "error"
							}`}
						>
							<label>Narxi</label>
							<input
								type="text"
								placeholder="Qiymat kiriting"
								className="input"
								value={cost ? cost : ""}
								onChange={(e) => setCost(e.target.value)}
							/>
							{submitted && numberCheck(cost) !== null && <Info size={20} />}
							<div className="validation-field">
								<span>{submitted && numberCheck(cost)}</span>
							</div>
						</div>
						<div className="input-wrapper modal-form regular">
							<label>Izoh</label>
							<textarea
								placeholder="Izoh"
								className="desc-input"
								value={reason}
								onChange={(e) => setReason(e.target.value)}
							></textarea>
						</div>
						<div className="modal-btn-group">
							<button
								className="primary-btn"
								disabled={btnLoading}
								onClick={addNewReturn}
							>
								{objId ? "Saqlash" : "Qo'shish"}{" "}
								{btnLoading && (
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
					</>
				)}
			</AddModal>

			<div className="filter-wrapper">
				<div className="input-wrapper">
					<Select
						showSearch
						allowClear
						placeholder="Ombor"
						className="select"
						value={searchStoreId ? searchStoreId : null}
						onChange={(e) => setSearchStoreId(e)}
						disabled
					>
						{state.store?.data.length
							? state.store?.data.map((item, idx) => (
									<Select.Option key={idx} value={item.store_id}>
										<div>
											<span>{item?.store_name}</span>
										</div>
									</Select.Option>
							  ))
							: null}
					</Select>
				</div>
				<div className="input-wrapper">
					<Select
						showSearch
						allowClear
						placeholder="Mijoz"
						className="select"
						value={searchDeliverId ? searchDeliverId : null}
						onChange={(e) => setSearchDeliverId(e)}
						disabled
					>
						{state.client?.data.length
							? state.client?.data.map((item, idx) => {
									if (!item?.isdelete)
										return (
											<Select.Option
												key={idx}
												value={item.clients_id}
												className="option-shrink"
											>
												<div>
													<span>{item?.clients_name} - </span>
													<span>
														{format_phone_number(item?.clients_nomer)}
													</span>
												</div>
											</Select.Option>
										)
							  })
							: null}
					</Select>
				</div>
				<div className="filter-btn-group">
					<button type="button" className="filter-btn" disabled>
						Tozalash
					</button>
					<button type="button" className="filter-btn" disabled>
						Saqlash
					</button>
				</div>
			</div>

			<div className="info-wrapper">
				<InfoItem
					value={
						searchSubmitted ? filteredData.length : state?.return?.quantity
					}
					name="Qaytgan mahsulotlar soni"
					icon={
						<ArrowCounterClockwise size={24} color="var(--color-primary)" />
					}
					iconBgColor={"var(--bg-icon)"}
				/>
			</div>

			<Search
				handleSearch={handleSearch}
				clearSearch={clearSearch}
				className={"table-m"}
			/>

			{state.return?.loading ? (
				<Loader />
			) : (
				<ReturnTable
					data={searchSubmitted ? filteredData : state.return.dataReturn}
					deleteItem={deleteItem}
					editItem={editItem}
					showDropdown={showDropdown}
					setshowDropdown={setshowDropdown}
					sidebar={sidebar}
				/>
			)}
		</>
	)
}

export default Return
