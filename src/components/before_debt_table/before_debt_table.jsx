import { Table } from "antd"
import moment from "moment"
import noDataImg from "../../assets/img/no data.png"

const BeforeDebtTable = ({ data, closeDebt, payDebt, deleteDebt }) => {
	let arr =
		data?.length &&
		data.map((item) => {
			return {
				cost: item?.debts_cost + item?.debts_currency,
				count: "x" + item?.debts_count,
				currencyName: item?.debts_currency,
				currencyAmount: item?.debts_currency_amount,
				deliver: item?.deliver_id,
				good: item?.goods_id,
				date: `${moment(item?.debts_createdat).zone(+7).format("YYYY/MM/DD")}`,
				dueDate: `${moment(item?.debts_due_date)
					.zone(+7)
					.format("YYYY/MM/DD")}`,
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
			title: "Narx",
			dataIndex: "cost",
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
						// onClick={(e) => payConfirmModal(e, closeDebt, record?.id)}
					>
						<i className="fa-solid fa-check"></i>
					</button>
					<button
						className="btn btn-sm btn-outline-warning mx-1 table-edit__btn"
						// onClick={(e) =>
						// 	payModal(e, payDebt, record?.id, record?.price_total)
						// }
					>
						<i className="fas fa-edit"></i>
					</button>
					<button
						className="btn btn-sm btn-outline-danger"
						// onClick={(e) =>
						// 	productDeleteConfirm(e, "Qarzdorlik", deleteDebt, record?.id)
						// }
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
