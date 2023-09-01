import { addComma } from "../addComma"

export default function ProductModalItem({ product, removeItem }) {
	return (
		<div className="product-modal__item">
			<h6>{product?.product_name}</h6>
			<h6>{product?.count} ta</h6>
			<h6>{product?.client}</h6>
			<h6>{addComma(product?.price)} so'm</h6>
			<h6>{addComma(product?.price * product?.count)} so'm</h6>
			<button
				className="btn btn-sm btn-melissa"
				onClick={() => removeItem(product?.product_id)}
				style={{ float: "right" }}
			>
				<i className="fas fa-remove"></i>
			</button>
		</div>
	)
}
