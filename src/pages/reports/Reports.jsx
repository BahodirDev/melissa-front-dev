import { DatePicker, Select, Space } from "antd"
import { Option } from "antd/es/mentions"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useOutletContext } from "react-router-dom"
import { addComma } from "../../components/addComma"
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
import { get } from "../../customHook/api"
import useApiRequest from "../../customHook/useUrl"
import "./report.css"
const { RangePicker } = DatePicker

export default function Reports() {
	const [buttonValid, setButtonValid] = useState(false)
	const [filteredData, setFilteredData] = useState({})
	const request = useApiRequest()
	const { report, store, client, deliver } = useSelector((state) => state)
	const dispatch = useDispatch()
	const [searchSubmitted, setSearchSubmitted] = useState(false)

	// filter
	const [searchInput, setSearchInput, sidebar, userInfo, action, setAction] =
		useOutletContext()
	const [selectedIncomeOutcome, setSelectedIncomeOutcome] = useState("all")
	const [dateRange, setDateRange] = useState([])
	const [storeId, setStoreId] = useState("")
	const [clientId, setClientId] = useState("")

	useEffect(() => {
		let startDate = ""
		let endDate = ""
		if (dateRange.length) {
			startDate = `${dateRange[0]?.$y}-${addZero(
				dateRange[0]?.$M + 1
			)}-${addZero(dateRange[0]?.$D)}`
			endDate = `${dateRange[1]?.$y}-${addZero(dateRange[1]?.$M + 1)}-${addZero(
				dateRange[1]?.$D
			)}`
		}

		let filterObj = {
			store: storeId,
			client: clientId,
			selectedDate: startDate,
			finishedDate: endDate,
			goods_name: searchInput,
			goods_code: searchInput,
		}
		if (selectedIncomeOutcome === "income") {
			filterObj.isEnter = true
		} else if (selectedIncomeOutcome === "outcome") {
			filterObj.isEnter = false
		}

		setAction({
			url: "/reports/reports-filter",
			body: filterObj,
			res: setFilteredData,
			submitted: setSearchSubmitted,
			clearValues: {
				second: setDateRange,
				third: setFilteredData,
				fourth: setStoreId,
				fifth: setClientId,
				sixth: setSelectedIncomeOutcome,
			},
			setLoading: setLoading,
		})
	}, [dateRange, searchInput, storeId, clientId, selectedIncomeOutcome])

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
			}
			dispatch(setLoading(false))
		})
	}

	useEffect(() => {
		getData("reports", setData)
		getData("deliver", setDataDeliver)
	}, [])

	return (
		<>
			{report?.loading ? (
				<Loader />
			) : (
				<div className="report-table__wrapper">
					<Select
						style={{ marginRight: "10px", width: "150px" }}
						defaultValue="all"
						placeholder="Barchasi"
						optionLabelProp="label"
						onChange={(e) => {
							setSelectedIncomeOutcome(e)
							setButtonValid(true)
						}}
						value={selectedIncomeOutcome}
					>
						<Option value="all" chosen label="Barchasi">
							Barchasi
						</Option>
						<Option value="income" label="Kirim">
							Kirim
						</Option>
						<Option value="outcome" label="Chiqim">
							Chiqim
						</Option>
					</Select>
					<Select
						allowClear
						style={{ marginRight: "10px", width: "190px" }}
						placeholder="Ombor"
						optionLabelProp="label"
						onChange={(e) => setStoreId(e)}
						value={storeId ? storeId : null}
					>
						{store?.data?.length &&
							store?.data?.map((item) => (
								<Option value={item?.store_name} label={item?.store_name}>
									{item?.store_name}
								</Option>
							))}
					</Select>
					<Select
						showSearch
						style={{ marginRight: "10px", width: "200px" }}
						placeholder="Haridor"
						allowClear
						optionLabelProp="label"
						onChange={(e) => setClientId(e)}
						value={clientId ? clientId : null}
					>
						{[...client?.data, ...deliver?.data]?.map(
							(item) =>
								item?.isdelete || (
									<Option
										value={
											item?.clients_name
												? `${
														item?.clients_name
												  } - ${item?.clients_nomer.replace(
														/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/,
														"+$1 ($2) $3-$4-$5"
												  )}`
												: `${
														item?.deliver_name
												  } - ${item?.deliver_nomer.replace(
														/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/,
														"+$1 ($2) $3-$4-$5"
												  )}`
										}
										label={
											item?.clients_name
												? `${
														item?.clients_name
												  } - ${item?.clients_nomer.replace(
														/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/,
														"+$1 ($2) $3-$4-$5"
												  )}`
												: `${
														item?.deliver_name
												  } - ${item?.deliver_nomer.replace(
														/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/,
														"+$1 ($2) $3-$4-$5"
												  )}`
										}
										className="report-client-option"
									>
										<span>
											{item?.clients_name
												? item?.clients_name
												: item?.deliver_name}{" "}
											-{" "}
										</span>
										<span>
											{item?.clients_nomer
												? item?.clients_nomer?.replace(
														/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/,
														"+$1 ($2) $3-$4-$5"
												  )
												: item?.deliver_nomer?.replace(
														/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/,
														"+$1 ($2) $3-$4-$5"
												  )}
										</span>
									</Option>
								)
						)}
					</Select>

					<Space direction="vertical" size={12}>
						<RangePicker
							value={dateRange}
							clearIcon={true}
							onChange={(e) => setDateRange(e)}
						/>
					</Space>

					<div className="reports-info">
						<span>
							<i className="fa-solid fa-tags"></i> Foyda:{" "}
							{addComma(
								searchSubmitted
									? filteredData?.hisob?.totalProductCost >= 0
										? filteredData?.hisob?.totalProductCost
										: 0
									: report.capital >= 0
									? report.capital
									: 0
							)}{" "}
							so'm
						</span>
						<span>
							<i className="fa-solid fa-tags"></i> Kirim:{" "}
							{addComma(
								searchSubmitted
									? filteredData?.hisob?.totalCostMinus >= 0
										? filteredData?.hisob?.totalCostMinus
										: 0
									: report.outcome >= 0
									? report.outcome
									: 0
							)}{" "}
							so'm
						</span>
						<span>
							<i className="fa-solid fa-tags"></i> Chiqim:{" "}
							{addComma(
								searchSubmitted
									? filteredData?.hisob?.totalCostPilus >= 0
										? filteredData?.hisob?.totalCostPilus
										: 0
									: report.income >= 0
									? report.income
									: 0
							)}{" "}
							so'm
						</span>
					</div>

					<AntReportTable
						data={searchSubmitted ? filteredData?.data : report?.data}
					/>
				</div>
			)}
		</>
	)
}
