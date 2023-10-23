import { Input, Select } from "antd"
import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useOutletContext } from "react-router-dom"
import { addComma, formatSumma } from "../../components/addComma"
import { error_modal } from "../../components/error_modal/error_modal"
import Loader from "../../components/loader/Loader"
import { setData as setDataDeliver } from "../../components/reducers/deliver"
import { setData as setDataGood } from "../../components/reducers/good"
import {
	addData,
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
	stringCheck,
	validation,
} from "../../components/validation"
import { get, post, remove } from "../../customHook/api"
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
	] = useOutletContext()
	const { product, good, currency, deliver, store } = useSelector(
		(state) => state
	)
	const dispatch = useDispatch()

	const [btnLoading, setBtnLoading] = useState(false)
	const [submitted, setSubmitted] = useState(false)
	const [userInfo, setUserInfo] = useState()

	// filter
	const [filteredData, setFilteredData] = useState({})
	const [searchSubmitted, setSearchSubmitted] = useState(false)
	const [searchStoreId, setSearchStoreId] = useState("")
	const [searchDeliverId, setSearchDeliverId] = useState("")
	const [searchGoodId, setSearchGoodId] = useState("")

	// new
	const [newGoodsId, setNewGoodsId] = useState({})
	const [newDeliverId, setNewDeliverId] = useState({})
	const [newStoreId, setNewStoreId] = useState({})
	const [newBoxQ, setNewBoxQ] = useState()
	const [newProductQ, setNewProductQ] = useState()
	const [newProductCost, setNewProductCost] = useState()
	const [newProductPrice, setNewProductPrice] = useState()
	const [newPercentId, setNewPercentId] = useState({})

	const getData = () => {
		dispatch(setLoading(true))
		get("/products/products-list").then((data) => {
			if (data?.status === 200 || data?.status === 201) {
				dispatch(setDataProduct(data?.data?.data))
				dispatch(setQuantity(data?.data?.hisob?.kategoriya))
				dispatch(setAmount(data?.data?.hisob?.soni))
				dispatch(setSum(data?.data?.hisob?.umumiyQiymati))
			} else {
				toast.error("Nomalum server xatolik")
			}
			dispatch(setLoading(false))
		})
	}

	const getData1 = (name, dispatch1) => {
		get(`/${name}/${name}-list`).then((data) => {
			dispatch(dispatch1(data?.data))
		})
	}

	useEffect(() => {
		setUserInfo(localStorage.getItem("role"))
		getData()
		getData1("deliver", setDataDeliver)
		getData1("goods", setDataGood)
	}, [])

	const addNewProduct = () => {
		setSubmitted(true)
		if (
			newGoodsId.goods_id &&
			newDeliverId.deliver_id &&
			newStoreId.store_id &&
			newPercentId.currency_id &&
			newBoxQ > 0 &&
			newProductQ > 0 &&
			newProductPrice > 0 &&
			newProductCost > 0
		) {
			setBtnLoading(true)
			let newProductObj = {
				goods_id: newGoodsId?.goods_id,
				deliver_id: newDeliverId?.deliver_id,
				store_id: newStoreId?.store_id,
				products_count_cost: +newProductCost,
				products_count: +newProductQ,
				products_box_count: +newBoxQ,
				currency_id: newPercentId?.currency_id,
				products_count_price: +newProductPrice,
			}
			post("/products/products-post", newProductObj).then((data) => {
				if (data?.status === 201) {
					dispatch(
						addData({
							...data?.data,
							...newGoodsId,
							...newDeliverId,
							...newStoreId,
							...newPercentId,
						})
					)
					clearAndClose()
					toast.success("Mahsulot muvoffaqiyatli qo'shildi")
				} else {
					toast.error("Nomalum server xatolik")
				}
				setBtnLoading(false)
			})
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
		setNewProductQ(0)
		setNewPercentId({})
		setNewProductCost(0)
		setNewProductPrice(0)

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

	return (
		<>
			<AddModal
				addModalVisible={addModalVisible}
				setAddModalVisible={setAddModalVisible}
				addModalDisplay={addModalDisplay}
				setAddModalDisplay={setAddModalDisplay}
				name={"Mahsulot qo'shish"}
			>
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
						{good.data?.length
							? good.data.map((item, idx) => {
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
						onChange={(e) =>
							e ? setNewDeliverId(JSON.parse(e)) : setNewDeliverId({})
						}
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
						submitted && numberCheck(newBoxQ) !== null && "error"
					}`}
				>
					<label>Quti soni</label>
					<input
						type="text"
						placeholder="Qiymat kiriting"
						className="input"
						value={newBoxQ ? newBoxQ : ""}
						onChange={(e) => setNewBoxQ(e.target.value)}
					/>
					{submitted && numberCheck(newBoxQ) !== null && <Info size={20} />}
					<div className="validation-field">
						<span>{submitted && numberCheck(newBoxQ)}</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form regular ${
						submitted && numberCheck(newProductQ) !== null && "error"
					}`}
				>
					<label>Mahsulot soni</label>
					<input
						type="text"
						placeholder="Qiymat kiriting"
						className="input"
						value={newProductQ ? newProductQ : ""}
						onChange={(e) => setNewProductQ(e.target.value)}
					/>
					{submitted && numberCheck(newProductQ) !== null && <Info size={20} />}
					<div className="validation-field">
						<span>{submitted && numberCheck(newProductQ)}</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form ${
						submitted &&
						stringCheck(newPercentId?.currency_name) !== null &&
						"error"
					}`}
				>
					<label>Pul birligi</label>
					<Select
						showSearch
						allowClear
						placeholder="Pul birligi tanlang"
						className="select"
						suffixIcon={
							submitted && stringCheck(newPercentId?.currency_name) !== null ? (
								<Info size={20} />
							) : (
								<CaretDown size={16} />
							)
						}
						value={
							newPercentId?.currency_name
								? `${newPercentId?.currency_name} - ${newPercentId?.currency_amount}`
								: null
						}
						onChange={(e) =>
							e ? setNewPercentId(JSON.parse(e)) : setNewPercentId({})
						}
					>
						{currency?.data.length
							? currency?.data.map((item, idx) => {
									return (
										<Select.Option key={idx} value={JSON.stringify(item)}>
											<div>
												<span>{item?.currency_name} - </span>
												<span>{item?.currency_amount}</span>
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
									newPercentId?.currency_name,
									"Pul birligi tanlash majburiy"
								)}
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
						onChange={(e) => setNewProductCost(e.target.value)}
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
						onChange={(e) => setNewProductPrice(e.target.value)}
					/>
					{submitted && numberCheck(newProductPrice) !== null && (
						<Info size={20} />
					)}
					<div className="validation-field">
						<span>{submitted && numberCheck(newProductPrice)}</span>
					</div>
				</div>
				<div className="modal-btn-group">
					<button
						className="primary-btn"
						disabled={btnLoading}
						onClick={addNewProduct}
					>
						{"Qo'shish"}{" "}
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
							? filteredData?.hisob?.kategoriya
							: product?.quantity
					}
					name="Kategoriyalar soni"
					icon={<SquaresFour size={24} color="var(--color-primary)" />}
					iconBgColor={"var(--bg-icon)"}
				/>
				<InfoItem
					value={searchSubmitted ? filteredData?.hisob?.soni : product?.amount}
					name="Mahsulotlar soni"
					icon={<Package size={24} color="var(--color-success)" />}
					iconBgColor={"var(--bg-success-icon)"}
				/>
				<InfoItem
					value={formatSumma(
						searchSubmitted ? +filteredData?.hisob?.umumiyQiymati : product?.sum
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
			/>

			{product?.loading ? (
				<Loader />
			) : (
				<AntTable
					data={searchSubmitted ? filteredData?.data : product?.dataProduct}
					deleteItem={deleteProduct}
					sidebar={sidebar}
					userRole={userInfo}
				/>
			)}
		</>
	)
}
