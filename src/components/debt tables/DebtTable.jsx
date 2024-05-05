import { Checkbox, Table } from "antd"
import NoData from "../noData/NoData"
import { addComma } from "../addComma"
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
import { productDeleteConfirm } from "../delete_modal/delete_modal"
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
				summa: addComma(item?.transaction_money),
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
			// dataIndex: "from",
			render: (text, record) => (
				<p
					onClick={() =>
						record?.t_type === "income" && record?.status === "client"
							? navigate(`/clients/${record?.from}`, {
									state: {
										id: record?.from_id,
										name: record?.from,
										desc: record?.from_desc,
										tel: record?.from_tel,
										date: record?.from_date,
									},
							  })
							: null
					}
					style={{
						textDecoration: `${
							record?.t_type === "income" && record?.status === "client"
								? "underline"
								: null
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
							? navigate(`/clients/${record?.to}`, {
									state: {
										id: record?.to_id,
										name: record?.to,
										desc: record?.to_desc,
										tel: record?.to_tel,
										date: record?.to_date,
									},
							  })
							: null
					}
					style={{
						textDecoration: `${
							record?.t_type === "outcome" && record?.status === "client"
								? "underline"
								: null
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
								productDeleteConfirm(
									e,
									<>
										<span>
											{record?.t_type === "income" ? record?.from : record?.to}
										</span>{" "}
										qarzdorligini
									</>,
									handleDelete,
									record?.id,
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
				id: item?.id,
				status: item?.details?.status,

				name: item?.details?.name,
				name_id: item?.id,
				name_desc: item?.details?.description,
				name_tel: item?.details?.nomer,

				debt: addComma(item?.debt),
				equity: addComma(item?.equity),
			}
		})

	const columns = [
		{
			title: "Shaxs",
			render: (text, record) => (
				<p
					onClick={() =>
						record?.status === "client"
							? navigate(`/clients/${record?.from}`, {
									state: {
										id: record?.name_id,
										name: record?.name,
										desc: record?.name_desc,
										tel: record?.name_tel,
										date: record?.name_date,
									},
							  })
							: null
					}
					style={{
						textDecoration: `${
							record?.status === "client" ? "underline" : null
						}`,
						cursor: `${record?.status === "client" ? "pointer" : "auto"}`,
					}}
				>
					{record?.name}
				</p>
			),
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
