import { addComma } from "../../components/addComma"

const ClientDebtList = ({ data }) => {
	const filteredItems = data.filter((item) => !item?.isdone)

	const itemsJSX = filteredItems.map((item, idx) => (
		<h5 key={idx}>
			{item?.products?.goods_name} {Number(item?.debts_count).toFixed(1)}ta x{" "}
			{addComma(item?.debts_price).slice(0, -1)} ={" "}
			{addComma(item?.debts_count * item?.debts_price).slice(0, -1)}
			{item?.debts_currency}
		</h5>
	))

	return itemsJSX.length > 0 ? <>{itemsJSX}</> : <h4>Qarzdorlik mavjud emas</h4>
}
export default ClientDebtList
