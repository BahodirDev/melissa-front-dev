import format_phone_number from "../../components/format_phone_number/format_phone_number"

export function mapOptionList(arrName, arr) {
	switch (arrName) {
		case "goods":
			return arr.map((item) => {
				return <option value={JSON.stringify(item)}>{item?.goods_name}</option>
			})
		case "courier":
			return arr.map((item) => {
				if (!item?.isdelete) {
					return (
						<option value={JSON.stringify(item)} className="product-option">
							<div>
								<span>{item?.deliver_name} - </span>
								<span>{format_phone_number(item?.deliver_nomer)}</span>
							</div>
						</option>
					)
				}
			})
		case "store":
			return arr.map((item) => {
				return <option value={JSON.stringify(item)}>{item?.store_name}</option>
			})
		case "currency":
			return arr.map((item) => {
				return (
					<option value={JSON.stringify(item)}>
						{item?.currency_name} - {item?.currency_amount}
					</option>
				)
			})

		default:
			return ""
	}
}
