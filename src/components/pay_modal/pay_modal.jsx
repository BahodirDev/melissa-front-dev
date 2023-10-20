import { Input, Modal } from "antd"
import { addComma } from "../addComma"
const { confirm } = Modal

export const payModal = (e, action, id, max, value, name) => {
	const rect = e.target.getBoundingClientRect()

	confirm({
		icon: " ",
		title: (
			<>
				<span style={{ float: "left" }}>
					{name}: {max}
				</span>
				<Input
					type="text"
					// placeholder={
					// 	addComma(parseFloat(max.replace(/[^\d.]/g, "")))
					// }
					placeholder={max}
					id="pay-modal-input"
					pattern="[0-9]*"
					onInput={(e) => {
						const maxValue = parseFloat(max.replace(/[^\d.]/g, ""))
						const inputValue = e.target.value.replace(/,/g, "")
						if (inputValue > maxValue) {
							e.target.value = maxValue.toLocaleString("en-US")
						}
						if (/[^0-9.]/.test(inputValue.slice(-1))) {
							e.target.value = e.target.value.slice(0, -1)
						}
					}}
				/>
			</>
		),
		okText: "Kiritish",
		okType: "success",
		cancelText: "Bekor qilish",
		width: 300,
		onOk() {
			action(id, document.querySelector("#pay-modal-input").value, value)
		},
		onCancel() {},
		width: 350,
		style: {
			position: "absolute",
			top: rect.top - 170,
			left: rect.right - 350,
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
				backgroundColor: "var(--bg-success)",
				color: "var(--color-light)",
			},
		},
	})
}
