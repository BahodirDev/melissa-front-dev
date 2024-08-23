import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { log_out } from "../log_out/delete_modal"
import "./ssidebar.css"
import {
	ChartBar,
	Cube,
	CurrencyDollar,
	FileText,
	HandCoins,
	Recycle,
	SecurityCamera,
	SignOut,
	SquaresFour,
	Truck,
	Users,
	UsersFour,
	Warehouse,
} from "@phosphor-icons/react"
import { useEffect, useState } from "react"

export default function SSidebar({
	setSidebar,
	sidebar,
	userInfo,
	activeSectionIndex,
	darkMode,
}) {
	const navigate = useNavigate()
	const [userRole, setUserRole] = useState(0)
	const url = useLocation()

	useEffect(() => {
		setUserRole(JSON.parse(localStorage.getItem("role")))
	}, [])

	useEffect(() => {
		const handleKeyPress = (e) => {
			if (e.ctrlKey && e.key === "Enter") {
				e.preventDefault()
				switch (activeSectionIndex) {
					case 0:
						navigate("/")
						break
					case 1:
						navigate("/reports")
						break
					case 2:
						navigate("/products")
						break
					case 3:
						navigate("/goods")
						break
					case 4:
						navigate("/return")
						break
					case 5:
						navigate("/debts")
						break
					case 6:
						navigate("/store")
						break
					case 7:
						navigate("/deliver")
						break
					case 8:
						navigate("/clients")
						break
					case 9:
						navigate("/monitoring")
						break
					case 10:
						navigate("/employees")
						break
					case 11:
						navigate("/currency")
						break
				}
			}
		}

		document.addEventListener("keydown", handleKeyPress)

		return () => {
			document.removeEventListener("keydown", handleKeyPress)
		}
	}, [activeSectionIndex])

	return (
		<div className={`ssidebar ${darkMode ? "dark" : null}`}>
			<div className="sicon">
				<h1 type="button" onClick={() => setSidebar((prev) => !prev)}>
					M
				</h1>
			</div>

			{/* links */}
			<ul>
				{userRole === 1 && (
					<li>
						<NavLink
							to="/"
							title="Statistika"
							className={`${
								activeSectionIndex === 0 && url.pathname !== "/"
									? "tabFocus"
									: null
							}`}
						>
							<ChartBar size={24} />
						</NavLink>
					</li>
				)}
				{userRole === 1 && (
					<li>
						<NavLink
							to="/reports"
							title="Hisobot"
							className={`${
								activeSectionIndex === 1 && url.pathname !== "/reports"
									? "tabFocus"
									: null
							}`}
						>
							<FileText size={24} />
						</NavLink>
					</li>
				)}
				<li>
					<NavLink
						to="/products"
						title="Mahsulotlar"
						className={`${
							activeSectionIndex === 2 && url.pathname !== "/products"
								? "tabFocus"
								: null
						}`}
					>
						<Cube size={24} />
					</NavLink>
				</li>
				{userRole === 1 && (
					<li>
						<NavLink
							to="/goods"
							title="Kategoriyalar"
							className={`${
								activeSectionIndex === 3 && url.pathname !== "/goods"
									? "tabFocus"
									: null
							}`}
						>
							<SquaresFour size={24} />
						</NavLink>
					</li>
				)}
				{userRole === 1 && (
					<li>
						<NavLink
							to="/return"
							title="Qaytgan mahsulotlar"
							className={`${
								activeSectionIndex === 4 && url.pathname !== "/return"
									? "tabFocus"
									: null
							}`}
						>
							<Recycle size={24} />
						</NavLink>
					</li>
				)}
				{userRole === 1 && (
					<li>
						<NavLink
							to="/debts"
							title="Moliya"
							className={`${
								activeSectionIndex === 5 && url.pathname !== "/debts"
									? "tabFocus"
									: null
							}`}
						>
							<HandCoins size={24} />
						</NavLink>
					</li>
				)}
				{userRole === 1 && (
					<li>
						<NavLink
							to="/store"
							title="Omborlar"
							className={`${
								activeSectionIndex === 6 && url.pathname !== "/store"
									? "tabFocus"
									: null
							}`}
						>
							<Warehouse size={24} />
						</NavLink>
					</li>
				)}
				{userRole === 1 && (
					<li>
						<NavLink
							to="/deliver"
							title="Ta'minotchilar"
							className={`${
								activeSectionIndex === 7 && url.pathname !== "/deliver"
									? "tabFocus"
									: null
							}`}
						>
							<Truck size={24} />
						</NavLink>
					</li>
				)}
				<li>
					<NavLink
						to="/clients"
						title="Mijozlar"
						className={`${
							activeSectionIndex === 8 && !url.pathname.startsWith("/clients")
								? "tabFocus"
								: null
						}`}
					>
						<UsersFour size={24} />
					</NavLink>
				</li>
				<li>
					<NavLink
						to="/monitoring"
						title="Monitoring"
						style={{ transform: "rotateY(180deg)" }}
						className={`${
							activeSectionIndex === 9 && url.pathname !== "/monitoring"
								? "tabFocus"
								: null
						}`}
					>
						<SecurityCamera size={24} />
					</NavLink>
				</li>
				{userRole === 1 && (
					<li>
						<NavLink
							to="/employees"
							title="Xodimlar"
							className={`${
								activeSectionIndex === 10 && url.pathname !== "/employees"
									? "tabFocus"
									: null
							}`}
						>
							<Users size={24} />
						</NavLink>
					</li>
				)}
				{userRole === 1 && (
					<li>
						<NavLink
							to="/currency"
							title="Pul birliklari"
							className={`${
								activeSectionIndex === 11 && url.pathname !== "/currency"
									? "tabFocus"
									: null
							}`}
						>
							<CurrencyDollar size={24} />
						</NavLink>
					</li>
				)}
				{/* <li>
					<NavLink to="/settings">
						<i className="fa-solid fa-gear"></i>
					</NavLink>
				</li> */}
			</ul>
		</div>
	)
}
