import { ExclamationCircleFilled } from "@ant-design/icons"
import { Modal } from "antd"
const { confirm } = Modal

export const log_out = (e, action) => {
	const rect = e.target.getBoundingClientRect()

	confirm({
		title: `Chiqish hohlaysizmi?`,
		icon: <ExclamationCircleFilled />,
		okText: "Ha",
		okType: "danger",
		cancelText: "Yo'q",
		width: 300,
		onOk() {
			// localStorage.clear()
			localStorage.removeItem("id")
			localStorage.removeItem("name")
			localStorage.removeItem("role")
			localStorage.removeItem("user")
			action("/login")
		},
		onCancel() {},
		style: {
			position: "absolute",
			top: rect.top - 150,
			left: rect.left + 0,
		},
	})
}
