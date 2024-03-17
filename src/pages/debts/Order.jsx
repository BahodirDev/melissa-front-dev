import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Loader from "../../components/loader/Loader"
import { patch, post, remove } from "../../customHook/api"
import { useOutletContext } from "react-router-dom"
import { toast } from "react-toastify"
import InfoItem from "../../components/info_item/InfoItem"
import { CaretDown, CurrencyDollar, Info } from "@phosphor-icons/react"
import { Select } from "antd"
import Search from "../../components/search/Search"
import AddModal from "../../components/add/AddModal"
import {
	dateCompare,
	numberCheck,
	stringCheck,
} from "../../components/validation"
import NDebtTable from "../../components/total_debt_table/total_debt_table"
import {
	addData,
	deleteData,
	payOrderDebt,
	setData,
	setLoading,
} from "../../components/reducers/orderDebt"
import format_phone_number from "../../components/format_phone_number/format_phone_number"
import ODebtTable from "../../components/before_debt_table/before_debt_table"
import { addComma, addSpace, formatSumma } from "../../components/addComma"

const Order = ({ getData }) => {
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
	const [beforeGood, setBeforeGood] = useState({})
	const [beforeDeliver, setBeforeDeliver] = useState({})
	const [beforeCost, setBeforeCost] = useState(0)
	const [beforeCount, setBeforeCount] = useState(0)
	const [beforeCurrency, setBeforeCurrency] = useState({})
	const [beforeDate, setBeforeDate] = useState("")
	const [beforeDueDate, setBeforeDueDate] = useState("")

	useEffect(() => {
		getData("ordered", setData, setLoading)
	}, [])

	const handleSearch = () => {
		if (inputRef.current?.value.length > 0) {
			dispatch(setLoading(true))
			setSearchSubmitted(true)
			post("/ordered/ordered-filter", {
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
		patch(`/ordered/ordered-patch-done/${id}`).then((data) => {
			if (data?.status === 200) {
				dispatch(
					deleteData({
						id,
						sum:
							data?.data?.debts_cost *
							data?.data?.debts_count *
							data?.data?.debts_currency_amount,
					})
				)
				toast.success("Qarzdorlik muvoffaqiyatli yopildi")
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
		patch(`/ordered/ordered-change/${id}`, { amount: sum }).then((data) => {
			console.log(data)
			if (data?.status === 200) {
				dispatch(
					payOrderDebt({
						id,
						amount: sum,
						currency: value,
						cost: data.data?.debts_cost,
					})
				)
				toast.success("Qarzdorlik muvoffaqiyatli kiritildi")
			} else if (data?.response?.data?.error === "DEBTS_COST_REQUIRED") {
				toast.warn("Kiritilgan summa mavjud summadan yuqori")
			} else {
				toast.error("Nomalum server xatolik")
			}
			dispatch(setLoading(false))
		})
	}

	const deleteDebt = (id) => {
		dispatch(setLoading(true))
		remove(`/ordered/ordered-delete/${id}`).then((data) => {
			if (data?.status === 200) {
				dispatch(
					deleteData({
						id,
						sum:
							data?.data?.debts_cost *
							data?.data?.debts_count *
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
			beforeGood?.goods_id &&
			beforeDeliver?.deliver_id &&
			beforeCost > 0 &&
			beforeCount > 0 &&
			beforeCurrency?.currency_name &&
			beforeDate &&
			beforeDueDate &&
			new Date(beforeDate) <= new Date(beforeDueDate)
		) {
			setBtn_loading(true)
			let newObj = {
				goods_id: beforeGood?.goods_id,
				deliver_id: beforeDeliver?.deliver_id,
				debts_cost: beforeCost,
				debts_count: beforeCount,
				debts_currency: beforeCurrency?.currency_symbol,
				debts_currency_amount: beforeCurrency.currency_amount,
				debts_due_date: new Date(beforeDueDate).toISOString(),
				debts_selected_date: new Date(beforeDate).toISOString(),
			}

			post("/ordered/ordered-post", newObj).then((data) => {
				if (data?.status === 200) {
					dispatch(addData(data?.data))
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
		setBeforeGood({})
		setBeforeDeliver({})
		setBeforeCost(0)
		setBeforeCount(0)
		setBeforeCurrency({})
		setBeforeDate("")
		setBeforeDueDate("")
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
		setBeforeGood({})
		setBeforeDeliver({})
		setBeforeCost(0)
		setBeforeCount(0)
		setBeforeCurrency({})
		setBeforeDate("")
		setBeforeDueDate("")
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
						submitted && stringCheck(beforeGood?.goods_name) !== null && "error"
					}`}
				>
					<label>Kategoriya</label>
					<Select
						showSearch
						allowClear
						placeholder="Kategoriya tanlang"
						className="select"
						suffixIcon={
							submitted && stringCheck(beforeGood?.goods_name) !== null ? (
								<Info size={20} />
							) : (
								<CaretDown size={16} />
							)
						}
						value={
							beforeGood?.goods_name
								? `${beforeGood?.goods_name} - ${beforeGood?.goods_code}`
								: null
						}
						onChange={(e) =>
							e ? setBeforeGood(JSON.parse(e)) : setBeforeGood({})
						}
					>
						{state.good?.data?.length
							? state.good.data.map((item, idx) => {
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
								stringCheck(
									beforeGood?.goods_name,
									"Kategoriya tanlash majburiy"
								)}
						</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form ${
						submitted &&
						stringCheck(beforeDeliver?.deliver_name) !== null &&
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
							submitted && stringCheck(beforeDeliver?.deliver_name) !== null ? (
								<Info size={20} />
							) : (
								<CaretDown size={16} />
							)
						}
						value={
							beforeDeliver?.deliver_name
								? `${beforeDeliver?.deliver_name} - ${format_phone_number(
										beforeDeliver?.deliver_nomer
								  )}`
								: null
						}
						onChange={(e) =>
							e ? setBeforeDeliver(JSON.parse(e)) : setBeforeDeliver({})
						}
					>
						{state.deliver?.data?.length
							? state.deliver.data.map((item, idx) => {
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
									beforeDeliver?.deliver_name,
									"Ta'minotchi tanlash majburiy"
								)}
						</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form regular ${
						submitted && numberCheck(beforeCount) !== null && "error"
					}`}
				>
					<label>Miqdor</label>
					<input
						type="text"
						placeholder="Son kiriting"
						className="input"
						value={beforeCount ? beforeCount : ""}
						onChange={(e) => setBeforeCount(e.target.value)}
					/>
					{submitted && numberCheck(beforeCount) !== null && <Info size={20} />}
					<div className="validation-field">
						<span>{submitted && numberCheck(beforeCount)}</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form ${
						submitted &&
						stringCheck(beforeCurrency?.currency_name) !== null &&
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
							submitted &&
							stringCheck(beforeCurrency?.currency_name) !== null ? (
								<Info size={20} />
							) : (
								<CaretDown size={16} />
							)
						}
						value={
							beforeCurrency?.currency_name
								? `${beforeCurrency?.currency_name} - ${addComma(
										beforeCurrency?.currency_amount
								  )}`
								: null
						}
						onChange={(e) =>
							e ? setBeforeCurrency(JSON.parse(e)) : setBeforeCurrency({})
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
									beforeCurrency?.currency_name,
									"Pul birligi tanlash majburiy"
								)}
						</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form regular ${
						submitted && numberCheck(beforeCost) !== null && "error"
					}`}
				>
					<label>Narx</label>
					<input
						type="text"
						placeholder="Narx kiriting"
						className="input"
						value={beforeCost ? beforeCost : ""}
						onChange={(e) => setBeforeCost(e.target.value)}
					/>
					{submitted && numberCheck(beforeCost) !== null && <Info size={20} />}
					<div className="validation-field">
						<span>{submitted && numberCheck(beforeCost)}</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form regular ${
						submitted && stringCheck(beforeDate) !== null && "error"
					}`}
				>
					<label>Berilgan sana</label>
					<input
						type="date"
						placeholder="Sana kiriting"
						className="input date"
						value={beforeDate ? beforeDate : ""}
						onChange={(e) => setBeforeDate(e.target.value)}
					/>
					<div className="validation-field">
						<span>
							{submitted && stringCheck(beforeDate, "Sana kiritish majburiy")}
						</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form regular ${
						(submitted && stringCheck(beforeDueDate) !== null && "error") ||
						(dateCompare(beforeDate, beforeDueDate) !== null && "error")
					}`}
				>
					<label>To'lanadigan sana</label>
					<input
						type="date"
						placeholder="Sana kiriting"
						className="input date"
						value={beforeDueDate ? beforeDueDate : ""}
						onChange={(e) => setBeforeDueDate(e.target.value)}
					/>
					<div className="validation-field">
						<span>
							{(submitted &&
								stringCheck(beforeDueDate, "Sana kiritish majburiy")) ||
								dateCompare(beforeDate, beforeDueDate)}
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
							? state.good.data.map((item, idx) => (
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
							: addSpace(state?.oDebt?.quantity)
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

			{state.oDebt?.loading ? (
				<Loader />
			) : (
				<ODebtTable
					data={searchSubmitted ? filteredData?.data : state.oDebt.data}
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

export default Order
