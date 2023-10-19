import { useDispatch, useSelector } from "react-redux"
import "./sell debt.css"
import { useEffect } from "react"
import { get } from "../../customHook/api"
import { setData as setDataClient } from "../reducers/client"
import { setData as setDataCurrency } from "../reducers/currency"
import { setDataProduct } from "../reducers/product"
import { setData } from "../reducers/store"

const SellDebt = ({
	SDModalVisible,
	setSDModalVisible,
	SDModalDisplay,
	setSDModalDisplay,
}) => {
	const { store, client, product, currency } = useSelector((state) => state)
	const dispatch = useDispatch()

	const getData = (name, dispatch1) => {
		get(`/${name}/${name}-list`).then((data) => {
			if (data?.status === 200 || data?.status === 201) {
				dispatch(dispatch1(name === "products" ? data?.data?.data : data?.data))
			}
		})
	}

	useEffect(() => {
		getData("clients", setDataClient)
		getData("store", setData)
		getData("products", setDataProduct)
		getData("currency", setDataCurrency)
	}, [])

	return (
		<div className="sell-modal-wrapper" style={{ display: SDModalDisplay }}>
			<div
				className={`sell-modal ${
					SDModalVisible ? "fade-in-sd" : "fade-out-sd"
				}`}
				onClick={(e) => e.stopPropagation()}
			>
				<h4>Sell and Debt Modal</h4>
			</div>
		</div>
	)
}
export default SellDebt
