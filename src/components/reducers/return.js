import { createSlice } from "@reduxjs/toolkit"

export const returnSlice = createSlice({
	name: "return",
	initialState: {
		dataReturn: [],
		loading: false,
		quantity: 0,
	},
	reducers: {
		setDataReturn: (state, action) => {
			state.dataReturn = action.payload
		},
		setLoading: (state, action) => {
			state.loading = action.payload
		},
		setQuantity: (state, action) => {
			state.quantity = state.dataReturn.length
		},
		addData: (state, action) => {
			let newDataObj = {
				return_id: action.payload.return_id,
				return_name: action.payload.return_name,
				return_store: action.payload.return_store,
				return_count: action.payload.return_count,
				return_cost: action.payload.return_cost,
				return_case: action.payload.return_case,
				return_createdat: action.payload.return_createdat,
				clients: {
					client_id: action.payload?.client_id,
					clients_desc: action.payload?.clients_desc,
					clients_name: action.payload?.clients_name,
					clients_nomer: action.payload?.clients_nomer,
				},
			}

			state.dataReturn = [...state.dataReturn, newDataObj]
		},
		editData: (state, action) => {
			const index = state.dataReturn.findIndex(
				(item) => item.return_id === action.payload?.return_id
			)

			if (index !== -1) {
				state.dataReturn[index] = {
					...state.dataReturn[index],

					return_name: action.payload?.return_name,
					return_store: action.payload?.return_store,
					return_count: action.payload?.return_count,
					return_cost: action.payload?.return_cost,
					return_case: action.payload?.return_case,
					clients: {
						client_id: action.payload?.client_id,
						clients_desc: action.payload?.clients_desc,
						clients_name: action.payload?.clients_name,
						clients_nomer: action.payload?.clients_nomer,
					},
				}
			}
		},
		removeReturn: (state, action) => {
			const index = state.dataReturn.findIndex(
				(item) => item.return_id === action.payload
			)
			state.dataReturn.splice(index, 1)
		},
	},
})

export const {
	setDataReturn,
	setLoading,
	setQuantity,
	addData,
	editData,
	removeReturn,
} = returnSlice.actions
export default returnSlice.reducer
