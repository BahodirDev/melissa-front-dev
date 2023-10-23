import { useState } from "react"
import { productDeleteConfirm } from "../../components/delete_modal/delete_modal"
import NoData from "../../components/noData/NoData"
import { DotsThreeVertical, PencilSimple, Trash } from "@phosphor-icons/react"
import moment from "moment/moment"

function StoreList({
	data,
	deleteStore,
	editStore,
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
		<div className="card-wrapper store grid">
			{data.map((item, idx) => {
				return (
					<div key={idx} className="card-item store">
						<div className="card-item-top">
							<div>
								<h3>{item?.store_name}</h3>
							</div>
							<div className="card-item-edit-holder">
								<button
									type="button"
									onClick={(e) => handleClick(e, item?.store_id)}
								>
									<DotsThreeVertical size={24} />
								</button>
								<div
									className={`card-item-edit-wrapper ${
										showDropdown === item?.store_id || "hidden"
									} ${loc && "top"}`}
								>
									<button
										type="button"
										className="card-item-edit-item"
										onClick={(e) => {
											e.stopPropagation()
											setshowDropdown("")
											editStore(item?.store_id)
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
													<span>{item?.store_name}</span> omborni
												</>,
												deleteStore,
												item?.store_id
											)
										}
									>
										O'chirish <Trash size={20} />
									</button>
								</div>
							</div>
						</div>

						<div className="card-item-bottom store">
							<h4>{moment(item?.store_createdat).format("YYYY/MM/DD")}</h4>
						</div>
					</div>
				)
			})}
		</div>
	) : (
		<NoData />
	)
}

export default StoreList
