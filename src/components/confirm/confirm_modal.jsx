import { Modal } from "antd"
const { confirm } = Modal

export const confirmCloseModal = (msg, saveAndClose, close) => {
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
		cancelButtonProps: {
			style: {
				color: "var(--color-secondary)",
				border: "var(--border-primary)",
				borderRadius: "var(--radius-sm)",
			},
		},
		okButtonProps: {
			style: {
				borderRadius: "var(--radius-sm)",
				backgroundColor: "var(--bg-danger)",
				color: "var(--color-light)",
			},
		},
	})
}

export const confirmApproveModal = (msg, action) => {
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
		cancelButtonProps: {
			style: {
				color: "var(--color-secondary)",
				border: "var(--border-primary)",
				borderRadius: "var(--radius-sm)",
			},
		},
		okButtonProps: {
			style: {
				borderRadius: "var(--radius-sm)",
				backgroundColor: "var(--bg-success)",
				color: "var(--color-light)",
			},
		},
	})
}

export const confirmReturnTF = (msg, action) => {
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
			cancelButtonProps: {
				style: {
					color: "var(--color-secondary)",
					border: "var(--border-primary)",
					borderRadius: "var(--radius-sm)",
				},
			},
			okButtonProps: {
				style: {
					borderRadius: "var(--radius-sm)",
					backgroundColor: "var(--bg-success)",
					color: "var(--color-light)",
				},
			},
		})
	})
}
