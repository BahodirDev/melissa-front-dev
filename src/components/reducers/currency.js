import { createSlice } from "@reduxjs/toolkit"

export const currencySlice = createSlice({
	name: "currency",
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
			state.quantity = state.data.length
		},
		addData: (state, action) => {
			state.data = [...state.data, action.payload]
		},
		editData: (state, action) => {
			const index = state.data.findIndex(
				(item) => item.currency_id === action.payload.currency_id
			)
			if (index !== -1) {
				state.data[index] = {
					...state.data[index],

					currency_name: action.payload?.currency_name,
					currency_code: action.payload?.currency_code,
					currency_symbol: action.payload?.currency_symbol,
					currency_amount: action.payload?.currency_amount,
					name: action.payload?.name,
					flag: action.payload?.flag,
				}
			}
		},
		removeCurrency: (state, action) => {
			const index = state.data.findIndex(
				(item) => item.currency_id === action.payload
			)
			state.data.splice(index, 1)
		},
	},
})

export const { setData, setLoading, setQuantity, addData, editData, removeCurrency } =
	currencySlice.actions
export default currencySlice.reducer
