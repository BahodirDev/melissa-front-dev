import { DatePicker, Select, Space } from "antd"
import { useEffect, useState } from "react"
import {
	useLocation,
	useNavigate,
	useOutletContext,
	useParams,
} from "react-router-dom"
import format_phone_number from "../../components/format_phone_number/format_phone_number"
import moment from "moment/moment"
import ClientInfoTable from "../../components/client_info_table/AntAccordion"
import { get } from "../../customHook/api"
import Loader from "../../components/loader/Loader"
import { CaretLeft } from "@phosphor-icons/react"
import AntdAccordion from "../../components/client_info_table/AntAccordion"
import { toast } from "react-toastify"
import Pagination from "../../components/pagination/Pagination"
import { addComma, addCommaWithTwoFixed } from "../../components/addComma"

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
		darkMode,
		setSDModalVisible,
		setSDModalDisplay,
	] = useOutletContext()

	const loc = useLocation()
	const [dateRange, setDateRange] = useState([])
	const { RangePicker } = DatePicker
	const [list, setList] = useState([])
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()
	const [currentPage, setCurrentPage] = useState(1)
	const [limit, setLimit] = useState(20)
	const [totalPages, setTotalPage] = useState(1)
	const [clientInfo, setClientInfo] = useState({})

	const userId = useParams()

	useEffect(() => {
		setLoading(true)

		get(`/clients/clients-list/${userId?.id}`).then((data) => {
			setClientInfo(data?.data)

			if (data?.status === 200) {
				get(
					`/clients/clients-reports-list/${userId?.id}?limit=${limit}&page=${currentPage}`
				).then((data) => {
					if (data?.status === 200) {
						setList(data?.data?.data)
						setTotalPage(Math.ceil(data?.data?.files / limit))
					} else {
						toast.error("Nomalur server xatolik")
						setTotalPage(1)
					}
					setLoading(false)
				})
			} else {
				toast.error("Nomalur server xatolik")
			}
		})
	}, [])

	useEffect(() => {
		setLoading(true)
		get(
			`/clients/clients-reports-list/${userId?.id}?limit=${limit}&page=${currentPage}`
		).then((data) => {
			if (data?.status === 200) {
				setList(data.data?.data)
				setTotalPage(Math.ceil(data?.data?.files / limit))
			} else {
				toast.error("Nomalur server xatolik")
				setTotalPage(1)
			}
			setLoading(false)
		})
	}, [currentPage, limit])

	const removeFromList = (id) => {
		const index = list.findIndex((item) => item?.unique_file_table_id === id)

		if (index !== -1) {
			const newList = [...list]
			newList.splice(index, 1)
			setList(newList)
		}
	}

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber)
		// if (
		// 	searchStoreId === "" &&
		// 	searchDeliverId === "" &&
		// 	inputRef.current.value === ""
		// ) {
		// 	setSearchSubmitted(false)
		// }
	}

	return (
		<>
			<button
				type="button"
				onClick={() => navigate(-1)}
				className={`back-btn  ${darkMode ? "dark" : null}`}
			>
				<CaretLeft size={24} /> <span>Orqaga</span>
			</button>

			<div className={`client-info-div ${darkMode ? "dark" : null}`}>
				<h2>{clientInfo?.clients_name}</h2>
				<div>
					<h3>
						Izoh: <span>{clientInfo?.clients_desc}</span>
					</h3>
					<h3>
						{clientInfo?.dollar_debt - clientInfo?.dollar_equity < 0
							? `Haqdor: $ ${addCommaWithTwoFixed(
									Math.abs(clientInfo?.dollar_debt - clientInfo?.dollar_equity)
							  )}`
							: `Qarzdor: $ ${addCommaWithTwoFixed(
									Math.abs(clientInfo?.dollar_debt - clientInfo?.dollar_equity)
							  )}`}
					</h3>
					<h3>
						Tel: <span>{format_phone_number(clientInfo?.clients_nomer)}</span>
					</h3>
					<h3>
						{clientInfo?.sum_debt - clientInfo?.sum_equity < 0
							? `Haqdor: ${addComma(
									Math.abs(clientInfo?.sum_debt - clientInfo?.sum_equity)
							  )} so'm`
							: `Qarzdor: ${addComma(
									Math.abs(clientInfo?.sum_debt - clientInfo?.sum_equity)
							  )} so'm`}
					</h3>
					<h3>
						Yaratilgan sana:{" "}
						<span>
							{moment(clientInfo?.clients_createdat).format("YYYY.MM.DD")}
						</span>
					</h3>
				</div>
			</div>

			{loading ? (
				<Loader />
			) : (
				<>
					<AntdAccordion
						data={list}
						removeFromList={removeFromList}
						userInfo={userInfo?.role}
						darkMode={darkMode}
						setList={setList}
						clientId={"id"}
						setSDModalVisible={setSDModalVisible}
						setSDModalDisplay={setSDModalDisplay}
						setshowDropdown={setshowDropdown}
						setMiniModal={setMiniModal}
					/>

					{totalPages > 1 ? (
						<>
							<Pagination
								pages={totalPages}
								currentPage={currentPage}
								onPageChange={handlePageChange}
								darkMode={darkMode}
							/>

							<div
								className={`input-wrapper ${
									darkMode ? "dark" : null
								} pagination-limit`}
							>
								<Select
									placeholder="Kirim Chiqim"
									className="select"
									value={limit}
									onChange={(e) => {
										setLimit(e)
										setCurrentPage(1)
									}}
								>
									<Select.Option
										value="10"
										className={`${darkMode ? "dark" : null}`}
									>
										<div>
											<span>10</span>
										</div>
									</Select.Option>
									<Select.Option
										value="25"
										className={`${darkMode ? "dark" : null}`}
									>
										<div>
											<span>25</span>
										</div>
									</Select.Option>
									<Select.Option
										value="50"
										className={`${darkMode ? "dark" : null}`}
									>
										<div>
											<span>50</span>
										</div>
									</Select.Option>
									<Select.Option
										value="100"
										className={`${darkMode ? "dark" : null}`}
									>
										<div>
											<span>100</span>
										</div>
									</Select.Option>
								</Select>
							</div>
						</>
					) : null}
				</>
			)}
		</>
	)
}
export default ClientsInfo
