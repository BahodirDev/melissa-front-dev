import { useEffect, useRef, useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import Sidebar from "../../components/sidebar/Sidebar"
import SSidebar from "../../components/ssidebar/SSidebar"
import { get } from "../../customHook/api"
import "./main.css"
import { Plus } from "@phosphor-icons/react"
import SellDebt from "../../components/sell_debt/SellDebt"

export default function MainPage() {
	const [sidebar, setSidebar] = useState(false)
	const inputRef = useRef(null)
	const url = useLocation()
	const navigate = useNavigate()
	const [userInfo, setUserInfo] = useState(0)
	const [showDropdown, setshowDropdown] = useState("")
	const [miniModal, setMiniModal] = useState("")
	const [addModalVisible, setAddModalVisible] = useState(false)
	const [addModalDisplay, setAddModalDisplay] = useState("none")
	const [SDModalVisible, setSDModalVisible] = useState(false)
	const [SDModalDisplay, setSDModalDisplay] = useState("none")

	useEffect(() => {
		get("/currency/currency-list").then((data) => {
			if (data?.response?.status === 401) {
				localStorage.removeItem("id")
				localStorage.removeItem("name")
				localStorage.removeItem("role")
				localStorage.removeItem("user")
				navigate("/login")
			}
		})

		if (!localStorage.getItem("user")) {
			localStorage.removeItem("id")
			localStorage.removeItem("name")
			localStorage.removeItem("role")
			localStorage.removeItem("user")
			navigate("/login")
		}
	}, [url])

	useEffect(() => {
		setUserInfo({
			userToken: localStorage.getItem("user"),
			role: JSON.parse(localStorage.getItem("role")),
			name: localStorage.getItem("name"),
			id: localStorage.getItem("id"),
		})

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
							setSDModalDisplay("grid")
						}
						return !prevVisible
					})
				} else if (e.key === "`") {
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
		setMiniModal("")
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
					setMiniModal("")
					setSDModalVisible(true)
					setSDModalDisplay("grid")
				}}
			>
				<Plus size={24} />
			</button>
			{sidebar ? (
				<Sidebar
					setSidebar={setSidebar}
					sidebar={sidebar}
					userInfo={userInfo}
				/>
			) : (
				<SSidebar
					setSidebar={setSidebar}
					sidebar={sidebar}
					userInfo={userInfo}
				/>
			)}
			<div className="main-div">
				<div
					className="content"
					style={{ overflowY: (addModalVisible || SDModalVisible) && "hidden" }}
				>
					<SellDebt
						SDModalVisible={SDModalVisible}
						setSDModalVisible={setSDModalVisible}
						SDModalDisplay={SDModalDisplay}
						setSDModalDisplay={setSDModalDisplay}
					/>
					<Outlet
						context={[
							inputRef,
							showDropdown,
							setshowDropdown,
							addModalVisible,
							setAddModalVisible,
							addModalDisplay,
							setAddModalDisplay,
							miniModal,
							setMiniModal,
							sidebar,
							userInfo,
						]}
					/>
				</div>
			</div>
		</div>
	)
}
