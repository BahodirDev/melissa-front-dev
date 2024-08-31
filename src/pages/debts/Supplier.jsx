import { useDispatch, useSelector } from "react-redux"
import { useOutletContext } from "react-router-dom"
import Search from "../../components/search/Search"
import { useEffect, useRef, useState } from "react"
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
import Pagination from "../../components/pagination/Pagination"

const Supplier = () => {
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
	const [currentPage, setCurrentPage] = useState(1)
	const [limit, setLimit] = useState(20)
	const [totalPage, setTotalPage] = useState(1)
	const didMount = useRef(false)
	const [searchSubmitted, setSearchSubmitted] = useState(false)
	const [filteredData, setFilteredData] = useState([])

	const getData = () => {
		setLoading(true)
		if (inputRef.current?.value.length > 0) {
			handleSearch()
		} else {
			get(`/debts/debts-equities?limit=${limit}&page=${currentPage}`).then(
				(data) => {
					if (data?.status === 200 || data?.status === 201) {
						setTotalPage(Math.ceil(data?.data?.equities / limit))
						setList(data?.data?.data)
					} else {
						setTotalPage(1)
						toast.error("Nomalum server xatolik")
					}
					setLoading(false)
				}
			)
		}
	}

	useEffect(getData, [currentPage])

	const handleSearch = () => {
		setLoading(true)
		setSearchSubmitted(true)

		post(`/debts/equities-filter?limit=${limit}&page=${currentPage}`, {
			search: inputRef.current?.value,
		}).then((response) => {
			if (response.status === 200) {
				const { data } = response

				setTotalPage(Math.ceil(data?.equities / limit))
				setFilteredData(data?.data)
				if (!data?.data?.length) setCurrentPage(1)
			} else {
				setTotalPage(1)
				toast.error("Nomalum server xatolik")
			}
			setLoading(false)
		})
	}

	const clearSearch = () => {
		inputRef.current.value = ""
	}

	const clearOnly = () => {}

	useEffect(() => {
		setCurrentPage(1)
		if (didMount.current) {
			handleSearch()
		} else {
			didMount.current = true
		}
	}, [limit])

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber)
		if (inputRef.current.value === "") {
			setSearchSubmitted(false)
		}
	}

	return (
		<>
			<Search
				handleSearch={handleSearch}
				clearSearch={clearSearch}
				showAddBtn={false}
				clearOnly={clearOnly}
				darkMode={darkMode}
			/>

			{loading ? (
				<Loader />
			) : (
				<>
					<DebtTableEquity
						data={searchSubmitted ? filteredData : list}
						sidebar={sidebar}
						darkMode={darkMode}
					/>

					{totalPage > 1 ? (
						<>
							<Pagination
								pages={totalPage}
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
									placeholder="Miqdor"
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

export default Supplier
