import { createSlice } from "@reduxjs/toolkit"

export const noteDebtSlice = createSlice({
	name: "nDebt",
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
			state.data.unshift(action.payload)
			state.quantity += action.payload?.price
		},
		payNoteDebt: (state, action) => {
			const index = state.data.findIndex(
				(item) => item.debts_id === action.payload.id
			)
			if (index !== -1) {
				state.data[index].price -= action.payload.price
				state.quantity -= action.payload.price
			}
		},
		deleteData: (state, action) => {
			const index = state.data.findIndex(
				(item) => item.debts_id === action.payload?.id
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
	payNoteDebt,
} = noteDebtSlice.actions
export default noteDebtSlice.reducer
