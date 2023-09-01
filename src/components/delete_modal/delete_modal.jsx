import { ExclamationCircleFilled } from "@ant-design/icons"
import { Modal } from "antd"
const { confirm } = Modal

export const productDeleteConfirm = (e, name, action, id) => {
	const rect = e.target.getBoundingClientRect()

	confirm({
		title: `${name}ni o'chirishni hohlaysizmi?`,
		icon: <ExclamationCircleFilled />,
		okText: "Ha",
		okType: "danger",
		cancelText: "Yo'q",
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
	})
}
