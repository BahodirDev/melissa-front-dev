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

const NDebtTable = ({
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
		data?.map((item, id) => {
			if (!item?.isdone) {
				arr.push({
					key: id,
					total_id: item?.debts_id,
					client: item?.client_name,
					price: addComma(item?.price),
					desc: item?.description ? item?.description : "Qo'shimcha ma`lumot",
					date: `${moment(item?.debts_due_date).format("YYYY/MM/DD hh:mm")}`,
					duedate: `${moment(item?.debts_createdat).format(
						"YYYY/MM/DD HH:MM"
					)}`,
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
				return <>{moment(text).format("YYYY/MM/DD")}</>
			},
		},
		{
			title: "To'lanadigan sana",
			dataIndex: "duedate",
			defaultSortOrder: "ascend",
			sorter: (a, b) => moment(a.duedate) - moment(b.duedate),
			render: (text) => {
				return <>{moment(text).format("YYYY/MM/DD")}</>
			},
		},
		{
			title: "",
			width: "50px",
			render: (text, record) => (
				<div className="table-item-edit-holder">
					<button
						type="button"
						onClick={(e) => handleClick(e, record?.total_id)}
					>
						<DotsThreeVertical size={24} />
					</button>
					<div
						className={`table-item-edit-wrapper ${
							showDropdown === record?.total_id || "hidden"
						} ${loc && "top"}`}
					>
						<button
							type="button"
							className="table-item-edit-item"
							onClick={(e) =>
								payModal(
									e,
									payDebt,
									record?.total_id,
									record?.price,
									1,
									record?.client
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
										<span>{record?.client}</span> qarzni
									</>,
									closeDebt,
									record?.total_id
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
										<span>{record?.client}</span> qarzni
									</>,
									deleteDebt,
									record?.total_id
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

export default NDebtTable
