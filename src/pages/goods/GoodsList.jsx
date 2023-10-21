import { useState } from "react"
import { productDeleteConfirm } from "../../components/delete_modal/delete_modal"
import NoData from "../../components/noData/NoData"
import { DotsThreeVertical, PencilSimple, Trash } from "@phosphor-icons/react"
import format_phone_number from "../../components/format_phone_number/format_phone_number"
import moment from "moment/moment"

function GoodsList({
	data,
	deleteGood,
	editGood,
	showDropdown,
	setshowDropdown,
}) {
	const [loc, setLoc] = useState(true)

	const handleClick = (e, id) => {
		showDropdown === id ? setshowDropdown("") : setshowDropdown(id)
		e.stopPropagation()
		setLoc(window.innerHeight - e.clientY > 110 ? false : true)
	}

	return data?.length ? (
		<div className="card-wrapper goods grid">
			{data.map((item, idx) => {
				return (
					<div key={idx} className="card-item goods">
						<div className="card-item-top">
							<div>
								<h3>{item?.goods_name}</h3>
							</div>
							<div className="card-item-edit-holder">
								<button
									type="button"
									onClick={(e) => handleClick(e, item?.goods_id)}
								>
									<DotsThreeVertical size={24} />
								</button>
								<div
									className={`card-item-edit-wrapper ${
										showDropdown === item?.goods_id || "hidden"
									} ${loc && "top"}`}
								>
									<button
										type="button"
										className="card-item-edit-item"
										onClick={(e) => {
											e.stopPropagation()
											setshowDropdown("")
											editGood(item?.goods_id)
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
												<>
													<span>{item?.goods_name}</span> kategoriyani
												</>,
												deleteGood,
												item?.goods_id
											)
										}
									>
										O'chirish <Trash size={20} />
									</button>
								</div>
							</div>
						</div>

						<div className="card-item-bottom goods">
							<h3>Kod: {item?.goods_code}</h3>
							<h4>{moment(item?.goods_createdat).format("YYYY/MM/DD")}</h4>
						</div>
					</div>
				)
			})}
		</div>
	) : (
		<NoData />
	)
}

export default GoodsList
