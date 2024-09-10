import { X } from "@phosphor-icons/react"
import { Modal } from "antd"
const { confirm } = Modal

export const image_modal = (action, id, img, mode = false) => {
	confirm({
		icon: " ",
		content: (
			<div
				style={{
					width: "70dvw",
					height: "70dvh",
					marginTop: "-10px",
				}}
			></div>
		),
		okText: "Saqlash",
		okType: "success",
		cancelText: "Ok",
		autoFocusButton: null,
		onOk() {
			action(id, "here will be new img")
		},
		onCancel() {},
		closable: true,
		closeIcon: <X size={18} color="#2196f3" />,
		width: "80dvw",
		bodyStyle: {
			height: "80dvh",
			display: "flex",
			justifyContent: "center",
		},
		style: {
			top: "50%",
			transform: "translateY(-50%)",
		},
		className: mode ? "dark" : null,
	})
}
