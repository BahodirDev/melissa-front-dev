import { Input, Modal } from "antd"
import { addComma } from "../addComma"
const { confirm } = Modal

export const payModal = (e, action, id, max, value, name, mode = false) => {
	const rect = e.target.getBoundingClientRect()

	confirm({
		icon: " ",
		title: (
			<>
				<div className={`input-wrapper pay-modal ${mode ? "dark" : null}`}>
					<label>
						{name}: {max}
					</label>
					<Input
						type="text"
						placeholder={max}
						id="pay-modal-input"
						onInput={(e) => {
							const maxValue = parseFloat(max.replace(/[^\d]/g, ""))
							const inputElement = e.target
							const inputValue = (inputElement.value =
								inputElement.value.replace(/[^\d]/g, ""))
							if (inputValue > maxValue) {
								inputElement.value = maxValue.toString()
							}
						}}
					/>
				</div>
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
		className: mode ? "dark" : null,
	})
}

export const subtractModal = (e, action, max, id, store, price, mode) => {
	const rect = e.target.getBoundingClientRect()

	confirm({
		icon: " ",
		title: (
			<>
				<div className={`input-wrapper pay-modal ${mode ? "dark" : ""}`}>
					<label>nomini keyin uylab topamiz ishlateli oldin</label>
					<Input
						type="text"
						placeholder={max}
						id="pay-modal-input"
						onInput={(e) => {
							let input = document.getElementById("pay-modal-input")
							input.value = e.target.value <= max ? e.target.value : max
						}}
					/>
				</div>
			</>
		),
		okText: "Saqlash",
		okType: "success",
		cancelText: "Bekor qilish",
		width: 300,
		onOk() {
			action(id, document.querySelector("#pay-modal-input").value, store, price)
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
		className: mode ? "dark" : null,
	})
}
