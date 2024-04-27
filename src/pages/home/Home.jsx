import { Button, DatePicker, Select, Space } from "antd"
import {
	ArcElement,
	BarElement,
	CategoryScale,
	Chart as ChartJs,
	Filler,
	Legend,
	LineElement,
	LinearScale,
	PointElement,
	Tooltip,
} from "chart.js"
import { useState } from "react"
import { Bar, Doughnut, Line } from "react-chartjs-2"
import { formatSumma } from "../../components/addComma"
import { useNavigate, useOutletContext } from "react-router-dom"
import { useEffect } from "react"

import "./home.css"
import { downloadFile, downloadNewList, get } from "../../customHook/api"
import { toast } from "react-toastify"
import AntTable from "../../components/table/Table"
import { StatsListTable, StatsTable } from "../../components/stats/StatsTable"
import Loader from "../../components/loader/Loader"
import Pagination from "../../components/pagination/Pagination"
import { useDispatch, useSelector } from "react-redux"
import { setData, setQuantity } from "../../components/reducers/stats"
import { FilePdf } from "@phosphor-icons/react"
import { confirmDownloadModal } from "../../components/confirm_download_modal/confirmDownloadModal"

ChartJs.register(
	BarElement,
	CategoryScale,
	LinearScale,
	Tooltip,
	Legend,
	ArcElement,
	PointElement,
	LineElement,
	Filler
)

export default function Home() {
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

	const state = useSelector((state) => state.stats)
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [stats, setStats] = useState([])
	const [loading, setLoading] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)
	const [limit, setLimit] = useState(20)
	const [totalPages, setTotalPages] = useState(1)

	const getStats = () => {
		setLoading(true)
		get(
			`/products/products-statistics-list?limit=${limit}&page=${currentPage}`
		).then((data) => {
			if (data?.status === 200) {
				setTotalPages(Math.ceil(data?.data?.[0]?.full_count / limit))
				setStats(data?.data)
			} else {
				setTotalPages(1)
				toast.error("Nomalum server xatolik")
			}
			setLoading(false)
		})
	}

	useEffect(() => {
		if (localStorage.getItem("role") !== "1") navigate("/products")
	}, [])

	useEffect(getStats, [currentPage, limit])

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber)
	}

	const addToStatsList = (obj) => {
		dispatch(setData([...state?.data, obj]))
	}

	const removeFromStatsList = (obj) => {
		dispatch(setData(state?.data.filter((item) => item?.id !== obj?.id)))
	}

	const handleQuantityChange = (id, q) => {
		dispatch(setQuantity({ id, q }))
	}

	const handleDownload = () => {
		let newArr = state?.data?.map((item) => {
			return {
				deliver: item?.deliver_id,
				name: item?.goods_name,
				code: item?.goods_code,
				price: item?.price,
				count: item?.products_count,
			}
		})
		confirmDownloadModal(downloadNewList, newArr, darkMode)
	}

	return loading ? (
		<Loader />
	) : (
		<>
			<div className="stats-table-row">
				<StatsTable
					data={stats}
					currentPage={currentPage}
					limit={limit}
					addToStatsList={addToStatsList}
					removeFromStatsList={removeFromStatsList}
					selected={state?.data}
				/>
				<StatsListTable
					data={state?.data}
					removeFromStatsList={removeFromStatsList}
					handleQuantityChange={handleQuantityChange}
					darkMode={darkMode}
				/>
			</div>
			<Pagination
				pages={totalPages}
				currentPage={currentPage}
				onPageChange={handlePageChange}
				darkMode={darkMode}
			/>
			<div className="stats-table-row">
				<div
					className={`input-wrapper ${
						darkMode ? "dark" : null
					} pagination-limit`}
				>
					<Select
						placeholder="Kirim Chiqim"
						className="select"
						value={limit}
						onChange={(e) => setLimit(e)}
					>
						<Select.Option value="10" className={`${darkMode ? "dark" : null}`}>
							<div>
								<span>10</span>
							</div>
						</Select.Option>
						<Select.Option value="25" className={`${darkMode ? "dark" : null}`}>
							<div>
								<span>25</span>
							</div>
						</Select.Option>
						<Select.Option value="50" className={`${darkMode ? "dark" : null}`}>
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

				<button
					className={`primary-btn low-height ${darkMode ? "dark" : null}`}
					onClick={handleDownload}
					disabled={!state?.data?.length}
				>
					Yuklab olish <FilePdf />
				</button>
			</div>
		</>
	)
}
