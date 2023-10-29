import { NavLink, useNavigate } from "react-router-dom"
import { log_out } from "../log_out/delete_modal"
import "./ssidebar.css"
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

export default function SSidebar({ setSidebar, sidebar, userInfo }) {
	const navigate = useNavigate()
	const [userRole, setUserRole] = useState(0)

	useEffect(() => {
		setUserRole(localStorage.getItem("role"))
	}, [])

	return (
		<div className="ssidebar">
			<div className="sicon">
				<h1 type="button" onClick={() => setSidebar((prev) => !prev)}>
					M
				</h1>
			</div>

			{/* links */}
			<ul>
				<li>
					<NavLink to="/stats" title="Statistika">
						<ChartBar size={24} />
					</NavLink>
				</li>
				<li>
					<NavLink to="/reports" title="Hisobot">
						<FileText size={24} />
					</NavLink>
				</li>
				<li>
					<NavLink to="/products" title="Mahsulotlar">
						<Cube size={24} />
					</NavLink>
				</li>
				<li>
					<NavLink to="/goods" title="Kategoriyalar">
						<SquaresFour size={24} />
					</NavLink>
				</li>
				<li>
					<NavLink to="/return" title="Qaytgan mahsulotlar">
						<Recycle size={24} />
					</NavLink>
				</li>
				<li>
					<NavLink to="/debts" title="Qarzdorlik">
						<HandCoins size={24} />
					</NavLink>
				</li>
				<li>
					<NavLink to="/store" title="Omborlar">
						<Warehouse size={24} />
					</NavLink>
				</li>
				<li>
					<NavLink to="/deliver" title="Ta'minotchilar">
						<Truck size={24} />
					</NavLink>
				</li>
				<li>
					<NavLink to="/clients" title="Mijozlar">
						<UsersFour size={24} />
					</NavLink>
				</li>
				{userRole === "1" && (
					<li>
						<NavLink to="/employees" title="Xodimlar">
							<Users size={24} />
						</NavLink>
					</li>
				)}
				<li>
					<NavLink to="/currency" title="Pul birliklari">
						<CurrencyDollar size={24} />
					</NavLink>
				</li>
				{/* <li>
					<NavLink to="/settings">
						<i className="fa-solid fa-gear"></i>
					</NavLink>
				</li> */}

				<li className="slogout">
					<a
						title="Hisobdan chiqish"
						href="#"
						onClick={(e) => {
							log_out(e, navigate)
						}}
					>
						<SignOut size={24} />
					</a>
				</li>
			</ul>
		</div>
	)
}
