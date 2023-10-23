import { Table } from "antd"
import moment from "moment/moment"
import noDataImg from "../../assets/img/no data.png"
import { addComma } from "../addComma"
import NoData from "../noData/NoData"
import { ArrowDown } from "@phosphor-icons/react"
import { ArrowUp } from "@phosphor-icons/react/dist/ssr"

const AntReportTable = ({ data, sidebar, userRole }) => {
	let arr2 = data?.map((item, idx) => {
		return {
			key: idx,
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
export default AntReportTable
