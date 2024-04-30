import { FilePdf } from "@phosphor-icons/react"
import { Modal } from "antd"
const { confirm } = Modal

export const confirmDownloadModal = (action, id, mode = false) => {
	confirm({
		icon: " ",
		title: <span>Yuklab olishni xohlaysizmi?</span>,
		content: "",
		okText: (
			<>
				Yuklab olish <FilePdf size={16} style={{ marginTop: "-4px" }} />
			</>
		),
		okType: "success",
		cancelText: "Bekor qilish",
		centered: true,
		onOk() {
			action(id)
		},
		onCancel() {},
		width: 400,
		style: {
			textAlign: "left",
			padding: "24px",
			borderRadius: "var(--radius-lg)",
		},
		bodyStyle: {
			display: "flex",
			justifyContent: "center",
		},
		className: mode ? "dark" : null,
	})
}
