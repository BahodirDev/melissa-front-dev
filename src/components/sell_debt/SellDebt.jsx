const SellDebt = ({
	SDModalVisible,
	setSDModalVisible,
	SDModalDisplay,
	setSDModalDisplay,
}) => {
	return (
		<div className="add-modal-wrapper" style={{ display: SDModalDisplay }}>
			<div
				className={`add-modal ${SDModalVisible ? "fade-in" : "fade-out"}`}
				onClick={(e) => e.stopPropagation()}
			>
				<h4>Sell and Debt Modal</h4>
			</div>
		</div>
	)
}
export default SellDebt
