import { DatePicker, Select, Space } from "antd"
import { Option } from "antd/es/mentions"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useOutletContext } from "react-router-dom"
import { addComma, addSpace, formatSumma } from "../../components/addComma"
import { addZero } from "../../components/addZero"
import Loader from "../../components/loader/Loader"
import { setData as setDataDeliver } from "../../components/reducers/deliver"
import {
	editDate,
	removeData,
	setCapital,
	setData,
	setIncome,
	setLoading,
	setOutcome,
} from "../../components/reducers/report"
import AntReportTable from "../../components/report_table/report_table"
import { get, patch, post, remove } from "../../customHook/api"
import "./report.css"
import { toast } from "react-toastify"
import InfoItem from "../../components/info_item/InfoItem"
import Search from "../../components/search/Search"
import { ArrowDown, ArrowUp, CurrencyDollar } from "@phosphor-icons/react"
import format_phone_number from "../../components/format_phone_number/format_phone_number"
import moment from "moment"
import AddModal from "../../components/add/AddModal"
import { stringCheck } from "../../components/validation"
import createPagination from "../../components/pagination/Pagination"
import Pagination from "../../components/pagination/Pagination"
const { RangePicker } = DatePicker

export default function Reports() {
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
	const { report, store, client, deliver } = useSelector((state) => state)
	const dispatch = useDispatch()

	const [userInfo, setUserInfo] = useState()

	const [submitted, setSubmitted] = useState(false)
	const [newDate, setNewDate] = useState("")
	const [btnLoading, setBtnLoading] = useState(false)
	const [objId, setObjId] = useState("")
	const [currentPage, setCurrentPage] = useState(1)
	const [limit, setLimit] = useState(20)
	const [totalPages, setTotalPage] = useState(1)

	// filter
	const [filteredData, setFilteredData] = useState({})
	const [searchSubmitted, setSearchSubmitted] = useState(false)
	const [selectedIncomeOutcome, setSelectedIncomeOutcome] = useState("all")
	const [storeId, setStoreId] = useState("")
	const [clientId, setClientId] = useState("")
	const [dateRange, setDateRange] = useState([])

	const getData = (name, setter) => {
		dispatch(setLoading(true))
		get(`/${name}/${name}-list`).then((data) => {
			if (data?.status === 201 || data?.status === 200) {
				if (name === "reports") {
					dispatch(setter(data?.data?.data))
					dispatch(setCapital(data?.data?.hisob?.totalProductCost))
					dispatch(setIncome(data?.data?.hisob?.totalCostPilus))
					dispatch(setOutcome(data?.data?.hisob?.totalCostMinus))
				} else {
					dispatch(setter(data?.data))
				}
			} else {
				toast.error("Nomalum server xatolik", { toastId: "" })
			}
			dispatch(setLoading(false))
		})
	}

	const getReports = () => {
		dispatch(setLoading(true))
		get(`reports/reports-list?limit=${limit}&page=${currentPage}`).then(
			(data) => {
				if (data?.status === 201 || data?.status === 200) {
					setTotalPage(Math.ceil(data?.data?.data[0]?.full_count / limit))
					dispatch(setData(data?.data?.data))
					dispatch(setCapital(data?.data?.hisob?.totalProductCost))
					dispatch(setIncome(data?.data?.hisob?.totalCostPilus))
					dispatch(setOutcome(data?.data?.hisob?.totalCostMinus))
				} else {
					toast.error("Nomalum server xatolik", { toastId: "" })
				}
				dispatch(setLoading(false))
			}
		)
	}

	useEffect(() => {
		getReports()
	}, [currentPage])

	useEffect(() => {
		setUserInfo(localStorage.getItem("role"))
		// getReports()
		getData("deliver", setDataDeliver)
	}, [])

	const handleFilter = () => {
		if (
			storeId ||
			clientId ||
			dateRange?.length ||
			selectedIncomeOutcome !== "all"
		) {
			dispatch(setLoading(true))
			setSearchSubmitted(true)

			let filterObj = {
				store: storeId,
				client: clientId,
				selectedDate: dateRange?.length
					? dateRange[0].format("YYYY/MM/DD")
					: "",
				finishedDate: dateRange?.length
					? dateRange[1].format("YYYY/MM/DD")
					: "",
				goods_name: inputRef.current?.value,
				goods_code: inputRef.current?.value,
			}
			if (selectedIncomeOutcome === "income") filterObj.isEnter = true
			else if (selectedIncomeOutcome === "outcome") filterObj.isEnter = false

			post("/reports/reports-filter", filterObj).then((data) => {
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

	const clearFilter = () => {
		setSelectedIncomeOutcome("all")
		setStoreId("")
		setClientId("")
		setDateRange([])
		setSearchSubmitted(false)
		setFilteredData([])
	}

	const handleSearch = () => {
		if (inputRef.current?.value.length > 0) {
			dispatch(setLoading(true))
			setSearchSubmitted(true)
			let filterObj = {
				store: storeId,
				client: clientId,
				selectedDate: dateRange?.length
					? dateRange[0].format("YYYY/MM/DD")
					: "",
				finishedDate: dateRange?.length
					? dateRange[1].format("YYYY/MM/DD")
					: "",
				goods_name: inputRef.current?.value,
				goods_code: inputRef.current?.value,
			}
			if (selectedIncomeOutcome === "income") filterObj.isEnter = true
			else if (selectedIncomeOutcome === "outcome") filterObj.isEnter = false

			post("/reports/reports-filter", filterObj).then((data) => {
				// console.log(data.data)
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

	const deleteReport = (id) => {
		remove(`/reports/reports-delete/${id}`).then((data) => {
			if (data?.status === 200 || data?.status === 201) {
				dispatch(removeData(id))
				toast.success("Hisobot muvoffaqiyatli o'chirildi")
			} else if (data?.response?.data?.error === "REPORTS_NOT_FOUND") {
				toast.error("Bunday hisobot topilmadi")
			} else {
				toast.error("Nomalum server xatolik")
			}
		})
	}

	const editReport = (id) => {
		setshowDropdown("")
		setAddModalVisible(true)
		setAddModalDisplay("block")
		setObjId(id)

		get(`/reports/reports-list/${id}`).then((data) => {
			if (data?.status === 200 || data?.status === 201) {
				setNewDate(moment(data?.data[0]?.reports_createdat).format("YYYY-MM-DD"))
			} else if (data?.response?.data?.error === "REPORTS_NOT_FOUND") {
				toast.error("Bunday hisobot topilmadi")
			} else {
				clearAndClose()
				toast.error("Nomalum server xatolik")
			}
		})
	}

	const clearAndClose = () => {
		setBtnLoading(false)
		setNewDate("")
		setSubmitted(false)

		setAddModalVisible(false)
		setTimeout(() => {
			setAddModalDisplay("none")
		}, 300)
	}

	const updateReport = () => {
		patch(`/reports/reports-patch/${objId}`, {
			reports_createdat: new Date(newDate).toISOString(),
		}).then((data) => {
			console.log(data)
			if (data?.status === 200 || data?.status === 201) {
				dispatch(editDate(objId))
				clearAndClose()
				toast.success("Hisobot muvoffaqiyatli o'zgartirildi")
			} else if (data?.response?.data?.error === "REPORTS_NOT_FOUND") {
				toast.error("Bunday hisobot topilmadi")
			} else {
				toast.error("Nomalum server xatolik")
			}
			setBtnLoading(false)
		})
	}

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber)
	}

	return (
		<>
			<AddModal
				addModalVisible={addModalVisible}
				setAddModalVisible={setAddModalVisible}
				addModalDisplay={addModalDisplay}
				setAddModalDisplay={setAddModalDisplay}
				name="Hisobot tahrirlash"
			>
				<div
					className={`input-wrapper modal-form regular ${
						submitted && stringCheck(newDate) !== null && "error"
					}`}
				>
					<label>Qayd qilingan sana</label>
					<input
						type="date"
						placeholder="Sana kiriting"
						className="input date"
						value={newDate ? newDate : ""}
						onChange={(e) => setNewDate(e.target.value)}
					/>
					<div className="validation-field">
						<span>{submitted && stringCheck(newDate)}</span>
					</div>
				</div>
				<div className="modal-btn-group">
					<button
						className="primary-btn"
						disabled={btnLoading}
						onClick={updateReport}
					>
						Saqlash
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
			</AddModal>

			<div className="filter-wrapper report">
				<div className="input-wrapper">
					<Select
						placeholder="Kirim Chiqim"
						className="select"
						value={selectedIncomeOutcome}
						onChange={(e) => setSelectedIncomeOutcome(e)}
					>
						<Select.Option value="all">
							<div>
								<span>Barchasi</span>
							</div>
						</Select.Option>
						<Select.Option value="income">
							<div>
								<span>Kirim</span>
							</div>
						</Select.Option>
						<Select.Option value="outcome">
							<div>
								<span>Chiqim</span>
							</div>
						</Select.Option>
					</Select>
				</div>
				<div className="input-wrapper">
					<Select
						showSearch
						allowClear
						placeholder="Ombor"
						className="select"
						value={storeId ? storeId : null}
						onChange={(e) => setStoreId(e)}
					>
						{store?.data.length
							? store?.data.map((item, idx) => (
									<Select.Option key={idx} value={item.store_name}>
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
						placeholder="Haridor"
						className="select"
						value={clientId ? clientId : null}
						onChange={(e) => setClientId(e)}
					>
						{client.data?.length || deliver.data?.length
							? selectedIncomeOutcome === "all"
								? [...client.data, ...deliver.data].map((item, idx) => {
										if (!item?.isdelete)
											if (item?.clients_name) {
												return (
													<Select.Option
														key={idx}
														value={item.clients_name}
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
											} else {
												return (
													<Select.Option
														key={idx}
														value={item.deliver_name}
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
											}
								  })
								: selectedIncomeOutcome === "income"
								? deliver.data.map((item, idx) => {
										if (!item?.isdelete)
											return (
												<Select.Option
													key={idx}
													value={item.deliver_name}
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
								: selectedIncomeOutcome === "outcome"
								? client.data.map((item, idx) => {
										if (!item?.isdelete)
											return (
												<Select.Option
													key={idx}
													value={item.clients_name}
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
								: null
							: null}
					</Select>
				</div>
				<div className="input-wrapper">
					<Space direction="vertical" size={12}>
						<RangePicker
							allowClear
							className="date-picker"
							value={dateRange}
							onChange={(e) => setDateRange(e)}
						/>
					</Space>
				</div>
				<div className="filter-btn-group">
					<button type="button" className="filter-btn" onClick={clearFilter}>
						Tozalash
					</button>
					<button type="button" className="filter-btn" onClick={handleFilter}>
						Saqlash
					</button>
				</div>
			</div>

			<div className="info-wrapper">
				<InfoItem
					value={addSpace(
						searchSubmitted
							? +filteredData?.hisob?.totalProductCost
							: report.capital
					)}
					name="Foyda"
					icon={<CurrencyDollar size={24} color="var(--color-primary)" />}
					iconBgColor={"var(--bg-icon)"}
				/>
				<InfoItem
					value={addSpace(
						searchSubmitted
							? +filteredData?.hisob?.totalCostMinus
							: report.outcome
					)}
					name="Kirim"
					icon={<ArrowDown size={24} color="var(--color-success)" />}
					iconBgColor={"var(--bg-success-icon)"}
				/>
				<InfoItem
					value={addSpace(
						searchSubmitted
							? +filteredData?.hisob?.totalCostPilus
							: report.income
					)}
					name="Chiqim"
					icon={<ArrowUp size={24} color="var(--color-warning)" />}
					iconBgColor={"var(--bg-icon-warning)"}
				/>
			</div>

			<Search
				handleSearch={handleSearch}
				clearSearch={clearSearch}
				showAddBtn={false}
				className={"table-m"}
			/>

			{report?.loading ? (
				<Loader />
			) : (
				<>
					<AntReportTable
						data={searchSubmitted ? filteredData?.data : report?.data}
						sidebar={sidebar}
						userRole={userInfo}
						showDropdown={showDropdown}
						setshowDropdown={setshowDropdown}
						deleteReport={deleteReport}
						editReport={editReport}
					/>

					<Pagination
						pages={totalPages}
						currentPage={currentPage}
						onPageChange={handlePageChange}
					/>
				</>
			)}
		</>
	)
}
