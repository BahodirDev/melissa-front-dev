import { toast } from "react-toastify"
import { Collapse } from "antd"
import moment from "moment/moment"
import { addComma, roundToNearestThousand } from "../addComma"
import NoData from "../noData/NoData"
import {
	Download,
	FilePdf,
	Pen,
	PencilSimpleLine,
	PersonSimpleSnowboard,
	ShoppingCart,
	Trash,
} from "@phosphor-icons/react"
import { confirmDownloadModal } from "../confirm_download_modal/confirmDownloadModal"
import {
	downloadFile,
	downloadMultipleFiles,
	patch,
	post,
	remove,
} from "../../customHook/api"
import { productDeleteConfirm } from "../delete_modal/delete_modal"
import { useState } from "react"
const { Panel } = Collapse

const AntdAccordion = ({
	data,
	removeFromList,
	userInfo,
	darkMode,
	setList,
	clientId,
	setSDModalVisible,
	setSDModalDisplay,
	setshowDropdown,
	setMiniModal,
}) => {
	const [idList, setIdList] = useState([])
	const [edit, setEdit] = useState("")
	const [newList, setNewList] = useState([])
	const [editArr, setEditArr] = useState([])
	const [prevCountList, setPrevCountList] = useState([])
	const [prevObj, setPrevObj] = useState([])

	const handleChange = (e, id) => {
		if (e.target.checked) {
			setIdList([...idList, id])
		} else {
			let newArr = idList.filter((item) => item !== id)
			setIdList(newArr)
		}
	}

	const deleteReport = (id) => {
		const newArr = id?.files.map((item) => ({
			...item,
			prev_count: item?.product_count,
			product_count: 0,
		}))

		patch(`/clients/clients-edit-list`, newArr).then((dat) => {
			if (dat?.status === 200 || dat?.status === 201) {
				toast.success("Royxat muvffaqiyatli o'chirildi")
				setIdList([])
				setEdit("")
				setNewList([])
				setEditArr([])
				setPrevCountList([])
				setPrevObj([])
				setList(
					data.filter(
						(item) => item?.unique_file_table_id !== id?.unique_file_table_id
					)
				)
			} else {
				toast.error("Nomalum server xatolik")
			}
		})
	}

	const handleQuantityChange = (id, q) => {
		const index = data.findIndex((item) => item.unique_file_table_id === edit)
		if (!newList?.length) {
			setPrevObj(data[index])
		}

		if (index !== -1) {
			let newArr = [...data]
			newArr[index] = {
				...newArr[index],
				files: newArr[index]?.files.map((item, idx) => {
					if (item.product_id === id) {
						const prevCountIndex = prevCountList.findIndex(
							(item) => item?.id === id
						)
						if (prevCountIndex !== -1) {
							setPrevCountList(prevCountList)
						} else {
							setPrevCountList([
								...prevCountList,
								{ id, count: item?.product_count },
							])
						}

						const innerIndex = editArr.findIndex(
							(item) => item?.product_id === id
						)
						let prevQuantity = prevCountList[prevCountIndex]?.count
							? prevCountList[prevCountIndex]?.count
							: 0

						let prevQ = prevQuantity ? prevQuantity : item?.product_count

						let newQ =
							q >= 0 && q <= item?.sub + prevQ
								? q
								: q < 0
								? 0
								: q > item?.sub + prevQ
								? item?.sub + prevQ
								: 0

						if (innerIndex !== -1) {
							let updatedNewArr = editArr
							updatedNewArr[innerIndex] = {
								...item,
								client_id: clientId,
								prev_count: prevCountList[prevCountIndex]?.count
									? prevCountList[prevCountIndex]?.count
									: item?.product_count,
								product_count: newQ,
							}
							setEditArr(updatedNewArr)
						} else {
							setEditArr([
								...editArr,
								{
									...item,
									client_id: clientId,
									prev_count: prevCountList[prevCountIndex]?.count
										? prevCountList[prevCountIndex]?.count
										: item?.product_count,
									product_count: newQ,
								},
							])
						}

						return {
							...item,
							product_count: newQ,
						}
					} else {
						return item
					}
				}),
			}
			setList(newArr)
			setNewList([0])
		}
	}

	const handleEditSave = (id = null) => {
		console.log(editArr)

		if (newList?.length && id === edit) {
		// 	patch(`/clients/clients-edit-list`, editArr).then((data) => {
		// 		if (data?.status === 200 || data?.status === 201) {
		// 			toast.success("Royxat muvffaqiyatli o'zgartirildi")
		// 			setIdList([])
		// 			setEdit("")
		// 			setNewList([])
		// 			setEditArr([])
		// 			setPrevCountList([])
		// 			setPrevObj([])
		// 		} else {
		// 			toast.error("Nomalum server xatolik")
		// 		}
		// 	})
		} else {
			setEdit(edit !== id ? id : "")
		}
	}

	const cancelEdit = (id) => {
		if (newList?.length) {
			const index = data.findIndex((item) => item.unique_file_table_id === id)
			let newArr = [...data]
			newArr[index] = prevObj
			setList(newArr)
		}

		setEdit("")
		setIdList([])
		setEdit("")
		setNewList([])
		setEditArr([])
		setPrevCountList([])
	}

	const handleResell = (e, id) => {
		e.stopPropagation()
		setshowDropdown("")
		setMiniModal("")
		setSDModalVisible(true)
		setSDModalDisplay("grid")

		let arrIndex = data?.findIndex((item) => item?.unique_file_table_id === id)
		// console.log(data[arrIndex]?.files)
		// setResellList(data[arrIndex]?.files)
		// console.log(data[arrIndex]?.files)
	}

	return (
		<>
			<button
				className={`primary-btn low-height ${darkMode ? "dark" : null}`}
				onClick={() =>
					confirmDownloadModal(downloadMultipleFiles, idList, darkMode)
				}
				disabled={!idList?.length}
			>
				Tanlanganlarni yuklab olish{" "}
				<FilePdf size={16} style={{ marginTop: "-4px" }} />
			</button>
			{data?.length ? (
				<Collapse
					className={`antd-collapse ${darkMode ? "dark" : null}`}
					accordion
				>
					{data?.map((item) => {
						return (
							<Panel
								key={item.key}
								header={
									<div className="antd-collapse-header">
										<div>
											{moment(item?.files[0].createdat).format(
												"YYYY/MM/DD HH:mm"
											)}
											&nbsp;&nbsp;&nbsp;&nbsp;
											<input
												type="checkbox"
												onChange={(e) =>
													handleChange(e, item?.unique_file_table_id)
												}
												onClick={(e) => e.stopPropagation()}
											/>
											<button
												onClick={(e) => {
													e.stopPropagation()
													confirmDownloadModal(
														downloadFile,
														item?.unique_file_table_id,
														darkMode
													)
												}}
												className="download-btn accordion"
											>
												<Download size={20} />
											</button>
										</div>
										<div>
											{/* <button
												type="button"
												className="accordion-delete__btn"
												onClick={(e) =>
													handleResell(e, item?.unique_file_table_id)
												}
												disabled
											>
												Qayta sotish <ShoppingCart size={20} />
											</button>{" "} */}
											&nbsp;
											<button
												type="button"
												className="accordion-delete__btn"
												onClick={(e) => {
													e.stopPropagation()
													productDeleteConfirm(
														e,
														<>
															<span>
																{moment(item?.files[0].createdat).format(
																	"YYYY/MM/DD"
																)}
															</span>{" "}
															dagi faylni
														</>,
														deleteReport,
														item,
														darkMode
													)
												}}
											>
												O'chirish <Trash size={20} />
											</button>
										</div>
									</div>
								}
							>
								<table cellPadding="5px">
									<button
										type="button"
										className="accordion-delete__btn extra"
										onClick={() => handleEditSave(item?.unique_file_table_id)}
									>
										{edit === item?.unique_file_table_id ? (
											"Saqlash"
										) : (
											<>
												Tahrirlash <PencilSimpleLine size={20} />
											</>
										)}
									</button>
									{edit === item?.unique_file_table_id ? (
										<button
											type="button"
											className="accordion-delete__btn"
											style={{ marginLeft: "10px" }}
											onClick={() => cancelEdit(item?.unique_file_table_id)}
										>
											Bekor qilish
										</button>
									) : null}
									<tbody>
										<h6>
											{item?.files?.length} hil -{" "}
											{item?.files
												?.reduce(
													(totalPrice, product) =>
														totalPrice + product?.total_price,
													0
												)
												.toLocaleString()}
											so'm
										</h6>
										{item?.files.map((fileInfo, idx) => (
											<tr>
												<td>
													&nbsp;&nbsp; {idx + 1} {fileInfo?.goods_name} -{" "}
													{fileInfo?.goods_code}
												</td>
												<td>
													{edit === item?.unique_file_table_id ? (
														<div
															className={`quantityWrapper ${
																darkMode ? "dark" : null
															}`}
														>
															<button
																className="quantityBtn"
																onClick={() =>
																	handleQuantityChange(
																		fileInfo?.product_id,
																		fileInfo?.product_count - 1
																	)
																}
															>
																-
															</button>
															<input
																type="text"
																className="quantityInput"
																value={fileInfo?.product_count}
																onChange={(e) =>
																	handleQuantityChange(
																		fileInfo?.product_id,
																		e.target.value
																	)
																}
																onKeyPress={(e) => {
																	if (isNaN(e.key)) {
																		e.preventDefault()
																	}
																}}
															/>
															<button
																className="quantityBtn"
																onClick={() =>
																	handleQuantityChange(
																		fileInfo?.product_id,
																		+fileInfo?.product_count + 1
																	)
																}
															>
																+
															</button>
														</div>
													) : (
														fileInfo?.product_count
													)}
												</td>
												<td>x &nbsp; {addComma(fileInfo?.count_price)}</td>
												<td>
													={" "}
													{addComma(
														fileInfo?.product_count * fileInfo?.count_price
													)}{" "}
													so'm
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</Panel>
						)
					})}
				</Collapse>
			) : (
				<NoData />
			)}
		</>
	)
}

export default AntdAccordion
