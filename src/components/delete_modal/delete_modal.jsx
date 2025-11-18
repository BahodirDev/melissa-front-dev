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
	currency,
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
			action(id, type, status, summa, currency)
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

export const debtDeleteConfirm = (e, name, amount, action, mode = false) => {
	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("uz-UZ", {
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount);
	};

	const rect = e?.target?.getBoundingClientRect();

	confirm({
		title: (
			<span className="delete-modal-span">
				"{name}" uchun {formatCurrency(amount)} so'm qarzni o'chirishni tasdiqlaysizmi?
			</span>
		),
		icon: " ",
		okText: "Ha, o'chirish",
		okType: "danger",
		cancelText: "Bekor qilish",
		width: 400,
		onOk() {
			action();
		},
		onCancel() {},
		style: rect
			? {
					position: "absolute",
					top: rect.top - 170,
					left: rect.right - 400,
					textAlign: "center",
					padding: 0,
					borderRadius: "var(--radius-lg)",
			  }
			: {
					top: "50%",
					transform: "translateY(-50%)",
					textAlign: "center",
					padding: 0,
					borderRadius: "var(--radius-lg)",
			  },
		bodyStyle: {
			display: "flex",
			justifyContent: "center",
		},
		className: mode ? "dark" : null,
	});
};