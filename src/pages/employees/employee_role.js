export const employee_role = (role) => {
	switch (role) {
		case '1':
			return "Admin"

		case '2':
			return "Sotuvchi"

		case '3':
			return "Kassir"

		default:
			return "..."
	}
}
