import { Input, Modal } from "antd"
import { addComma } from "../addComma"
const { confirm } = Modal

export const payModal = (e, action, id, max) => {
	const rect = e.target.getBoundingClientRect()

	confirm({
		icon: <></>,
		title: (
			<>
				<Input
					type="text"
					placeholder={addComma(parseFloat(max.replace(/[^\d.]/g, "")))}
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
		okText: "Saqlash",
		okType: "danger",
		cancelText: "Bekor qilish",
		width: 300,
		onOk() {
			action(id, document.querySelector("#pay-modal-input").value)
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
