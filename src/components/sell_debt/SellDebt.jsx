import "./sell debt.css"

const SellDebt = ({
	SDModalVisible,
	setSDModalVisible,
	SDModalDisplay,
	setSDModalDisplay,
}) => {
	return (
		<div className="sell-modal-wrapper" style={{ display: SDModalDisplay }}>
			<div
				className={`sell-modal ${
					SDModalVisible ? "fade-in-sd" : "fade-out-sd"
				}`}
				onClick={(e) => e.stopPropagation()}
			>
				<h4>Sell and Debt Modal</h4>
			</div>
		</div>
	)
}
export default SellDebt
