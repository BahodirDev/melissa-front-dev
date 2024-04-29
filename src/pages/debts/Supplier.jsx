import { useDispatch, useSelector } from "react-redux"
import { useOutletContext } from "react-router-dom"
import Search from "../../components/search/Search"
import { useEffect, useState } from "react"
import AddModal from "../../components/add/AddModal"
import { numberCheck, stringCheck } from "../../components/validation"
import { CaretDown, Info } from "@phosphor-icons/react"
import { Select } from "antd"
import format_phone_number from "../../components/format_phone_number/format_phone_number"
import { toast } from "react-toastify"
import { get, post } from "../../customHook/api"
import {
	DebtTable,
	DebtTableEquity,
} from "../../components/debt tables/DebtTable"
import Loader from "../../components/loader/Loader"

const Supplier = ({ getData }) => {
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

	const [list, setList] = useState([])
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		setLoading(true)
		get("/debts/debts-equities").then((data) => {
			if (data?.status === 201 || data?.status === 200) {
				setList(data?.data)
			} else {
				toast.error("Nomalur server xatolik")
			}
			setLoading(false)
		})
	}, [])

	return (
		<>
			{loading ? (
				<Loader />
			) : (
				<DebtTableEquity data={list} sidebar={sidebar} darkMode={darkMode} />
			)}
		</>
	)
}

export default Supplier
