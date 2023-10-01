import { addComma } from "../../components/addComma"

const ClientDebtList = ({ data }) => {
	const filteredItems = data.filter((item) => !item?.isdone)

	const itemsJSX = filteredItems.map((item) => (
		<>
			<span>
				{item?.products?.goods_name} x{item?.debts_count} x{" "}
				{addComma(item?.debts_price).slice(0, -1)} ={" "}
				{addComma(item?.debts_count * item?.debts_price).slice(0, -1)}
				{item?.debts_currency}
			</span>
			<hr style={{ margin: "5px 0" }} />
		</>
	))

	return itemsJSX.length > 0 ? (
		<div className="clients_desc-item">{itemsJSX}</div>
	) : (
		"Qarzdorlik mavjud emas"
	)
}
export default ClientDebtList
