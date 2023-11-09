import { createSlice } from "@reduxjs/toolkit"

export const debtSlice = createSlice({
	name: "debt",
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
			action.payload?.map((item) => {
				state.quantity +=
					item?.debts_count * item?.debts_price * item?.debts_currency_amount
				state.data.unshift({
					debts_id: item?.debts_id,
					client: {
						client_id: item?.client_id,
						clients_name: item?.clients_name,
						clients_nomer: item?.clients_nomer,
					},
					product: {
						product_id: item?.product_id,
						product_details: {
							goods_name: item?.goods_name,
							goods_code: item?.goods_code,
						},
					},
					debts_count: item?.debts_count,
					debts_cost: item?.debts_cost,
					debts_price: item?.debts_price,
					isdone: false,
					debts_currency: item?.debts_currency,
					debts_currency_amount: item?.debts_currency_amount,
					debts_createdat: item?.debts_selected_date,
					debts_due_date: item?.debts_due_date,
					debts_total_price: item?.debts_total_price,
				})
			})
		},
		payClientDebt: (state, action) => {
			const index = state.data.findIndex(
				(item) => item.debts_id === action.payload.id
			)
			if (index !== -1) {
				state.data[index].debts_count -=
					action.payload.amount / state.data[index].debts_price
				state.data[index].debts_total_price -= action.payload.amount
				state.quantity -= action.payload.amount * action.payload?.currency
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
	payClientDebt,
} = debtSlice.actions
export default debtSlice.reducer
