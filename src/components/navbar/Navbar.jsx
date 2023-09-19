import { Button, Input } from "antd"
import { useDispatch } from "react-redux"
import { useLocation } from "react-router-dom"
import user_image from "../../assets/img/admin.jpg"
import { post } from "../../customHook/api"
import useApiRequest from "../../customHook/useUrl"
import { employee_role } from "../../pages/employees/employee_role"
import "./navbar.css"

export default function Navbar({
	setSidebar,
	inputRef,
	sidebar,
	setSearchInput,
	searchInput,
	userInfo,
	action,
}) {
	const location = useLocation()
	const request = useApiRequest()
	const dispatch = useDispatch()

	const submitSearch = () => {
		// for those with reducer
		if (
			action?.url === "/return/return-filter" ||
			action?.url === "/users/users-search" ||
			action?.url === "/clients/clients-search" ||
			action?.url === "/deliver/deliver-search"
		) {
			dispatch(action?.setLoading(true))
			post(action?.url, action?.body).then((data) => {
				action?.res(data)
				action?.submitted(true)
				dispatch(action?.setLoading(false))
			})
		} else {
			action?.setLoading(true)
			request(
				"POST",
				`${process.env.REACT_APP_URL}${action?.url}`,
				action?.body
			).then((data) => {
				action?.res(data)
				action?.submitted(true)
				action?.setLoading(false)
			})
		}
	}

	const clearSearch = () => {
		if (action?.url === "/return/return-filter") {
			action?.clearValues.first("")
			action?.clearValues.second("")
			action?.clearValues.third("")
		}
		setSearchInput("")
		action?.submitted(false)
	}

	return (
		<div className="top-bar">
			<button className="btn nav-toggle" onClick={() => setSidebar(!sidebar)}>
				<svg
					style={{ transform: sidebar && "rotate(180deg)" }}
					width="21"
					height="14"
					viewBox="0 0 21 14"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M1 10H11C11.2652 10 11.5196 9.89464 11.7071 9.70711C11.8946 9.51957 12 9.26522 12 9C12 8.73478 11.8946 8.48043 11.7071 8.29289C11.5196 8.10536 11.2652 8 11 8H1C0.734784 8 0.48043 8.10536 0.292893 8.29289C0.105357 8.48043 0 8.73478 0 9C0 9.26522 0.105357 9.51957 0.292893 9.70711C0.48043 9.89464 0.734784 10 1 10ZM1 6H11C11.2652 6 11.5196 5.89464 11.7071 5.70711C11.8946 5.51957 12 5.26522 12 5C12 4.73478 11.8946 4.48043 11.7071 4.29289C11.5196 4.10536 11.2652 4 11 4H1C0.734784 4 0.48043 4.10536 0.292893 4.29289C0.105357 4.48043 0 4.73478 0 5C0 5.26522 0.105357 5.51957 0.292893 5.70711C0.48043 5.89464 0.734784 6 1 6ZM1 2H19C19.2652 2 19.5196 1.89464 19.7071 1.70711C19.8946 1.51957 20 1.26522 20 1C20 0.734784 19.8946 0.48043 19.7071 0.292893C19.5196 0.105357 19.2652 0 19 0H1C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1C0 1.26522 0.105357 1.51957 0.292893 1.70711C0.48043 1.89464 0.734784 2 1 2ZM19 12H1C0.734784 12 0.48043 12.1054 0.292893 12.2929C0.105357 12.4804 0 12.7348 0 13C0 13.2652 0.105357 13.5196 0.292893 13.7071C0.48043 13.8946 0.734784 14 1 14H19C19.2652 14 19.5196 13.8946 19.7071 13.7071C19.8946 13.5196 20 13.2652 20 13C20 12.7348 19.8946 12.4804 19.7071 12.2929C19.5196 12.1054 19.2652 12 19 12ZM17.64 4.57C17.5412 4.47449 17.4239 4.40036 17.2952 4.35223C17.1665 4.30409 17.0293 4.28299 16.8921 4.29023C16.7549 4.29747 16.6207 4.3329 16.4978 4.39432C16.3749 4.45573 16.266 4.54181 16.1778 4.64718C16.0897 4.75255 16.0242 4.87495 15.9854 5.00676C15.9467 5.13856 15.9355 5.27694 15.9526 5.41325C15.9697 5.54957 16.0147 5.6809 16.0848 5.79905C16.1549 5.91721 16.2486 6.01966 16.36 6.1L17.44 7L16.36 7.9C16.2587 7.98395 16.175 8.08705 16.1137 8.2034C16.0523 8.31974 16.0145 8.44705 16.0025 8.57803C15.9904 8.70901 16.0043 8.84108 16.0433 8.96668C16.0824 9.09229 16.1458 9.20895 16.23 9.31C16.324 9.42288 16.4418 9.51366 16.5748 9.57588C16.7079 9.63811 16.8531 9.67024 17 9.67C17.2349 9.66765 17.4615 9.58269 17.64 9.43L19.64 7.77C19.7532 7.67617 19.8444 7.55851 19.907 7.42542C19.9695 7.29232 20.002 7.14707 20.002 7C20.002 6.85293 19.9695 6.70768 19.907 6.57458C19.8444 6.44149 19.7532 6.32383 19.64 6.23L17.64 4.57Z"
						fill="black"
					/>
				</svg>
			</button>

			{location.pathname !== "/" &&
			"reports products goods return debts store deliver clients employees".includes(
				location.pathname.slice(1)
			) ? (
				<div className="search-form">
					{/* <img src={searchIcon} alt="" /> */}
					<Input
						ref={inputRef}
						type="text"
						className=""
						placeholder="Qidiruv..."
						value={searchInput}
						allowClear
						onChange={(e) => setSearchInput(e.target.value)}
					/>
					{location.pathname !== "/" &&
					"goods return debts store deliver clients employees".includes(
						location.pathname.slice(1)
					) ? (
						<>
							<Button className="" onClick={clearSearch}>
								Tozalash
							</Button>
							<Button className="" onClick={submitSearch}>
								Saqlash
							</Button>
						</>
					) : null}
				</div>
			) : null}

			{/* <div className="nav-icons">
				<button className="btn">
					<i className="fas fa-plus"></i>
				</button>
				<button className="btn">
					<i className="fa-regular fa-bell">
						<span className="dot"></span>
					</i>
				</button>
			</div> */}

			{/* <div className="language-select">
				<span>uz</span>
				<span>ру</span>
			</div> */}

			<div className="nav-user__info">
				<div className="nav-user__image">
					<img src={user_image} alt="user image" />
				</div>
				<div className="nav-user__about">
					<p className="nav-user__name">
						{userInfo?.name ? userInfo?.name : "Hodim"}
					</p>
					<span className="nav-user__role">
						{employee_role(userInfo?.role)}
					</span>
				</div>
			</div>
		</div>
	)
}
