import { NavLink, useNavigate } from "react-router-dom"
import icon from "../../assets/img/Photoshop-Logo-Illustration-Mockup-Tutorial 1.png"
import { log_out } from "../log_out/delete_modal"
import "./ssidebar.css"

export default function SSidebar() {
	const navigate = useNavigate()

	return (
		<div className="ssidebar">
			<div className="sicon">
				<NavLink to="/">
					<img src={icon} alt="Logo icon image" />
				</NavLink>
			</div>

			{/* links */}
			<ul>
				<li>
					<NavLink to="/stats">
						<i className="fa-solid fa-square-poll-vertical"></i>
					</NavLink>
				</li>
				<li>
					<NavLink to="/reports">
						<i className="fa-solid fa-list-check"></i>
					</NavLink>
				</li>
				<li>
					<NavLink to="/products">
						<i className="fa-regular fa-rectangle-list"></i>
					</NavLink>
				</li>
				<li>
					<NavLink to="/goods">
						<i className="fa-solid fa-tags"></i>
					</NavLink>
				</li>
				<li>
					<NavLink to="/return">
						<i className="fa-solid fa-box-archive"></i>
					</NavLink>
				</li>
				<li>
					<NavLink to="/debts">
						<i className="fa-solid fa-hand-holding-dollar"></i>
					</NavLink>
				</li>
				<li>
					<NavLink to="/store">
						<i className="fa-solid fa-warehouse"></i>
					</NavLink>
				</li>
				<li>
					<NavLink to="/deliver">
						<i className="fa-solid fa-truck"></i>
					</NavLink>
				</li>
				<li>
					<NavLink to="/clients">
						<i className="fa-solid fa-users"></i>
					</NavLink>
				</li>
				<li>
					<NavLink to="/employees">
						<i className="fa-solid fa-user-tag"></i>
					</NavLink>
				</li>
				<li>
					<NavLink to="/currency">
						<i className="fa-solid fa-money-bill-transfer"></i>
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
						<i className="fa-solid fa-right-from-bracket"></i>
					</a>
				</li>
			</ul>
		</div>
	)
}
