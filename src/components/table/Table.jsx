import { Table } from "antd"
import moment from "moment/moment"
import { addComma } from "../addComma"
import { productDeleteConfirm } from "../delete_modal/delete_modal"
import NoData from "../noData/NoData"
import { Trash } from "@phosphor-icons/react"

const AntTable = ({ data, deleteItem, sidebar, userRole }) => {
	let arr2 =
		data?.length &&
		data?.map((item, idx) => {
			return {
				key: idx,
				id: item?.products_id,
				deliver_id: item?.deliver_id?.deliver_name,
				store_id: item?.store_id?.store_name,
				goods_code: item?.goods_id?.goods_code,
				goods_name: item?.goods_id?.goods_name,
				products_box_count: Math.ceil(item?.products_box_count),
				products_count: item?.products_count,
				products_count_cost:
					addComma(item?.products_count_cost) +
					item?.currency_id?.currency_symbol,
				products_count_price:
					addComma(item?.products_count_price) +
					item?.currency_id?.currency_symbol,
				total_price:
					addComma(
						(item?.products_count * item?.products_count_cost).toFixed(2)
					) + item?.currency_id?.currency_symbol,
				product_date: `${moment(item?.products_createdat).format(
					"YYYY/MM/DD HH:MM:SS"
				)}`,
			}
		})

	const columns = [
		{
			title: "Ombor",
			dataIndex: "store_id",
		},
		{
			title: "Diller",
			dataIndex: "deliver_id",
		},
		{
			title: "Mahsulot",
			dataIndex: "goods_name",
			sorter: (a, b) => a.goods_name.localeCompare(b.goods_name),
		},
		{
			title: "Kod",
			dataIndex: "goods_code",
		},
		{
			title: <nobr>Qutilar soni</nobr>,
			dataIndex: "products_box_count",
		},
		{
			title: "Miqdor",
			dataIndex: "products_count",
		},
		{
			title: <nobr>Narx</nobr>,
			dataIndex: "products_count_cost",
		},
		{
			title: <nobr>Sotuv narxi</nobr>,
			dataIndex: "products_count_price",
		},
		{
			title: <nobr>Umumiy narx</nobr>,
			dataIndex: "total_price",
		},
		{
			title: "Sana",
			dataIndex: "product_date",
			defaultSortOrder: "descend",
			sorter: (a, b) =>
				moment(a.product_date).unix() - moment(b.product_date).unix(),
			render: (text) => {
				return <>{text.slice(0, 10)}</>
			},
		},
		{
			title: "",
			render: (text, record) =>
				userRole == 1 && (
					<button
						type="button"
						className="product-table-btn"
						onClick={(e) =>
							productDeleteConfirm(
								e,
								<>
									Mahsulot <span>{record?.goods_name}</span>ni
								</>,
								deleteItem,
								record?.id
							)
						}
					>
						<Trash size={20} />
					</button>
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
					position: ["bottomLeft"],
					pageSize: 20,
				}}
			/>
		</div>
	)
}

export default AntTable
