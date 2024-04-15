import { DatePicker, Select, Space } from "antd"
import { Option } from "antd/es/mentions"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useOutletContext } from "react-router-dom"
import {
	addComma,
	addSpace,
	formatSumma,
	roundToNearestThousand,
} from "../../components/addComma"
import { addZero } from "../../components/addZero"
import Loader from "../../components/loader/Loader"
import { setData as setDataDeliver } from "../../components/reducers/deliver"
import { setData as setDataUser } from "../../components/reducers/users"
import {
	editDate,
	removeData,
	setCapital,
	setData,
	setIncome,
	setLoading,
	setOutcome,
	setQtyIn,
	setQtyOut,
} from "../../components/reducers/report"
import AntReportTable from "../../components/report_table/report_table"
import {
	downloadExcelFile,
	get,
	patch,
	post,
	remove,
} from "../../customHook/api"
import "./report.css"
import { toast } from "react-toastify"
import InfoItem from "../../components/info_item/InfoItem"
import Search from "../../components/search/Search"
import {
	ArrowDown,
	ArrowUp,
	Cube,
	CurrencyDollar,
	MicrosoftExcelLogo,
} from "@phosphor-icons/react"
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
		userInfo,
		darkMode,
	] = useOutletContext()
	const navigate = useNavigate()
	const { report, store, client, deliver, users } = useSelector(
		(state) => state
	)
	const dispatch = useDispatch()

	const [submitted, setSubmitted] = useState(false)
	const [newDate, setNewDate] = useState("")
	const [btnLoading, setBtnLoading] = useState(false)
	const [objId, setObjId] = useState("")
	const [currentPage, setCurrentPage] = useState(1)
	const [limit, setLimit] = useState(20)
	const [totalPages, setTotalPage] = useState(1)
	const didMount = useRef(false)

	// filter
	const [filteredData, setFilteredData] = useState({})
	const [searchSubmitted, setSearchSubmitted] = useState(false)
	const [selectedIncomeOutcome, setSelectedIncomeOutcome] = useState("all")
	const [storeId, setStoreId] = useState("")
	const [deliverId, setDeliverId] = useState("")
	const [clientId, setClientId] = useState("")
	const [user, setUser] = useState("")
	const [dateRange, setDateRange] = useState([])

	const getData = (name, setter) => {
		dispatch(setLoading(true))
		get(`/${name}/${name}-list`).then((data) => {
			if (data?.status === 201 || data?.status === 200) {
				dispatch(setter(data?.data))
			} else {
				toast.error("Nomalum server xatolik", { toastId: "" })
			}
			dispatch(setLoading(false))
		})
	}

	const getReports = () => {
		dispatch(setLoading(true))
		if (
			storeId ||
			clientId ||
			dateRange?.length ||
			selectedIncomeOutcome !== "all" ||
			inputRef.current?.value.length > 0
		) {
			handleSearch()
		} else {
			get(`reports/reports-list?limit=${limit}&page=${currentPage}`).then(
				(data) => {
					if (data?.status === 201 || data?.status === 200) {
						setTotalPage(Math.ceil(data?.data?.data[0]?.full_count / limit))
						dispatch(setData(data?.data?.data))
						dispatch(setCapital(data?.data?.hisob?.totalProductCost))
						dispatch(setIncome(data?.data?.hisob?.totalCostPilus))
						dispatch(setOutcome(data?.data?.hisob?.totalCostMinus))
						dispatch(setQtyIn(data?.data?.hisob?.totalInput))
						dispatch(setQtyOut(data?.data?.hisob?.totalOuput))
					} else {
						setTotalPage(1)
						toast.error("Nomalum server xatolik", { toastId: "" })
					}
					dispatch(setLoading(false))
				}
			)
		}
	}

	useEffect(getReports, [currentPage])

	useEffect(() => {
		if (localStorage.getItem("role") !== "1") navigate("/*")

		getData("deliver", setDataDeliver)
		getData("users", setDataUser)
	}, [])

	const clearFilter = () => {
		setSelectedIncomeOutcome("all")
		setStoreId("")
		setDeliverId("")
		setUser("")
		setClientId("")
		setDateRange([])
		setSearchSubmitted(false)
		setFilteredData([])
		inputRef.current.value = ""
	}

	const handleSearch = () => {
		dispatch(setLoading(true))
		setSearchSubmitted(true)
		let filterObj = {
			store: storeId,
			deliver: deliverId,
			seller: user,
			client: clientId,
			selectedDate: dateRange?.length
				? dateRange[0].format("YYYY/MM/DD")
				: null,
			finishedDate: dateRange?.length
				? dateRange[1].format("YYYY/MM/DD")
				: null,
			search: inputRef.current?.value,
		}
		if (selectedIncomeOutcome === "income") filterObj.isEnter = true
		else if (selectedIncomeOutcome === "outcome") filterObj.isEnter = false
		post(
			`/reports/reports-filter?limit=${limit}&page=${currentPage}`,
			filterObj
		).then((data) => {
			if (data.status === 200) {
				setTotalPage(Math.ceil(data?.data?.data[0]?.full_count / limit))
				setFilteredData(data?.data)
				if (!data?.data?.data?.length) setCurrentPage(1)
			} else {
				setTotalPage(1)
				toast.error("Nomalum server xatolik")
			}
			dispatch(setLoading(false))
		})
	}

	useEffect(() => {
		setCurrentPage(1)
		if (didMount.current) {
			handleSearch()
		} else {
			didMount.current = true
		}
	}, [
		storeId,
		deliverId,
		user,
		clientId,
		dateRange,
		selectedIncomeOutcome,
		limit,
	])

	const deleteReport = (id) => {
		remove(`/reports/reports-delete/${id}`).then((data) => {
			if (data?.status === 200 || data?.status === 201) {
				dispatch(removeData(id))
				toast.success("Hisobot muvoffaqiyatli o'chirildi")
				if (searchSubmitted) {
					setFilteredData((prevState) => ({
						...prevState,
						data: prevState?.data.filter((item) => item.reports_id !== id),
					}))
				}
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
				setNewDate(
					moment(data?.data[0]?.reports_createdat).format("YYYY-MM-DD")
				)
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
			// console.log(data)
			if (data?.status === 200 || data?.status === 201) {
				clearAndClose()
				toast.success("Malumot muvoffaqiyatli o'zgartirildi")
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
		if (
			selectedIncomeOutcome === "all" &&
			storeId === "" &&
			deliverId === "" &&
			clientId === "" &&
			dateRange?.length === 0 &&
			inputRef.current.value === ""
		) {
			setSearchSubmitted(false)
		}
	}

	const handleDownload = () => {
		const dataToDownload = searchSubmitted ? filteredData?.data : report?.data
		if (!dataToDownload) {
			toast.warn("Yuklash uchun ma'lumot mavjud emas")
			return
		}
		downloadExcelFile(dataToDownload)
	}

	return (
		<>
			<AddModal name="Hisobot tahrirlash">
				<div
					className={`input-wrapper modal-form regular ${
						submitted && stringCheck(newDate) !== null && "error"
					} ${darkMode ? "dark" : null}`}
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
						className={`primary-btn ${darkMode ? "dark" : null}`}
						disabled={btnLoading}
						onClick={updateReport}
					>
						Saqlash
						{btnLoading && (
							<span
								className={`spinner-grow spinner-grow-sm`}
								role="status"
								aria-hidden="true"
								style={{ marginLeft: "5px" }}
							></span>
						)}
					</button>
					<button
						className={`secondary-btn ${darkMode ? "dark" : null}`}
						onClick={clearAndClose}
					>
						Bekor qilish
					</button>
				</div>
			</AddModal>

			<div className={`filter-wrapper report ${darkMode ? "dark" : null}`}>
				<div className={`input-wrapper ${darkMode ? "dark" : null}`}>
					<Select
						placeholder="Kirim Chiqim"
						className="select"
						value={selectedIncomeOutcome}
						onChange={(e) => setSelectedIncomeOutcome(e)}
					>
						<Select.Option
							value="all"
							className={`${darkMode ? "dark" : null}`}
						>
							<div>
								<span>Barchasi</span>
							</div>
						</Select.Option>
						<Select.Option
							value="income"
							className={`${darkMode ? "dark" : null}`}
						>
							<div>
								<span>Kirim</span>
							</div>
						</Select.Option>
						<Select.Option
							value="outcome"
							className={`${darkMode ? "dark" : null}`}
						>
							<div>
								<span>Chiqim</span>
							</div>
						</Select.Option>
					</Select>
				</div>
				<div className={`input-wrapper ${darkMode ? "dark" : null}`}>
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
									<Select.Option
										key={idx}
										value={item.store_name}
										className={`${darkMode ? "dark" : null}`}
									>
										<div>
											<span>{item?.store_name}</span>
										</div>
									</Select.Option>
							  ))
							: null}
					</Select>
				</div>
				<div className={`input-wrapper ${darkMode ? "dark" : null}`}>
					<Select
						showSearch
						allowClear
						placeholder="Sotuvchi"
						className="select"
						value={user ? user : null}
						onChange={(e) => setUser(e)}
					>
						{users?.data?.length
							? users?.data.map((item, idx) => {
									return (
										<Select.Option
											key={idx}
											value={item?.user_name}
											className={`${darkMode ? "dark" : null}`}
										>
											<div>
												<span>{item?.user_name}</span>
											</div>
										</Select.Option>
									)
							  })
							: null}
					</Select>
				</div>
				<div className={`input-wrapper ${darkMode ? "dark" : null}`}>
					<Select
						showSearch
						allowClear
						placeholder="Ta'minotchi"
						className="select"
						value={deliverId ? deliverId : null}
						onChange={(e) => setDeliverId(e)}
					>
						{deliver.data?.length
							? deliver.data.map((item, idx) => {
									if (!item?.isdelete)
										return (
											<Select.Option
												key={idx}
												value={item.deliver_name}
												className={`${darkMode ? "dark" : null}`}
											>
												<div>
													<span>{item?.deliver_name}</span>
												</div>
											</Select.Option>
										)
							  })
							: null}
					</Select>
				</div>
				<div className={`input-wrapper ${darkMode ? "dark" : null}`}>
					<Select
						showSearch
						allowClear
						placeholder="Mijoz"
						className="select"
						value={clientId ? clientId : null}
						onChange={(e) => setClientId(e)}
					>
						{client.data?.length
							? client.data.map((item, idx) => {
									if (!item?.isdelete)
										return (
											<Select.Option
												key={idx}
												value={item.clients_name}
												className={`option-shrink ${darkMode ? "dark" : null}`}
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
				<div className={`input-wrapper ${darkMode ? "dark" : null}`}>
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
					<button
						type="button"
						className={`filter-btn ${darkMode ? "dark" : null}`}
						onClick={clearFilter}
					>
						Tozalash
					</button>
					<button
						type="button"
						className={`filter-btn ${darkMode ? "dark" : null}`}
						onClick={handleDownload}
					>
						Yuklab olish <MicrosoftExcelLogo />
					</button>
					{/* <button type="button" className="filter-btn" onClick={handleFilter}>
						Saqlash
					</button> */}
				</div>
			</div>

			<div className="info-wrapper">
				<InfoItem
					value={
						addSpace(
							searchSubmitted
								? roundToNearestThousand(+filteredData?.hisob?.totalCostMinus)
								: roundToNearestThousand(report.outcome)
						) + " so'm"
					}
					name="Kirim"
					icon={<ArrowDown size={24} color="var(--color-success)" />}
					iconBgColor={`${darkMode ? "var(--d-bg-icon)" : "var(--bg-icon)"}`}
					darkMode={darkMode}
				/>
				<InfoItem
					value={
						addSpace(
							searchSubmitted
								? roundToNearestThousand(+filteredData?.hisob?.totalCostPilus)
								: roundToNearestThousand(report.income)
						) + " so'm"
					}
					name="Chiqim"
					icon={<ArrowUp size={24} color="var(--color-danger)" />}
					iconBgColor={`${darkMode ? "var(--d-bg-icon)" : "var(--bg-icon)"}`}
					darkMode={darkMode}
				/>
				<InfoItem
					value={
						addSpace(
							searchSubmitted
								? roundToNearestThousand(+filteredData?.hisob?.totalProductCost)
								: roundToNearestThousand(report.capital)
						) + " so'm"
					}
					name="Foyda"
					icon={<CurrencyDollar size={24} color="var(--color-primary)" />}
					iconBgColor={`${darkMode ? "var(--d-bg-icon)" : "var(--bg-icon)"}`}
					darkMode={darkMode}
				/>
				<InfoItem
					value={addSpace(
						searchSubmitted
							? filteredData?.hisob?.totalInput -
									filteredData?.hisob?.totalOuput
							: report.qtyIn - report.qtyOut
					)}
					name="Mavjud mahsulotlar soni"
					icon={<Cube size={24} color="var(--color-primary)" />}
					iconBgColor={`${darkMode ? "var(--d-bg-icon)" : "var(--bg-icon)"}`}
					darkMode={darkMode}
				/>
				<InfoItem
					value={addSpace(
						searchSubmitted ? filteredData?.hisob?.totalInput : report.qtyIn
					)}
					name="Kirgan mahsulotlar soni"
					icon={<ArrowDown size={24} color="var(--color-success)" />}
					iconBgColor={`${darkMode ? "var(--d-bg-icon)" : "var(--bg-icon)"}`}
					darkMode={darkMode}
				/>
				<InfoItem
					value={addSpace(
						searchSubmitted ? filteredData?.hisob?.totalOuput : report.qtyOut
					)}
					name="Chiqqan mahsulotlar soni"
					icon={<ArrowUp size={24} color="var(--color-danger)" />}
					iconBgColor={`${darkMode ? "var(--d-bg-icon)" : "var(--bg-icon)"}`}
					darkMode={darkMode}
				/>
			</div>

			<Search
				handleSearch={handleSearch}
				clearSearch={() => (inputRef.current.value = "")}
				showAddBtn={false}
				className={"table-m"}
				darkMode={darkMode}
			/>

			{report?.loading ? (
				<Loader />
			) : (
				<>
					<AntReportTable
						data={searchSubmitted ? filteredData?.data : report?.data}
						sidebar={sidebar}
						userRole={userInfo?.role}
						showDropdown={showDropdown}
						setshowDropdown={setshowDropdown}
						deleteReport={deleteReport}
						editReport={editReport}
						darkMode={darkMode}
						currentPage={currentPage}
						limit={limit}
					/>

					<Pagination
						pages={totalPages}
						currentPage={currentPage}
						onPageChange={handlePageChange}
						darkMode={darkMode}
					/>

					<div
						className={`input-wrapper ${
							darkMode ? "dark" : null
						} pagination-limit`}
					>
						<Select
							placeholder="Kirim Chiqim"
							className="select"
							value={limit}
							onChange={(e) => setLimit(e)}
						>
							<Select.Option
								value="10"
								className={`${darkMode ? "dark" : null}`}
							>
								<div>
									<span>10</span>
								</div>
							</Select.Option>
							<Select.Option
								value="25"
								className={`${darkMode ? "dark" : null}`}
							>
								<div>
									<span>25</span>
								</div>
							</Select.Option>
							<Select.Option
								value="50"
								className={`${darkMode ? "dark" : null}`}
							>
								<div>
									<span>50</span>
								</div>
							</Select.Option>
							<Select.Option
								value="100"
								className={`${darkMode ? "dark" : null}`}
							>
								<div>
									<span>100</span>
								</div>
							</Select.Option>
						</Select>
					</div>
				</>
			)}
		</>
	)
}
