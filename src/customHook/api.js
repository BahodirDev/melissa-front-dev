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

export const downloadExcelFile = async (data) => {
	const fileUrl = `${process.env.REACT_APP_URL}reports/reports-file-download`

	axios({
		url: fileUrl,
		method: "POST",
		responseType: "blob",
		data: { data },
	})
		.then((response) => {
			const url = window.URL.createObjectURL(new Blob([response.data]))
			const link = document.createElement("a")
			link.href = url

			const now = new Date()
			const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1)
				.toString()
				.padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`
			const formattedTime = `${now.getHours().toString().padStart(2, "0")}-${now
				.getMinutes()
				.toString()
				.padStart(2, "0")}-${now.getSeconds().toString().padStart(2, "0")}`

			link.setAttribute("download", `${formattedDate}_${formattedTime}.xlsx`)
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
		})
		.catch((error) => {
			console.error("There was a problem with your Axios request:", error)
		})
}

export const get = (endpoint) => apiRequest("GET", endpoint)
export const post = (endpoint, data) => apiRequest("POST", endpoint, data)
export const patch = (endpoint, data) => apiRequest("PATCH", endpoint, data)
export const put = (endpoint, data) => apiRequest("PUT", endpoint, data)
export const remove = (endpoint) => apiRequest("DELETE", endpoint)
