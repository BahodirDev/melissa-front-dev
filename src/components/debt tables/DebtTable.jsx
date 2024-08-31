import { Checkbox, Table } from "antd"
import NoData from "../noData/NoData"
import { addComma, addCommaWithTwoFixed } from "../addComma"
import {
	ChatDots,
	CreditCard,
	CurrencyCircleDollar,
	DotsThreeVertical,
	Info,
	Money,
	PencilSimple,
	Trash,
	Wallet,
} from "@phosphor-icons/react"
import moment from "moment"
import { useEffect, useState } from "react"
import { transactionDeleteConfirm } from "../delete_modal/delete_modal"
import { useNavigate } from "react-router-dom"

export const DebtTable = ({
	data,
	sidebar,
	showDropdown,
	setshowDropdown,
	darkMode,
	handleDelete,
}) => {
	const [loc, setLoc] = useState(true)
	const navigate = useNavigate()

	const handleClick = (e, id) => {
		showDropdown === id ? setshowDropdown("") : setshowDropdown(id)
		e.stopPropagation()
		setLoc(window.innerHeight - e.clientY > 110 ? false : true)
	}

	let newArr =
		data?.length &&
		data?.map((item, idx) => {
			return {
				key: idx + 1,
				id: item?.transaction_id,

				from: item?.details_from?.name,
				from_id: item?.transaction_from,
				from_desc: item?.details_from?.description,
				from_tel: item?.details_from?.nomer,
				from_date: item?.details_from?.created_at,

				to: item?.details_to?.name,
				to_id: item?.transaction_to,
				to_desc: item?.details_to?.description,
				to_tel: item?.details_to?.nomer,
				to_date: item?.details_to?.created_at,

				status: item?.transaction_status,
				summa: `${item?.transaction_currency === "Dollar" ? "$ " : ""} ${
					item?.transaction_currency === "Dollar"
						? addCommaWithTwoFixed(item?.transaction_money)
						: addComma(item?.transaction_money)
				} ${item?.transaction_currency === "Dollar" ? "" : " so'm"}`,
				summ: item?.transaction_money,
				currency: item?.transaction_currency,
				type: item?.transaction_money_type,
				t_type: item?.transaction_type,
				desc: item?.transaction_summary
					? item?.transaction_summary
					: "Izoh mavjud emas",
				date: `${moment(item?.transaction_created_at).format(
					"YYYY/MM/DD HH:mm"
				)}`,
			}
		})

	const columns = [
		{
			title: "Kimdan",
			render: (text, record) => (
				<p
					onClick={() =>
						record?.t_type === "income" && record?.status === "client"
							? navigate(`/clients/${record?.from_id}`)
							: null
					}
					style={{
						textDecoration: `${
							record?.t_type === "income" && record?.status === "client"
								? "underline"
								: "none"
						}`,
						cursor: `${
							record?.t_type === "income" && record?.status === "client"
								? "pointer"
								: "auto"
						}`,
					}}
				>
					{record?.from}
				</p>
			),
		},
		{
			title: "Kimga",
			render: (text, record) => (
				<p
					onClick={() =>
						record?.t_type === "outcome" && record?.status === "client"
							? navigate(`/clients/${record?.to_id}`)
							: null
					}
					style={{
						textDecoration: `${
							record?.t_type === "outcome" && record?.status === "client"
								? "underline"
								: "none"
						}`,
						cursor: `${
							record?.t_type === "outcome" && record?.status === "client"
								? "pointer"
								: "auto"
						}`,
					}}
				>
					{record?.to}
				</p>
			),
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
				<>
					<button className="quantityBtn clickDropdownBtn">
						<ChatDots size={16} />
						<div className="clickDropdownContent">
							<span>
								<Info size={16} />{" "}
							</span>
							{record?.desc}
						</div>
					</button>
				</>
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
							onClick={(e) =>
								transactionDeleteConfirm(
									e,
									<>
										<span>
											{record?.t_type === "income" ? record?.from : record?.to}
										</span>{" "}
										qarzdorligini
									</>,
									handleDelete,
									record?.id,
									record?.t_type,
									record?.status,
									record?.summ,
									record?.currency,
									darkMode
								)
							}
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
	const navigate = useNavigate()

	let newArr =
		data?.length &&
		data?.map((item, idx) => {
			return {
				key: idx + 1,
				id: item?.entity_id,
				type: item?.entity_type,
				name: item?.entity_name,

				equity: `${
					item?.dollar_debt - item?.dollar_equity < 0
						? "$ " +
						  addCommaWithTwoFixed(
								Math.abs(item?.dollar_debt - item?.dollar_equity)
						  )
						: `${item?.sum_debt - item?.sum_equity < 0 ? "" : "-"}`
				} ${
					item?.sum_debt - item?.sum_equity < 0
						? `${item?.dollar_debt - item?.dollar_equity < 0 ? " - " : ""}` +
						  addComma(Math.abs(item?.sum_debt - item?.sum_equity)) +
						  " so'm"
						: `${item?.dollar_debt - item?.dollar_equity < 0 ? "" : "-"}`
				}`,
				debt: `${
					item?.dollar_debt - item?.dollar_equity > 0
						? "$ " +
						  addCommaWithTwoFixed(
								Math.abs(item?.dollar_debt - item?.dollar_equity)
						  )
						: `${item?.sum_debt - item?.sum_equity > 0 ? "" : "-"}`
				} ${
					item?.sum_debt - item?.sum_equity > 0
						? `${item?.dollar_debt - item?.dollar_equity > 0 ? " | " : ""}` +
						  addComma(Math.abs(item?.sum_debt - item?.sum_equity)) +
						  " so'm"
						: `${item?.dollar_debt - item?.dollar_equity > 0 ? "" : "-"}`
				}`,
			}
		})

	const columns = [
		{
			title: "Shaxs",
			render: (text, record) => (
				<p
					onClick={() =>
						record?.type === "client"
							? navigate(`/clients/${record?.id}`)
							: null
					}
					style={{
						textDecoration: `${record?.type === "client" ? "underline" : null}`,
						cursor: `${record?.type === "client" ? "pointer" : "auto"}`,
					}}
				>
					{record?.name}
				</p>
			),
		},
		{
			title: "Haqdor",
			dataIndex: "equity",
		},
		{
			title: "Qarzdor",
			dataIndex: "debt",
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

// alternative to same named table above
// export const DebtTableEquity = ({ data, sidebar }) => {
// 	const navigate = useNavigate()

// 	let newArr =
// 		data?.length &&
// 		data?.map((item, idx) => {
// 			return {
// 				key: idx + 1,
// 				id: item?.entity_id,
// 				type: item?.entity_type,
// 				name: item?.entity_name,
// 				dollar: `${
// 					item?.dollar_debt - item?.dollar_equity < 0
// 						? addCommaWithTwoFixed(
// 								Math.abs(item?.dollar_debt - item?.dollar_equity)
// 						  )
// 						: addCommaWithTwoFixed(
// 								Math.abs(item?.dollar_debt - item?.dollar_equity)
// 						  )
// 				}`,
// 				dollarTitle: `${
// 					item?.dollar_debt - item?.dollar_equity < 0 ? "Haqdor" : "Qarzdor"
// 				}`,
// 				sum: `${
// 					item?.sum_debt - item?.sum_equity < 0
// 						? addComma(Math.abs(item?.sum_debt - item?.sum_equity))
// 						: addComma(Math.abs(item?.sum_debt - item?.sum_equity))
// 				}`,
// 				sumTitle: `${
// 					item?.sum_debt - item?.sum_equity < 0 ? "Haqdor" : "Qarzdor"
// 				}`,
// 			}
// 		})

// 	// clientInfo?.dollar_debt - clientInfo?.dollar_equity < 0
// 	// 	? `Haqdor: $ ${addCommaWithTwoFixed(
// 	// 			Math.abs(clientInfo?.dollar_debt - clientInfo?.dollar_equity)
// 	// 	  )}`
// 	// 	: `Qarzdor: $ ${addCommaWithTwoFixed(
// 	// 			Math.abs(clientInfo?.dollar_debt - clientInfo?.dollar_equity)
// 	// 	  )}`

// 	const columns = [
// 		{
// 			title: "Shaxs",
// 			render: (text, record) => (
// 				<p
// 					onClick={() =>
// 						record?.type === "client"
// 							? navigate(`/clients/${record?.id}`)
// 							: null
// 					}
// 					style={{
// 						textDecoration: `${record?.type === "client" ? "underline" : null}`,
// 						cursor: `${record?.type === "client" ? "pointer" : "auto"}`,
// 					}}
// 				>
// 					{record?.name}
// 				</p>
// 			),
// 		},
// 		{
// 			title: "Dollarda",
// 			render: (text, record) => (
// 				<>
// 					{record?.dollarTitle}:{" "}
// 					<CurrencyCircleDollar
// 						size={20}
// 						color={record?.dollarTitle === "Haqdor" ? "#f44336" : "#4caf50"}
// 					/>{" "}
// 					{record?.dollar}
// 				</>
// 			),
// 		},
// 		{
// 			title: "So'mda",
// 			render: (text, record) => (
// 				<>
// 					{record?.sumTitle}:{" "}
// 					{/* <CurrencyCircleDollar
// 						size={20}
// 						color={record?.sumTitle === "Haqdor" ? "#f44336" : "#4caf50"}
// 					/>{" "} */}
// 					{record?.sum} so'm
// 				</>
// 			),
// 		},
// 	]

// 	return (
// 		<div
// 			className="ant-d-table"
// 			style={{
// 				width: sidebar && "calc(100dvw - 309px)",
// 			}}
// 		>
// 			<Table
// 				scroll={{ x: "max-content" }}
// 				columns={columns}
// 				locale={{
// 					emptyText: <NoData />,
// 				}}
// 				dataSource={newArr}
// 				pagination={false}
// 			/>
// 		</div>
// 	)
// }
