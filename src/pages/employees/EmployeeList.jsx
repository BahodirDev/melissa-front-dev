import {
	CheckCircle,
	DotsThreeVertical,
	PencilSimple,
	Trash,
} from "@phosphor-icons/react"
import user from "../../assets/img/user.png"
import { productDeleteConfirm } from "../../components/delete_modal/delete_modal"
import NoData from "../../components/noData/NoData"
import { employee_role } from "./employee_role"
import format_phone_number from "../../components/format_phone_number/format_phone_number"
import { useState } from "react"
import { addComma, addCommaWithTwoFixed } from "../../components/addComma"

export default function EmployeeList({
	data,
	deleteEmp,
	editEmp,
	showDropdown,
	setshowDropdown,
	darkMode,
	miniModal,
	setMiniModal,
}) {
	const [loc, setLoc] = useState(true)
	const [loc2, setLoc2] = useState(true)

	const handleClick = (e, id) => {
		showDropdown === id ? setshowDropdown("") : setshowDropdown(id)
		e.stopPropagation()
		setLoc(window.innerHeight - e.clientY > 110 ? false : true)
	}

	return data?.length ? (
		<div className={`card-wrapper grid ${darkMode ? "dark" : null}`}>
			{data.map((item, idx) => {
				return (
					<div
						key={idx}
						className={`card-item emp  ${darkMode ? "dark" : null}`}
					>
						<div className="card-item-top">
							<div>
								<img src={user} alt="user-image" />
							</div>

							<div className="card-item-edit-holder">
								<button
									type="button"
									onClick={(e) => handleClick(e, item?.user_id)}
								>
									<DotsThreeVertical size={24} />
								</button>
								<div
									className={`card-item-edit-wrapper ${
										showDropdown === item?.user_id || "hidden"
									} ${loc && "top"}`}
								>
									<button
										type="button"
										className="card-item-edit-item"
										onClick={(e) => {
											e.stopPropagation()
											setshowDropdown("")
											editEmp(item?.user_id)
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
													Xodim <span>{item?.user_name}</span>ni
												</>,
												deleteEmp,
												item?.user_id,
												darkMode
											)
										}
									>
										O'chirish <Trash size={20} />
									</button>
								</div>
							</div>
						</div>

						<div className="card-item-bottom emp clients">
							<h4>{item?.user_name}</h4>
							<h5>
								{item?.user_nomer && format_phone_number(item.user_nomer)}
							</h5>

							<button
								type="button"
								onClick={(e) => {
									setshowDropdown("")
									e.stopPropagation()
									miniModal === item?.clients_id
										? setMiniModal("")
										: setMiniModal(item?.clients_id)

									setLoc2(window.innerHeight - e.clientY < 230 ? true : false)
								}}
							>
								<CheckCircle size={20} /> Qarzdorlikni tekshirish
							</button>

							{/* debts mini modal */}
							<div
								className={`mini-modal  ${
									miniModal === item?.clients_id || "hidden"
								} ${loc2 && "top"} ${darkMode ? "dark" : null}`}
								onClick={(e) => e.stopPropagation()}
							>
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
			})}
		</div>
	) : (
		<NoData />
	)
}
