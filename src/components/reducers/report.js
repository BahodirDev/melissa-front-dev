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
		removeData: (state, action) => {
			const index = state.data.findIndex(
				(item) => item.reports_id === action.payload
			)

			if (index !== -1) {
				state.data.splice(index, 1)
				// state.capital = 1
				// state.outcome = 2
				// state.income = 3
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
		editDate: (state, action) => {
			const index = state.data.findIndex(
				(item) => item.reports_id === action.payload
			)

			if (index !== -1) {
				state.data[index] = {
					...state.data[index],
					reports_createdat: action.payload?.reports_createdat,
				}
			}
		},
	},
})

export const {
	setData,
	setLoading,
	addData,
	editData,
	removeData,
	setCapital,
	setBenefit,
	setIncome,
	setOutcome,
	editDate,
} = reportSlice.actions
export default reportSlice.reducer
