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
							goods_name: item?.product_name,
							goods_code: item?.product_code,
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
					// debts_due_date: "2023-08-08T12:15:23.614Z",
					// debts_createdat: "2023-08-08T12:15:23.615Z",
				})
			})
		},
		editData: (state, action) => {
			// console.log(action.payload)
			// const index = state.data.findIndex(
			// 	(item) => item.deliver_id === action.payload.deliver_id
			// )
			// if (index !== -1) {
			// 	state.data[index] = {
			// 		...state.data[index],
			// 		// deliver_name: action.payload?.deliver_name,
			// 	}
			// }
		},
		deleteData: (state, action) => {
			const index = state.data.findIndex(
				(item) => item.debts_id === action.payload
			)
			if (index !== -1) {
				state.data.splice(index, 1)
			}
		},
		payClientDebt: (state, action) => {
			const index = state.data.findIndex(
				(item) => item.debts_id === action.payload.id
			)
			if (index !== -1) {
				state.data[index].debts_count -=
					action.payload.sum / state.data[index].debts_price
				state.data[index].debts_total_price -= action.payload.sum
			}
		},
	},
})

export const {
	setData,
	setLoading,
	setQuantity,
	addData,
	editData,
	deleteData,
	payClientDebt,
} = debtSlice.actions
export default debtSlice.reducer
