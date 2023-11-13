import { useState } from "react"
import { productDeleteConfirm } from "../../components/delete_modal/delete_modal"
import NoData from "../../components/noData/NoData"
import {
	CheckCircle,
	DotsThreeVertical,
	PencilSimple,
	Trash,
} from "@phosphor-icons/react"
import format_phone_number from "../../components/format_phone_number/format_phone_number"
import DeliverDebtList from "./DeliverDebtList"

function DeliverList({
	data,
	deleteSup,
	editSup,
	showDropdown,
	setshowDropdown,
	miniModal,
	setMiniModal,
}) {
	const [loc, setLoc] = useState(true)
	const [loc2, setLoc2] = useState(true)

	const handleClick = (e, id) => {
		setMiniModal("")
		showDropdown === id ? setshowDropdown("") : setshowDropdown(id)
		e.stopPropagation()
		setLoc(window.innerHeight - e.clientY > 110 ? false : true)
	}

	return data?.length ? (
		<div className="card-wrapper deliver grid">
			{data.map((item, idx) => {
				if (!item?.isdelete) {
					return (
						<div key={idx} className="card-item deliver">
							<div className="card-item-top">
								<div>
									<h3>{item?.deliver_name}</h3>
								</div>
								<div className="card-item-edit-holder">
									<button
										type="button"
										onClick={(e) => handleClick(e, item?.deliver_id)}
									>
										<DotsThreeVertical size={24} />
									</button>
									<div
										className={`card-item-edit-wrapper ${
											showDropdown === item?.deliver_id || "hidden"
										} ${loc && "top"}`}
									>
										<button
											type="button"
											className="card-item-edit-item"
											onClick={(e) => {
												e.stopPropagation()
												setshowDropdown("")
												editSup(item?.deliver_id)
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
														Ta'minotchi <span>{item?.deliver_name}</span>ni
													</>,
													deleteSup,
													item?.deliver_id
												)
											}
										>
											O'chirish <Trash size={20} />
										</button>
									</div>
								</div>
							</div>

							<div className="card-item-bottom deliver">
								<h4>{format_phone_number(item?.deliver_nomer)}</h4>
								<h5>
									Manzil: &nbsp;{" "}
									{item?.deliver_place ? item?.deliver_place : "Nomalum"}
								</h5>
								<button
									type="button"
									onClick={(e) => {
										setshowDropdown("")
										e.stopPropagation()
										miniModal === item?.deliver_id
											? setMiniModal("")
											: setMiniModal(item?.deliver_id)

										setLoc2(window.innerHeight - e.clientY < 230 ? true : false)
									}}
								>
									<CheckCircle size={20} /> Qarzdorlikni tekshirish
								</button>

								{/* debts mini modal */}
								<div
									className={`mini-modal  ${
										miniModal === item?.deliver_id || "hidden"
									} ${loc2 && "top"}`}
									onClick={(e) => e.stopPropagation()}
								>
									{item?.deliver_debts?.length ? (
										<DeliverDebtList data={item?.deliver_debts} />
									) : (
										<h4>Qarzdorlik mavjud emas</h4>
									)}
								</div>
							</div>
						</div>
					)
				}
			})}
		</div>
	) : (
		<NoData />
	)
}

export default DeliverList
