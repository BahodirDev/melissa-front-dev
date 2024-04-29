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
import Supplier from "./Supplier"
import Total from "./Total"
import "./debts.css"
import { toast } from "react-toastify"
import { useNavigate, useOutletContext } from "react-router-dom"

function Debts() {
	const [
		inputRef,
		showDropdown,
		setshowDropdown,
		addModalVisible,
		setAddModalVisible,
		addModalDisplay,
		setAddModalDisplay,
		miniModal,
		setMiniModal,
		sidebar,
		userInfo,
		darkMode,
	] = useOutletContext()
	const navigate = useNavigate()
	const { deliver, currency, good } = useSelector((state) => state)
	const dispatch = useDispatch()
	const [show, setShow] = useState("client")

	useEffect(() => {
		if (localStorage.getItem("role") !== "1") navigate("/*")
		setShow(localStorage.getItem("debt-section"))
	}, [])
	if (!localStorage.getItem("debt-section"))
		localStorage.setItem("debt-section", "client")

	const handleSectionSwitch = (e) => {
		setShow(e.target.value)
		localStorage.setItem("debt-section", e.target.value)
	}

	return (
		<>
			<div className={`debt-switch ${darkMode ? "dark" : null}`}>
				<button
					type="button"
					onClick={handleSectionSwitch}
					value="client"
					className={show === "client" ? "active" : null}
				>
					Oldi / Berdi
				</button>
				<button
					type="button"
					onClick={handleSectionSwitch}
					value="supplier"
					className={show === "supplier" ? "active" : null}
				>
					Haqdorlik / Qarzdorlik
				</button>
				<button
					type="button"
					onClick={handleSectionSwitch}
					value="total"
					className={show === "total" ? "active" : null}
				>
					Harajatlar
				</button>
			</div>

			{show === "client" ? (
				<Client />
			) : show === "supplier" ? (
				<Supplier />
			) : (
				<Total />
			)}
		</>
	)
}

export default Debts
