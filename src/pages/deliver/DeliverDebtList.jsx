import { addComma } from "../../components/addComma"

const DeliverDebtList = ({ data }) => {
	return data.map((item) => {
		console.log(item)
		if (!item?.isdone) {
			return (
				<>
					<span>
						{item?.goods?.goods_name} x{item?.debts_count} x{" "}
						{addComma(item?.debts_cost).slice(0, -1)} ={" "}
						{addComma(item?.debts_count * item?.debts_cost).slice(0, -1)}
						{item?.debts_currency}
					</span>
					<hr style={{ margin: "5px 0" }} />
				</>
			)
		}
	})
}
export default DeliverDebtList
