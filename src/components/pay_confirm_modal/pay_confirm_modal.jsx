import { Modal } from "antd"
const { confirm } = Modal

export const payConfirmModal = (e, action, id) => {
	const rect = e.target.getBoundingClientRect()

	confirm({
		icon: " ",
		title: "Qarzni yopishni hohlaysizmi?",
		okText: "Yopish",
		okType: "danger",
		cancelText: "Bekor qilish",
		width: 300,
		onOk() {
			action(id)
		},
		onCancel() {},
		style: {
			position: "absolute",
			top: rect.top - 150,
			left: rect.left - 250,
		},
		okButtonProps: {
			style: {
				backgroundColor: "#30af25",
				color: "white",
				borderColor: "#30af25",
			},
		},
	})
}
