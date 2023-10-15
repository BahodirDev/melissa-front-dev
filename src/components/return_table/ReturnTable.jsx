import { Table } from "antd"
import moment from "moment/moment"
import noDataImg from "../../assets/img/no data.png"
import { addComma } from "../addComma"
import { productDeleteConfirm } from "../delete_modal/delete_modal"

const ReturnTable = ({ data, deleteItem, editItem }) => {
	let arr2 =
		data.length &&
		data?.map((item) => {
			return {
				id: item?.return_id,
				name: item?.return_name,
				store: item?.return_store,
				count: "x" + item?.return_count,
				cost_each: addComma(item?.return_cost) + " so'm",
				cost_total: addComma(item?.return_cost * item?.return_count) + " so'm",
				reason: item?.return_case,
				client:
					item?.clients?.clients_name +
					" - " +
					item?.clients?.clients_nomer?.replace(
						/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/,
						"+$1 ($2) $3-$4-$5"
					),
				data: moment(item?.return_createdat).format("YYYY/MM/DD"),
			}
		})

	const columns = [
		{
			title: "Ombor",
			dataIndex: "store",
		},
		{
			title: "Mahsulot",
			dataIndex: "name",
		},
		{
			title: "Mijoz",
			dataIndex: "client",
		},
		{
			title: "Izoh",
			dataIndex: "reason",
		},
		{
			title: "Miqdor",
			dataIndex: "count",
		},
		{
			title: "Narxi(har biri)",
			dataIndex: "cost_each",
		},
		{
			title: "Narxi(umumiy)",
			dataIndex: "cost_total",
		},
		{
			title: "Sana",
			dataIndex: "data",
			defaultSortOrder: "descend",
			sorter: (a, b) => moment(a.data).unix() - moment(b.datas).unix(),
		},
		{
			title: "Tahrirlash",
			render: (text, record) => (
				<nobr>
					<button
						className="btn btn-sm btn-outline-warning mx-1 table-edit__btn"
						onClick={() => editItem(record?.id)}
					>
						<i className="fas fa-edit"></i>
					</button>
					<button
						className="btn btn-sm btn-outline-danger mx-1"
						onClick={(e) =>
							productDeleteConfirm(
								e,
								"Qaytgan mahsulot",
								deleteItem,
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
						<span>Qaytgan mahsulot mavjud emas</span>
					</div>
				),
			}}
			dataSource={arr2}
			pagination={{
				position: ["bottomLeft"],
				pageSize: 20,
			}}
		/>
	)
}

export default ReturnTable
