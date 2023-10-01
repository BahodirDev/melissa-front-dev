import { Radio } from "antd"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { useOutletContext } from "react-router-dom"
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

function Debts() {
	const { deliver, currency, good } = useSelector((state) => state)
	const dispatch = useDispatch()
	const [showDeliver, setShowDeliver] = useState("client")
	const [
		saerchInputValue,
		setSearchInput,
		sidebar,
		userInfo,
		action,
		setAction,
	] = useOutletContext()

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
			}
			dispatch(setPreload(false))
		})
	}

	useEffect(() => {
		getData("deliver", setDataDeliver, fakeLoad)
		getData("goods", setDataGood, fakeLoad)
	}, [])

	return (
		<>
			<Radio.Group
				value={showDeliver}
				onChange={(e) => {
					setShowDeliver(e.target.value)
					setSearchInput("")
					// localStorage.setItem("debt", JSON.stringify(e.target.value))
				}}
				className="debt-page-toggle"
			>
				<Radio.Button value="client">Mijoz</Radio.Button>
				<Radio.Button value="supplier">Ta'minotchi</Radio.Button>
				<Radio.Button value="total">Umumiy qarzdorlik</Radio.Button>
				<Radio.Button value="order">Oldindan to'lov</Radio.Button>
			</Radio.Group>

			{showDeliver === "client" ? (
				<Client getData={getData} setAction={setAction} />
			) : showDeliver === "supplier" ? (
				<Supplier
					getData={getData}
					good={good}
					currency={currency}
					deliver={deliver}
					setAction={setAction}
				/>
			) : showDeliver === "total" ? (
				<Total
					getData={getData}
					saerchInputValue={saerchInputValue}
					setAction={setAction}
				/>
			) : (
				<Order
					getData={getData}
					good={good}
					deliver={deliver}
					currency={currency}
					setAction={setAction}
				/>
			)}
		</>
	)
}

export default Debts
