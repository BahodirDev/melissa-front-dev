import {
	ArrowRight,
	DotsThreeVertical,
	PencilSimple,
	Trash,
} from "@phosphor-icons/react"
import { addComma } from "../../components/addComma"
import { productDeleteConfirm } from "../../components/delete_modal/delete_modal"
import NoData from "../../components/noData/NoData"

export default function CurrencyList({
	products,
	deleteCurrency,
	editCurrency,
	showDropdown,
	setshowDropdown,
}) {
	const handleClick = (e, id) => {
		showDropdown === id ? setshowDropdown("") : setshowDropdown(id)
		e.stopPropagation()
	}

	return products?.length ? (
		<div className="card-wrapper currency">
			{products.map((item, idx) => {
				return (
					<div key={idx} className="card-item currency">
						<div className="card-item-top">
							<div>
								<img src={`data:image/png;base64,${item?.flag}`} />
							</div>
							<div className="card-item-edit-holder">
								<button
									type="button"
									onClick={(e) => handleClick(e, item?.currency_id)}
								>
									<DotsThreeVertical size={24} />
								</button>
								<div
									className={`card-item-edit-wrapper ${
										showDropdown === item?.currency_id || "hidden"
									}`}
								>
									<button
										type="button"
										className="card-item-edit-item"
										onClick={(e) => {
											e.stopPropagation()
											setshowDropdown("")
											editCurrency(item?.currency_id)
										}}
									>
										Tahrirlash <PencilSimple size={20} />
									</button>
									<button
										type="button"
										className="card-item-edit-item"
										onClick={(e) =>
											productDeleteConfirm(
												e,
												`"${item?.currency_name}" pul birligi`,
												deleteCurrency,
												item?.currency_id
											)
										}
									>
										O'chirish <Trash size={20} />
									</button>
								</div>
							</div>
						</div>

						<div className="card-item-bottom currency">
							<h6>
								{item?.currency_name} &nbsp;&nbsp;
								<ArrowRight size={12} />
								&nbsp;&nbsp; SUM
							</h6>
							<h5>{addComma(item?.currency_amount)} so'm</h5>
						</div>
					</div>
				)
			})}
		</div>
	) : (
		<NoData />
	)
}
