import { DatePicker, Select, Space } from "antd"
import { Option } from "antd/es/mentions"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useOutletContext } from "react-router-dom"
import { addComma, formatSumma } from "../../components/addComma"
import { addZero } from "../../components/addZero"
import Loader from "../../components/loader/Loader"
import { setData as setDataDeliver } from "../../components/reducers/deliver"
import {
	setCapital,
	setData,
	setIncome,
	setLoading,
	setOutcome,
} from "../../components/reducers/report"
import AntReportTable from "../../components/report_table/report_table"
import { get, post } from "../../customHook/api"
import useApiRequest from "../../customHook/useUrl"
import "./report.css"
import { toast } from "react-toastify"
import InfoItem from "../../components/info_item/InfoItem"
import Search from "../../components/search/Search"
import { ArrowDown, ArrowUp, CurrencyDollar } from "@phosphor-icons/react"
import format_phone_number from "../../components/format_phone_number/format_phone_number"
import moment from "moment"
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

	useEffect(() => {
		setUserInfo(localStorage.getItem("role"))
		getData("reports", setData)
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
				if (data.status === 200) {
					setFilteredData(data?.data)
					console.log(data.data)
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
					value={formatSumma(
						searchSubmitted
							? +filteredData?.hisob?.totalProductCost
							: report.capital
					)}
					name="Foyda"
					icon={<CurrencyDollar size={24} color="var(--color-primary)" />}
					iconBgColor={"var(--bg-icon)"}
				/>
				<InfoItem
					value={formatSumma(
						searchSubmitted
							? +filteredData?.hisob?.totalCostMinus
							: report.outcome
					)}
					name="Kirim"
					icon={<ArrowDown size={24} color="var(--color-success)" />}
					iconBgColor={"var(--bg-success-icon)"}
				/>
				<InfoItem
					value={formatSumma(
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
				<AntReportTable
					data={searchSubmitted ? filteredData?.data : report?.data}
					sidebar={sidebar}
					userRole={userInfo}
				/>
			)}
		</>
	)
}
