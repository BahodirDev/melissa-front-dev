import { createSlice } from "@reduxjs/toolkit"

export const productSlice = createSlice({
	name: "product",
	initialState: {
		dataProduct: [],
		dataGood: [],
		dataDeliver: [],
		dataStore: [],
		dataCurrency: [],
		loading: false,
		quantity: 0,
		amount: 0,
		sum: 0,
	},
	reducers: {
		setDataProduct: (state, action) => {
			state.dataProduct = action.payload
		},
		setDataGood: (state, action) => {
			state.dataGood = action.payload
		},
		setDataDeliver: (state, action) => {
			state.dataDeliver = action.payload
		},
		setDataStore: (state, action) => {
			state.dataStore = action.payload
		},
		setDataCurrency: (state, action) => {
			state.dataCurrency = action.payload
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
			const indexStore = state.dataStore.findIndex(
				(item) => item.store_id === action.payload.store_id
			)
			const indexCurrency = state.dataCurrency.findIndex(
				(item) => item.currency_id === action.payload.currency_id
			)
			const indexDeliver = state.dataDeliver.findIndex(
				(item) => item.deliver_id === action.payload.deliver_id
			)
			const indexGood = state.dataGood.findIndex(
				(item) => item.goods_id === action.payload.goods_id
			)

			let newDataObj = {
				products_id: action.payload.products_id,
				goods_id: state.dataGood[indexGood],
				deliver_id: state.dataDeliver[indexDeliver],
				store_id: state.dataStore[indexStore],
				currency_id: state.dataCurrency[indexCurrency],
				products_box_count: action.payload.products_box_count,
				products_count: action.payload.products_count,
				products_count_cost: action.payload.products_count_cost,
				products_count_price: action.payload.products_count_price,
				products_createdat: action.payload.products_createdat,
			}

			state.dataProduct = [...state.dataProduct, newDataObj]
		},
		editData: (state, action) => {
			const index = state.dataProduct.findIndex(
				(item) => item.products_id === action.payload.products_id
			)
			const indexStore = state.dataStore.findIndex(
				(item) => item.store_id === action.payload.store_id
			)
			const indexCurrency = state.dataCurrency.findIndex(
				(item) => item.currency_id === action.payload.currency_id
			)
			const indexDeliver = state.dataDeliver.findIndex(
				(item) => item.deliver_id === action.payload.deliver_id
			)
			const indexGood = state.dataGood.findIndex(
				(item) => item.goods_id === action.payload.goods_id
			)

			if (index !== -1) {
				state.dataProduct[index] = {
					...state.dataProduct[index],

					goods_id: state.dataGood[indexGood],
					deliver_id: state.dataDeliver[indexDeliver],
					store_id: state.dataStore[indexStore],
					currency_id: state.dataCurrency[indexCurrency],
					products_box_count: action.payload?.products_box_count,
					products_count: action.payload?.products_count,
					products_count_cost: action.payload?.products_count_cost,
					products_count_price: action.payload?.products_count_price,
				}
			}
		},
		sellData: (state, action) => {},
	},
})

export const {
	setDataProduct,
	setDataGood,
	setDataDeliver,
	setDataStore,
	setDataCurrency,
	setLoading,
	addData,
	editData,
	sellData,
	setQuantity,
	setAmount,
	setSum,
} = productSlice.actions
export default productSlice.reducer
