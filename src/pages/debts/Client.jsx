import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import DebtTable from "../../components/debt_table/debt_table"
import { error_modal } from "../../components/error_modal/error_modal"
import Loader from "../../components/loader/Loader"
import {
	deleteData,
	payClientDebt,
	setData,
	setLoading,
} from "../../components/reducers/debt"
import { patch, post, remove } from "../../customHook/api"
import { useOutletContext } from "react-router-dom"
import { toast } from "react-toastify"
import InfoItem from "../../components/info_item/InfoItem"
import { CurrencyDollar } from "@phosphor-icons/react"
import { Select } from "antd"
import Search from "../../components/search/Search"
import { addComma, formatSumma } from "../../components/addComma"
import format_phone_number from "../../components/format_phone_number/format_phone_number"

const Client = ({ getData }) => {
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
	const [searchSubmitted, setSearchSubmitted] = useState(false)

	// filter
	const [store, setStore] = useState("")
	const [supplier, setSupplier] = useState("")
	const [category, setCategory] = useState("")

	useEffect(() => {
		getData("debts", setData, setLoading)
	}, [])

	const handleSearch = () => {
		if (inputRef.current?.value.length > 0) {
			dispatch(setLoading(true))
			setSearchSubmitted(true)
			post("/debts/debts-filter", {
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
		patch(`/debts/debts-patch-done/${id}`).then((data) => {
			if (data?.status === 200) {
				dispatch(
					deleteData({
						id,
						sum:
							data?.data?.reports_count *
							data?.data?.reports_count_price *
							data?.data?.currency_amount,
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
		patch(`/debts/debts-patch-change/${id}`, { price: sum }).then((data) => {
			if (data?.status === 200) {
				dispatch(payClientDebt({ id, amount: sum, currency: value }))
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
		remove(`/debts/debts-delete/${id}`).then((data) => {
			if (data?.status === 200) {
				dispatch(
					deleteData({
						id: data?.data?.debts_id,
						sum:
							data?.data?.debts_count *
							data?.data?.debts_price *
							data?.data?.debts_currency_amount,
					})
				)
				toast.success("Qarzdorlik muvoffaqiyatli o'chirildi")
			} else {
				toast.error("Nomalum server xatolik")
			}
			dispatch(setLoading(false))
		})
	}

	return (
		<>
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
						placeholder="Mijoz"
						className="select"
						value={supplier ? supplier : null}
						onChange={(e) => setSupplier(e)}
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
										key={idx}
										value={item.goods_id}
										className="option-shrink"
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
							? formatSumma(+filteredData.amount)
							: formatSumma(state?.debt?.quantity)
					}
					name="Umumiy summa"
					icon={<CurrencyDollar size={24} color="var(--color-warning)" />}
					iconBgColor={"var(--bg-icon-warning)"}
				/>
			</div>

			<Search
				handleSearch={handleSearch}
				clearSearch={clearSearch}
				showAddBtn={false}
				className={"table-m"}
			/>

			{state.debt?.loading ? (
				<Loader />
			) : (
				<DebtTable
					data={searchSubmitted ? filteredData?.data : state.debt.data}
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

export default Client
