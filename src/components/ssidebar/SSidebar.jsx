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

export default function SSidebar() {
	const navigate = useNavigate()
	const [userRole, setUserRole] = useState(0)

	useEffect(() => {
		setUserRole(localStorage.getItem("role"))
	}, [])

	return (
		<div className="ssidebar">
			<div className="sicon">
				<h1>M</h1>
			</div>

			{/* links */}
			<ul>
				<li>
					<NavLink to="/stats">
						<ChartBar size={24} />
					</NavLink>
				</li>
				<li>
					<NavLink to="/reports">
						<FileText size={24} />
					</NavLink>
				</li>
				<li>
					<NavLink to="/products">
						<Cube size={24} />
					</NavLink>
				</li>
				<li>
					<NavLink to="/goods">
						<SquaresFour size={24} />
					</NavLink>
				</li>
				<li>
					<NavLink to="/return">
						<Recycle size={24} />
					</NavLink>
				</li>
				<li>
					<NavLink to="/debts">
						<HandCoins size={24} />
					</NavLink>
				</li>
				<li>
					<NavLink to="/store">
						<Warehouse size={24} />
					</NavLink>
				</li>
				<li>
					<NavLink to="/deliver">
						<Truck size={24} />
					</NavLink>
				</li>
				<li>
					<NavLink to="/clients">
						<UsersFour size={24} />
					</NavLink>
				</li>
				{userRole === "1" && (
					<li>
						<NavLink to="/employees">
							<Users size={24} />
						</NavLink>
					</li>
				)}
				<li>
					<NavLink to="/currency">
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
