import { Table } from "antd"
import moment from "moment/moment"
import noDataImg from "../../assets/img/no data.png"
import { addComma } from "../addComma"
import { payConfirmModal } from "../pay_confirm_modal/pay_confirm_modal"
import { productDeleteConfirm } from "../delete_modal/delete_modal"
import { payModal } from "../pay_modal/pay_modal"

const DDebtTable = ({
	data,
	closeDeliverDebt,
	deleteDeliverDebt,
	payDeliverDebt,
}) => {
	let arr = data?.map((item) => {
		if (!item?.isdone) {
			return {
				id: item?.deliver_debt_id,
				client:
					item?.deliver?.deliver_name +
					" " +
					item?.deliver?.deliver_nomer.replace(
						/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/,
						"+$1 ($2) $3-$4-$5"
					),
				product: item?.goods?.goods_name + " - " + item?.goods?.goods_code,
				quantity: "x" + item?.debts_count,
				price_each: addComma(item?.debts_cost) + item?.debts_currency,
				price_total:
					addComma(item?.debts_count * item?.debts_cost) + item?.debts_currency,
				date: `${moment(item?.debts_createdat)
					.zone(+7)
					.format("YYYY/MM/DD HH:MM")}`,
			}
		}
	})

	const columns = [
		{
			title: "Mijoz",
			dataIndex: "client",
			// defaultSortOrder: "ascend",
			sorter: (a, b) => a.client.localeCompare(b.client),
		},
		{
			title: "Kategoriya",
			dataIndex: "product",
		},
		{
			title: "Miqdor",
			dataIndex: "quantity",
		},
		{
			title: "Narx(har biri)",
			dataIndex: "price_each",
		},
		{
			title: "Narx(umumiy)",
			dataIndex: "price_total",
		},
		{
			title: "Sana",
			dataIndex: "date",
			defaultSortOrder: "descend",
			sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
			render: (text) => {
				return <>{text.slice(0, 10)}</>
			},
		},
		{
			title: "Tahrirlash",
			render: (text, record) => (
				<nobr>
					<button
						className="btn btn-sm btn-table-success"
						onClick={(e) => payConfirmModal(e, closeDeliverDebt, record?.id)}
					>
						<i className="fa-solid fa-check"></i>
					</button>
					<button
						className="btn btn-sm btn-outline-warning mx-1 table-edit__btn"
						onClick={(e) =>
							payModal(e, payDeliverDebt, record?.id, record?.price_total)
						}
					>
						<i className="fas fa-edit"></i>
					</button>
					<button
						className="btn btn-sm btn-outline-danger"
						onClick={(e) =>
							productDeleteConfirm(
								e,
								"Qarzdorlik",
								deleteDeliverDebt,
								record?.id
							)
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

export default DDebtTable
