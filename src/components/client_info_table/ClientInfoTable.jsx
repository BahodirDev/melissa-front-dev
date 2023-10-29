import { Table } from "antd"
import moment from "moment/moment"
import { addComma } from "../addComma"
import NoData from "../noData/NoData"
import { Download } from "@phosphor-icons/react"
import { confirmDownloadModal } from "../confirm_download_modal/confirmDownloadModal"
import { downloadFile } from "../../customHook/api"

const ClientInfoTable = ({ data, sidebar }) => {
	let arr =
		data.length &&
		data?.map((item, idx) => {
			return {
				key: idx,
				id: item?.client_id,
				download_id: item?.unique_file_table_id,
				store: item?.files?.store,
				product: item?.files?.goods_name,
				code: item?.files?.goods_code,
				quantity: item?.files?.product_count,
				price_each: 0,
				price_total: 0,
				date: moment(item?.files?.createdat).format("YYYY/MM/DD"),
			}
		})

	const columns = [
		{
			title: "Ombor",
			dataIndex: "store",
		},
		{
			title: "Mahsulot",
			dataIndex: "product",
		},
		{
			title: "Kod",
			dataIndex: "code",
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
			title: "Sana",
			dataIndex: "date",
			defaultSortOrder: "descend",
			sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
		},
		{
			title: "",
			width: "50px",
			render: (text, record) => (
				<div className="info-table">
					{/* <input type="checkbox" /> */}
					<button
						onClick={() =>
							confirmDownloadModal(downloadFile, record?.download_id)
						}
						className="download-btn"
					>
						<Download size={20} />
					</button>
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

export default ClientInfoTable
