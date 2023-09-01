import { createSlice } from "@reduxjs/toolkit"

export const reportSlice = createSlice({
	name: "report",
	initialState: {
		data: [],
		loading: false,
		capital: 0,
		benefit: 0,
		income: 0,
		outcome: 0,
	},
	reducers: {
		setData: (state, action) => {
			state.data = action.payload
		},
		setLoading: (state, action) => {
			state.loading = action.payload
		},
		addData: (state, action) => {
			state.data = [...state.data, action.payload]
		},
		editData: (state, action) => {
			const index = state.data.findIndex(
				(item) => item.store_id === action.payload.store_id
			)
			if (index !== -1) {
				state.data[index] = {
					...state.data[index],

					store_name: action.payload?.store_name,
				}
			}
		},
		setCapital: (state, action) => {
			state.capital = action.payload
		},
		setBenefit: (state, action) => {
			state.benefit = action.payload
		},
		setIncome: (state, action) => {
			state.income = action.payload
		},
		setOutcome: (state, action) => {
			state.outcome = action.payload
		},
	},
})

export const {
	setData,
	setLoading,
	addData,
	editData,
	setCapital,
	setBenefit,
	setIncome,
	setOutcome,
} = reportSlice.actions
export default reportSlice.reducer
