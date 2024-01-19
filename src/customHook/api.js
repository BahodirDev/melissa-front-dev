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

export const get = (endpoint) => apiRequest("GET", endpoint)
export const post = (endpoint, data) => apiRequest("POST", endpoint, data)
export const patch = (endpoint, data) => apiRequest("PATCH", endpoint, data)
export const put = (endpoint, data) => apiRequest("PUT", endpoint, data)
export const remove = (endpoint) => apiRequest("DELETE", endpoint)
