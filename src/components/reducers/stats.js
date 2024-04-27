import { createSlice } from "@reduxjs/toolkit"

export const statsSlice = createSlice({
	name: "stats",
	initialState: {
		data: [],
	},
	reducers: {
		setData: (state, action) => {
			state.data = action.payload
		},
		setQuantity: (state, action) => {
			const index = state.data.findIndex(
				(item) => item.id === action.payload?.id
			)
			if (index !== -1) {
				state.data[index] = {
					...state.data[index],
					products_count: action.payload?.q >= 0 ? action.payload?.q : 0,
				}
			}
		},
	},
})

export const { setData, setQuantity } = statsSlice.actions
export default statsSlice.reducer
