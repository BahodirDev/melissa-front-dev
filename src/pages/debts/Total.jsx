import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Loader from "../../components/loader/Loader"
import { patch, post, remove } from "../../customHook/api"
import { useOutletContext } from "react-router-dom"
import { toast } from "react-toastify"
import InfoItem from "../../components/info_item/InfoItem"
import { CurrencyDollar, Info } from "@phosphor-icons/react"
import { Select } from "antd"
import Search from "../../components/search/Search"
import AddModal from "../../components/add/AddModal"
import {
	dateCompare,
	numberCheck,
	stringCheck,
} from "../../components/validation"
import {
	addData,
	deleteData,
	payNoteDebt,
	setData,
	setLoading,
} from "../../components/reducers/noteDebt"
import NDebtTable from "../../components/total_debt_table/total_debt_table"
import { addComma } from "../../components/addComma"

const Total = ({ getData }) => {
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
	const [totalName, setTotalName] = useState("")
	const [totalCost, setTotalCost] = useState(0)
	const [totalComment, setTotalComment] = useState("")
	const [totalDate, setTotalDate] = useState("")
	const [totalDueDate, setTotalDueDate] = useState("")

	useEffect(() => {
		getData("debts-note", setData, setLoading)
	}, [])

	const handleSearch = () => {
		if (inputRef.current?.value.length > 0) {
			dispatch(setLoading(true))
			setSearchSubmitted(true)
			post("/debts-note/debts-note-filter", {
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
		patch(`/debts-note/debts-note-patch-done/${id}`).then((data) => {
			if (data?.status === 200) {
				dispatch(deleteData({ id, sum: data?.data?.price }))
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
		patch(`/debts-note/debts-note-change/${id}`, { price: sum }).then(
			(data) => {
				if (data?.status === 200) {
					// dispatch(payDDebt({ id, sum, value }))
					dispatch(payNoteDebt({ id, price: sum }))
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
		remove(`/debts-note/debts-note-delete/${id}`).then((data) => {
			if (data?.status === 200) {
				dispatch(deleteData({ id, sum: data?.data?.price }))
				toast.success("Qarzdorlik muvoffaqiyatli o'chirildi")
			} else {
				toast.error("Nomalum server xatolik")
			}
			dispatch(setLoading(false))
		})
	}

	const addNewDebt = () => {
		setSubmitted(true)
		if (
			totalName.length &&
			totalCost > 0 &&
			totalDate &&
			totalDueDate &&
			new Date(totalDate) <= new Date(totalDueDate)
		) {
			setBtn_loading(true)
			let newObj = {
				client_name: totalName,
				price: totalCost,
				description: totalComment,
				debts_due_date: new Date(totalDate).toISOString(),
				selectedDate: new Date(totalDueDate).toISOString(),
			}

			post("/debts-note/debts-note-post", newObj).then((data) => {
				if (data?.status === 200) {
					dispatch(addData(data?.data))
					toast.success("Qarzdorlik muvoffaqiyatli qo'shildi")
					clearAndClose()
				} else {
					toast.error("Nomalum server xatolik")
				}
				setBtn_loading(false)
			})
		}
	}

	const clearAndClose = () => {
		setTotalName("")
		setTotalCost(0)
		setTotalComment("")
		setTotalDate("")
		setTotalDueDate("")
		// clear new data
		setObjId("")
		setSubmitted(false)
		setAddModalVisible(false)
		setTimeout(() => {
			setAddModalDisplay("none")
		}, 300)
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
					className={`input-wrapper modal-form regular 
					${submitted && stringCheck(totalName) !== null && "error"}
					`}
				>
					<label>Xaridor</label>
					<input
						type="text"
						placeholder="Xaridor ismini kiriting"
						className="input"
						value={totalName}
						onChange={(e) => setTotalName(e.target.value)}
					/>
					{submitted && stringCheck(totalName) !== null && <Info size={20} />}
					<div className="validation-field">
						<span>
							{submitted && stringCheck(totalName, "Ism kiritish majburiy")}
						</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form regular ${
						submitted && numberCheck(totalCost) !== null && "error"
					}`}
				>
					<label>Narx</label>
					<input
						type="text"
						placeholder="Qiymat kiriting"
						className="input"
						value={totalCost ? totalCost : ""}
						onChange={(e) => setTotalCost(e.target.value)}
					/>
					{submitted && numberCheck(totalCost) !== null && <Info size={20} />}
					<div className="validation-field">
						<span>{submitted && numberCheck(totalCost)}</span>
					</div>
				</div>
				<div className="input-wrapper modal-form regular">
					<label>Izoh</label>
					<textarea
						placeholder="Izoh"
						className="desc-input"
						value={totalComment}
						onChange={(e) => setTotalComment(e.target.value)}
					></textarea>
				</div>
				<div
					className={`input-wrapper modal-form regular ${
						submitted && stringCheck(totalDate) !== null && "error"
					}`}
				>
					<label>Berilgan sana</label>
					<input
						type="date"
						placeholder="Sana kiriting"
						className="input date"
						value={totalDate ? totalDate : ""}
						onChange={(e) => setTotalDate(e.target.value)}
					/>
					<div className="validation-field">
						<span>
							{submitted && stringCheck(totalDate, "Sana kiritish majburiy")}
						</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form regular ${
						(submitted && stringCheck(totalDueDate) !== null && "error") ||
						(dateCompare(totalDate, totalDueDate) !== null && "error")
					}`}
				>
					<label>To'lanadigan sana</label>
					<input
						type="date"
						placeholder="Sana kiriting"
						className="input date"
						value={totalDueDate ? totalDueDate : ""}
						onChange={(e) => setTotalDueDate(e.target.value)}
					/>
					<div className="validation-field">
						<span>
							{(submitted &&
								stringCheck(totalDueDate, "Sana kiritish majburiy")) ||
								dateCompare(totalDate, totalDueDate)}
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

			<div className="info-wrapper">
				<InfoItem
					value={
						searchSubmitted
							? addComma(filteredData.amount) + " so'm"
							: addComma(state?.nDebt?.quantity) + " so'm"
					}
					name="Umumiy summa"
					icon={
						<CurrencyDollar
							size={24}
							style={{ color: "var(--color-warning)" }}
						/>
					}
					iconBgColor={"var(--bg-icon-warning)"}
				/>
			</div>

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
						{state.deliver?.data.length
							? state.deliver?.data.map((item, idx) => {
									if (!item?.isdelete)
										return (
											<Select.Option key={idx} value={item.deliver_id}>
												<div>
													<span>{item?.deliver_name}</span>
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
						{state.good?.data.length
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

			<Search handleSearch={handleSearch} clearSearch={clearSearch} />

			{state.nDebt?.loading ? (
				<Loader />
			) : (
				<NDebtTable
					data={searchSubmitted ? filteredData?.data : state.nDebt.data}
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

export default Total
