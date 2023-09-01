import { createSlice } from "@reduxjs/toolkit"

export const returnSlice = createSlice({
	name: "return",
	initialState: {
		dataReturn: [],
		dataClient: [],
		dataStore: [],
		loading: false,
		quantity: 0,
	},
	reducers: {
		setDataReturn: (state, action) => {
			state.dataReturn = action.payload
		},
		setDataClient: (state, action) => {
			state.dataClient = action.payload
		},
		setDataStore: (state, action) => {
			state.dataStore = action.payload
		},
		setLoading: (state, action) => {
			state.loading = action.payload
		},
		setQuantity: (state, action) => {
			state.quantity = state.dataReturn.length
		},
		addData: (state, action) => {
			const index = state.dataClient.findIndex(
				(item) => item.clients_id === action.payload.client_id
			)

			let newDataObj = {
				return_id: action.payload.return_id,
				return_name: action.payload.return_name,
				return_store: action.payload.return_store,
				return_count: action.payload.return_count,
				return_cost: action.payload.return_cost,
				return_case: action.payload.return_case,
				return_createdat: action.payload.return_createdat,
				clients: state.dataClient[index],
			}

			state.dataReturn = [...state.dataReturn, newDataObj]
		},
		editData: (state, action) => {
			const index = state.dataReturn.findIndex(
				(item) => item.return_id === action.payload?.return_id
			)
			const indexC = state.dataClient.findIndex(
				(item) => item.clients_id === action.payload?.client_id
			)

			if (index !== -1) {
				state.dataReturn[index] = {
					...state.dataReturn[index],

					return_name: action.payload?.return_name,
					return_store: action.payload?.return_store,
					return_count: action.payload?.return_count,
					return_cost: action.payload?.return_cost,
					return_case: action.payload?.return_case,
					clients: state.dataClient[indexC],
				}
			}
		},
	},
})

export const {
	setDataReturn,
	setDataClient,
	setDataStore,
	setLoading,
	setQuantity,
	addData,
	editData,
} = returnSlice.actions
export default returnSlice.reducer
