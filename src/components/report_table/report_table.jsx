import { Table } from "antd"
import moment from "moment/moment"
import noDataImg from "../../assets/img/no data.png"
import { addComma } from "../addComma"
import NoData from "../noData/NoData"
import {
	ArrowDown,
	DotsThreeVertical,
	PencilSimple,
	Trash,
} from "@phosphor-icons/react"
import { ArrowUp } from "@phosphor-icons/react/dist/ssr"
import { useState } from "react"
import { productDeleteConfirm } from "../delete_modal/delete_modal"

const AntReportTable = ({
	data,
	sidebar,
	userRole,
	showDropdown,
	setshowDropdown,
	deleteReport,
	editReport,
}) => {
	const [loc, setLoc] = useState(true)

	// const customPageChange = () => {
	// 	console.log("hey")
	// }

	const handleClick = (e, id) => {
		showDropdown === id ? setshowDropdown("") : setshowDropdown(id)
		e.stopPropagation()
		setLoc(window.innerHeight - e.clientY > 110 ? false : true)
	}

	let arr2 = data?.map((item, idx) => {
		return {
			key: idx,
			id: item?.reports_id,
			user_info: item?.user_info,
			data_store: item?.store,
			data_product: item?.goods_name,
			data_code: item?.goods_code,
			is_enter: item?.isenter,
			// data_box: item?.reports_box_count,
			data_q: Math.ceil(item?.reports_count),
			data_client: item?.client,
			data_cost_each: addComma(item?.reports_count_cost) + item?.currency,
			data_price_each: addComma(item?.reports_count_price) + item?.currency,
			data_price_total: addComma(item?.reports_total_cost) + item?.currency,
			// data_kurs: addComma(item?.currency_amount) + "лв",
			data_date: `${moment(item?.reports_createdat).format(
				"YYYY/MM/DD HH:MM:SS"
			)}`,
		}
	})

	const columns = [
		{
			title: "Hodim",
			dataIndex: "user_info",
		},
		{
			title: "Ombor",
			dataIndex: "data_store",
		},
		{
			title: "Mahsulot",
			dataIndex: "data_product",
			// defaultSortOrder: "ascend",
			sorter: (a, b) => a.data_product.localeCompare(b.data_product),
		},
		{
			title: "Kod",
			dataIndex: "data_code",
		},
		{
			title: "Haridor",
			dataIndex: "data_client",
		},
		{
			title: "Miqdor",
			dataIndex: "data_q",
			render: (text, record) => {
				const icon = record.is_enter ? (
					<ArrowDown size={18} color="var(--color-success)" />
				) : (
					<ArrowUp size={18} color="var(--color-danger)" />
				)
				return (
					<span>
						{icon} &nbsp;&nbsp;
						{text}
					</span>
				)
			},
		},
		{
			title: <nobr>Xarajat</nobr>,
			dataIndex: "data_cost_each",
			width: 150,
		},
		{
			title: <nobr>Narx</nobr>,
			dataIndex: "data_price_each",
			width: 150,
		},
		{
			title: <nobr>Umumiy narx</nobr>,
			dataIndex: "data_price_total",
		},
		{
			title: "Sana",
			dataIndex: "data_date",
			defaultSortOrder: "descend",
			sorter: (a, b) => moment(a.data_date).unix() - moment(b.data_date).unix(),
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
						className={`table-item-edit-wrapper extra ${
							showDropdown === record?.id || "hidden"
						} ${loc && "top"}`}
					>
						<button
							type="button"
							className="table-item-edit-item"
							onClick={(e) => {
								e.stopPropagation()
								editReport(record?.id)
							}}
						>
							Tahrirlash <PencilSimple size={20} />
						</button>
						<button
							type="button"
							className="table-item-edit-item"
							onClick={(e) =>
								productDeleteConfirm(
									e,
									<>
										<span>
											{record?.data_product + "-" + record?.data_code}
										</span>{" "}
										hisobotni
									</>,
									deleteReport,
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
				// pagination={{
				// 	showSizeChanger: false,
				// 	position: ["bottomLeft"],
				// 	pageSize: 20,
				// 	onChange: customPageChange,
				// }}
				pagination={false}
			/>
		</div>
	)
}
export default AntReportTable
