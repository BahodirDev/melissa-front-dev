import user_image from "../../assets/img/user.jpg"
import { useEffect, useRef, useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import Sidebar from "../../components/sidebar/Sidebar"
import SSidebar from "../../components/ssidebar/SSidebar"
import { get } from "../../customHook/api"
import "./main.css"
import {
	ArrowLineLeft,
	ArrowLineRight,
	MoonStars,
	Plus,
	SignOut,
	SunDim,
} from "@phosphor-icons/react"
import SellDebt from "../../components/sell_debt/SellDebt"
import { employee_role } from "../employees/employee_role"
import { log_out } from "../../components/log_out/delete_modal"

export default function MainPage() {
	// const [sidebar, setSidebar] = useState(true)
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
	const [infoModal, setInfoModal] = useState(false)
	const [darkMode, setDarkMode] = useState(() => {
		const savedDarkMode = localStorage.getItem("darkMode")
		return savedDarkMode ? JSON.parse(savedDarkMode) : false
	})
	const [sidebar, setSidebar] = useState(() => {
		const savedSidebar = localStorage.getItem("sidebar")
		return savedSidebar ? JSON.parse(savedSidebar) : false
	})
	const [backspaceCount, setBackspaceCount] = useState(0)

	const removeLinkFocus = () => {
		switch (url.pathname.split("/")[1]) {
			case "":
				setActiveSectionIndex(0)
				break
			case "reports":
				setActiveSectionIndex(1)
				break
			case "products":
				setActiveSectionIndex(2)
				break
			case "goods":
				setActiveSectionIndex(3)
				break
			case "return":
				setActiveSectionIndex(4)
				break
			case "debts":
				setActiveSectionIndex(5)
				break
			case "store":
				setActiveSectionIndex(6)
				break
			case "deliver":
				setActiveSectionIndex(7)
				break
			case "clients":
				setActiveSectionIndex(8)
				break
			case "employees":
				setActiveSectionIndex(9)
				break
			case "currency":
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
		localStorage.setItem("darkMode", JSON.stringify(darkMode))
	}, [darkMode])

	useEffect(() => {
		localStorage.setItem("sidebar", JSON.stringify(sidebar))
	}, [sidebar])

	useEffect(() => {
		if (backspaceCount === 2 && inputRef.current) {
			inputRef.current.value = ""
		}
	}, [backspaceCount])

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
				} else if (
					e.key === "`" ||
					e.key === "ё" ||
					e.key === "~" ||
					e.key === "Ё"
				) {
					e.preventDefault()
					setshowDropdown("")
					setAddModalVisible(false)
					setSDModalVisible(false)
					setTimeout(() => {
						setAddModalDisplay("none")
						setSDModalDisplay("none")
					}, 300)
					inputRef.current?.focus()
				} else if (
					e.key === "Backspace" &&
					inputRef.current === document.activeElement
				) {
					setBackspaceCount((prevCount) => prevCount + 1)
					setTimeout(() => {
						setBackspaceCount(0)
					}, 150)
				} else if (e.ctrlKey && e.key === "ArrowLeft") {
					e.preventDefault()
					setSidebar(false)
				} else if (e.ctrlKey && e.key === "ArrowRight") {
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
		setInfoModal(false)
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
		<div
			className={`home-con ${darkMode ? "dark" : null}`}
			onClick={closeAllModals}
		>
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
					darkMode={darkMode}
				/>
			) : (
				<SSidebar
					setSidebar={setSidebar}
					sidebar={sidebar}
					userInfo={userInfo}
					activeSectionIndex={activeSectionIndex}
					darkMode={darkMode}
				/>
			)}

			<div className="main-div">
				<div className={`top-menu ${darkMode ? "dark" : null}`}>
					{sidebar ? (
						<ArrowLineLeft size={24} onClick={() => setSidebar(!sidebar)} />
					) : (
						<ArrowLineRight size={24} onClick={() => setSidebar(!sidebar)} />
					)}

					<div className="top-menu-right">
						{darkMode ? (
							<SunDim size={24} onClick={() => setDarkMode(!darkMode)} />
						) : (
							<MoonStars size={24} onClick={() => setDarkMode(!darkMode)} />
						)}
						<div className="user-info" onClick={(e) => e.stopPropagation()}>
							<img
								src={user_image}
								alt="xodim-rasm"
								onClick={() => setInfoModal(!infoModal)}
							/>
							{infoModal ? (
								<>
									<div className="user-info-modal-pointer"></div>
									<div className="user-info-modal">
										<p>{userInfo?.name ? userInfo?.name : "Xodim"}</p>
										<span>{employee_role(userInfo?.role)}</span>
										<button
											title="Hisobdan chiqish"
											onClick={(e) => {
												log_out(e, navigate, darkMode)
											}}
											className="btn-logout"
										>
											Saytdan chiqish &nbsp;
											<SignOut size={24} />
										</button>
									</div>
								</>
							) : null}
						</div>
					</div>
				</div>

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
						darkMode={darkMode}
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
							darkMode,
						]}
					/>
				</div>
			</div>
		</div>
	)
}
