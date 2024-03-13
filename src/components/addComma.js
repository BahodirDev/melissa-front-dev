export function addComma(num) {
	let strNum = (+num).toFixed(2)
	var str = strNum.toString().split(".")
	if (str[0].length >= 5) {
		str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, "$1,")
	}
	if (str[1] && str[1].length >= 5) {
		str[1] = str[1].replace(/(\d{3})/g, "$1 ")
	}
	return str.join(".")
}

export function addSpace(num) {
	let strNum = +num
	var str = strNum.toString().split(".")
	if (str[0].length >= 5) {
		str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, "$1,")
	}
	if (str[1] && str[1].length >= 5) {
		str[1] = str[1].replace(/(\d{3})/g, "$1 ")
	}
	return str.join(".") + " so'm"
}

export function roundToNearestThousand(number) {
	const remainder = number % 1000
	return number - remainder + (remainder > 500 ? 1000 : 0)
}

export function formatSumma(number) {
	if (number >= 1000000) {
		return (number / 1000000).toFixed(1) + " mln"
	} else if (number >= 1000) {
		return (number / 1000).toFixed(number % 1000 !== 0 ? 1 : 0) + " ming"
	} else {
		return number.toString()
	}
}
