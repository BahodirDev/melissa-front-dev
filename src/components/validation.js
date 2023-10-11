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

export { validation, stringCheck, numberCheck }
