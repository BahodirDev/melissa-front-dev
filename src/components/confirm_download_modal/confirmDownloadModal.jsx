import { Modal } from "antd"
const { confirm } = Modal

export const confirmDownloadModal = (action, id) => {
	confirm({
		icon: " ",
		title: <span>Hisobotni yuklab olishni xohlaysizmi?</span>,
		content: "",
		okText: "Yuklab olish",
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
				borderColor: "var(--bg-success)",
			},
		},
	})
}
