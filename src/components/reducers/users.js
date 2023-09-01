import { createSlice } from "@reduxjs/toolkit"

export const usersSlice = createSlice({
	name: "users",
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
				(item) => item.user_id === action.payload.user_id
			)

			if (index !== -1) {
				state.data[index] = {
					...state.data[index],

					user_name: action.payload?.user_name,
					user_nomer: action.payload?.user_nomer,
					user_role: action.payload?.user_role,
					user_login: action.payload?.user_login,
					user_password: action.payload?.user_password,
				}
			}
		},
	},
})

export const { setData, setLoading, setQuantity, addData, editData } =
	usersSlice.actions
export default usersSlice.reducer
