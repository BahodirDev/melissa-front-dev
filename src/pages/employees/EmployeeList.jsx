import noDataImg from "../../assets/img/no data.png"
import { productDeleteConfirm } from "../../components/delete_modal/delete_modal"
import { employee_role } from "./employee_role"

export default function EmployeeList({
	users,
	user_id,
	setUser_id,
	deleteUser,
	editEmp,
}) {
	const setUserId = (id) => {
		if (id == user_id) {
			setUser_id("")
		} else {
			setUser_id(id)
		}
	}

	return (
		<div className="emp-wrapper">
			{users?.length ? (
				users.map((user) => {
					return (
						<div className="emp-item">
							<i className="fa-solid fa-user"></i>
							<h5>
								{user?.user_name} | {employee_role(user?.user_role)}
							</h5>
							<h6>
								Tel:{" "}
								{user?.user_nomer.replace(
									/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/,
									"+$1 ($2) $3-$4-$5"
								)}
							</h6>
							<button
								className="btn btn-melissa mx-2"
								onClick={() => editEmp(user?.user_id)}
							>
								<i className="fas fa-edit"></i>
							</button>
							<button
								className="btn btn-my__danger mx-2"
								onClick={(e) =>
									productDeleteConfirm(e, "Hodim", deleteUser, user?.user_id)
								}
							>
								<i className="fa-solid fa-trash-can"></i>
							</button>
						</div>
					)
				})
			) : (
				<div className="no-data__con">
					<img src={noDataImg} alt="" />
					<span>Hodim mavjud emas</span>
				</div>
			)}
		</div>
	)
}
