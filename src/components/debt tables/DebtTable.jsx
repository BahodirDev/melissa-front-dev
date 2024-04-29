import { Checkbox, Table } from "antd"
import NoData from "../noData/NoData"
import { addComma } from "../addComma"
import {
	ChatDots,
	CreditCard,
	CurrencyCircleDollar,
	DotsThreeVertical,
	Money,
	PencilSimple,
	Trash,
	Wallet,
} from "@phosphor-icons/react"
import moment from "moment"
import { useState } from "react"

export const DebtTable = ({
	data,
	sidebar,
	showDropdown,
	setshowDropdown,
	darkMode,
}) => {
	const [loc, setLoc] = useState(true)

	const handleClick = (e, id) => {
		showDropdown === id ? setshowDropdown("") : setshowDropdown(id)
		e.stopPropagation()
		setLoc(window.innerHeight - e.clientY > 110 ? false : true)
	}

	const handleClickSmallInfoModal = (e, id) => {
		// showDropdown === id ? setshowDropdown("") : setshowDropdown(id)
		// e.stopPropagation()
		// setLoc(window.innerHeight - e.clientY > 110 ? false : true)
	}

	let newArr =
		data?.length &&
		data?.map((item, idx) => {
			return {
				key: idx + 1,
				id: item?.transaction_id,
				from: item?.from_name,
				to: item?.to_name,
				summa: addComma(item?.transaction_money),
				type: item?.transaction_money_type,
				desc: item?.transaction_summary ? item?.transaction_summary : "...",
				date: `${moment(item?.transaction_created_at).format(
					"YYYY/MM/DD HH:mm"
				)}`,
			}
		})

	const columns = [
		{
			title: "Kimdan",
			dataIndex: "from",
		},
		{
			title: "Kimga",
			dataIndex: "to",
		},
		{
			title: "Summa",
			dataIndex: "summa",
		},
		{
			title: "To'lov turi",
			// dataIndex: "type",
			render: (text, record) =>
				record?.type === "cash" ? (
					<>
						<Wallet size={18} /> Naqd
					</>
				) : (
					<>
						<CreditCard size={18} /> Karta
					</>
				),
		},
		{
			title: "Izoh",
			render: (text, record) => (
				<button
					className="quantityBtn"
					onClick={(e) => handleClickSmallInfoModal(e, record?.id)}
				>
					<ChatDots size={16} />
				</button>
			),
		},
		{
			title: "Sana",
			dataIndex: "date",
		},
		{
			title: " ",
			width: "50px",
			render: (text, record) => (
				<div className="table-item-edit-holder">
					<button type="button" onClick={(e) => handleClick(e, record?.id)}>
						<DotsThreeVertical size={24} />
					</button>
					<div
						className={`table-item-edit-wrapper extra ${
							showDropdown === record?.id || "hidden"
						} ${loc && "top"} ${darkMode ? "dark" : null}`}
					>
						<button
							type="button"
							className="table-item-edit-item"
							// onClick={(e) => {
							// 	e.stopPropagation()
							// 	editReport(record?.id)
							// }}
						>
							Tahrirlash <PencilSimple size={20} />
						</button>
						<button
							type="button"
							className="table-item-edit-item"
							// onClick={(e) =>
							// 	productDeleteConfirm(
							// 		e,
							// 		<>
							// 			<span>
							// 				{record?.data_product + "-" + record?.data_code}
							// 			</span>{" "}
							// 			hisobotni
							// 		</>,
							// 		deleteReport,
							// 		record?.id,
							// 		darkMode
							// 	)
							// }
						>
							O'chirish <Trash size={20} />
						</button>
					</div>
				</div>
			),
		},
	]

	return (
		<div
			className="ant-d-table"
			style={{
				width: sidebar && "calc(100dvw - 309px)",
			}}
		>
			<Table
				scroll={{ x: "max-content" }}
				columns={columns}
				locale={{
					emptyText: <NoData />,
				}}
				dataSource={newArr}
				pagination={false}
			/>
		</div>
	)
}

export const DebtTableEquity = ({ data, sidebar }) => {
	let newArr =
		data?.length &&
		data?.map((item, idx) => {
			return {
				key: idx + 1,
				id: item?.transaction_id,
				name: item?.name,
				// debt: addComma(+item?.debt_card + +item?.debt_cash),
				// equity: addComma(+item?.equity_card + +item?.equity_cash),
				debt: addComma(item?.debt_cash),
				equity: addComma(item?.equity_cash),
			}
		})

	const columns = [
		{
			title: "Shaxs",
			dataIndex: "name",
		},
		{
			title: "Haqdorlik",
			render: (text, record) => (
				<>
					<CurrencyCircleDollar size={20} color="#4caf50" /> {record?.equity}
				</>
			),
		},
		{
			title: "Qarzdorlik",
			render: (text, record) => (
				<>
					<CurrencyCircleDollar size={20} color="#f44336" /> {record?.debt}
				</>
			),
		},
	]

	return (
		<div
			className="ant-d-table"
			style={{
				width: sidebar && "calc(100dvw - 309px)",
			}}
		>
			<Table
				scroll={{ x: "max-content" }}
				columns={columns}
				locale={{
					emptyText: <NoData />,
				}}
				dataSource={newArr}
				pagination={false}
			/>
		</div>
	)
}
