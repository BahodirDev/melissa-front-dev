import { Modal } from "antd"
const { confirm } = Modal

export const log_out = (e, action, mode = false) => {
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
			top: "40%",
			left: "50%",
			transform: "translateY(-50%)",
			transform: "translateX(-50%)",
			textAlign: "center",
			padding: 0,
			borderRadius: "var(--radius-lg)",
		},
		bodyStyle: {
			display: "flex",
			justifyContent: "center",
		},
		className: mode ? "dark" : null,
	})
}
