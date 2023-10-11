import { Modal } from "antd"
const { confirm } = Modal

export const productDeleteConfirm = (e, name, action, id) => {
	const rect = e.target.getBoundingClientRect()

	confirm({
		title: `${name}ni o'chirishni hohlaysizmi?`,
		icon: " ",
		okText: "Ha, o'chirish",
		okType: "danger",
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
				backgroundColor: "var(--bg-danger)",
				color: "var(--color-light)",
			},
		},
	})
}
