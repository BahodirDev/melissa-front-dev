import { Modal } from "antd"
const { confirm } = Modal

export const confirmCloseModal = (msg, saveAndClose, close) => {

	confirm({
		title: (
			<span className="delete-modal-span">{msg}</span>
		),
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
