import axios from "axios"
import { toast } from "react-toastify"

const apiRequest = async (method, endpoint, data) => {
	try {
		// Remove leading slash from endpoint if present, and ensure base URL doesn't have trailing slash
		const baseUrl = (process.env.REACT_APP_URL || '').replace(/\/+$/, '');
		const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
		const url = `${baseUrl}${cleanEndpoint}`;
		
		const response = await axios({
			method,
			url,
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

export const downloadMultipleFiles = (data) => {
	axios
		.post(
			`/products/products-file`,
			{
				data,
			},
			{
				responseType: "blob",
			}
		)
		.then((response) => {
			if (response.status === 200 || 201) {
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
				const formattedTime = `${now
					.getHours()
					.toString()
					.padStart(2, "0")}-${now
					.getMinutes()
					.toString()
					.padStart(2, "0")}-${now.getSeconds().toString().padStart(2, "0")}`
				a.download = `Royxat ${formattedDate}_${formattedTime}.pdf`
				a.click()
				window.URL.revokeObjectURL(url)
			} else {
				toast.error("Nomalum server xatolik")
			}
		})
		.catch((error) => {
			toast.error("Nomalum server xatolik")
		})
}

export const downloadFile = async (id) => {
	try {
		const response = await axios.get(`/products/products-sale-file/${id}`, {
			responseType: "blob",
		})
		if (response.status === 200 || response?.status === 201) {
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
			a.download = `Royxat ${formattedDate}_${formattedTime}.pdf`
			a.click()
			window.URL.revokeObjectURL(url)
		} else {
			toast.error("Nomalum server xatolik")
		}
	} catch (error) {
		toast.error("Nomalum server xatolik")
	}
}

export const downloadExcelFile = async (data, setLoading) => {
	try {
		const fileUrl = `${process.env.REACT_APP_URL}reports/reports-file-download`

		const response = await axios.post(
			fileUrl,
			{ data },
			{ responseType: "blob" }
		)

		if (response.status === 200 || response?.status === 201) {
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

			link.setAttribute(
				"download",
				`Hisobot ${formattedDate}_${formattedTime}.xlsx`
			)
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
		} else {
			toast.error("Nomalum server xatolik")
		}
		setLoading(false)
	} catch (error) {
		toast.error("Nomalum server xatolik")
		setLoading(false)
	}
}

export const downloadNewList = (arr) => {
	axios
		.post(
			`/products/get-pdf`,
			{ data: arr },
			{
				responseType: "blob",
			}
		)
		.then((response) => {
			if (response.status === 200 || 201) {
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
				const formattedTime = `${now
					.getHours()
					.toString()
					.padStart(2, "0")}-${now
					.getMinutes()
					.toString()
					.padStart(2, "0")}-${now.getSeconds().toString().padStart(2, "0")}`
				a.download = `Royxat ${formattedDate}_${formattedTime}.pdf`
				a.click()
				window.URL.revokeObjectURL(url)
			} else {
				toast.error("Nomalum server xatolik")
			}
		})
		.catch((error) => {
			toast.error("Nomalum server xatolik")
		})
}

export const get = (endpoint) => apiRequest("GET", endpoint)
export const post = (endpoint, data) => apiRequest("POST", endpoint, data)
export const patch = (endpoint, data) => apiRequest("PATCH", endpoint, data)
export const put = (endpoint, data) => apiRequest("PUT", endpoint, data)
export const remove = (endpoint) => apiRequest("DELETE", endpoint)
