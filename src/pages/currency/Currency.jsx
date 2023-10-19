import { Select } from "antd"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useOutletContext } from "react-router-dom"
import currency from "../../assets/currency.json"
import Loader from "../../components/loader/Loader"
import {
	addData,
	editData,
	removeCurrency,
	setData,
	setLoading,
	setQuantity,
} from "../../components/reducers/currency"
import { numberCheck, stringCheck } from "../../components/validation"
import { get, patch, post, remove } from "../../customHook/api"
import CurrencyList from "./CurrencyList"
import "./currency.css"
import { CurrencyDollar } from "@phosphor-icons/react/dist/ssr"
import { toast } from "react-toastify"
import Search from "../../components/search/Search"
import InfoItem from "../../components/info_item/InfoItem"
import AddModal from "../../components/add/AddModal"
import { CaretDown, Info } from "@phosphor-icons/react"

export default function Currency() {
	const [filteredData, setFilteredData] = useState([])
	const [newName, setNewName] = useState({})
	const [newAmount, setNewAmount] = useState(0)
	const [buttonLoader, setButtonLoader] = useState(false)
	const [
		inputRef,
		showDropdown,
		setshowDropdown,
		addModalVisible,
		setAddModalVisible,
		addModalDisplay,
		setAddModalDisplay,
	] = useOutletContext()
	const [objId, setObjId] = useState("")
	const [submitted, setSubmitted] = useState(false)
	const [searchSubmitted, setSearchSubmitted] = useState(false)
	const state = useSelector((state) => state.currency)
	const dispatch = useDispatch()

	const handleSearch = () => {
		if (inputRef.current?.value.length > 0) {
			setSearchSubmitted(true)
			let newArr = state.data.filter(
				(item) =>
					item?.currency_name.toLowerCase().includes(inputRef.current?.value) ||
					item?.currency_code.toLowerCase().includes(inputRef.current?.value) ||
					item?.name.toLowerCase().includes(inputRef.current?.value) ||
					item?.currency_symbol.toLowerCase().includes(inputRef.current?.value)
			)
			setFilteredData(newArr)
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

	useEffect(() => {
		dispatch(setLoading(true))
		get("/currency/currency-list").then((data) => {
			if (data?.status === 201) {
				dispatch(setData(data?.data))
				dispatch(setQuantity())
			} else {
				toast.error("Nomalur server xatolik")
			}
			dispatch(setLoading(false))
		})
	}, [])

	const addNewCurrency = () => {
		setSubmitted(true)
		if (newName.name && newAmount > 0) {
			setButtonLoader(true)
			if (objId) {
				patch(`/currency/currency-patch/${objId}`, {
					currency_name: newName?.currency?.name,
					currency_code: newName?.currency?.code,
					currency_symbol: newName?.currency?.symbol,
					currency_amount: newAmount,
					name: newName?.name,
					flag: newName?.flag,
				}).then((data) => {
					if (data?.status === 201) {
						dispatch(editData(data?.data))
						clearAndClose()
						toast.success("Pul birligi muvoffaqiyatli o'zgartirildi")
						setObjId("")
						setSubmitted(false)
					} else if (data?.response?.data?.error === "CURRENCY_ALREADY_EXIST") {
						toast.warn("Bunday pul birligi allaqachon mavjud")
					} else {
						toast.error("Nomalum server xatolik")
					}
					setButtonLoader(false)
				})
			} else {
				let newCurrency = {
					currency_name: newName?.currency?.name,
					currency_code: newName?.currency?.code,
					currency_symbol: newName?.currency?.symbol,
					currency_amount: newAmount,
					name: newName?.name,
					flag: newName?.flag,
				}
				post(`/currency/currency-post`, newCurrency).then((data) => {
					if (data?.status === 201) {
						dispatch(addData(data?.data))
						dispatch(setQuantity())
						clearAndClose()
						toast.success("Pul birligi muvoffaqiyatli qo'shildi")
						setSubmitted(false)
					} else if (data?.response?.data?.error === "CURRENCY_ALREADY_EXIST") {
						toast.warn("Pul birligi allaqachon mavjud")
					} else {
						toast.error("Pul birligi qo'shib bo'lmadi")
					}
					setButtonLoader(false)
				})
			}
		}
	}

	const deleteCurrency = (id) => {
		dispatch(setLoading(true))
		remove(`/currency/currency-delete/${id}`).then((data) => {
			if (data?.status === 200) {
				dispatch(removeCurrency(id))
				dispatch(setQuantity())
				toast.success("Valyuta muvoffaqiyatli o'chirildi")
			} else if (data?.response?.data?.error === "PRODUCT_FOUND") {
				toast.warn("Bu valyutada mahsulot bor")
			} else {
				toast.error("Nomalum server xatolik")
			}
			dispatch(setLoading(false))
		})
		clearAndClose()
	}

	const editCurrency = (id) => {
		const data = state?.data.find((item) => item?.currency_id === id)
		if (data.currency_name) {
			setNewName({
				currency: {
					name: data?.currency_name,
					code: data?.currency_code,
					symbol: data?.currency_symbol,
				},
				name: data?.name,
				flag: data?.flag,
			})
			setNewAmount(data?.currency_amount)
			setObjId(id)
			setAddModalDisplay("block")
			setAddModalVisible(true)
		} else {
			toast.error("Nomalum server xatolik")
		}
	}

	const clearAndClose = () => {
		setNewName({})
		setNewAmount("")
		setObjId("")
		setSubmitted(false)
		setAddModalVisible(false)
		setTimeout(() => {
			setAddModalDisplay("none")
		}, 300)
	}

	return (
		<>
			<AddModal
				addModalVisible={addModalVisible}
				setAddModalVisible={setAddModalVisible}
				addModalDisplay={addModalDisplay}
				setAddModalDisplay={setAddModalDisplay}
				name={objId ? "Pul birligi tahrirlash" : "Pul birligi qo'shish"}
			>
				<div
					className={`input-wrapper modal-form ${
						submitted && stringCheck(newName.name) !== null && "error"
					}`}
				>
					<label>Valyuta nomi</label>
					<Select
						showSearch
						allowClear
						placeholder="Qidiruv..."
						className="select"
						suffixIcon={
							submitted && stringCheck(newName.name) !== null ? (
								<Info size={20} />
							) : (
								<CaretDown size={16} />
							)
						}
						// notFoundContent="nothing here"
						value={
							newName.currency
								? `${newName?.currency?.name} - ${newName?.name}`
								: null
						}
						onChange={(e) => (e ? setNewName(JSON.parse(e)) : setNewName({}))}
					>
						{currency.list.length
							? currency.list.map((item, idx) => (
									<Select.Option key={idx} value={JSON.stringify(item)}>
										<div>
											<span>{item?.currency?.name} - </span>
											<span>{item?.name}</span>
										</div>
									</Select.Option>
							  ))
							: null}
					</Select>
					<div className="validation-field">
						<span>
							{submitted &&
								stringCheck(newName.name, "Valyuta tanlash majburiy")}
						</span>
					</div>
				</div>
				<div
					className={`input-wrapper modal-form regular ${
						submitted && numberCheck(newAmount) !== null && "error"
					}`}
				>
					<label>Qiymat</label>
					<input
						type="text"
						placeholder="Qiymat kiriting"
						className="input"
						value={newAmount ? newAmount : ""}
						onChange={(e) => setNewAmount(e.target.value)}
					/>
					{submitted && numberCheck(newAmount) !== null && <Info size={20} />}
					<div className="validation-field">
						<span>{submitted && numberCheck(newAmount)}</span>
					</div>
				</div>
				<div className="modal-btn-group">
					<button
						className="primary-btn"
						disabled={buttonLoader}
						onClick={addNewCurrency}
					>
						{objId ? "Saqlash" : "Qo'shish"}{" "}
						{buttonLoader && (
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

			<div className="info-wrapper">
				<InfoItem
					value={searchSubmitted ? filteredData.length : state?.quantity}
					name="Valyutalar soni"
					icon={
						<CurrencyDollar
							size={24}
							style={{ color: "var(--color-primary)" }}
						/>
					}
					iconBgColor={"var(--bg-icon)"}
				/>
			</div>

			<Search handleSearch={handleSearch} clearSearch={clearSearch} />

			{state?.loading ? (
				<Loader />
			) : (
				<CurrencyList
					data={searchSubmitted ? filteredData : state.data}
					deleteCurrency={deleteCurrency}
					editCurrency={editCurrency}
					showDropdown={showDropdown}
					setshowDropdown={setshowDropdown}
				/>
			)}
		</>
	)
}
