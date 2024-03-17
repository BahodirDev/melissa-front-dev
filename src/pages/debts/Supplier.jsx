import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import DebtTable from "../../components/debt_table/debt_table"
import Loader from "../../components/loader/Loader"
import { patch, post, remove } from "../../customHook/api"
import { useOutletContext } from "react-router-dom"
import { toast } from "react-toastify"
import InfoItem from "../../components/info_item/InfoItem"
import { CaretDown, CurrencyDollar, Info } from "@phosphor-icons/react"
import { Input, Select } from "antd"
import Search from "../../components/search/Search"
import {
	addData,
	deleteData,
	payDDebt,
	setData,
	setLoading,
	setQuantity,
} from "../../components/reducers/d-debt"
import DDebtTable from "../../components/d_debt_table/debt_table"
import AddModal from "../../components/add/AddModal"
import {
	dateCompare,
	numberCheck,
	stringCheck,
} from "../../components/validation"
import { addComma, addSpace, formatSumma } from "../../components/addComma"
import format_phone_number from "../../components/format_phone_number/format_phone_number"

const Supplier = ({ getData }) => {
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

	const [filteredData, setFilteredData] = useState({})
	const [btn_loading, setBtn_loading] = useState(false)
	const [objId, setObjId] = useState("")
	const [submitted, setSubmitted] = useState(false)
	const [searchSubmitted, setSearchSubmitted] = useState(false)

	// filter
	const [store, setStore] = useState("")
	const [supplier, setSupplier] = useState("")
	const [category, setCategory] = useState("")

	// new data
	const [newDeliver, setNewDeliver] = useState({})
	const [newGood, setNewGood] = useState({})
	const [newCurrency, setNewCurrency] = useState({})
	const [newCount, setNewCount] = useState(0)
	const [newCost, setNewCost] = useState(0)
	const [deliverDate, setDeliverDate] = useState("")
	const [deliverDueDate, setDeliverDueDate] = useState("")

	useEffect(() => {
		getData("deliver-debts", setData, setLoading)
	}, [])

	const handleSearch = () => {
		if (inputRef.current?.value.length > 0) {
			dispatch(setLoading(true))
			setSearchSubmitted(true)
			post("/deliver-debts/deliver-debts-filter", {
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

	const closeDebt = (id) => {
		dispatch(setLoading(true))
		patch(`/deliver-debts/deliver-debts-patch-done/${id}`).then((data) => {
			if (data?.status === 200) {
				dispatch(
					deleteData({
						id,
						sum:
							data?.data?.debts_count *
							data?.data?.debts_cost *
							data?.data?.debts_currency_amount,
					})
				)
				toast.success("Qarzdorlik muvoffaqiyatli yopildi")
				toast.warn("Mahsulotni ro'yhatga qo'shishni unutmang")
			} else if (data?.response?.data?.error === "DEBTS_NOT_FOUND") {
				toast.warn("Bunday qarzdorlik topilmadi")
			} else {
				toast.error("Nomalum server xatolik")
			}
			dispatch(setLoading(false))
		})
	}

	const payDebt = (id, sum, value) => {
		dispatch(setLoading(true))
		patch(`/deliver-debts/deliver-debts-change/${id}`, { price: sum }).then(
			(data) => {
				if (data?.status === 200) {
					dispatch(payDDebt({ id, amount: sum, currency: value }))
					toast.success("Qarzdorlik muvoffaqiyatli kiritildi")
				} else if (data?.response?.data?.error === "DEBTS_COST_REQUIRED") {
					toast.warn("Kiritilgan summa mavjud summadan yuqori")
				} else {
					toast.error("Nomalum server xatolik")
				}
				dispatch(setLoading(false))
			}
		)
	}

	const deleteDebt = (id) => {
		dispatch(setLoading(true))
		remove(`/deliver-debts/deliver-debts-delete/${id}`).then((data) => {
			if (data?.status === 200) {
				dispatch(
					deleteData({
						id,
						sum:
							data?.data?.debts_count *
							data?.data?.debts_cost *
							data?.data?.debts_currency_amount,
					})
				)
				toast.success("Qarzdorlik muvoffaqiyatli o'chirildi")
				clearAndClose()
			} else {
				toast.error("Nomalum server xatolik")
			}
			dispatch(setLoading(false))
		})
	}

	const addNewDebt = () => {
		setSubmitted(true)
		if (
			newDeliver?.deliver_name &&
			newGood?.goods_name &&
			newCurrency?.currency_name &&
			newCount > 0 &&
			newCost > 0 &&
			deliverDate &&
			deliverDueDate &&
			new Date(deliverDate) <= new Date(deliverDueDate)
		) {
			setBtn_loading(true)
			let newObj = {
				goods_id: newGood?.goods_id,
				deliver_id: newDeliver?.deliver_id,
				debts_cost: newCost,
				debts_count: newCount,
				debts_currency: newCurrency?.currency_symbol,
				debts_currency_amount: newCurrency?.currency_amount,
				debts_selected_date: new Date(deliverDate).toISOString(),
				debts_due_date: new Date(deliverDueDate).toISOString(),

				goods_name: newGood?.goods_name,
				goods_code: newGood?.goods_code,
				deliver_name: newDeliver?.deliver_name,
				deliver_nomer: newDeliver?.deliver_nomer,
			}

			post("/deliver-debts/deliver-debts-post", newObj).then((data) => {
				if (data?.status === 200) {
					dispatch(
						addData({
							...data?.data,
							goods_name: newObj?.goods_name,
							goods_code: newObj?.goods_code,
							deliver_name: newObj?.deliver_name,
							deliver_nomer: newObj?.deliver_nomer,
						})
					)
					clearAndClose()
					toast.success("Qarzdorlik muvoffaqiyatli qo'shildi")
				} else {
					toast.error("Nomalum server xatolik")
				}
				setBtn_loading(false)
			})
		}
	}

	const clearAndClose = () => {
		setNewDeliver({})
		setNewGood({})
		setNewCurrency({})
		setNewCount(0)
		setNewCost(0)
		setDeliverDate("")
		setDeliverDueDate("")
		// clear new data
		setObjId("")
		setSubmitted(false)
		setBtn_loading(false)
		setAddModalVisible(false)
		setTimeout(() => {
			setAddModalDisplay("none")
		}, 300)
	}

	const clearOnly = () => {
		setNewDeliver({})
		setNewGood({})
		setNewCurrency({})
		setNewCount(0)
		setNewCost(0)
		setDeliverDate("")
		setDeliverDueDate("")
		// clear new data
		setObjId("")
		setSubmitted(false)
		setBtn_loading(false)
	}

	return (
		<>
			<AddModal
				addModalVisible={addModalVisible}
				setAddModalVisible={setAddModalVisible}
				addModalDisplay={addModalDisplay}
				setAddModalDisplay={setAddModalDisplay}
				name={objId ? "Qarzdorlik tahrirlash" : "Qarzdorlik kiritish"}
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
						value={newDeliver?.deliver_name ? newDeliver?.deliver_name : null}
						onChange={(e) =>
							e ? setNewDeliver(JSON.parse(e)) : setNewDeliver({})
						}
					>
						{state.deliver?.data?.length
							? state.deliver?.data.map((item, idx) => {
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
									newDeliver.deliver_name,
									"Ta'minotchi tanlash majburiy"
								)}
						</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form ${
						submitted && stringCheck(newGood.goods_name) !== null && "error"
					}`}
				>
					<label>Kategoriya</label>
					<Select
						showSearch
						allowClear
						placeholder="Kategoriya tanlang"
						className="select"
						suffixIcon={
							submitted && stringCheck(newGood.goods_name) !== null ? (
								<Info size={20} />
							) : (
								<CaretDown size={16} />
							)
						}
						value={
							newGood.goods_name
								? `${newGood.goods_name} - ${newGood.goods_code}`
								: null
						}
						onChange={(e) => (e ? setNewGood(JSON.parse(e)) : setNewGood({}))}
					>
						{state.good?.data?.length
							? state.good?.data.map((item, idx) => {
									return (
										<Select.Option
											key={idx}
											className="option-shrink"
											value={JSON.stringify(item)}
										>
											<div>
												<span>{item?.goods_name} - </span>
												<span>{item?.goods_code}</span>
											</div>
										</Select.Option>
									)
							  })
							: null}
					</Select>
					<div className="validation-field">
						<span>
							{submitted &&
								stringCheck(newGood.goods_name, "Kategoriya tanlash majburiy")}
						</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form ${
						submitted &&
						stringCheck(newCurrency.currency_name) !== null &&
						"error"
					}`}
				>
					<label>Pul birligi</label>
					<Select
						showSearch
						allowClear
						placeholder="Pul birligi tanlang"
						className="select"
						suffixIcon={
							submitted && stringCheck(newCurrency.currency_name) !== null ? (
								<Info size={20} />
							) : (
								<CaretDown size={16} />
							)
						}
						value={
							newCurrency.currency_name
								? `${newCurrency.currency_name} - ${addComma(
										newCurrency.currency_amount
								  )}`
								: null
						}
						onChange={(e) =>
							e ? setNewCurrency(JSON.parse(e)) : setNewCurrency({})
						}
					>
						{state.currency?.data.length
							? state.currency?.data.map((item, idx) => {
									return (
										<Select.Option key={idx} value={JSON.stringify(item)}>
											<div>
												<span>{item?.currency_name} - </span>
												<span>{addComma(item?.currency_amount)}</span>
											</div>
										</Select.Option>
									)
							  })
							: null}
					</Select>
					<div className="validation-field">
						<span>
							{submitted &&
								stringCheck(
									newCurrency.currency_amount,
									"Pul birligi tanlash majburiy"
								)}
						</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form regular ${
						submitted && numberCheck(newCount) !== null && "error"
					}`}
				>
					<label>Miqdor</label>
					<input
						type="text"
						placeholder="Son kiriting"
						className="input"
						value={newCount ? newCount : ""}
						onChange={(e) => setNewCount(e.target.value)}
					/>
					{submitted && numberCheck(newCount) !== null && <Info size={20} />}
					<div className="validation-field">
						<span>{submitted && numberCheck(newCount)}</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form regular ${
						submitted && numberCheck(newCost) !== null && "error"
					}`}
				>
					<label>Narx</label>
					<input
						type="text"
						placeholder="Narx kiriting"
						className="input"
						value={newCost ? newCost : ""}
						onChange={(e) => setNewCost(e.target.value)}
					/>
					{submitted && numberCheck(newCost) !== null && <Info size={20} />}
					<div className="validation-field">
						<span>{submitted && numberCheck(newCost)}</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form regular ${
						submitted && stringCheck(deliverDate) !== null && "error"
					}`}
				>
					<label>Berilgan sana</label>
					<input
						type="date"
						placeholder="Sana kiriting"
						className="input date"
						value={deliverDate ? deliverDate : ""}
						onChange={(e) => setDeliverDate(e.target.value)}
					/>
					{/* {submitted && stringCheck(deliverDate) !== null && <Info size={20} />} */}
					<div className="validation-field">
						<span>
							{submitted && stringCheck(deliverDate, "Sana kiritish majburiy")}
						</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form regular ${
						(submitted && stringCheck(deliverDueDate) !== null && "error") ||
						(dateCompare(deliverDate, deliverDueDate) !== null && "error")
					}`}
				>
					<label>To'lanadigan sana</label>
					<input
						type="date"
						placeholder="Sana kiriting"
						className="input date"
						value={deliverDueDate ? deliverDueDate : ""}
						onChange={(e) => setDeliverDueDate(e.target.value)}
					/>
					<div className="validation-field">
						<span>
							{(submitted &&
								stringCheck(deliverDueDate, "Sana kiritish majburiy")) ||
								dateCompare(deliverDate, deliverDueDate)}
						</span>
					</div>
				</div>
				<div className="modal-btn-group">
					<button
						className="primary-btn"
						disabled={btn_loading}
						onClick={addNewDebt}
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

			<div className="filter-wrapper">
				<div className="input-wrapper">
					<Select
						showSearch
						allowClear
						placeholder="Ombor"
						className="select"
						value={store ? store : null}
						onChange={(e) => setStore(e)}
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
						placeholder="Ta'minotchi"
						className="select"
						value={supplier ? supplier : null}
						onChange={(e) => setSupplier(e)}
						disabled
					>
						{state.deliver?.data?.length
							? state.deliver?.data.map((item, idx) => {
									if (!item?.isdelete)
										return (
											<Select.Option
												key={idx}
												value={item.deliver_id}
												className="option-shrink"
											>
												<div>
													<span>{item?.deliver_name} - </span>
													<span>
														{format_phone_number(item?.deliver_nomer)}
													</span>
												</div>
											</Select.Option>
										)
							  })
							: null}
					</Select>
				</div>
				<div className="input-wrapper">
					<Select
						showSearch
						allowClear
						placeholder="Kategoriya"
						className="select"
						value={category ? category : null}
						onChange={(e) => setCategory(e)}
						disabled
					>
						{state.good?.data?.length
							? state.good?.data.map((item, idx) => (
									<Select.Option
										className="option-shrink"
										key={idx}
										value={item.goods_id}
									>
										<div>
											<span>{item?.goods_name} - </span>
											<span>{item?.goods_code}</span>
										</div>
									</Select.Option>
							  ))
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
						searchSubmitted
							? addSpace(+filteredData.amount)
							: addSpace(state?.dDebt?.quantity)
					}
					name="Umumiy summa"
					icon={<CurrencyDollar size={24} color="var(--color-warning)" />}
					iconBgColor={"var(--bg-icon-warning)"}
				/>
			</div>

			<Search
				handleSearch={handleSearch}
				clearSearch={clearSearch}
				className={"table-m"}
				clearOnly={clearOnly}
			/>

			{state.dDebt?.loading ? (
				<Loader />
			) : (
				<DDebtTable
					data={searchSubmitted ? filteredData?.data : state.dDebt.data}
					closeDebt={closeDebt}
					payDebt={payDebt}
					deleteDebt={deleteDebt}
					showDropdown={showDropdown}
					setshowDropdown={setshowDropdown}
					sidebar={sidebar}
				/>
			)}
		</>
	)
}

export default Supplier
