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

export default function App() {
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
					<Route path="/" element={<BoshSahifa />} />
					<Route path="/reports" element={<Reports />} />
					<Route path="/stats" element={<Home />} />
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
