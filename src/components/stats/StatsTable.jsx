import { Checkbox, Table } from "antd"
import NoData from "../noData/NoData"

export const StatsTable = ({
	data,
	currentPage,
	limit,
	addToStatsList,
	removeFromStatsList,
	selected,
}) => {
	let arr2 =
		data?.length &&
		data?.map((item, idx) => {
			return {
				key: idx + 1 + (currentPage - 1) * limit,
				id: item?.products_id,
				deliver_id: item?.deliver_id?.deliver_name,
				store_id: item?.store_id?.store_name,
				img: item?.img_url,
				goods_name:
					item?.goods_id?.goods_name + " - " + item?.goods_id?.goods_code,
				products_count: Math.ceil(+item?.products_count),
			}
		})

	const columns = [
		{
			title: "Rasm",
			height: "40px",
			width: "40px",
			render: (text, record) => (
				<div className="table-img-col">
					<img
						src={`${record?.img}`}
						height={40}
						onClick={() => window.open(record?.img)}
					/>
				</div>
			),
		},
		{
			title: "Mahsulot",
			dataIndex: "goods_name",
		},
		{
			title: "Ta'minotchi",
			dataIndex: "deliver_id",
		},
		{
			title: "Miqdor",
			dataIndex: "products_count",
		},
		{
			title: "",
			render: (text, record) => (
				<Checkbox
					onChange={(e) => {
						if (e.target.checked) {
							addToStatsList(record)
						} else {
							removeFromStatsList(record)
						}
					}}
					checked={selected.some((item) => item.id === record.id)}
				></Checkbox>
			),
		},
	]

	return (
		<div
			className="ant-d-table"
			style={{
				width: "50%",
				height: "calc(100vh - 150px)",
				overflow: "auto",
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

export const StatsListTable = ({ data, removeFromStatsList }) => {
	let arr2 =
		data?.length &&
		data?.map((item, idx) => {
			return {
				key: idx + 1,
				id: item?.id,
				deliver_id: item?.deliver_id,
				store_id: item?.store_id?.store_name,
				img: item?.img,
				goods_name: item?.goods_name,
				products_count: Math.ceil(+item?.products_count),
			}
		})

	const columns = [
		{
			title: "Rasm",
			height: "40px",
			width: "40px",
			render: (text, record) => (
				<div className="table-img-col">
					<img
						src={`${record?.img}`}
						height={40}
						onClick={() => window.open(record?.img)}
					/>
				</div>
			),
		},
		{
			title: "Mahsulot",
			dataIndex: "goods_name",
		},
		{
			title: "Ta'minotchi",
			dataIndex: "deliver_id",
		},
		{
			title: "Miqdor",
			dataIndex: "products_count",
		},
		{
			title: "",
			render: (text, record) => (
				<Checkbox
					checked
					onChange={() => removeFromStatsList(record)}
				></Checkbox>
			),
		},
	]

	return (
		<div
			className="ant-d-table"
			style={{
				width: "50%",
				height: "calc(100vh - 150px)",
				overflow: "auto",
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
