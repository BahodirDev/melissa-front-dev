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
		},
		deleteData: (state, action) => {
			const index = state.data.findIndex(
				(item) => item.deliver_debt_id === action.payload
			)
			if (index !== -1) {
				state.data.splice(index, 1)
			}
		},
		payOrderDebt: (state, action) => {
			const index = state.data.findIndex(
				(item) => item.deliver_debt_id === action.payload.id
			)
			if (index !== -1) {
				state.data[index].debts_count -= action.payload.amount
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
