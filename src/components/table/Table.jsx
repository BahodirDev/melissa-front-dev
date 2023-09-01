import { Table } from "antd"
import moment from "moment/moment"
import noDataImg from "../../assets/img/no data.png"
import { addComma } from "../addComma"
import { productDeleteConfirm } from "../delete_modal/delete_modal"

const AntTable = ({ data, deleteItem, editProduct }) => {
	let arr2 =
		data?.length &&
		data?.map((item) => {
			return {
				deliver_id: item?.deliver_id?.deliver_name,
				store_id: item?.store_id?.store_name,
				product_id: item?.products_id,
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
				// product_date: item?.products_createdat,
				product_date: `${moment(item?.products_createdat)
					.zone(+7)
					.format("YYYY/MM/DD HH:MM:SS")}`,
				kurs: item?.currency_id?.currency_amount,
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
			// defaultSortOrder: "ascend",
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
			title: <nobr>Narx(har biri)</nobr>,
			dataIndex: "products_count_cost",
		},
		{
			title: <nobr>Narx(umumiy)</nobr>,
			dataIndex: "total_price",
		},
		{
			title: <nobr>Sotuv narxi</nobr>,
			dataIndex: "products_count_price",
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
			title: "Tahrirlash",
			render: (text, record) => (
				<nobr>
					<button
						className="btn btn-sm btn-outline-warning mx-1 table-edit__btn"
						onClick={() => editProduct(record?.product_id)}
					>
						<i className="fas fa-edit"></i>
					</button>
					<button
						className="btn btn-sm btn-outline-danger mx-1"
						onClick={(e) =>
							productDeleteConfirm(
								e,
								"Mahsulot",
								deleteItem,
								record?.product_id
							)
						}
					>
						<i className="fa-solid fa-trash-can"></i>
					</button>
				</nobr>
			),
		},
	]

	return (
		<Table
			columns={columns}
			locale={{
				emptyText: (
					<div className="no-data__con">
						<img src={noDataImg} alt="" />
						<span>Mahsulot mavjud emas</span>
					</div>
				),
			}}
			dataSource={arr2}
			pagination={{
				position: ["bottomLeft"],
				pageSize: 20,
			}}
		/>
	)
}

export default AntTable
