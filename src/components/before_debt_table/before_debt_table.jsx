import { Table } from "antd"
import moment from "moment"
import noDataImg from "../../assets/img/no data.png"
import { addComma } from "../addComma"
import { productDeleteConfirm } from "../delete_modal/delete_modal"
import { payConfirmModal } from "../pay_confirm_modal/pay_confirm_modal"
import { payModal } from "../pay_modal/pay_modal"

const BeforeDebtTable = ({
	data,
	deleteDebt,
	editDebt,
	beforeDebtCloseAtOnce,
}) => {
	let arr =
		data?.length &&
		data.map((item) => {
			return {
				id: item?.deliver_debt_id,
				cost: addComma(item?.debts_cost) + item?.debts_currency,
				count: "x" + (+item?.debts_count).toFixed(1),
				currencyName: item?.debts_currency,
				currencyAmount: item?.debts_currency_amount,
				each: item?.debts_cost,
				deliver: item?.deliver_id?.deliver_name,
				good: item?.goods_id?.deliver_name,
				totalCost:
					addComma(item?.debts_count * item?.debts_cost) + item?.debts_currency,
				date: `${moment(item?.debts_createdat).format("YYYY/MM/DD")}`,
				dueDate: `${moment(item?.debts_due_date).format("YYYY/MM/DD")}`,
			}
		})

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
			title: "Narx(har biri)",
			dataIndex: "cost",
		},
		{
			title: "Narx(umumiy)",
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
			title: "Tahrirlash",
			render: (text, record) => (
				<nobr>
					<button
						className="btn btn-sm btn-table-success mx-1"
						onClick={(e) =>
							payConfirmModal(e, beforeDebtCloseAtOnce, record?.id)
						}
					>
						<i className="fa-solid fa-check"></i>
					</button>
					<button
						className="btn btn-sm btn-outline-warning mx-1 table-edit__btn"
						onClick={(e) =>
							payModal(
								e,
								editDebt,
								record?.id,
								record?.count,
								"ta",
								record?.currencyAmount * record?.each
							)
						}
					>
						<i className="fas fa-edit"></i>
					</button>
					<button
						className="btn btn-sm btn-outline-danger"
						onClick={(e) =>
							productDeleteConfirm(e, "Oldindan to'lov", deleteDebt, record?.id)
						}
					>
						<i className="fa-solid fa-trash-can"></i>
					</button>
				</nobr>
			),
		},
	]

	return (
		<Table
			columns={columns}
			locale={{
				emptyText: (
					<div className="no-data__con">
						<img src={noDataImg} alt="" />
						<span>Qarzdorlik mavjud emas</span>
					</div>
				),
			}}
			dataSource={arr}
			pagination={{
				position: ["bottomLeft"],
				pageSize: 20,
			}}
		/>
	)
}

export default BeforeDebtTable
