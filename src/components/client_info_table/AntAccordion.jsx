import { Collapse } from "antd"
import moment from "moment/moment"
import { addComma } from "../addComma"
import NoData from "../noData/NoData"
import { Download } from "@phosphor-icons/react"
import { confirmDownloadModal } from "../confirm_download_modal/confirmDownloadModal"
import { downloadFile } from "../../customHook/api"
const { Panel } = Collapse

const AntdAccordion = ({ data }) =>
	data?.length ? (
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
								{moment(item?.files[0].createdat).format("YYYY/MM/DD HH:MM:SS")}
								<button
									onClick={() =>
										confirmDownloadModal(
											downloadFile,
											item?.unique_file_table_id
										)
									}
									className="download-btn"
								>
									<Download size={20} />
								</button>
							</div>
						}
					>
						<table cellPadding="5px">
							<tbody>
								{item?.files.map((fileInfo) => (
									<tr>
										<td>
											{fileInfo?.goods_name} - {fileInfo?.goods_code}
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

export default AntdAccordion
