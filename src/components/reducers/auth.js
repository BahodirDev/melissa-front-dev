import { createSlice } from "@reduxjs/toolkit"

export const authSlice = createSlice({
	name: "auth",
	initialState: {
		user: null,
	},
	reducers: {
		login: (state, action) => {
			state.user = action.payload
		},
		logout: (state, action) => {
			state.user = null
		},
	},
})

export const { user, login, logout } = authSlice.actions
export default authSlice.reducer
