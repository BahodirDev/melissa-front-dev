import { Table } from "antd"
import moment from "moment/moment"
import noDataImg from "../../assets/img/no data.png"
import { addComma } from "../addComma"
import { productDeleteConfirm } from "../delete_modal/delete_modal"
import { payConfirmModal } from "../pay_confirm_modal/pay_confirm_modal"
import { payModal } from "../pay_modal/pay_modal"
import NoData from "../noData/NoData"
import {
	CheckCircle,
	DotsThree,
	DotsThreeVertical,
	PencilSimple,
	PlusMinus,
	Trash,
} from "@phosphor-icons/react"
import { useState } from "react"

const DDebtTable = ({
	data,
	closeDebt,
	payDebt,
	deleteDebt,
	showDropdown,
	setshowDropdown,
	sidebar,
}) => {
	const [loc, setLoc] = useState(true)

	const handleClick = (e, id) => {
		showDropdown === id ? setshowDropdown("") : setshowDropdown(id)
		e.stopPropagation()
		setLoc(window.innerHeight - e.clientY > 110 ? false : true)
	}

	let arr = []
	data?.length &&
		data?.map((item, idx) => {
			if (!item?.isdone) {
				arr.push({
					key: idx,
					id: item?.deliver_debt_id,
					name: item?.deliver?.deliver_name,
					client:
						item?.deliver?.deliver_name +
						" " +
						item?.deliver?.deliver_nomer.replace(
							/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/,
							"+$1 ($2) $3-$4-$5"
						),
					product: item?.goods?.goods_name + " - " + item?.goods?.goods_code,
					quantity: "x" + (+item?.debts_count).toFixed(1),
					currencyAmount: item?.debts_currency_amount,
					currencyName: item?.debts_currency,
					price_each: addComma(item?.debts_cost) + item?.debts_currency,
					price_total: addComma(item?.debts_total_price) + item?.debts_currency,
					date: `${moment(item?.debts_createdat).format("YYYY/MM/DD")}`,
					duedate: `${moment(item?.debts_due_date).format("YYYY/MM/DD HH:MM")}`,
				})
			}
		})

	const columns = [
		{
			title: "Mijoz",
			dataIndex: "client",
			sorter: (a, b) => a.client.localeCompare(b.client),
		},
		{
			title: "Mahsulot",
			dataIndex: "product",
		},
		{
			title: "Miqdor",
			dataIndex: "quantity",
		},
		{
			title: "Narx",
			dataIndex: "price_each",
		},
		{
			title: "Umumiy narx",
			dataIndex: "price_total",
		},
		{
			title: "Berilgan sana",
			dataIndex: "date",
		},
		{
			title: "To'lanadigan sana",
			dataIndex: "duedate",
			defaultSortOrder: "descend",
			sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
			render: (text) => {
				return <>{text.slice(0, 10)}</>
			},
		},
		{
			title: "",
			width: "50px",
			render: (text, record) => (
				<div className="table-item-edit-holder">
					<button type="button" onClick={(e) => handleClick(e, record?.id)}>
						<DotsThreeVertical size={24} />
					</button>
					<div
						className={`table-item-edit-wrapper ${
							showDropdown === record?.id || "hidden"
						} ${loc && "top"}`}
					>
						<button
							type="button"
							className="table-item-edit-item"
							onClick={(e) =>
								payModal(
									e,
									payDebt,
									record?.id,
									record?.price_total,
									record?.currencyAmount,
									record?.name
								)
							}
						>
							<nobr>Qisman to'lash</nobr>
							<PlusMinus size={20} />
						</button>
						<button
							type="button"
							className="table-item-edit-item"
							onClick={(e) =>
								payConfirmModal(
									e,
									<>
										<span>{record?.name}</span> qarzni
									</>,
									closeDebt,
									record?.id
								)
							}
						>
							<nobr>Qarzni yopish</nobr>
							<CheckCircle size={20} />
						</button>
						<button
							type="button"
							className="table-item-edit-item"
							onClick={(e) =>
								productDeleteConfirm(
									e,
									<>
										<span>{record?.name}</span> qarzni
									</>,
									deleteDebt,
									record?.id
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
				width: sidebar && "calc(100dvw - 302px)",
			}}
		>
			<Table
				scroll={{ x: "max-content" }}
				columns={columns}
				locale={{
					emptyText: <NoData />,
				}}
				dataSource={arr}
				pagination={{
					position: ["bottomLeft"],
					pageSize: 20,
				}}
			/>
		</div>
	)
}

export default DDebtTable
