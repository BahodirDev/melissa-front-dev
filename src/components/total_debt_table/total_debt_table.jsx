import { Table } from "antd"
import moment from "moment/moment"
import noDataImg from "../../assets/img/no data.png"
import { addComma } from "../addComma"
import { productDeleteConfirm } from "../delete_modal/delete_modal"
import { payConfirmModal } from "../pay_confirm_modal/pay_confirm_modal"
import { payModal } from "../pay_modal/pay_modal"

const AntTable = ({
	data,
	deleteTotalDebt,
	totalDebtPart,
	totalDebtCloseAtOnce,
}) => {
	let arr = []
	data?.length &&
		data?.map((item) => {
			if (item?.isdone === false) {
				arr.push({
					total_id: item?.debts_id,
					client: item?.client_name,
					price: addComma(item?.price),
					desc: item?.description,
					date: `${moment(item?.debts_createdat)
						.zone(+7)
						.format("YYYY/MM/DD HH:MM")}`,
					duedate: `${moment(item?.debts_due_date)
						.zone(+7)
						.format("YYYY/MM/DD HH:MM")}`,
				})
			}
		})

	const columns = [
		{
			title: "Haridor",
			dataIndex: "client",
		},
		{
			title: "Narx",
			dataIndex: "price",
		},
		{
			title: "Izoh",
			dataIndex: "desc",
		},
		{
			title: "Berilgan sana",
			dataIndex: "date",
			render: (text) => {
				return <>{moment(text).format("YYYY-MM-DD")}</>
			},
		},
		{
			title: "To'lanadigan sana",
			dataIndex: "duedate",
			defaultSortOrder: "ascend",
			sorter: (a, b) => moment(a.duedate) - moment(b.duedate),
			render: (text) => {
				return <>{moment(text).format("YYYY-MM-DD")}</>
			},
		},
		{
			title: "Tahrirlash",
			render: (text, record) => (
				<nobr>
					<button
						className="btn btn-sm btn-table-success mx-1"
						onClick={(e) =>
							payConfirmModal(e, totalDebtCloseAtOnce, record?.total_id)
						}
					>
						<i className="fa-solid fa-check"></i>
					</button>
					<button
						className="btn btn-sm btn-outline-warning mx-1 table-edit__btn"
						onClick={(e) =>
							payModal(e, totalDebtPart, record?.total_id, record?.price)
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
								deleteTotalDebt,
								record?.total_id
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

export default AntTable

// import { Table } from "antd"
// import moment from "moment/moment"
// import noDataImg from "../../assets/img/no data.png"
// import { addComma } from "../addComma"
// import { productDeleteConfirm } from "../delete_modal/delete_modal"
// import { payConfirmModal } from "../pay_confirm_modal/pay_confirm_modal"
// import { payModal } from "../pay_modal/pay_modal"

// const TotalDebtTable = ({
// 	data,
// 	deleteTotalDebt,
// 	totalDebtPart,
// 	totalDebtCloseAtOnce,
// }) => {
// 	let arr =
// 		data?.length &&
// 		data?.map((item) => {
// 			if (!item?.isdone) {
// 				return {
// 					id: item?.debts_id,
// 					client: item?.client_name,
// 					price: addComma(item?.price),
// 					desc: item?.description,
// 					date: `${moment(item?.debts_createdat)
// 						.zone(+7)
// 						.format("YYYY/MM/DD HH:MM")}`,
// 					duedate: `${moment(item?.debts_due_date)
// 						.zone(+7)
// 						.format("YYYY/MM/DD HH:MM")}`,
// 				}
// 			}
// 		})

// 	const columns = [
// 		{
// 			title: "Haridor",
// 			dataIndex: "client",
// 			// defaultSortOrder: "ascend",
// 			// sorter: (a, b) => a.client.localeCompare(b.client),
// 		},
// 		{
// 			title: "Narx",
// 			dataIndex: "price",
// 		},
// 		{
// 			title: "Izoh",
// 			dataIndex: "desc",
// 		},
// 		{
// 			title: "Berilgan sana",
// 			dataIndex: "date",
// 			// render: (text) => {
// 			// 	return <>{text.slice(0, 10)}</>
// 			// },
// 		},
// 		{
// 			title: "To'lanadigan sana",
// 			dataIndex: "duedate",
// 			defaultSortOrder: "descend",
// 			sorter: (a, b) => moment(a.duedate).unix() - moment(b.duedate).unix(),
// 			// render: (text) => {
// 			// 	return <>{text.slice(0, 10)}</>
// 			// },
// 		},
// 		{
// 			title: "Tahrirlash",
// 			render: (text, record) => (
// 				<nobr>
// 					<button
// 						className="btn btn-sm btn-table-success mx-1"
// 						onClick={(e) =>
// 							payConfirmModal(e, totalDebtCloseAtOnce, record?.id)
// 						}
// 					>
// 						<i className="fa-solid fa-check"></i>
// 					</button>
// 					<button
// 						className="btn btn-sm btn-outline-warning mx-1 table-edit__btn"
// 						onClick={(e) =>
// 							payModal(e, totalDebtPart, record?.id, record?.price)
// 						}
// 					>
// 						<i className="fas fa-edit"></i>
// 					</button>
// 					<button
// 						className="btn btn-sm btn-outline-danger"
// 						onClick={(e) =>
// 							productDeleteConfirm(e, "Qarzdorlik", deleteTotalDebt, record?.id)
// 						}
// 					>
// 						<i className="fa-solid fa-trash-can"></i>
// 					</button>
// 				</nobr>
// 			),
// 		},
// 	]

// 	return (
// 		<Table
// 			columns={columns}
// 			locale={{
// 				emptyText: (
// 					<div className="no-data__con">
// 						<img src={noDataImg} alt="" />
// 						<span>Qarzdorlik mavjud emas</span>
// 					</div>
// 				),
// 			}}
// 			dataSource={arr}
// 			pagination={{
// 				position: ["bottomLeft"],
// 				pageSize: 20,
// 			}}
// 		/>
// 	)
// }

// export default TotalDebtTable
