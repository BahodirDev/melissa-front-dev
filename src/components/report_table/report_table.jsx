import { Table } from "antd"
import moment from "moment/moment"
import noDataImg from "../../assets/img/no data.png"
import { addComma } from "../addComma"

const AntReportTable = ({ data }) => {
	let arr2 = data?.map((item) => {
		return {
			data_store: item?.store,
			data_product: item?.goods_name,
			data_code: item?.goods_code,
			is_enter: item?.isenter,
			// data_box: item?.reports_box_count,
			data_q: item?.reports_count,
			data_client: item?.client,
			data_cost_each: addComma(item?.reports_count_cost) + item?.currency,
			data_price_each: addComma(item?.reports_count_price) + item?.currency,
			data_price_total: addComma(item?.reports_total_cost) + item?.currency,
			// data_kurs: addComma(item?.currency_amount) + "лв",
			data_date: `${moment(item?.reports_createdat)
				.zone(+7)
				.format("YYYY/MM/DD HH:MM:SS")}`,
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
					<i className="fa-solid fa-arrow-down" style={{ color: "green" }}></i>
				) : (
					<i className="fa-solid fa-arrow-up" style={{ color: "red" }}></i>
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
			title: <nobr>Narx(har biri)</nobr>,
			dataIndex: "data_price_each",
			width: 150,
		},
		{
			title: <nobr>Narx(umumiy)</nobr>,
			dataIndex: "data_price_total",
		},
		{
			title: "Sana",
			dataIndex: "data_date",
			defaultSortOrder: "descend",
			sorter: (a, b) => moment(a.data_date).unix() - moment(b.data_date).unix(),
			render: (text) => {
				return <>{text.slice(0,10)}</>
			},
		},
	]

	return (
		<Table
			columns={columns}
			locale={{
				emptyText: (
					<div className="no-data__con">
						<img src={noDataImg} alt="" />
						<span>Hisobot mavjud emas</span>
					</div>
				),
			}}
			pagination={{
				position: ["bottomLeft"],
				pageSize: 20,
			}}
			dataSource={arr2}
		/>
	)
}
export default AntReportTable
