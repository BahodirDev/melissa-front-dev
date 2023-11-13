import user_image from "../../assets/img/user.jpg"
import { NavLink, useNavigate } from "react-router-dom"
import { log_out } from "../log_out/delete_modal"
import "./sidebar.css"
import {
	ChartBar,
	Cube,
	CurrencyDollar,
	FileText,
	HandCoins,
	Recycle,
	SignOut,
	SquaresFour,
	Truck,
	Users,
	UsersFour,
	Warehouse,
} from "@phosphor-icons/react"
import { useEffect, useState } from "react"
import { employee_role } from "../../pages/employees/employee_role"

export default function Sidebar({ setSidebar, sidebar, userInfo }) {
	const navigate = useNavigate()
	const [userRole, setUserRole] = useState(0)

	useEffect(() => {
		setUserRole(localStorage.getItem("role"))
	}, [])

	return (
		<div className="sidebar">
			<div className="sicon">
				<h1 type="button" onClick={() => setSidebar((prev) => !prev)}>
					Melissa Kids
				</h1>
			</div>

			{/* links */}
			<ul>
				<li>
					<NavLink to="/">
						<ChartBar size={24} /> Statistika
					</NavLink>
				</li>
				<li>
					<NavLink to="/reports">
						<FileText size={24} /> Hisobot
					</NavLink>
				</li>
				<li>
					<NavLink to="/products">
						<Cube size={24} /> Mahsulotlar
					</NavLink>
				</li>
				<li>
					<NavLink to="/goods">
						<SquaresFour size={24} /> Kategoriyalar
					</NavLink>
				</li>
				<li>
					<NavLink to="/return">
						<Recycle size={24} /> Qaytgan mahsulotlar
					</NavLink>
				</li>
				<li>
					<NavLink to="/debts">
						<HandCoins size={24} /> Qarzdorlik
					</NavLink>
				</li>
				<li>
					<NavLink to="/store">
						<Warehouse size={24} /> Omborlar
					</NavLink>
				</li>
				<li>
					<NavLink to="/deliver">
						<Truck size={24} /> Ta'minotchilar
					</NavLink>
				</li>
				<li>
					<NavLink to="/clients">
						<UsersFour size={24} /> Mijozlar
					</NavLink>
				</li>
				{userRole === "1" && (
					<li>
						<NavLink to="/employees">
							<Users size={24} /> Xodimlar
						</NavLink>
					</li>
				)}
				<li>
					<NavLink to="/currency">
						<CurrencyDollar size={24} /> Pul birliklari
					</NavLink>
				</li>
				{/* <li>
					<NavLink to="/settings">
						<i className="fa-solid fa-gear"></i>
					</NavLink>
				</li> */}

				<li className="logout">
					<div className="user__info">
						<div className="user__image">
							<img src={user_image} alt="xodim-rasm" />
						</div>
						<div className="user__about">
							<p>{userInfo?.name ? userInfo?.name : "Xodim"}</p>
							<span>{employee_role(userInfo?.role)}</span>
						</div>
						<a
							href="#"
							title="Hisobdan chiqish"
							onClick={(e) => {
								log_out(e, navigate)
							}}
						>
							<SignOut size={24} />
						</a>
					</div>
				</li>
			</ul>
		</div>
	)
}
