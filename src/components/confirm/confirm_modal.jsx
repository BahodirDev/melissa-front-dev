import { Modal } from "antd"
const { confirm } = Modal

export const confirmCloseModal = (msg, saveAndClose, close, mode = false) => {
	confirm({
		title: <span className="delete-modal-span">{msg}</span>,
		icon: " ",
		okText: "Ha, o'chirish",
		okType: "danger",
		cancelText: "Saqlash",
		width: 300,
		onOk() {
			close()
		},
		onCancel() {
			saveAndClose()
		},
		width: 350,
		bodyStyle: {
			display: "flex",
			justifyContent: "center",
		},
		className: mode ? "dark" : null,
	})
}

export const confirmApproveModal = (msg, action, mode = false) => {
	confirm({
		title: <span className="delete-modal-span">{msg}</span>,
		icon: " ",
		okText: "Ha, tasdiqlash",
		okType: "success",
		cancelText: "Bekor qilish",
		width: 300,
		onOk() {
			action()
		},
		onCancel() {},
		width: 350,
		bodyStyle: {
			// display: "flex",
			// justifyContent: "center",
		},
		style: {
			top: "50%",
			transform: "translateY(-50%)",
		},
		className: mode ? "dark" : null,
	})
}

export const confirmReturnTF = (msg, action, mode = false) => {
	return new Promise((resolve, reject) => {
		confirm({
			title: <span className="delete-modal-span">{msg}</span>,
			icon: " ",
			okText: "Ha, tasdiqlash",
			okType: "success",
			cancelText: "Bekor qilish",
			width: 300,
			onOk() {
				action()
				resolve(true) // Resolve with true when user clicks OK
			},
			onCancel() {
				resolve(undefined) // Reject with false when user clicks Cancel
			},
			width: 350,
			style: {
				top: "50%",
				transform: "translateY(-50%)",
			},
			className: mode ? "dark" : null,
		})
	})
}
