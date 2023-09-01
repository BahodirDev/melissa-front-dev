import { createSlice } from "@reduxjs/toolkit"

export const deliverSlice = createSlice({
	name: "deliver",
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
				(item) => item.deliver_id === action.payload.deliver_id
			)
			if (index !== -1) {
				state.data[index] = {
					...state.data[index],

					deliver_name: action.payload?.deliver_name,
					deliver_nomer: action.payload?.deliver_nomer,
					deliver_place: action.payload?.deliver_place,
					deliver_debts: action.payload?.deliver_debts,
				}
			}
		},
	},
})

export const { setData, setLoading, setQuantity, addData, editData } =
	deliverSlice.actions
export default deliverSlice.reducer
