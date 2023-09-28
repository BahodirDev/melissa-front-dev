import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import DebtTable from "../../components/debt_table/debt_table"
import { error_modal } from "../../components/error_modal/error_modal"
import Loader from "../../components/loader/Loader"
import { deleteData, setData, setLoading } from "../../components/reducers/debt"
import { patch, remove } from "../../customHook/api"

const Client = ({ getData }) => {
	const state = useSelector((state) => state.debt)
	const dispatch = useDispatch()
	const [modalAlert, setModalAlert] = useState("")
	const [modalMsg, setModalMsg] = useState("")

	useEffect(() => {
		getData("debts", setData, setLoading)
	}, [])

	const closeDebt = (id) => {
		dispatch(setLoading(true))
		patch(`/debts/debts-patch-done/${id}`).then((data) => {
			if (data?.status === 200) {
				dispatch(deleteData(id))
				setModalAlert("Xabar")
				setModalMsg("Qarzdorlik muvoffaqiyatli yopildi")
			} else if (data?.response?.data?.error === "DEBTS_NOT_FOUND") {
				setModalAlert("Xatolik")
				setModalMsg("Bunday qarzdorlik topilmadi")
			} else {
				setModalAlert("Nomalum server xatolik")
				setModalMsg("Qarzdorlik yopib bo'lmadi")
			}
			dispatch(setLoading(false))
		})
	}

	const payDebt = (id, sum) => {
		dispatch(setLoading(true))
		patch(`/debts/debts-patch-change/${id}`, { price: sum }).then((data) => {
			if (data?.status === 200) {
				getData("debts", setData)
				setModalAlert("Xabar")
				setModalMsg("Qarzdorlik muvoffaqiyatli kiritildi")
			} else {
				setModalAlert("Nomalum server xatolik")
				setModalMsg("Qarzdorlik kiritib bo'lmadi")
			}
			dispatch(setLoading(false))
		})
	}

	const deleteDebt = (id) => {
		dispatch(setLoading(true))
		remove(`/debts/debts-delete/${id}`).then((data) => {
			if (data?.status === 200) {
				setModalAlert("Xabar")
				setModalMsg("Qarzdorlik muvoffaqiyatli o'chirildi")
				dispatch(deleteData(data.debts_id))
			} else {
				setModalAlert("Nomalum server xatolik")
				setModalMsg("Qarzdorlikni o'chirib bo'lmadi")
			}
			dispatch(setLoading(false))
		})
	}

	return (
		<>
			{error_modal(modalAlert, modalMsg, modalMsg.length, setModalMsg)}
			<div className="return-info">
				<i className="fa-solid fa-user-tag"></i> Umumiy summa: {state.quantity}{" "}
				so'm
			</div>
			<div style={{ height: "10px" }}></div>

			{state?.loading ? (
				<Loader />
			) : (
				<DebtTable
					data={state.data}
					closeDebt={closeDebt}
					payDebt={payDebt}
					deleteDebt={deleteDebt}
				/>
			)}
		</>
	)
}
export default Client
