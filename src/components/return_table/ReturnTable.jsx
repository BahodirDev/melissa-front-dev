import { Table } from "antd"
import moment from "moment/moment"
import { addComma } from "../addComma"
import { productDeleteConfirm } from "../delete_modal/delete_modal"
import format_phone_number from "../format_phone_number/format_phone_number"
import { DotsThreeVertical, PencilSimple, Trash } from "@phosphor-icons/react"
import { useState } from "react"
import NoData from "../noData/NoData"

const ReturnTable = ({
	data,
	deleteItem,
	editItem,
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

	let arr2 =
		data?.length &&
		data?.map((item, idx) => {
			return {
				key: idx,
				id: item?.return_id,
				name: item?.return_name,
				store: item?.return_store,
				count: Math.ceil(item?.return_count),
				cost_each: addComma(item?.return_cost) + " so'm",
				cost_total: addComma(item?.return_cost * item?.return_count) + " so'm",
				reason: item?.return_case ? item?.return_case : "Qo'shimcha ma'lumot",
				client:
					item?.clients?.clients_name +
					" - " +
					format_phone_number(item?.clients?.clients_nomer),
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
			title: "Narx",
			dataIndex: "cost_each",
		},
		{
			title: "Umumiy narx",
			dataIndex: "cost_total",
		},
		{
			title: "Sana",
			dataIndex: "data",
			defaultSortOrder: "descend",
			sorter: (a, b) => moment(a.data).unix() - moment(b.data).unix(),
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
						className={`table-item-edit-wrapper small ${
							showDropdown === record?.id || "hidden"
						} ${loc && "top"}`}
					>
						<button
							type="button"
							className="table-item-edit-item"
							onClick={(e) => {
								e.stopPropagation()
								setshowDropdown("")
								editItem(record?.id)
							}}
						>
							<nobr>Tahrirlash</nobr>
							<PencilSimple size={20} />
						</button>
						<button
							type="button"
							className="table-item-edit-item"
							onClick={(e) =>
								productDeleteConfirm(
									e,
									<>
										Mahsulot <span>{record?.name}</span>ni
									</>,
									deleteItem,
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
				dataSource={arr2}
				pagination={{
					showSizeChanger: false,
					position: ["bottomLeft"],
					pageSize: 20,
				}}
			/>
		</div>
	)
}

export default ReturnTable
