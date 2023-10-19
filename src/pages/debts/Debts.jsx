import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setQuantity as setQuantityD } from "../../components/reducers/d-debt"
import { setQuantity } from "../../components/reducers/debt"
import { setData as setDataDeliver } from "../../components/reducers/deliver"
import {
	fakeLoad,
	setData as setDataGood,
} from "../../components/reducers/good"
import { setQuantity as setQuantityN } from "../../components/reducers/noteDebt"
import { setQuantity as setQuantityO } from "../../components/reducers/orderDebt"
import { get } from "../../customHook/api"
import Client from "./Client"
import Order from "./Order"
import Supplier from "./Supplier"
import Total from "./Total"
import "./debts.css"
import { toast } from "react-toastify"

function Debts() {
	const { deliver, currency, good } = useSelector((state) => state)
	const dispatch = useDispatch()
	const [show, setShow] = useState("client")

	const getData = (list, setList, setPreload) => {
		dispatch(setPreload(true))
		get(`/${list}/${list}-list`).then((data) => {
			if (data?.status === 200 || data?.status === 201) {
				if (
					list === "debts" ||
					list === "deliver-debts" ||
					list === "debts-note" ||
					list === "ordered"
				) {
					dispatch(setList(data.data?.data))
					if (list === "debts") {
						dispatch(setQuantity(data?.data.amount))
					} else if (list === "deliver-debts") {
						dispatch(setQuantityD(data?.data.amount))
					} else if (list === "debts-note") {
						dispatch(setQuantityN(data?.data.amount))
					} else if (list === "ordered") {
						dispatch(setQuantityO(data?.data.amount))
					}
				} else {
					dispatch(setList(data?.data))
				}
			} else {
				toast.error("Nomalum server xatolik")
			}
			dispatch(setPreload(false))
		})
	}

	useEffect(() => {
		getData("deliver", setDataDeliver, fakeLoad)
		getData("goods", setDataGood, fakeLoad)
		setShow(localStorage.getItem("debt-section"))
	}, [])

	const handleSectionSwitch = (e) => {
		// setShow(e.target.value)
		// localStorage.setItem("debt-section", e.target.value)
	}

	return (
		<>
			<div className="debt-switch">
				<button
					type="button"
					onClick={handleSectionSwitch}
					value="client"
					className={show === "client" ? "active" : null}
				>
					Mijoz
				</button>
				<button
					type="button"
					onClick={handleSectionSwitch}
					value="supplier"
					className={show === "supplier" ? "active" : null}
				>
					Ta'minotchi
				</button>
				<button
					type="button"
					onClick={handleSectionSwitch}
					value="total"
					className={show === "total" ? "active" : null}
				>
					Umumiy qarzdorlik
				</button>
				<button
					type="button"
					onClick={handleSectionSwitch}
					value="order"
					className={show === "order" ? "active" : null}
				>
					Oldindan to'lov
				</button>
			</div>

			{show === "client" ? (
				<Client getData={getData} />
			) : show === "supplier" ? (
				<Supplier
					getData={getData}
					good={good}
					currency={currency}
					deliver={deliver}
				/>
			) : show === "total" ? (
				<Total getData={getData} />
			) : (
				<Order
					getData={getData}
					good={good}
					deliver={deliver}
					currency={currency}
				/>
			)}
		</>
	)
}

export default Debts
