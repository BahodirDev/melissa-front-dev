import noDataImg from "../../assets/img/no data.png"
import { addComma } from "../../components/addComma"
import { productDeleteConfirm } from "../../components/delete_modal/delete_modal"

export default function CurrencyList({
	products,
	deleteCurrency,
	editCurrency,
}) {
	return (
		<div className="currency-wrapper">
			{products?.length ? (
				products.map((item) => {
					return (
						<div className="currency-item">
							<div className="currency-item-top">
								<h3>
									{item?.currency_name}
									<span>
										{addComma(item?.currency_amount)} {item?.currency_symbol}
									</span>
								</h3>
								<img
									src={`data:image/png;base64,${item?.flag}`}
									width="30px"
									height="20px"
								/>
							</div>
							<div className="currency-item-bottom">
								<span>
									{item?.name} - {item?.currency_code}
								</span>
								<button
									className="btn btn-my__danger"
									onClick={(e) =>
										productDeleteConfirm(
											e,
											"Pul birligi",
											deleteCurrency,
											item?.currency_id
										)
									}
								>
									<i className="fa-solid fa-trash-can"></i>
								</button>
								<button
									className="btn btn-melissa"
									style={{ marginRight: "5px" }}
									onClick={() => editCurrency(item?.currency_id)}
								>
									<i className="fas fa-edit"></i>
								</button>
							</div>
						</div>
					)
				})
			) : (
				<div className="no-data__con">
					<img src={noDataImg} alt="" />
					<span>Pul birligi mavjud emas</span>
				</div>
			)}
		</div>
	)
}
