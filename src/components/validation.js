const validation = (show, text) => {
	return show && text
}

const stringCheck = (string, msg = "") => {
	if (!string) {
		return msg
	} else {
		return null
	}
}

const numberCheck = (number) => {
	if (!number) {
		return "Qiymat kiritish majburiy"
	} else if (number <= 0 || isNaN(number * 1)) {
		return "Noto'g'ri qiymat"
	} else {
		return null
	}
}

const phoneNumberCheck = (number) => {
	if (!number) return "Raqam kiritish majburiy"
	else if (number.slice(-1) === "_") return "Noto'g'ri raqam"
	else return null
}

const passwordCheck = (password, name = "") => {
	if (!password) return `${name} kiritish majburiy`
	else if (password.length < 6)
		if (name === "Parol") return "Kuchsiz parol"
		else return "Kamida 6ta harf yoki belgi kiritish shart"
	else return null
}

export { validation, stringCheck, numberCheck, phoneNumberCheck, passwordCheck }
