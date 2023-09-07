import { Table } from "antd"
import noDataImg from "../../assets/img/no data.png"

const BeforeDebtTable = ({ data, closeDebt, payDebt, deleteDebt }) => {
	let arr = []

	const columns = [
		{
			title: "Haridor",
			dataIndex: "client",
		},
	]

	return (
		<Table
			columns={columns}
			locale={{
				emptyText: (
					<div className="no-data__con">
						<img src={noDataImg} alt="" />
						<span>Qarzdorlik mavjud emas</span>
					</div>
				),
			}}
			dataSource={arr}
			pagination={{
				position: ["bottomLeft"],
				pageSize: 20,
			}}
		/>
	)
}

export default BeforeDebtTable
