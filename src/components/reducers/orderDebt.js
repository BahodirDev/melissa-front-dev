import { createSlice } from "@reduxjs/toolkit"

export const orderDebtSlice = createSlice({
	name: "oDebt",
	initialState: {
		data: [],
		loading: false,
		quantity: 0,
	},
	reducers: {
		setData: (state, action) => {
			state.data = action.payload
		},
		setLoading: (state, action) => {
			state.loading = action.payload
		},
		setQuantity: (state, action) => {
			state.quantity = action.payload
		},
		addData: (state, action) => {
			state.data.push(action.payload)
			state.quantity +=
				action.payload?.debts_count *
				action.payload?.debts_cost *
				action.payload?.debts_currency_amount
		},
		payOrderDebt: (state, action) => {
			const index = state.data.findIndex(
				(item) => item.deliver_debt_id === action.payload?.id
			)
			if (index !== -1) {
				state.data[index].debts_count -= action.payload?.amount
				state.quantity -= action.payload?.amount * action.payload?.sum
			}
		},
		deleteData: (state, action) => {
			const index = state.data.findIndex(
				(item) => item.deliver_debt_id === action.payload?.id
			)
			if (index !== -1) {
				state.data.splice(index, 1)
				state.quantity -= action.payload?.sum
			}
		},
	},
})

export const {
	setData,
	setLoading,
	setQuantity,
	addData,
	deleteData,
	payOrderDebt,
} = orderDebtSlice.actions
export default orderDebtSlice.reducer
