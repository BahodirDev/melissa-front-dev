const format_phone_number = (x) => {
	// return x.replace(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/, "+$1 ($2) $3-$4-$5")
	return x.replace(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/, "($2) $3 $4 $5")
}
export default format_phone_number
