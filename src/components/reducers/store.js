import { createSlice } from "@reduxjs/toolkit"

export const storeSlice = createSlice({
	name: "store",
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
				(item) => item.store_id === action.payload.store_id
			)
			if (index !== -1) {
				state.data[index] = {
					...state.data[index],

					store_name: action.payload?.store_name,
				}
			}
		},
		removeStore: (state, action) => {
			const index = state.data.findIndex(
				(item) => item.store_id === action.payload
			)
			if (index !== -1) state.data.splice(index, 1)
		},
	},
})

export const {
	setData,
	setLoading,
	setQuantity,
	addData,
	editData,
	removeStore,
} = storeSlice.actions
export default storeSlice.reducer
