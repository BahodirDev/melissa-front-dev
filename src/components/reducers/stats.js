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
	},
})

export const { setData } = statsSlice.actions
export default statsSlice.reducer
