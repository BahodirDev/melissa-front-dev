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

const ODebtTable = ({
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

	let arr = data?.length
		? data.map((item, id) => {
				return {
					key: id,
					id: item?.deliver_debt_id,
					cost: addComma(item?.debts_cost) + item?.debts_currency,
					count: (+item?.debts_count).toFixed(1),
					currencyName: item?.debts_currency,
					currencyAmount: item?.debts_currency_amount,
					each: item?.debts_cost,
					deliver: item?.deliver_id?.deliver_name,
					good: item?.goods_id?.deliver_name,
					totalCost:
						addComma(item?.debts_count * item?.debts_cost) +
						item?.debts_currency,
					date: `${moment(item?.debts_createdat).format("YYYY/MM/DD")}`,
					dueDate: `${moment(item?.debts_due_date).format("YYYY/MM/DD")}`,
				}
		  })
		: []

	const columns = [
		{
			title: "Ta'minotchi",
			dataIndex: "deliver",
		},
		{
			title: "Mahsulot",
			dataIndex: "good",
		},
		{
			title: "Miqdor",
			dataIndex: "count",
		},
		{
			title: "Narx",
			dataIndex: "cost",
		},
		{
			title: "Umumiy narx",
			dataIndex: "totalCost",
		},
		{
			title: "Berilgan sana",
			dataIndex: "date",
		},
		{
			title: "To'lanadigan sana",
			dataIndex: "dueDate",
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
									record?.count,
									record?.currencyAmount,
									record?.deliver
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
										<span>{record?.deliver}</span> qarzni
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
										<span>{record?.deliver}</span> qarzni
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
				width: sidebar && "calc(100dvw - 309px)",
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
					showSizeChanger: false,
					position: ["bottomLeft"],
					pageSize: 20,
				}}
			/>
		</div>
	)
}

export default ODebtTable
