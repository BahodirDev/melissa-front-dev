import { X } from "@phosphor-icons/react"
import "./add modal.css"

const AddModal = ({
	addModalVisible,
	setAddModalVisible,
	addModalDisplay,
	setAddModalDisplay,
	name,
	children,
}) => {
	return (
		<div className="add-modal-wrapper" style={{ display: addModalDisplay }}>
			<div
				className={`add-modal ${addModalVisible ? "fade-in" : "fade-out"}`}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="modal-top">
					<button
						onClick={() => {
							setAddModalVisible(false)
							setTimeout(() => {
								setAddModalDisplay("none")
							}, 300)
						}}
					>
						<X size={20} />
					</button>
					<h4>{name}</h4>
				</div>
				<div className="modal-bottom">{children}</div>
			</div>
		</div>
	)
}

export default AddModal
