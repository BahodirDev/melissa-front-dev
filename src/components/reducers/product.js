import { createSlice } from "@reduxjs/toolkit"

export const productSlice = createSlice({
	name: "product",
	initialState: {
		dataProduct: [],
		loading: false,
		quantity: 0,
		amount: 0,
		sum: 0,
	},
	reducers: {
		setDataProduct: (state, action) => {
			state.dataProduct = action.payload
		},
		setLoading: (state, action) => {
			state.loading = action.payload
		},
		setQuantity: (state, action) => {
			state.quantity = action.payload
		},
		setAmount: (state, action) => {
			state.amount = action.payload
		},
		setSum: (state, action) => {
			state.sum = action.payload
		},
		addData: (state, action) => {
			let newDataObj = {
				products_id: action.payload.products_id,
				goods_id: {
					goods_code: action.payload?.goods_code,
					goods_name: action.payload?.goods_name,
				},
				deliver_id: {
					deliver_name: action.payload?.deliver_name,
					deliver_nomer: action.payload?.deliver_nomer,
				},
				store_id: { store_name: action.payload?.store_name },
				currency_id: {
					currency_symbol: action.payload?.currency_symbol,
					currency_name: action.payload?.currency_name,
					currency_code: action.payload?.currency_code,
					currency_amount: action.payload?.currency_amount,
				},
				products_box_count: action.payload.products_box_count,
				products_count: action.payload.products_count,
				products_count_cost: action.payload.products_count_cost,
				products_count_price: action.payload.products_count_price,
				products_createdat: action.payload.products_createdat,
			}

			state.quantity += 1
			state.amount += +newDataObj.products_count
			state.sum +=
				newDataObj.products_count *
				newDataObj.products_count_cost *
				action.payload?.currency_amount
			state.dataProduct = [newDataObj, ...state.dataProduct]
		},
		editData: (state, action) => {
			const index = state.dataProduct.findIndex(
				(item) => item.products_id === action.payload?.products_id
			)
			let newDataObj = {
				goods_id: {
					goods_code: action.payload?.goods_code,
					goods_name: action.payload?.goods_name,
				},
				deliver_id: {
					deliver_name: action.payload?.deliver_name,
					deliver_nomer: action.payload?.deliver_nomer,
				},
				store_id: { store_name: action.payload?.store_name },
				currency_id: {
					currency_symbol: action.payload?.currency_symbol,
					currency_name: action.payload?.currency_name,
					currency_code: action.payload?.currency_code,
					currency_amount: action.payload?.currency_amount,
				},
				products_box_count: action.payload.products_box_count,
				products_count: action.payload.products_count,
				products_count_cost: action.payload.products_count_cost,
				products_count_price: action.payload.products_count_price,
				products_createdat: action.payload.products_createdat,
			}
			
			if (index !== -1) {
				// state.amount += +newDataObj.products_count
				// state.sum +=
				// 	newDataObj.products_count *
				// 	newDataObj.products_count_cost *
				// 	action.payload?.currency_amount
				state.dataProduct[index] = newDataObj
			}
		},
		removeProduct: (state, action) => {
			const index = state.dataProduct.findIndex(
				(item) => item.products_id === action.payload
			)

			state.quantity -= 1
			state.amount -= state.dataProduct[index].products_count
			state.sum -=
				state.dataProduct[index].products_count *
				state.dataProduct[index].products_count_cost *
				state.dataProduct[index].currency_id.currency_amount
			state.dataProduct.splice(index, 1)
		},
	},
})

export const {
	setDataProduct,
	setLoading,
	setQuantity,
	setAmount,
	setSum,
	addData,
	editData,
	removeProduct,
} = productSlice.actions
export default productSlice.reducer
