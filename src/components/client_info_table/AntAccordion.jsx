import { toast } from "react-toastify"
import { Collapse } from "antd"
import moment from "moment/moment"
import { addComma, roundToNearestThousand } from "../addComma"
import NoData from "../noData/NoData"
import { Download, Trash } from "@phosphor-icons/react"
import { confirmDownloadModal } from "../confirm_download_modal/confirmDownloadModal"
import { downloadFile, remove } from "../../customHook/api"
import { productDeleteConfirm } from "../delete_modal/delete_modal"
const { Panel } = Collapse

const AntdAccordion = ({ data, removeFromList }) => {
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

	return data?.length ? (
		<Collapse className="antd-collapse" accordion>
			{data
				.sort(
					(a, b) =>
						moment(b?.files[0].createdat) - moment(a?.files[0].createdat)
				)
				.map((item) => (
					<Panel
						key={item.key}
						header={
							<div className="antd-collapse-header">
								<div>
									{moment(item?.files[0].createdat).format(
										"YYYY/MM/DD hh:mm"
									)}
									<button
										onClick={() =>
											confirmDownloadModal(
												downloadFile,
												item?.unique_file_table_id
											)
										}
										className="download-btn accordion"
									>
										<Download size={20} />
									</button>
								</div>
								<button
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
											item?.unique_file_table_id
										)
									}
								>
									O'chirish <Trash size={20} />
								</button>
							</div>
						}
					>
						<table cellPadding="5px">
							<tbody>
								<h6>
									{item?.files?.length}ta -{" "}
									{roundToNearestThousand(
										item?.files?.reduce(
											(totalPrice, product) =>
												totalPrice + product?.total_price,
											0
										)
									).toLocaleString()}
									so'm
								</h6>
								{item?.files.map((fileInfo, idx) => (
									<tr>
										<td>
											{idx + 1} {fileInfo?.goods_name} - {fileInfo?.goods_code}
										</td>
										<td>{fileInfo?.product_count}ta</td>
										<td>{addComma(fileInfo?.count_price)} =</td>
										<td>
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
				))}
		</Collapse>
	) : (
		<NoData />
	)
}

export default AntdAccordion
