import { Modal } from "antd"
const { confirm } = Modal

export const log_out = (e, action) => {
	const rect = e.target.getBoundingClientRect()

	confirm({
		title: `Saytdan chiqishni hohlaysizmi?`,
		icon: " ",
		okText: "Ha, chiqish",
		cancelText: "Bekor qilish",
		width: 300,
		onOk() {
			localStorage.removeItem("id")
			localStorage.removeItem("name")
			localStorage.removeItem("role")
			localStorage.removeItem("user")
			action("/login")
		},
		onCancel() {},
		width: 350,
		style: {
			position: "absolute",
			top: rect.top - 170,
			left: rect.left + 0,
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
