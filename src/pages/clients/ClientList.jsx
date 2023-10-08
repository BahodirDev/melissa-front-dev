import { useState } from "react"
import noDataImg from "../../assets/img/no data.png"
import { productDeleteConfirm } from "../../components/delete_modal/delete_modal"
import ClientDebtList from "./ClientDebtList"

function ClientList({
	data,
	deleteClient,
	toggleDesc,
	setToggleDesc,
	editClient,
}) {
	const [loc, setLoc] = useState(true)

	return (
		<div className="clients-wrapper">
			{data?.length ? (
				data.map((item) => {
					if (!item?.isdelete) {
						return (
							<div className="clients-item">
								<h5>{item?.clients_name}</h5>
								<h6>
									Tel:{" "}
									{item?.clients_nomer.replace(
										/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/,
										"+$1 ($2) $3-$4-$5"
									)}
								</h6>
								<h6>Izoh: {item?.clients_desc}</h6>

								<div
									className={`clients-desc ${
										toggleDesc === item?.clients_id || "hide-client-desc"
									}`}
									style={{
										marginTop: loc
											? "50px"
											: `-${
													item?.debts.filter((item) => !item?.isdone).length
														? "230"
														: "47"
											  }px`,
									}}
								>
									<div className="clients_desc-i">
										{item?.debts?.length ? (
											<ClientDebtList data={item?.debts} />
										) : (
											"Qarzdorlik mavjud emas"
										)}
									</div>
								</div>

								<button
									className="btn btn-melissa btn-desc"
									onClick={(e) => {
										toggleDesc === item?.clients_id
											? setToggleDesc(0)
											: setToggleDesc(item?.clients_id)

										setLoc(window.innerHeight - e.clientY > 220 ? true : false)
									}}
								>
									<i className="fa-solid fa-message"></i>
								</button>
								<button
									className="btn btn-my__danger"
									onClick={(e) => {
										setToggleDesc(0)
										productDeleteConfirm(
											e,
											"Mijoz",
											deleteClient,
											item?.clients_id
										)
									}}
								>
									<i className="fa-solid fa-trash-can"></i>
								</button>
								<button
									className="btn btn-melissa mx-2"
									onClick={() => {
										setToggleDesc(0)
										editClient(item?.clients_id)
									}}
								>
									<i className="fas fa-edit"></i>
								</button>
							</div>
						)
					}
				})
			) : (
				<div className="no-data__con">
					<img src={noDataImg} alt="" />
					<span>Mijoz mavjud emas</span>
				</div>
			)}
		</div>
	)
}

export default ClientList
