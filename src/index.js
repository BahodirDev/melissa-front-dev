import axios from "axios"
import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import App from "./App"
import store from "./components/store"
import "./index.css"

let token = localStorage.getItem("user")
axios.defaults.headers.common["Authorization"] = token

const root = ReactDOM.createRoot(document.getElementById("root"))

root.render(
	// <React.StrictMode>
	<Provider store={store}>
		<App />
	</Provider>
	// </React.StrictMode>
)
