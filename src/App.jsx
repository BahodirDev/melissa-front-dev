import { BrowserRouter, Route, Routes } from "react-router-dom"
import {
	BoshSahifa,
	Clients,
	Currency,
	Debts,
	Deliver,
	Employees,
	Goods,
	Home,
	Login,
	MainPage,
	PageNotFound,
	Products,
	Reports,
	Return,
	Settings,
	Store,
} from "./components"
import "react-toastify/dist/ReactToastify.css"
import { ToastContainer } from "react-toastify"
import ClientsInfo from "./pages/clients/ClientsInfo"
import { useEffect, useState } from "react"

// import { useDispatch, useSelector } from "react-redux"
// import { login, logout } from "./components/reducers/auth"

export default function App() {
	// const state = useSelector((state) => state.auth)
	// const dispatch = useDispatch()
	// console.log(dispatch(login, logout))

	const [user, setUser] = useState(null)

	useEffect(() => {
		setUser(localStorage.getItem("user"))
	}, [])

	return (
		<BrowserRouter>
			<ToastContainer
				autoClose={3000}
				position="top-center"
				hideProgressBar
				pauseOnFocusLoss={false}
			/>

			<Routes>
				<Route path="/login" element={<Login />} />

				<Route path="/" element={<MainPage />}>
					<Route index element={<Home />} />
					<Route path="/reports" element={<Reports />} />
					<Route path="/products" element={<Products />} />
					<Route path="/goods" element={<Goods />} />
					<Route path="/currency" element={<Currency />} />
					<Route path="/employees" element={<Employees />} />
					<Route path="/store" element={<Store />} />
					<Route path="/settings" element={<Settings />} />
					<Route path="/deliver" element={<Deliver />} />
					<Route path="/clients">
						<Route index element={<Clients />} />
						<Route path=":id" element={<ClientsInfo />} />
					</Route>
					<Route path="/return" element={<Return />} />
					<Route path="/debts" element={<Debts />} />
				</Route>
				<Route path="*" element={<PageNotFound />} />
			</Routes>
		</BrowserRouter>
	)
}
