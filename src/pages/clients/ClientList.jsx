import { useState } from "react"
import { productDeleteConfirm } from "../../components/delete_modal/delete_modal"
import ClientDebtList from "./ClientDebtList"
import NoData from "../../components/noData/NoData"
import {
	CheckCircle,
	DotsThreeVertical,
	PencilSimple,
	Trash,
} from "@phosphor-icons/react"
import format_phone_number from "../../components/format_phone_number/format_phone_number"
import { Link, useNavigate } from "react-router-dom"
import { addComma, addCommaWithTwoFixed } from "../../components/addComma"

function ClientList({
	data,
	deleteClient,
	editClient,
	showDropdown,
	setshowDropdown,
	miniModal,
	setMiniModal,
	darkMode,
	userInfo,
}) {
	const [loc, setLoc] = useState(true)
	const [loc2, setLoc2] = useState(true)
	const navigate = useNavigate()

	const handleClick = (e, id) => {
		setMiniModal("")
		showDropdown === id ? setshowDropdown("") : setshowDropdown(id)
		e.stopPropagation()
		setLoc(window.innerHeight - e.clientY > 110 ? false : true)
	}

	return data?.length ? (
		<div className={`card-wrapper clients grid ${darkMode ? "dark" : null}`}>
			{data.map((item, idx) => {
				if (!item?.isdelete) {
					return (
						<div key={idx} className="card-item clients">
							<div className="card-item-top">
								<div>
									<h3
										// onClick={() =>
										// 	navigate(item?.clients_name, {
										// 		state: {
										// 			id: item?.clients_id,
										// 			name: item?.clients_name,
										// 			tel: item?.clients_nomer,
										// 			desc: item?.clients_desc,
										// 			date: item?.clients_createdat,
										// 		},
										// 	})
										// }
										onClick={() => navigate(item?.clients_id)}
									>
										{item?.clients_name}
									</h3>
								</div>
								{userInfo.role == 1 ? (
									<div className="card-item-edit-holder">
										<button
											type="button"
											onClick={(e) => handleClick(e, item?.clients_id)}
										>
											<DotsThreeVertical size={24} />
										</button>
										<div
											className={`card-item-edit-wrapper ${
												showDropdown === item?.clients_id || "hidden"
											} ${loc && "top"}`}
										>
											<button
												type="button"
												className="card-item-edit-item"
												onClick={(e) => {
													e.stopPropagation()
													setshowDropdown("")
													editClient(item?.clients_id)
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
															Mijoz <span>{item?.clients_name}</span>ni
														</>,
														deleteClient,
														item?.clients_id,
														darkMode
													)
												}
											>
												O'chirish <Trash size={20} />
											</button>
										</div>
									</div>
								) : null}
							</div>

							<div className="card-item-bottom clients">
								<h4>{format_phone_number(item?.clients_nomer)}</h4>
								<h5>Izoh: &nbsp; {item?.clients_desc}</h5>
								{userInfo.role == 1 ? (
									<button
										type="button"
										onClick={(e) => {
											setshowDropdown("")
											e.stopPropagation()
											miniModal === item?.clients_id
												? setMiniModal("")
												: setMiniModal(item?.clients_id)

											setLoc2(
												window.innerHeight - e.clientY < 230 ? true : false
											)
										}}
									>
										<CheckCircle size={20} /> Qarzdorlikni tekshirish
									</button>
								) : null}

								{/* debts mini modal */}
								<div
									className={`mini-modal  ${
										miniModal === item?.clients_id || "hidden"
									} ${loc2 && "top"} ${darkMode ? "dark" : null}`}
									onClick={(e) => e.stopPropagation()}
								>
									{/* {item?.debts?.length ? (
										<ClientDebtList data={item?.debts} />
									) : (
										<h4>Qarzdorlik mavjud emas</h4>
									)} */}
									{item?.dollar_debt - item?.dollar_equity < 0
										? `Haqdor: $ ${addCommaWithTwoFixed(
												Math.abs(item?.dollar_debt - item?.dollar_equity)
										  )}`
										: `Qarzdor: $ ${addCommaWithTwoFixed(
												Math.abs(item?.dollar_debt - item?.dollar_equity)
										  )}`}
									<br />
									{item?.sum_debt - item?.sum_equity < 0
										? `Haqdor: ${addComma(
												Math.abs(item?.sum_debt - item?.sum_equity)
										  )} so'm`
										: `Qarzdor: ${addComma(
												Math.abs(item?.sum_debt - item?.sum_equity)
										  )} so'm`}
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

export default ClientList
