import { useState } from "react"
import noDataImg from "../../assets/img/no data.png"
import { productDeleteConfirm } from "../../components/delete_modal/delete_modal"
import DeliverDebtList from "./DeliverDebtList"

function DeliverList({
	data,
	deleteDeliver,
	editDeliver,
	toggleDesc,
	setToggleDesc,
}) {
	const [loc, setLoc] = useState(true)

	return (
		<div className="deliver-wrapper">
			{data.length ? (
				data.map((item) => {
					if (!item?.isdelete) {
						return (
							<div className="deliver-item">
								<i className="fas fa-user deliver-user-icon"></i>
								<div className="deliver-info">
									<h5>Ism: {item?.deliver_name}</h5>
									<p>
										Tel:{" "}
										{item?.deliver_nomer.replace(
											/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/,
											"+$1 ($2) $3-$4-$5"
										)}
									</p>
									<span>Manzil: {item?.deliver_place}</span>
									<div
										className={`clients-desc ${
											toggleDesc === item?.deliver_id || "hide-client-desc"
										}`}
										style={{
											marginTop: loc
												? "38px"
												: `-${item?.deliver_debts?.length ? "223" : "47"}px`,
										}}
									>
										<div className="clients_desc-i">
											{item?.deliver_debts?.length ? (
												<div className="clients_desc-item">
													<DeliverDebtList data={item?.deliver_debts} />
												</div>
											) : (
												"Qarzdorlik mavjud emas"
											)}
										</div>
									</div>

									<div className="deliver-btn-group">
										<button
											className="btn btn-melissa btn-desc-deliver"
											onClick={(e) => {
												toggleDesc === item?.deliver_id
													? setToggleDesc(0)
													: setToggleDesc(item?.deliver_id)

												setLoc(
													window.innerHeight - e.clientY > 220 ? true : false
												)
											}}
										>
											<i className="fa-solid fa-message"></i>
										</button>
										<button
											className="btn btn-melissa mx-2"
											onClick={() => {
												setToggleDesc(0)
												editDeliver(item?.deliver_id)
											}}
										>
											<i className="fas fa-edit"></i>
										</button>
										<button
											className="btn btn-my__danger"
											onClick={(e) => {
												setToggleDesc(0)
												productDeleteConfirm(
													e,
													"Diller",
													deleteDeliver,
													item?.deliver_id
												)
											}}
										>
											<i className="fa-solid fa-trash-can"></i>
										</button>
									</div>
								</div>
							</div>
						)
					}
				})
			) : (
				<div className="no-data__con">
					<img src={noDataImg} alt="" />
					<span>Ta'minotchi mavjud emas</span>
				</div>
			)}
		</div>
	)
}
export default DeliverList
