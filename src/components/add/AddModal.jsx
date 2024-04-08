import { X } from "@phosphor-icons/react"
import "./add modal.css"
import { useOutletContext } from "react-router-dom"

const AddModal = ({ name, children }) => {
	const [
		inputRef,
		showDropdown,
		setshowDropdown,
		addModalVisible,
		setAddModalVisible,
		addModalDisplay,
		setAddModalDisplay,
		miniModal,
		setMiniModal,
		sidebar,
		userInfo,
		darkMode,
	] = useOutletContext()

	return (
		<div
			className={`add-modal-wrapper ${darkMode ? "dark" : null}`}
			style={{ display: addModalDisplay }}
		>
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
						<X size={20} className={`${darkMode ? "phosphor-icon" : null}`} />
					</button>
					<h4>{name}</h4>
				</div>
				<div className="modal-bottom">{children}</div>
			</div>
		</div>
	)
}

export default AddModal
