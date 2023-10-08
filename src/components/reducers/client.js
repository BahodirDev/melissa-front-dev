import { createSlice } from "@reduxjs/toolkit"

export const clientSlice = createSlice({
	name: "client",
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
			state.quantity = state.data.filter((item) => !item?.isdelete).length
		},
		addData: (state, action) => {
			state.data = [...state.data, action.payload]
		},
		editData: (state, action) => {
			const index = state.data.findIndex(
				(item) => item.clients_id === action.payload.clients_id
			)

			if (index !== -1) {
				state.data[index] = {
					...state.data[index],

					clients_desc: action.payload?.clients_desc,
					clients_id: action.payload?.clients_id,
					clients_name: action.payload?.clients_name,
					clients_nomer: action.payload?.clients_nomer,
					isdelete: action.payload?.isdelete,
				}
			}
		},
		addDebt: (state, action) => {
			action.payload.map((itemPayload) => {
				const index = state.data.findIndex(
					(itemData) => itemData?.clients_id === itemPayload?.client_id
				)

				state.data[index]?.debts.unshift({
					isdone: false,
					products: { goods_name: itemPayload?.product_name },
					debts_count: itemPayload?.debts_count,
					debts_price: itemPayload?.debts_price,
					debts_currency: itemPayload?.debts_currency,
				})
			})
		},
		removeDebt: (state, action) => {
			const index = state.data.findIndex(
				(item) => item.clients_id === action.payload
			)
			state.data.splice(index, 1)
		},
	},
})

export const {
	setData,
	setLoading,
	setQuantity,
	addData,
	editData,
	addDebt,
	removeDebt,
} = clientSlice.actions
export default clientSlice.reducer
