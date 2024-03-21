import { Input, Select } from "antd"
import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useOutletContext } from "react-router-dom"
import {
	addComma,
	addSpace,
	formatSumma,
	roundToNearestThousand,
} from "../../components/addComma"
import { error_modal } from "../../components/error_modal/error_modal"
import Loader from "../../components/loader/Loader"
import { setData as setDataDeliver } from "../../components/reducers/deliver"
import { setData as setDataGood } from "../../components/reducers/good"
import {
	addData,
	editData,
	removeProduct,
	setAmount,
	setDataProduct,
	setLoading,
	setQuantity,
	setSum,
} from "../../components/reducers/product"
import AntTable from "../../components/table/Table"
import {
	numberCheck,
	numberCheckAllow0,
	stringCheck,
	validation,
} from "../../components/validation"
import { get, patch, post, remove } from "../../customHook/api"
import { mapOptionList } from "./mapOptionList"
import "./product.css"
import { toast } from "react-toastify"
import AddModal from "../../components/add/AddModal"
import InfoItem from "../../components/info_item/InfoItem"
import {
	ArrowCounterClockwise,
	CaretDown,
	CurrencyDollar,
	Info,
	Package,
	SquaresFour,
} from "@phosphor-icons/react"
import Search from "../../components/search/Search"
import format_phone_number from "../../components/format_phone_number/format_phone_number"
import moment from "moment"
import Pagination from "../../components/pagination/Pagination"

