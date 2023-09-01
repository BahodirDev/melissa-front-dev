import moment from "moment"
import noDataImg from "../../assets/img/no data.png"
import { productDeleteConfirm } from "../../components/delete_modal/delete_modal"

export default function GoodsList({ goods, deleteGood, updateGood }) {
	return (
		<div className="good-wrapper">
			{goods.length ? (
				goods.map((item) => {
					return (
						<div className="good-item">
							<h3>{item?.goods_name}</h3>
							<h5>Code: &nbsp;{item?.goods_code}</h5>
							<div className="good-item-bottom">
								<span>
									{moment(item?.goods_createdat).zone(+7).format("YYYY/MM/DD")}
								</span>
								<div>
									<button
										className="btn btn-melissa mx-2"
										onClick={() => updateGood(item?.goods_id)}
									>
										<i className="fas fa-edit"></i>
									</button>
									<button
										className="btn btn-my__danger mx-2"
										onClick={(e) =>
											productDeleteConfirm(
												e,
												"Kategoriya",
												deleteGood,
												item?.goods_id
											)
										}
									>
										<i className="fa-solid fa-trash-can"></i>
									</button>
								</div>
							</div>
						</div>
					)
				})
			) : (
				<div className="no-data__con">
					<img src={noDataImg} alt="" />
					<span>Kategoriya mavjud emas</span>
				</div>
			)}
		</div>
	)
}
