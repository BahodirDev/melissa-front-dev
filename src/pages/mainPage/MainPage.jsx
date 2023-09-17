import { useEffect, useRef, useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import DebtsModal from "../../components/debts/DebtsModal"
import MyModal from "../../components/modal/Modal"
import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import SSidebar from "../../components/ssidebar/SSidebar"
import { get } from "../../customHook/api"
import "./main.css"

export default function MainPage() {
	const [debtsModal, setDebtsModal] = useState(false)
	const [myModal, setMyModal] = useState(false)
	const [sidebar, setSidebar] = useState(false)
	const [searchInput, setSearchInput] = useState("")
	const inputRef = useRef(null)
	const url = useLocation()
	const navigate = useNavigate()
	const [userInfo, setUserInfo] = useState(0)
	const [action, setAction] = useState({})

	useEffect(() => {
		setUserInfo({
			userToken: localStorage.getItem("user"),
			role: localStorage.getItem("role"),
			name: localStorage.getItem("name"),
		})
		get("/currency/currency-list").then((data) => {
			if (data?.response?.status === 401) {
				localStorage.clear()
				navigate("/login")
				// window.location.reload(false)
			}
		})

		setSearchInput("")

		window.addEventListener("keydown", (e) => {
			if (e.key === "Escape") {
				setDebtsModal(false)
				setMyModal(!myModal)
			} else if (e.key === "`") {
				setMyModal(false)
				setDebtsModal((prev) => !prev)
			} else if (e.ctrlKey && e.key === "/") {
				setMyModal(false)
				setDebtsModal(false)
				e.preventDefault()
				inputRef.current.focus()
			} else if (e.ctrlKey && e.key === ",") {
				e.preventDefault()
				setSidebar(false)
			} else if (e.ctrlKey && e.key === ".") {
				e.preventDefault()
				setSidebar(true)
			}
		})
	}, [url])

	return (
		<div className="home-con">
			<button
				onClick={() => {
					setDebtsModal(false)
					setMyModal(!myModal)
				}}
				className="btn btn-primary modal-toggle__button"
			>
				<i className="fa-solid fa-weight-scale"></i>
			</button>
			<button
				onClick={() => {
					setMyModal(false)
					setDebtsModal(!debtsModal)
				}}
				className="btn btn-primary debts-modal-toggle__button"
			>
				<i className="fas fa-hand-holding-usd"></i>
			</button>
			{sidebar ? <Sidebar /> : <SSidebar />}
			<div className="main-div">
				<Navbar
					setSidebar={setSidebar}
					inputRef={inputRef}
					sidebar={sidebar}
					searchInput={searchInput}
					setSearchInput={setSearchInput}
					userInfo={userInfo}
					action={action}
				/>
				<div
					className="content"
					style={{ width: sidebar && "calc(100vw - 250px)" }}
				>
					<MyModal myModal={myModal} setMyModal={setMyModal} />
					<DebtsModal debtsModal={debtsModal} setDebtsModal={setDebtsModal} />
					<Outlet
						context={[
							searchInput,
							setSearchInput,
							sidebar,
							userInfo,
							action,
							setAction,
						]}
					/>
				</div>
			</div>
		</div>
	)
}
