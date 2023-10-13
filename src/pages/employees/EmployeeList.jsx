import { DotsThreeVertical, PencilSimple, Trash } from "@phosphor-icons/react"
import user from "../../assets/img/user.png"
import { productDeleteConfirm } from "../../components/delete_modal/delete_modal"
import NoData from "../../components/noData/NoData"
import { employee_role } from "./employee_role"
import format_phone_number from "../../components/format_phone_number/format_phone_number"
import { useState } from "react"

export default function EmployeeList({
	data,
	deleteEmp,
	editEmp,
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
		<div className="card-wrapper grid">
			{data.map((item, idx) => {
				return (
					<div key={idx} className="card-item emp">
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
												item?.user_id
											)
										}
									>
										O'chirish <Trash size={20} />
									</button>
								</div>
							</div>
						</div>

						<div className="card-item-bottom emp">
							<h4>{item?.user_name}</h4>
							<h5>{format_phone_number(item?.user_nomer)}</h5>
						</div>
					</div>
				)
			})}
		</div>
	) : (
		<NoData />
	)
}
