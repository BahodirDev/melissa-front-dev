import axios from "axios"
import { toast } from "react-toastify"

const apiRequest = async (method, endpoint, data) => {
	try {
		const response = await axios({
			method,
			url: `${process.env.REACT_APP_URL + endpoint}`,
			data,
		})
		if (response?.status === 400 || response?.status === 403) {
			toast.error(data?.message, { toastId: "" })
		}
		return response
	} catch (error) {
		// throw error
		return error
	}
}

export const downloadFile = (id) => {
	axios
		.get(`/products/products-sale-file/${id}`, { responseType: "blob" })
		.then((response) => {
			const blob = new Blob([response.data], {
				type: response.headers["content-type"],
			})
			const url = window.URL.createObjectURL(blob)
			const a = document.createElement("a")
			a.href = url
			a.download = "Hisobot.pdf"
			a.click()
			window.URL.revokeObjectURL(url)
		})
}

export const downloadExcelFile = (data) => {
	axios
		.post(`/reports/reports-file-download/`, { responseType: "blob", data })
		.then((response) => {
			if (response?.status === 500) {
				toast.error("Fayl yuklashda xatolik")
				return
			}
			const blob = new Blob([response.data], {
				type: response.headers["content-type"],
			})
			const url = window.URL.createObjectURL(blob)
			const a = document.createElement("a")
			a.href = url
			const now = new Date()
			const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1)
				.toString()
				.padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`
			const formattedTime = `${now.getHours().toString().padStart(2, "0")}-${now
				.getMinutes()
				.toString()
				.padStart(2, "0")}-${now.getSeconds().toString().padStart(2, "0")}`
			a.download = `${formattedDate}_${formattedTime}.xlsx`
			a.click()
			window.URL.revokeObjectURL(url)
		})
}

export const get = (endpoint) => apiRequest("GET", endpoint)
export const post = (endpoint, data) => apiRequest("POST", endpoint, data)
export const patch = (endpoint, data) => apiRequest("PATCH", endpoint, data)
export const put = (endpoint, data) => apiRequest("PUT", endpoint, data)
export const remove = (endpoint) => apiRequest("DELETE", endpoint)
