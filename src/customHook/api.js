import axios from "axios"

const apiRequest = async (method, endpoint, data) => {
	try {
		const response = await axios({ method, url: endpoint, data })
		return response.data
	} catch (error) {
		throw error
	}
}

export const get = (endpoint) => apiRequest("GET", endpoint)
export const patch = (endpoint, data) => apiRequest("PATCH", endpoint, data)
export const put = (endpoint, data) => apiRequest("PUT", endpoint, data)
export const remove = (endpoint) => apiRequest("DELETE", endpoint)
