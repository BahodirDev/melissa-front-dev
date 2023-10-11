import { useEffect, useRef, useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import DebtsModal from "../../components/debts/DebtsModal"
import MyModal from "../../components/modal/Modal"
import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import SSidebar from "../../components/ssidebar/SSidebar"
import { get } from "../../customHook/api"
import "./main.css"
// import "./old.css"
import { Plus } from "@phosphor-icons/react"
import SellDebt from "../../components/sell_debt/SellDebt"

export default function MainPage() {
	const [sidebar, setSidebar] = useState(false)
	const inputRef = useRef(null)
	const url = useLocation()
	const navigate = useNavigate()
	const [userInfo, setUserInfo] = useState(0)
	const [action, setAction] = useState({})
	const [showDropdown, setshowDropdown] = useState("")
	const [addModalVisible, setAddModalVisible] = useState(false)
	const [addModalDisplay, setAddModalDisplay] = useState("none")
	const [SDModalVisible, setSDModalVisible] = useState(false)
	const [SDModalDisplay, setSDModalDisplay] = useState("none")

	useEffect(() => {
		setUserInfo({
			userToken: localStorage.getItem("user"),
			role: localStorage.getItem("role"),
			name: localStorage.getItem("name"),
			id: localStorage.getItem("id"),
		})

		get("/currency/currency-list").then((data) => {
			if (data?.response?.status === 401) {
				// localStorage.clear()
				localStorage.removeItem("id")
				localStorage.removeItem("name")
				localStorage.removeItem("role")
				localStorage.removeItem("user")
				navigate("/login")
				// window.location.reload(false)
			} else if (!localStorage.getItem("user")) {
				// localStorage.clear()
				localStorage.removeItem("id")
				localStorage.removeItem("name")
				localStorage.removeItem("role")
				localStorage.removeItem("user")
				navigate("/login")
			}
		})
	}, [url])

	useEffect(() => {
		document.addEventListener(
			"keydown",
			(e) => {
				if (e.key === "Escape") {
					setshowDropdown("")
					setAddModalVisible(false)
					setAddModalDisplay("none")
					setSDModalVisible((prevVisible) => {
						if (prevVisible) {
							setTimeout(() => {
								setSDModalDisplay("none")
							}, 300)
						} else {
							setSDModalDisplay("block")
						}
						return !prevVisible
					})
				} else if (e.ctrlKey && e.key === "k") {
					e.preventDefault()
					setshowDropdown("")
					setAddModalVisible(false)
					setSDModalVisible(false)
					setTimeout(() => {
						setAddModalDisplay("none")
						setSDModalDisplay("none")
					}, 300)
					inputRef.current?.focus()
				} else if (e.ctrlKey && e.key === ",") {
					e.preventDefault()
					setSidebar(false)
				} else if (e.ctrlKey && e.key === ".") {
					e.preventDefault()
					setSidebar(true)
				}
			},
			true
		)
	}, [])

	const closeAllModals = () => {
		setshowDropdown("")
		setAddModalVisible(false)
		setSDModalVisible(false)
		setTimeout(() => {
			setAddModalDisplay("none")
			setSDModalDisplay("none")
		}, 300)
	}

	return (
		<div className="home-con" onClick={closeAllModals}>
			<button
				className="primary-btn modal-toggle-btn"
				onClick={(e) => {
					e.stopPropagation()
					setshowDropdown("")
					setSDModalVisible(true)
					setSDModalDisplay("block")
				}}
			>
				<Plus size={24} />
			</button>
			{sidebar ? <Sidebar /> : <SSidebar />}
			<div className="main-div">
				<Navbar
					setSidebar={setSidebar}
					sidebar={sidebar}
					userInfo={userInfo}
					action={action}
				/>
				<div
					className="content"
					style={{ overflowY: (addModalVisible || SDModalVisible) && "hidden" }}
				>
					{/* <MyModal myModal={myModal} setMyModal={setMyModal} />
					<DebtsModal debtsModal={debtsModal} setDebtsModal={setDebtsModal} /> */}
					<SellDebt
						SDModalVisible={SDModalVisible}
						setSDModalVisible={setSDModalVisible}
						SDModalDisplay={SDModalDisplay}
						setSDModalDisplay={setSDModalDisplay}
					/>
					<Outlet
						context={[
							userInfo,
							inputRef,
							action,
							setAction,
							showDropdown,
							setshowDropdown,
							addModalVisible,
							setAddModalVisible,
							addModalDisplay,
							setAddModalDisplay,
						]}
					/>
				</div>
			</div>
		</div>
	)
}
