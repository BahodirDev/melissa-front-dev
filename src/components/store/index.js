import { configureStore } from "@reduxjs/toolkit"
import clientReducer from "../reducers/client"
import currencyReducer from "../reducers/currency"
import dDebtReducer from "../reducers/d-debt"
import debtReducer from "../reducers/debt"
import deliverReducer from "../reducers/deliver"
import goodReducer from "../reducers/good"
import productReducer from "../reducers/product"
import reportReducer from "../reducers/report"
import returnReducer from "../reducers/return"
import storeReducer from "../reducers/store"
import userReducer from "../reducers/users"

export default configureStore({
	reducer: {
		client: clientReducer,
		users: userReducer,
		currency: currencyReducer,
		deliver: deliverReducer,
		store: storeReducer,
		return: returnReducer,
		good: goodReducer,
		product: productReducer,
		debt: debtReducer,
		dDebt: dDebtReducer,
		report: reportReducer,
	},
})
