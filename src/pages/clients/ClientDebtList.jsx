import { addComma } from "../../components/addComma"

const ClientDebtList = ({ data }) => {
	return data.map((item) => {
		if (!item?.isdone) {
			return (
				<>
					<span>
						{item?.products?.goods_name} x{item?.debts_count} x{" "}
						{addComma(item?.debts_price).slice(0, -1)} ={" "}
						{addComma(item?.debts_count * item?.debts_price).slice(0, -1)}
						{item?.debts_currency}
					</span>
					<hr style={{ margin: "5px 0" }} />
				</>
			)
		}
	})
}
export default ClientDebtList
