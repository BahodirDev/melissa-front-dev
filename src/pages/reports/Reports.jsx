import { Button, DatePicker, Select, Space } from "antd"
import { Option } from "antd/es/mentions"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useOutletContext } from "react-router-dom"
import { addComma } from "../../components/addComma"
import { addZero } from "../../components/addZero"
import Loader from "../../components/loader/Loader"
import { setData as setDataDeliver } from "../../components/reducers/deliver"
import {
	setBenefit,
	setCapital,
	setData,
	setIncome,
	setLoading,
	setOutcome,
} from "../../components/reducers/report"
import AntReportTable from "../../components/report_table/report_table"
import useApiRequest from "../../customHook/useUrl"
import "./report.css"
const { RangePicker } = DatePicker

export default function Reports() {
	const [buttonValid, setButtonValid] = useState(false)
	const [filteredData, setFilteredData] = useState([])
	const request = useApiRequest()
	const { report, store, client, deliver } = useSelector((state) => state)
	const dispatch = useDispatch()

	// filter
	const [searchInput, setSearchInput] = useOutletContext()
	const [selectedIncomeOutcome, setSelectedIncomeOutcome] = useState("all")
	const [dateRange, setDateRange] = useState([])
	const [storeId, setStoreId] = useState("")
	const [clientId, setClientId] = useState("")

	useEffect(() => {
		let isValid =
			dateRange.length ||
			searchInput.length ||
			storeId?.length ||
			clientId?.length
		setButtonValid(isValid)
	}, [dateRange, searchInput, storeId, clientId])

	const getData = (name, setter) => {
		request("GET", `${process.env.REACT_APP_URL}/${name}/${name}-list`)
			.then((data) => {
				if (name === "reports") {
					// console.log(data)
					dispatch(setter(data?.data))
					dispatch(setCapital(data?.hisob?.totalProductCost))
					dispatch(setBenefit(data?.hisob?.totalCost))
					dispatch(setIncome(data?.hisob?.totalCostPilus))
					dispatch(setOutcome(data?.hisob?.totalCostMinus))
				} else {
					dispatch(setter(data))
				}
			})
			.catch((error) => {
				console.log(error)
			})
	}

	useEffect(() => {
		dispatch(setLoading(true))
		getData("reports", setData)
		getData("deliver", setDataDeliver)
		dispatch(setLoading(false))
	}, [])

	const clearFilters = () => {
		dispatch(setLoading(true))

		setSearchInput("")
		setDateRange([])
		setFilteredData([])
		setStoreId("")
		setClientId("")
		setSelectedIncomeOutcome("all")

		// window.location.reload(false) ---------------------------------------------last resort

		dispatch(setLoading(false))
	}

	const setFilters = () => {
		dispatch(setLoading(true))
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

		console.log(filterObj)
		request(
			"POST",
			`${process.env.REACT_APP_URL}/reports/reports-filter`,
			filterObj
		)
			.then((data) => {
				setFilteredData(data)
			})
			.catch((error) => {
				console.log(error?.response?.data?.error)
			})

		dispatch(setLoading(false))
	}

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

					<Button
						disabled={!buttonValid}
						onClick={clearFilters}
						style={{ marginRight: "10px" }}
					>
						O'chirish
					</Button>

					<Button onClick={setFilters} disabled={!buttonValid}>
						Ko'rish
					</Button>

					<div className="reports-info">
						<span>
							<i className="fa-solid fa-tags"></i> Umumiy savdo:{" "}
							{addComma(report?.benefit ? report.benefit : 0)} лв
						</span>
						<span>
							<i className="fa-solid fa-tags"></i> Foyda:{" "}
							{addComma(report?.capital ? report.capital : 0)} лв
						</span>
						<span>
							<i className="fa-solid fa-tags"></i> Kirim:{" "}
							{addComma(report?.outcome ? report.outcome : 0)} лв
						</span>
						<span>
							<i className="fa-solid fa-tags"></i> Chiqim:{" "}
							{addComma(report?.income ? report.income : 0)} лв
						</span>
					</div>
					<AntReportTable
						data={filteredData?.length ? filteredData : report?.data}
					/>
				</div>
			)}
		</>
	)
}
