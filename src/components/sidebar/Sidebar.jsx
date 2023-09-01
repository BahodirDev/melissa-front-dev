import { NavLink, useNavigate } from "react-router-dom"
import icon from "../../assets/img/Photoshop-Logo-Illustration-Mockup-Tutorial 1.png"
import { log_out } from "../log_out/delete_modal"
import "./sidebar.css"

export default function Sidebar() {
	const navigate = useNavigate()

	return (
		<div className="sidebar">
			<div className="icon">
				<NavLink to="/">
					<img src={icon} alt="Logo icon image" />
				</NavLink>
			</div>

			{/* links */}
			<ul>
				<li>
					<NavLink to="/stats">
						<i className="fa-solid fa-square-poll-vertical"></i>
						<span className="link-name">Statistika</span>
					</NavLink>
				</li>
				<li>
					<NavLink to="/reports">
						<i className="fa-solid fa-list-check"></i>
						<span className="link-name">Hisobotlar</span>
					</NavLink>
				</li>
				<li>
					<NavLink to="/products">
						<i className="fa-regular fa-rectangle-list"></i>{" "}
						<span className="link-name">Mahsulotlar</span>
					</NavLink>
				</li>
				<li>
					<NavLink to="/goods">
						<i className="fa-solid fa-tags"></i>
						<span className="link-name">Kategoriyalar</span>
					</NavLink>
				</li>
				<li>
					<NavLink to="/return">
						<i className="fa-solid fa-box-archive"></i>
						<span className="link-name">Qaytgan mahsulotlar</span>
					</NavLink>
				</li>
				<li>
					<NavLink to="/debts">
						<i className="fa-solid fa-hand-holding-dollar"></i>
						<span className="link-name">Qarzdorlik</span>
					</NavLink>
				</li>
				<li>
					<NavLink to="/store">
						<i className="fa-solid fa-warehouse"></i>
						<span className="link-name">Ombor</span>
					</NavLink>
				</li>
				<li>
					<NavLink to="/deliver">
						<i className="fa-solid fa-truck"></i>
						<span className="link-name">Yetbakiz beruvchi</span>
					</NavLink>
				</li>
				<li>
					<NavLink to="/clients">
						<i className="fa-solid fa-users"></i>
						<span className="link-name">Mijozlar</span>
					</NavLink>
				</li>
				<li>
					<NavLink to="/employees">
						<i className="fa-solid fa-user-tag"></i>
						<span className="link-name">Xodimlar</span>
					</NavLink>
				</li>
				<li>
					<NavLink to="/currency">
						<i className="fa-solid fa-money-bill-transfer"></i>
						<span className="link-name">Pul birliklari</span>
					</NavLink>
				</li>
				<li>
					<NavLink to="/settings">
						<i className="fa-solid fa-gear"></i>
						<span className="link-name">Sozlamalar</span>
					</NavLink>
				</li>

				<li className="logout">
					<a
						href="#"
						onClick={(e) => {
							log_out(e, navigate)
						}}
					>
						<i className="fa-solid fa-right-from-bracket"></i>{" "}
						<span className="">Chiqish</span>
					</a>
				</li>
			</ul>
		</div>
	)
}
