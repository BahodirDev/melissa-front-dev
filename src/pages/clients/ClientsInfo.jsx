import { DatePicker, Space } from "antd"
import { useEffect, useState } from "react"
import { useLocation, useNavigate, useOutletContext } from "react-router-dom"
import format_phone_number from "../../components/format_phone_number/format_phone_number"
import moment from "moment/moment"
import ClientInfoTable from "../../components/client_info_table/AntAccordion"
import { get } from "../../customHook/api"
import Loader from "../../components/loader/Loader"
import { CaretLeft } from "@phosphor-icons/react"
import AntdAccordion from "../../components/client_info_table/AntAccordion"

const ClientsInfo = () => {
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
	] = useOutletContext()

	const loc = useLocation()
	const [dateRange, setDateRange] = useState([])
	const { RangePicker } = DatePicker
	const [list, setList] = useState([])
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()

	const { id, name, desc, tel, date } = loc.state

	useEffect(() => {
		setLoading(true)
		get(`/clients/clients-reports-list/${id}`).then((data) => {
			if (data?.status === 200) {
				setList(data.data)
				setLoading(false)
			}
		})
	}, [])

	const removeFromList = (id) => {
		const index = list.findIndex((item) => item?.unique_file_table_id === id)

		if (index !== -1) {
			const newList = [...list]
			newList.splice(index, 1)
			setList(newList)
		}
	}

	return (
		<>
			<button type="button" onClick={() => navigate(-1)} className="back-btn">
				<CaretLeft size={24} /> <span>Orqaga</span>
			</button>
			{/* <div className="filter-wrapper client-info">
				<div className="input-wrapper">
					<Space direction="vertical" size={12}>
						<RangePicker
							allowClear
							disabled
							className="date-picker"
							value={dateRange}
							onChange={(e) => setDateRange(e)}
						/>
					</Space>
				</div>
				<div className="filter-btn-group">
					<button
						type="button"
						disabled
						className="filter-btn"
						onClick={() => {}}
					>
						Saqlash
					</button>
				</div>
			</div> */}

			<div className="client-info-div">
				<h2>{name}</h2>
				<h3>
					Izoh: <span>{desc}</span>
				</h3>
				<h3>
					Tel: <span>{format_phone_number(tel)}</span>
				</h3>
				<h3>
					Yaratilgan sana: <span>{moment(date).format("YYYY.MM.DD")}</span>
				</h3>
			</div>

			{loading ? (
				<Loader />
			) : (
				<AntdAccordion
					data={list}
					removeFromList={removeFromList}
					userInfo={userInfo?.role}
				/>
			)}
		</>
	)
}
export default ClientsInfo
