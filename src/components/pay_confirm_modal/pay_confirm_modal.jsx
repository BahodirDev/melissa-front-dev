import { Modal } from "antd"
const { confirm } = Modal

export const payConfirmModal = (e, name, action, id) => {
	const rect = e.target.getBoundingClientRect()

	confirm({
		icon: " ",
		title: (
			<span className="confirm-modal-span">{name} yopishni hohlaysizmi?</span>
		),
		okText: "Yopish",
		okType: "success",
		cancelText: "Bekor qilish",
		width: 300,
		onOk() {
			action(id)
		},
		onCancel() {},
		width: 350,
		style: {
			position: "absolute",
			top: rect.top - 170,
			left: rect.right - 350,
			textAlign: "center",
			padding: 0,
			borderRadius: "var(--radius-lg)",
		},
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
				backgroundColor: "var(--bg-success)",
				color: "var(--color-light)",
			},
		},
	})
}
