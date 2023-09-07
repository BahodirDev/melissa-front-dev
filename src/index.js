import axios from "axios"
import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import App from "./App"
import store from "./components/store"
import "./index.css"

axios.defaults.baseURL = process.env.REACT_APP_URL
axios.defaults.headers.common["Authorization"] = localStorage.getItem("user")

const root = ReactDOM.createRoot(document.getElementById("root"))

root.render(
	// <React.StrictMode>
	<Provider store={store}>
		<App />
	</Provider>
	// </React.StrictMode>
)
