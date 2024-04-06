import { useEffect, useRef, useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import Sidebar from "../../components/sidebar/Sidebar"
import SSidebar from "../../components/ssidebar/SSidebar"
import { get } from "../../customHook/api"
import "./main.css"
import { Plus } from "@phosphor-icons/react"
import SellDebt from "../../components/sell_debt/SellDebt"

export default function MainPage() {
	const [sidebar, setSidebar] = useState(true)
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
	const [activeSectionIndex, setActiveSectionIndex] = useState(0)
	const [activeElementIndex, setActiveElementIndex] = useState(0)

	const removeLinkFocus = () => {
		switch (url.pathname) {
			case "/":
				setActiveSectionIndex(0)
				break
			case "/reports":
				setActiveSectionIndex(1)
				break
			case "/products":
				setActiveSectionIndex(2)
				break
			case "/goods":
				setActiveSectionIndex(3)
				break
			case "/return":
				setActiveSectionIndex(4)
				break
			case "/debts":
				setActiveSectionIndex(5)
				break
			case "/store":
				setActiveSectionIndex(6)
				break
			case "/deliver":
				setActiveSectionIndex(7)
				break
			case "/clients":
				setActiveSectionIndex(8)
				break
			case "/employees":
				setActiveSectionIndex(9)
				break
			case "/currency":
				setActiveSectionIndex(10)
				break
		}
	}

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

		removeLinkFocus()
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
					setActiveElementIndex(1)
					inputRef?.current?.blur()
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
				} else if (e.ctrlKey && e.key === "ArrowUp") {
					e.preventDefault()
					setActiveSectionIndex((prev) => (prev === 0 ? 10 : prev - 1))
					inputRef?.current?.blur()
				} else if (e.ctrlKey && e.key === "ArrowDown") {
					e.preventDefault()
					setActiveSectionIndex((prev) => (prev === 10 ? 0 : prev + 1))
					inputRef?.current?.blur()
				}
			},
			true
		)
	}, [])

	const closeAllModals = () => {
		removeLinkFocus()
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
					setActiveElementIndex(1)
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
					activeSectionIndex={activeSectionIndex}
				/>
			) : (
				<SSidebar
					setSidebar={setSidebar}
					sidebar={sidebar}
					userInfo={userInfo}
					activeSectionIndex={activeSectionIndex}
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
						activeElementIndex={activeElementIndex}
						setActiveElementIndex={setActiveElementIndex}
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
