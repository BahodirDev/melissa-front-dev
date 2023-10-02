import { createSlice } from "@reduxjs/toolkit"

export const goodSlice = createSlice({
	name: "good",
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
		fakeLoad: (state, action) => {},
		editData: (state, action) => {
			const index = state.data.findIndex(
				(item) => item.goods_id === action.payload.goods_id
			)
			if (index !== -1) {
				state.data[index] = {
					...state.data[index],

					goods_name: action.payload?.goods_name,
					goods_code: action.payload?.goods_code,
				}
			}
		},
		removeGood: (state, action) => {
			const index = state.data.findIndex(
				(item) => item.goods_id === action.payload
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
	fakeLoad,
	removeGood,
} = goodSlice.actions
export default goodSlice.reducer
