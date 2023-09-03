import axios from "axios"
import { useCallback } from "react"
import { useNavigate } from "react-router-dom"

const useApiRequest = () => {
	const history = useNavigate()

	const makeRequest = useCallback(
		async (method, url, body = null, headers = {}) => {
			try {
				const config = {
					method,
					url,
					headers,
					data: body,
				}

				const response = await axios(config)
				return response.data
			} catch (error) {
				if (error?.response?.data?.status == 401) {
					localStorage.clear()
					history("/login")
					// window.location.reload(false)
				}
				// console.log(error)
				return error
			}
		},
		[]
	)

	return makeRequest
}
export default useApiRequest
