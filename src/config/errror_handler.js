export default function getError(Enum) {
	switch (Enum) {
		case "USER_NOT_FOUND":
			return "Foydalanuvchi topilmadi"

		case "VALIDATION_ERROR_USER_LOGIN_LENGTH":
			return "Foydalanuvchi nomi 20ta harfdan kichik bo'lishi shart"

		case "VALIDATION_ERROR_USER_PASSWORD_REQUIRED":
			return "Parol kiritish majburiy"

		case "VALIDATION_ERROR_USER_LOGIN_REQUIRED":
			return "Foydalanuvchi nomini kiritish majburiy"

		case "VALIDATION_ERROR_USER_PASSWORD_LENGTH":
			return "Parol uzunligi 20ta harfdan kichik bo'lishi shart"

		case "USER_PASSWORD_NOTCORRECT":
			return "Login yoki parol noto'g'ri"

		case "PRODUCT_FOUND":
			return "Maxsulot borligi sababli o'chirib bo'lmadi"

		case "product_deleted_successfully":
			return "Mahsulot muvoffaqiyatli o'chirildi"

		case "product_added_successfully":
			return "Mahsulot muvoffaqiyatli qo'shildi"

		case "GOODS_ALREADY_EXIST":
			return "Mahsulotdan omborda borligi uchun o'chirib bo'lmadi"

		case "GOOD_SUCCESSFULLY_ADDED":
			return "Kategoriya muvoffaqiyatli qo'shildi"
		
		case "GOOD_SUCCESSFULLY_DELETED":
			return "Kategoriya muvoffaqiyatli o'chirildi"

		default:
			return "..."
	}
}
