import axios from "axios"

const apiRequest = async (method, endpoint, data) => {
	try {
		const response = await axios({
			method,
			url: `${process.env.REACT_APP_URL + endpoint}`,
			data,
		})
		return response
	} catch (error) {
		// throw error
		return error
	}
}

export const get = (endpoint) => apiRequest("GET", endpoint)
export const post = (endpoint, data) => apiRequest("POST", endpoint, data)
export const patch = (endpoint, data) => apiRequest("PATCH", endpoint, data)
export const put = (endpoint, data) => apiRequest("PUT", endpoint, data)
export const remove = (endpoint) => apiRequest("DELETE", endpoint)
