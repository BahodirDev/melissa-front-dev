import { Button, Input } from "antd"
import { useDispatch } from "react-redux"
import { useLocation } from "react-router-dom"
import user_image from "../../assets/img/user.jpg"
import { post } from "../../customHook/api"
import { employee_role } from "../../pages/employees/employee_role"
import "./navbar.css"

export default function Navbar({
	setSidebar,
	inputRef,
	sidebar,
	userInfo,
	action,
}) {
	const location = useLocation()
	const dispatch = useDispatch()

	const submitSearch = () => {
		dispatch(action?.setLoading(true))
		post(action?.url, action?.body).then((data) => {
			if (data?.status === 200 || data?.status === 201) {
				action?.res(data?.data)
				action?.submitted(true)
			}
			dispatch(action?.setLoading(false))
		})
	}

	const clearSearch = () => {
		action?.submitted(false)
		dispatch(action?.setLoading(false))
		if (action?.url === "/return/return-filter") {
			action?.clearValues.first("")
			action?.clearValues.second("")
			action?.clearValues.third("")
		} else if (action?.url === "/reports/reports-filter") {
			action?.clearValues.second([])
			action?.clearValues.third([])
			action?.clearValues.fourth("")
			action?.clearValues.fifth("")
			action?.clearValues.sixth("all")
		} else if (action?.url === "/products/products-filter") {
			action?.clearValues.first([])
			action?.clearValues.second("")
			action?.clearValues.third("")
			action?.clearValues.fourth("")
			action?.clearValues.fifth("")
		}
	}

	return (
		<div className="top-bar">
			<button className="nav-toggle" onClick={() => setSidebar(!sidebar)}>
				<svg
					style={{ transform: sidebar || "rotate(180deg)" }}
					width="19"
					height="18"
					viewBox="0 0 19 18"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M18.75 9C18.75 9.19891 18.671 9.38968 18.5303 9.53033C18.3897 9.67098 18.1989 9.75 18 9.75H5.56031L11.0306 15.2194C11.1003 15.2891 11.1556 15.3718 11.1933 15.4628C11.231 15.5539 11.2504 15.6515 11.2504 15.75C11.2504 15.8485 11.231 15.9461 11.1933 16.0372C11.1556 16.1282 11.1003 16.2109 11.0306 16.2806C10.9609 16.3503 10.8782 16.4056 10.7872 16.4433C10.6961 16.481 10.5985 16.5004 10.5 16.5004C10.4015 16.5004 10.3039 16.481 10.2128 16.4433C10.1218 16.4056 10.0391 16.3503 9.96937 16.2806L3.21937 9.53063C3.14964 9.46097 3.09432 9.37825 3.05658 9.2872C3.01884 9.19616 2.99941 9.09856 2.99941 9C2.99941 8.90144 3.01884 8.80384 3.05658 8.7128C3.09432 8.62175 3.14964 8.53903 3.21937 8.46937L9.96937 1.71938C10.0391 1.64969 10.1218 1.59442 10.2128 1.55671C10.3039 1.51899 10.4015 1.49958 10.5 1.49958C10.5985 1.49958 10.6961 1.51899 10.7872 1.55671C10.8782 1.59442 10.9609 1.64969 11.0306 1.71938C11.1003 1.78906 11.1556 1.87178 11.1933 1.96283C11.231 2.05387 11.2504 2.15145 11.2504 2.25C11.2504 2.34855 11.231 2.44613 11.1933 2.53717C11.1556 2.62822 11.1003 2.71094 11.0306 2.78062L5.56031 8.25H18C18.1989 8.25 18.3897 8.32902 18.5303 8.46967C18.671 8.61032 18.75 8.80109 18.75 9ZM0.75 0C0.551088 0 0.360322 0.0790178 0.21967 0.21967C0.0790178 0.360322 0 0.551088 0 0.75V17.25C0 17.4489 0.0790178 17.6397 0.21967 17.7803C0.360322 17.921 0.551088 18 0.75 18C0.948912 18 1.13968 17.921 1.28033 17.7803C1.42098 17.6397 1.5 17.4489 1.5 17.25V0.75C1.5 0.551088 1.42098 0.360322 1.28033 0.21967C1.13968 0.0790178 0.948912 0 0.75 0Z"
						fill="#424242"
					/>
				</svg>
			</button>

			<div className="nav-user__info">
				<div className="nav-user__about">
					<p className="nav-user__name">
						{userInfo?.name ? userInfo?.name : "Hodim"}
					</p>
					<span className="nav-user__role">
						{employee_role(userInfo?.role)}
					</span>
				</div>
				<div className="nav-user__image">
					<img src={user_image} alt="hodim-rasm" />
				</div>
			</div>
		</div>
	)
}
