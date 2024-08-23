import { Table } from "antd"
import moment from "moment/moment"
import { addComma } from "../addComma"
import NoData from "../noData/NoData"

const MonTable = ({ data, sidebar, darkMode }) => {
	console.log(data)

	let arr2 =
		data?.length &&
		data?.map((item, idx) => {
			return {
				key: idx + 1,
				id: item?.section_id,
				date: `${moment(item?.created_at).format("YYYY/MM/DD HH:mm")}`,
			}
		})

	const columns = [
		{
			title: "No̱",
			dataIndex: "key",
		},
		{
			title: "Ombor",
			dataIndex: "store_id",
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

export default MonTable
