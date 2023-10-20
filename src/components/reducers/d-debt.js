import { createSlice } from "@reduxjs/toolkit"

export const dDebtSlice = createSlice({
	name: "dDebt",
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
			state.data = [
				{
					deliver_debt_id: action.payload?.deliver_debt_id,
					deliver: {
						deliver_id: action.payload?.deliver_id,
						deliver_name: action.payload?.deliver_name,
						deliver_nomer: action.payload?.deliver_nomer,
					},
					goods: {
						goods_id: action.payload?.goods_id,
						goods_name: action.payload?.goods_name,
						goods_code: action.payload?.goods_code,
					},
					debts_count: action.payload?.debts_count,
					debts_cost: action.payload?.debts_cost,
					isdone: false,
					debts_currency: action.payload?.debts_currency,
					debts_currency_amount: action.payload?.debts_currency_amount,
					debts_total_price:
						action.payload?.debts_count * action.payload?.debts_cost,
					debts_due_date: action.payload?.debts_due_date,
					debts_createdat: action.payload?.debts_createdat,
				},
				...state.data,
			]

			state.quantity +=
				action.payload?.debts_count *
				action.payload?.debts_cost *
				action.payload?.debts_currency_amount
		},
		payDDebt: (state, action) => {
			const index = state.data.findIndex(
				(item) => item.deliver_debt_id === action.payload.id
			)
			if (index !== -1) {
				state.data[index].debts_count -=
					action.payload.sum / state.data[index].debts_cost
				state.data[index].debts_total_price -= action.payload.sum
				state.quantity -= action.payload?.sum * action.payload?.value
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
	payDDebt,
} = dDebtSlice.actions
export default dDebtSlice.reducer
