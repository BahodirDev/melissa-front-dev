import { Modal } from "antd"
const { confirm } = Modal

export const productDeleteConfirm = (e, name, action, id, mode = false) => {
	const rect = e.target.getBoundingClientRect()

	confirm({
		// title: `${name} o'chirishni hohlaysizmi?`,
		title: (
			<span className="delete-modal-span">{name} o'chirishni hohlaysizmi?</span>
		),
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
		className: mode ? "dark" : null,
	})
}

export const transactionDeleteConfirm = (
	e,
	name,
	action,
	id,
	type,
	status,
	summa,
	mode = false
) => {
	const rect = e.target.getBoundingClientRect()

	confirm({
		// title: `${name} o'chirishni hohlaysizmi?`,
		title: (
			<span className="delete-modal-span">{name} o'chirishni hohlaysizmi?</span>
		),
		icon: " ",
		okText: "Ha, o'chirish",
		okType: "danger",
		cancelText: "Bekor qilish",
		width: 300,
		onOk() {
			action(id, type, status, summa)
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
