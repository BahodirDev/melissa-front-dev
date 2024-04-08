import { Modal } from "antd"
const { confirm } = Modal

export const payConfirmModal = (e, name, action, id, mode = false) => {
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
		className: mode ? "dark" : null,
	})
}