export default function Products() {
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
	const { product, good, currency, deliver, store } = useSelector(
		(state) => state
	)
	const dispatch = useDispatch()

	const [btnLoading, setBtnLoading] = useState(false)
	const [submitted, setSubmitted] = useState(false)
	// const [userInfo, setUserInfo] = useState()
	const [goodList, setGoodList] = useState([])
	const [objId, setObjId] = useState("")

	// filter
	const [filteredData, setFilteredData] = useState({})
	const [searchSubmitted, setSearchSubmitted] = useState(false)
	const [searchStoreId, setSearchStoreId] = useState("")
	const [searchDeliverId, setSearchDeliverId] = useState("")
	const [searchGoodId, setSearchGoodId] = useState("")

	const [currentPage, setCurrentPage] = useState(1)
	const [limit, setLimit] = useState(20)
	const [totalPages, setTotalPage] = useState(1)

	// new
	const [newGoodsId, setNewGoodsId] = useState({})
	const [newDeliverId, setNewDeliverId] = useState({})
	const [newStoreId, setNewStoreId] = useState({})
	const [newBoxQ, setNewBoxQ] = useState()
	const [newPerBox, setNewPerBox] = useState(0)
	const [newProductQ, setNewProductQ] = useState()
	const [newProductCost, setNewProductCost] = useState()
	const [newProductPrice, setNewProductPrice] = useState()
	const [newPercentId, setNewPercentId] = useState({})
	const [newDate, setNewDate] = useState("")

	const getData = () => {
		dispatch(setLoading(true))
		get(`/products/products-list?limit=${limit}&page=${currentPage}`).then(
			(data) => {
				if (data?.status === 200 || data?.status === 201) {
					setTotalPage(Math.ceil(data?.data?.data[0]?.full_count / limit))
					dispatch(setDataProduct(data?.data?.data))
					dispatch(setQuantity(data?.data?.hisob?.kategoriya))
					dispatch(setAmount(data?.data?.hisob?.soni))
					dispatch(setSum(data?.data?.hisob?.umumiyQiymati))
				} else {
					setTotalPage(0)
					toast.error("Nomalum server xatolik")
				}
				dispatch(setLoading(false))
			}
		)
	}

	useEffect(() => {
		getData()
	}, [currentPage])

	const getData1 = (name, dispatch1) => {
		get(`/${name}/${name}-list`).then((data) => {
			dispatch(dispatch1(data?.data))
		})
	}

	useEffect(() => {
		// setUserInfo(localStorage.getItem("role"))
		// getData()
		getData1("deliver", setDataDeliver)
		getData1("goods", setDataGood)
	}, [])

	const addNewProduct = () => {
		setSubmitted(true)
		if (
			newGoodsId.goods_id &&
			newDeliverId.deliver_id &&
			newStoreId.store_id &&
			currency?.data?.length &&
			newProductPrice > 0 &&
			newProductCost > 0
		) {
			setBtnLoading(true)
			let newProductObj = {
				goods_id: newGoodsId?.goods_id,
				deliver_id: newDeliverId?.deliver_id,
				store_id: newStoreId?.store_id,
				products_count_cost: +newProductCost,
				products_box_count: +newBoxQ,
				each_box_count: +newPerBox,
				out_of_box: +newProductQ,
				currency_id: currency?.data[0]?.currency_id,
				products_count_price: +newProductPrice,
			}
			if (objId) {
				if (newDate) {
					newProductObj.products_createdat = newDate
					patch(`/products/products-patch/${objId}`, newProductObj).then(
						(data) => {
							if (data?.status === 200 || data?.status === 201) {
								dispatch(
									editData({
										...data?.data,
										...newGoodsId,
										...newDeliverId,
										...newStoreId,
										...currency?.data[0],
									})
								)
								clearAndClose()
								toast.success("Mahsulot muvoffaqiyatli o'zgartirildi")
							} else {
								toast.error("Nomalum server xatolik")
							}
							setBtnLoading(false)
						}
					)
				}
			} else {
				if (newBoxQ > 0 && newProductQ > 0) {
					post("/products/products-post", newProductObj).then((data) => {
						if (data?.status === 201) {
							dispatch(
								addData({
									...data?.data,
									...newGoodsId,
									...newDeliverId,
									...newStoreId,
									...currency?.data[0],
								})
							)
							clearAndClose()
							toast.success("Mahsulot muvoffaqiyatli qo'shildi")
						} else {
							toast.error("Nomalum server xatolik")
						}
						setBtnLoading(false)
						console.log(data)
					})
				}
			}
		}
	}

	const deleteProduct = (id) => {
		remove(`/products/products-delete/${id}`).then((data) => {
			if (data?.status === 200 || data?.status === 201) {
				dispatch(removeProduct(id))
				toast.success("Mahsulot muvoffaqiyatli o'chirildi")
			} else if (data?.response?.data?.error === "PRODUCT_NOT_FOUND") {
				toast.error("Bunday mahsulot topilmadi")
			} else if (data?.response?.data?.error === "DEBTS_EXIST") {
				toast.warn("Bu mahsulotda qarzdorlik mavjud")
			} else {
				toast.error("Nomalum server xatolik")
			}
		})
	}

	const clearAndClose = () => {
		setNewGoodsId({})
		setNewDeliverId({})
		setNewStoreId({})
		setNewBoxQ(0)
		setNewPerBox(0)
		setNewProductQ(0)
		setNewPercentId({})
		setNewProductCost(0)
		setNewProductPrice(0)
		setBtnLoading(false)
		setObjId("")
		setNewDate("")

		setSubmitted(false)
		setAddModalVisible(false)
		setTimeout(() => {
			setAddModalDisplay("none")
		}, 300)
	}

	const handleSearch = () => {
		if (inputRef.current?.value.length > 0) {
			dispatch(setLoading(true))
			setSearchSubmitted(true)
			post("/products/products-filter", {
				search: inputRef.current?.value,
			}).then((data) => {
				if (data.status === 200) {
					// setTotalPage(Math.ceil(data?.data?.data[0]?.full_count / limit))
					setFilteredData(data?.data)
				} else {
					toast.error("Nomalum server xatolik")
				}
				dispatch(setLoading(false))
			})
		} else {
			setSearchSubmitted(false)
			setFilteredData([])
		}
	}

	const clearSearch = () => {
		setSearchSubmitted(false)
		setFilteredData([])
		inputRef.current.value = ""
	}

	const getGoodsList = (id) => {
		get(`/goods/deliver-goods-list/${id}`).then((data) => {
			setGoodList(data?.data)
		})
		setNewGoodsId({})
	}

	const editProduct = (id) => {
		// setNewGoodName("")

		setshowDropdown("")
		setAddModalVisible(true)
		setAddModalDisplay("block")

		get(`/products/products-list/${id}`).then((data) => {
			if (data?.status === 200) {
				setObjId(id)

				setNewGoodsId(data?.data?.goods_id)
				setNewDeliverId(data?.data?.deliver_id)
				setNewStoreId(data?.data?.store_id)
				setNewBoxQ(data?.data?.products_box_count)
				setNewProductQ(data?.data?.products_count)
				setNewProductCost(data?.data?.products_count_cost)
				setNewProductPrice(data?.data?.products_count_price)
				setNewPercentId(data?.data?.currency_id)
				setNewDate(moment(data?.data?.products_createdat).format("YYYY-MM-DD"))
			} else {
				clearAndClose()
				toast.error("Nomalum server xatolik")
			}
		})
	}

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber)
	}

	const clearOnly = () => {
		setNewGoodsId({})
		setNewDeliverId({})
		setNewStoreId({})
		setNewBoxQ(0)
		setNewProductQ(0)
		setNewPercentId({})
		setNewProductCost(0)
		setNewProductPrice(0)
		setBtnLoading(false)
		setObjId("")
		setNewDate("")

		setSubmitted(false)
	}

	return (
		<>
			<AddModal
				addModalVisible={addModalVisible}
				setAddModalVisible={setAddModalVisible}
				addModalDisplay={addModalDisplay}
				setAddModalDisplay={setAddModalDisplay}
				name={objId ? "Mahsulot tahrirlash" : "Mahsulot qo'shish"}
			>
				<div
					className={`input-wrapper modal-form ${
						submitted &&
						stringCheck(newDeliverId?.deliver_name) !== null &&
						"error"
					}`}
				>
					<label>Ta'minotchi</label>
					<Select
						showSearch
						allowClear
						placeholder="Ta'minotchi tanlang"
						className="select"
						suffixIcon={
							submitted && stringCheck(newDeliverId?.deliver_name) !== null ? (
								<Info size={20} />
							) : (
								<CaretDown size={16} />
							)
						}
						value={
							newDeliverId.deliver_name
								? `${newDeliverId?.deliver_name} - ${format_phone_number(
										newDeliverId?.deliver_nomer
								  )}`
								: null
						}
						onChange={(e) => {
							e ? setNewDeliverId(JSON.parse(e)) : setNewDeliverId({})
							getGoodsList(JSON.parse(e)?.deliver_id)
						}}
					>
						{deliver.data?.length
							? deliver.data.map((item, idx) => {
									if (!item?.isdelete) {
										return (
											<Select.Option
												key={idx}
												className="option-shrink"
												value={JSON.stringify(item)}
											>
												<div>
													<span>{item?.deliver_name} - </span>
													<span>
														{format_phone_number(item?.deliver_nomer)}
													</span>
												</div>
											</Select.Option>
										)
									}
							  })
							: null}
					</Select>
					<div className="validation-field">
						<span>
							{submitted &&
								stringCheck(
									newDeliverId?.deliver_nomer,
									"Ta'minotchi tanlash majburiy"
								)}
						</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form ${
						submitted && stringCheck(newGoodsId?.goods_name) !== null && "error"
					}`}
				>
					<label>Kategoriya</label>
					<Select
						showSearch
						allowClear
						placeholder="Kategoriya tanlang"
						className="select"
						suffixIcon={
							submitted && stringCheck(newGoodsId?.goods_name) !== null ? (
								<Info size={20} />
							) : (
								<CaretDown size={16} />
							)
						}
						value={
							newGoodsId.goods_name
								? `${newGoodsId?.goods_name} - ${newGoodsId?.goods_code}`
								: null
						}
						onChange={(e) =>
							e ? setNewGoodsId(JSON.parse(e)) : setNewGoodsId({})
						}
					>
						{goodList?.length
							? goodList.map((item, idx) => {
									return (
										<Select.Option
											key={idx}
											className="option-shrink"
											value={JSON.stringify(item)}
										>
											<div>
												<span>{item?.goods_name} - </span>
												<span>{item?.goods_code}</span>
											</div>
										</Select.Option>
									)
							  })
							: null}
					</Select>
					<div className="validation-field">
						<span>
							{submitted &&
								stringCheck(
									newGoodsId?.goods_name,
									"Kategoriya tanlash majburiy"
								)}
						</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form ${
						submitted && stringCheck(newStoreId?.store_name) !== null && "error"
					}`}
				>
					<label>Ombor</label>
					<Select
						showSearch
						allowClear
						placeholder="Ombor tanlang"
						className="select"
						suffixIcon={
							submitted && stringCheck(newStoreId?.store_name) !== null ? (
								<Info size={20} />
							) : (
								<CaretDown size={16} />
							)
						}
						value={newStoreId?.store_name ? newStoreId?.store_name : null}
						onChange={(e) =>
							e ? setNewStoreId(JSON.parse(e)) : setNewStoreId({})
						}
					>
						{store?.data.length
							? store?.data.map((item, idx) => {
									return (
										<Select.Option key={idx} value={JSON.stringify(item)}>
											<div>
												<span>{item?.store_name}</span>
											</div>
										</Select.Option>
									)
							  })
							: null}
					</Select>
					<div className="validation-field">
						<span>
							{submitted &&
								stringCheck(newStoreId?.store_name, "Ombor tanlash majburiy")}
						</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form regular ${
						objId
							? null
							: submitted && numberCheckAllow0(newBoxQ) !== null && "error"
					}`}
				>
					<label>Quti soni</label>
					<input
						type="text"
						placeholder="Qiymat kiriting"
						className="input"
						value={newBoxQ ? newBoxQ : ""}
						onChange={(e) => setNewBoxQ(e.target.value.replace(/[^0-9]/g, ""))}
					/>
					{objId
						? null
						: submitted &&
						  numberCheckAllow0(newBoxQ) !== null && <Info size={20} />}
					<div className="validation-field">
						<span>
							{objId ? null : submitted && numberCheckAllow0(newBoxQ)}
						</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form regular ${
						objId
							? null
							: submitted && numberCheck(newPerBox) !== null && "error"
					}`}
				>
					<label>Har bir quti soni</label>
					<input
						type="text"
						placeholder="Qiymat kiriting"
						className="input"
						value={newPerBox ? newPerBox : ""}
						onChange={(e) =>
							setNewPerBox(e.target.value.replace(/[^0-9]/g, ""))
						}
					/>
					{objId
						? null
						: submitted &&
						  numberCheck(newPerBox) !== null && <Info size={20} />}
					<div className="validation-field">
						<span>{objId ? null : submitted && numberCheck(newPerBox)}</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form regular ${
						objId
							? null
							: submitted && numberCheckAllow0(newProductQ) !== null && "error"
					}`}
				>
					<label>Qoldiq soni</label>
					<input
						type="text"
						placeholder="Qiymat kiriting"
						className="input"
						value={newProductQ ? newProductQ : ""}
						onChange={(e) =>
							setNewProductQ(e.target.value.replace(/[^0-9]/g, ""))
						}
					/>
					{objId
						? null
						: submitted &&
						  numberCheckAllow0(newProductQ) !== null && <Info size={20} />}
					<div className="validation-field">
						<span>
							{objId ? null : submitted && numberCheckAllow0(newProductQ)}
						</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form regular ${
						submitted && numberCheck(newProductCost) !== null && "error"
					}`}
				>
					<label>Narx</label>
					<input
						type="text"
						placeholder="Qiymat kiriting"
						className="input"
						value={newProductCost ? newProductCost : ""}
						onChange={(e) =>
							setNewProductCost(e.target.value.replace(/[^0-9]/g, ""))
						}
					/>
					{submitted && numberCheck(newProductCost) !== null && (
						<Info size={20} />
					)}
					<div className="validation-field">
						<span>{submitted && numberCheck(newProductCost)}</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form regular ${
						submitted && numberCheck(newProductPrice) !== null && "error"
					}`}
				>
					<label>Sotuv narx</label>
					<input
						type="text"
						placeholder="Qiymat kiriting"
						className="input"
						value={newProductPrice ? newProductPrice : ""}
						onChange={(e) =>
							setNewProductPrice(e.target.value.replace(/[^0-9]/g, ""))
						}
					/>
					{submitted && numberCheck(newProductPrice) !== null && (
						<Info size={20} />
					)}
					<div className="validation-field">
						<span>{submitted && numberCheck(newProductPrice)}</span>
					</div>
				</div>
				{objId ? (
					<div
						className={`input-wrapper modal-form regular ${
							submitted && stringCheck(newDate) !== null && "error"
						}`}
					>
						<label>Qabul qilingan sana</label>
						<input
							type="date"
							placeholder="Sana kiriting"
							className="input date"
							value={newDate ? newDate : ""}
							onChange={(e) => setNewDate(e.target.value)}
						/>
						{/* {submitted && stringCheck(newDate) !== null && <Info size={20} />} */}
						<div className="validation-field">
							<span>{submitted && stringCheck(newDate)}</span>
						</div>
					</div>
				) : null}
				<div className="modal-btn-group">
					<button
						className="primary-btn"
						disabled={btnLoading}
						onClick={addNewProduct}
					>
						{objId ? "Saqlash" : "Qo'shish"}{" "}
						{btnLoading && (
							<span
								className="spinner-grow spinner-grow-sm"
								role="status"
								aria-hidden="true"
								style={{ marginLeft: "5px" }}
							></span>
						)}
					</button>
					<button className="secondary-btn" onClick={clearAndClose}>
						Bekor qilish
					</button>
				</div>
			</AddModal>

			<div className="filter-wrapper">
				<div className="input-wrapper">
					<Select
						showSearch
						allowClear
						placeholder="Ombor"
						className="select"
						value={searchStoreId ? searchStoreId : null}
						onChange={(e) => setSearchStoreId(e)}
						disabled
					>
						{store?.data.length
							? store?.data.map((item, idx) => (
									<Select.Option key={idx} value={item.store_id}>
										<div>
											<span>{item?.store_name}</span>
										</div>
									</Select.Option>
							  ))
							: null}
					</Select>
				</div>
				<div className="input-wrapper">
					<Select
						showSearch
						allowClear
						placeholder="Ta'minotchi"
						className="select"
						value={searchDeliverId ? searchDeliverId : null}
						onChange={(e) => setSearchDeliverId(e)}
						disabled
					>
						{deliver.data?.length
							? deliver.data.map((item, idx) => {
									if (!item?.isdelete)
										return (
											<Select.Option
												key={idx}
												value={item.deliver_id}
												className="option-shrink"
											>
												<div>
													<span>{item?.deliver_name} - </span>
													<span>
														{format_phone_number(item?.deliver_nomer)}
													</span>
												</div>
											</Select.Option>
										)
							  })
							: null}
					</Select>
				</div>
				<div className="input-wrapper">
					<Select
						showSearch
						allowClear
						placeholder="Kategoriya"
						className="select"
						value={searchGoodId ? searchGoodId : null}
						onChange={(e) => setSearchGoodId(e)}
						disabled
					>
						{good.data?.length
							? good.data.map((item, idx) => (
									<Select.Option
										className="option-shrink"
										key={idx}
										value={item.goods_id}
									>
										<div>
											<span>{item?.goods_name} - </span>
											<span>{item?.goods_code}</span>
										</div>
									</Select.Option>
							  ))
							: null}
					</Select>
				</div>
				<div className="filter-btn-group">
					<button type="button" className="filter-btn" disabled>
						Tozalash
					</button>
					<button type="button" className="filter-btn" disabled>
						Saqlash
					</button>
				</div>
			</div>

			<div className="info-wrapper">
				<InfoItem
					value={
						searchSubmitted
							? addSpace(filteredData?.hisob?.kategoriya)
							: addSpace(product?.quantity)
					}
					name="Kategoriyalar soni"
					icon={<SquaresFour size={24} color="var(--color-primary)" />}
					iconBgColor={"var(--bg-icon)"}
				/>
				<InfoItem
					value={
						searchSubmitted
							? addSpace(filteredData?.hisob?.soni)
							: addSpace(product?.amount)
					}
					name="Mahsulotlar soni"
					icon={<Package size={24} color="var(--color-success)" />}
					iconBgColor={"var(--bg-success-icon)"}
				/>
				<InfoItem
					value={addSpace(
						roundToNearestThousand(
							searchSubmitted
								? +filteredData?.hisob?.umumiyQiymati
								: product?.sum
						)
					)}
					name="Umumiy summa"
					icon={<CurrencyDollar size={24} color="var(--color-warning)" />}
					iconBgColor={"var(--bg-icon-warning)"}
				/>
			</div>

			<Search
				handleSearch={handleSearch}
				clearSearch={clearSearch}
				className={"table-m"}
				clearOnly={clearOnly}
			/>

			{product?.loading ? (
				<Loader />
			) : (
				<>
					<AntTable
						data={searchSubmitted ? filteredData?.data : product?.dataProduct}
						deleteItem={deleteProduct}
						sidebar={sidebar}
						userRole={userInfo?.role}
						showDropdown={showDropdown}
						setshowDropdown={setshowDropdown}
						editProduct={editProduct}
						setAddModalVisible={setAddModalVisible}
						setAddModalDisplay={setAddModalDisplay}
					/>

					<Pagination
						pages={totalPages}
						currentPage={currentPage}
						onPageChange={handlePageChange}
					/>
				</>
			)}
		</>
	)
}
