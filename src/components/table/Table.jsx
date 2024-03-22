import { Table } from "antd"
import moment from "moment/moment"
import { addComma } from "../addComma"
import { productDeleteConfirm } from "../delete_modal/delete_modal"
import NoData from "../noData/NoData"
import { DotsThreeVertical, PencilSimple, Trash } from "@phosphor-icons/react"
import { useState } from "react"

const AntTable = ({
	data,
	deleteItem,
	sidebar,
	userRole,
	showDropdown,
	setshowDropdown,
	editProduct,
	setAddModalVisible,
	setAddModalDisplay,
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
				id: item?.products_id,
				deliver_id: item?.deliver_id?.deliver_name,
				store_id: item?.store_id?.store_name,
				goods_code: item?.goods_id?.goods_code,
				goods_name: item?.goods_id?.goods_name,
				products_box_count: Math.ceil(item?.products_box_count),
				products_count: Math.ceil(+item?.products_count + +item?.out_of_box),
				per_box: item?.each_box_count,
				extra: item?.out_of_box,
				products_count_cost:
					addComma(item?.products_count_cost) +
					item?.currency_id?.currency_symbol,
				products_count_price:
					addComma(item?.products_count_price) +
					item?.currency_id?.currency_symbol,
				total_price:
					addComma(item?.products_count * item?.products_count_cost) +
					item?.currency_id?.currency_symbol,
				product_date: `${moment(item?.products_createdat).format(
					"YYYY/MM/DD hh:mm"
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
			title: <nobr>Har bir quti soni</nobr>,
			dataIndex: "per_box",
		},
		{
			title: "Qoldiq",
			dataIndex: "extra",
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
							} ${loc && "top"}`}
						>
							<button
								type="button"
								className="table-item-edit-item"
								onClick={(e) => {
									e.stopPropagation()
									editProduct(record?.id)
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
											Mahsulot <span>{record?.goods_name}</span>ni
										</>,
										deleteItem,
										record?.id
									)
								}
							>
								O'chirish
								<Trash size={20} />
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
				// pagination={{
				// 	showSizeChanger: false,
				// 	position: ["bottomLeft"],
				// 	pageSize: 20,
				// }}
				pagination={false}
			/>
		</div>
	)
}

export default AntTable
