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
	darkMode,
	currentPage,
	limit,
}) => {
	const [loc, setLoc] = useState(true)

	const handleClick = (e, id) => {
		showDropdown === id ? setshowDropdown("") : setshowDropdown(id)
		e.stopPropagation()
		setLoc(window.innerHeight - e.clientY > 110 ? false : true)
	}
	let arr2 = data?.map((item, idx) => {
		return {
			key: idx + 1 + (currentPage - 1) * limit,
			id: item?.reports_id,
			user_info: item?.user_info,
			data_store: item?.store,
			data_product: item?.current_goods_name
				? item?.current_goods_name
				: item?.goods_name,
			data_code: item?.current_goods_code
				? item?.current_goods_code
				: item?.goods_code,
			is_enter: item?.isenter,
			// data_box: item?.reports_box_count,
			deliver: item?.deliver ? item?.deliver : "Nomalum",
			data_boxes: Math.ceil(
				isNaN(item?.reports_box_count) ? 0 : item?.reports_box_count
			),
			data_q: Math.ceil(item?.reports_count),
			data_per_box: Math.ceil(item?.reports_per_box_count),
			data_client: item?.client ? item?.client : "Nomalum",
			data_price_each: item?.isenter
				? item?.currency === "$"
					? item?.currency +
					  item?.reports_count_cost +
					  " - " +
					  addComma(item?.reports_count_cost * item?.currency_amount)
					: addComma(item?.reports_count_cost) + " so'm"
				: addComma(item?.reports_count_price * item?.currency_amount) + " so'm",
			data_price_total:
				addComma(
					item?.isenter
						? item?.reports_count_cost *
								item?.reports_count *
								item?.currency_amount
						: item?.reports_total_cost * item?.currency_amount
				) + " so'm",
			data_date: `${moment(item?.reports_createdat).format(
				"YYYY/MM/DD HH:mm"
			)}`,
		}
	})

	const columns = [
		{
			title: "No̱",
			dataIndex: "key",
		},
		{
			title: "Ombor",
			dataIndex: "data_store",
		},
		{
			title: "Hodim",
			dataIndex: "user_info",
		},
		{
			title: "Mahsulot",
			dataIndex: "data_product",
			// defaultSortOrder: "ascend",
			// sorter: (a, b) => a.data_product.localeCompare(b.data_product),
		},
		{
			title: "Kod",
			dataIndex: "data_code",
		},
		{
			title: "Ta'minotchi",
			dataIndex: "deliver",
		},
		{
			title: "Haridor",
			dataIndex: "data_client",
		},
		{
			title: "Quti",
			dataIndex: "data_boxes",
		},
		{
			title: "Qutida",
			dataIndex: "data_per_box",
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
			// defaultSortOrder: "descend",
			// sorter: (a, b) => moment(a.data_date).unix() - moment(b.data_date).unix(),
			// render: (text) => {
			// 	return <>{text}</>
			// },
		},
		{
			title: "",
			width: "50px",
			render: (text, record) =>
				userRole === 1 ? (
					<div className="table-item-edit-holder">
						<button type="button" onClick={(e) => handleClick(e, record?.id)}>
							<DotsThreeVertical size={24} />
						</button>
						<div
							className={`table-item-edit-wrapper extra ${
								showDropdown === record?.id || "hidden"
							} ${loc && "top"} ${darkMode ? "dark" : null}`}
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
										record?.id,
										darkMode
									)
								}
							>
								O'chirish <Trash size={20} />
							</button>
						</div>
					</div>
				) : null,
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
				pagination={false}
			/>
		</div>
	)
}
export default AntReportTable
