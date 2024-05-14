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
	Trash,
} from "@phosphor-icons/react"
import { confirmDownloadModal } from "../confirm_download_modal/confirmDownloadModal"
import {
	downloadFile,
	downloadMultipleFiles,
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
}) => {
	const [idList, setIdList] = useState([])
	const [edit, setEdit] = useState("")
	const [newList, setNewList] = useState([])

	const handleChange = (e, id) => {
		if (e.target.checked) {
			setIdList([...idList, id])
		} else {
			let newArr = idList.filter((item) => item !== id)
			setIdList(newArr)
		}
	}

	const deleteReport = (id) => {
		remove(`files/files-delete/${id}`).then((data) => {
			if (data?.status === 200 || data?.status === 201) {
				removeFromList(id)
				toast.success("Fayl muvoffaqiyatli o'chirildi")
			} else if (data?.response?.status === 404) {
				toast.warn("Bunday fayl topilmadi")
			} else {
				toast.error("Nomalum server xatolik")
			}
		})
	}

	const handleQuantityChange = (id, q) => {
		const index = data.findIndex((item) => item.unique_file_table_id === edit)
		if (index !== -1) {
			let newArr = [...data]
			newArr[index] = {
				...newArr[index],
				files: newArr[index]?.files.map((s, idx) => {
					if (s.product_id == id) {
						return {
							...s,
							product_count: q >= 0 ? q : 0,
						}
					} else {
						return s
					}
				}),
			}
			setList(newArr)
			setNewList({})
		}
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
					{data
						.sort(
							(a, b) =>
								moment(b?.files[0].createdat) - moment(a?.files[0].createdat)
						)
						.map((item) => {
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
												/>
												<button
													onClick={() =>
														confirmDownloadModal(
															downloadFile,
															item?.unique_file_table_id,
															darkMode
														)
													}
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
														item?.unique_file_table_id,
														darkMode
													)
												}
											>
												O'chirish <Trash size={20} />
											</button> */}
											</div>
										</div>
									}
								>
									<table cellPadding="5px">
										<button
											type="button"
											className="accordion-delete__btn"
											onClick={() =>
												setEdit(
													edit !== item?.unique_file_table_id
														? item?.unique_file_table_id
														: ""
												)
											}
											disabled
										>
											{edit ? (
												"Saqlash"
											) : (
												<>
													Tahrirlash <PencilSimpleLine size={20} />
												</>
											)}
										</button>
										<tbody>
											<h6>
												{item?.files?.length}ta -{" "}
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
																			fileInfo?.product_count + 1
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
													<td>x {addComma(fileInfo?.count_price)}</td>
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
