import { useEffect } from "react"
import { useState } from "react"
import { get } from "../../customHook/api"
import { useNavigate, useOutletContext } from "react-router-dom"
import { toast } from "react-toastify"
import Loader from "../../components/loader/Loader"
import MonTable from "../../components/mon table/MonTable"

const Monitoring = () => {
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

	const [data, setData] = useState([])
	const [loading, setLoading] = useState(false)
	const [quantity, setQuantity] = useState(0)
	const navigate = useNavigate()

	useEffect(() => {
		if (localStorage.getItem("role") !== "1") navigate("/*")

		setLoading(true)
		get("/monitoring/monitoring-list").then((data) => {
			if (data?.status === 201 || data?.status === 200) {
				setData(data?.data)
				setQuantity(data?.data?.[0]?.full_count)
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
				<>
					{/* <MonTable data={data} sidebar={sidebar} darkMode={darkMode} /> */}
					{/* <h2>data here</h2> */}
				</>
			)}
		</>
	)
}

export default Monitoring
