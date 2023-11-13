import ProductModalItem from "./ProductModalItem"

export default function ProductModalList({ productList, removeItem }) {
	return (
		<div className="modal-product__list">
			{/* <div className="product-modal__head row">
				<div className="col-3">
					<span>Nomi: </span>
				</div>
				<div className="col-3">
					<span>Soni: </span>
				</div>
				<div className="col-3">
					<span>Narx: </span>
				</div>
				<div className="col-3" style={{ paddingLeft: "0" }}>
					<span>Umumiy narx: </span>
				</div>
			</div> */}
			{productList.map((product, idx) => {
				return <ProductModalItem key={idx} product={product} removeItem={removeItem} />
			})}
		</div>
	)
}
