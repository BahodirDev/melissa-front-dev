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
import format_phone_number from "../format_phone_number/format_phone_number"

const DebtTable = ({
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
					id: item?.debts_id,
					name: item?.client?.clients_name,
					client:
						item?.client?.clients_name +
						" " +
						format_phone_number(item?.client?.clients_nomer),
					product:
						item?.product?.product_details?.goods_name +
						" - " +
						item?.product?.product_details?.goods_code,
					quantity: (+item?.debts_count).toFixed(1),
					currencyAmount: item?.debts_currency_amount,
					currencyName: item?.debts_currency,
					price_each: addComma(item?.debts_price) + item?.debts_currency,
					price_total: addComma(item?.debts_total_price) + item?.debts_currency,
					date: `${moment(item?.debts_createdat).format("YYYY/MM/DD")}`,
					duedate: `${moment(item?.debts_due_date).format("YYYY/MM/DD hh:mm")}`,
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
				// <nobr>
				// 	<button
				// 		className="btn btn-sm btn-table-success mx-1"
				// 		onClick={(e) => payConfirmModal(e, closeDebt, record?.id)}
				// 	>
				// 		<i className="fa-solid fa-check"></i>
				// 	</button>
				// 	<button
				// 		className="btn btn-sm btn-outline-warning mx-1 table-edit__btn"
				// 		onClick={(e) =>
				// 			payModal(
				// 				e,
				// 				payDebt,
				// 				record?.id,
				// 				record?.price_total,
				// 				record?.currencyName,
				// 				record?.currencyAmount
				// 			)
				// 		}
				// 	>
				// 		<i className="fas fa-edit"></i>
				// 	</button>
				// 	<button
				// 		className="btn btn-sm btn-outline-danger"
				// 		onClick={(e) =>
				// 			productDeleteConfirm(e, "Qarzdorlik", deleteDebt, record?.id)
				// 		}
				// 	>
				// 		<i className="fa-solid fa-trash-can"></i>
				// 	</button>
				// </nobr>
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

export default DebtTable
