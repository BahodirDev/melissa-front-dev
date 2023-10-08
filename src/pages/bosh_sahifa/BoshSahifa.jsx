import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

export default function BoshSahifa() {
	const navigate = useNavigate()

	useEffect(() => {
		navigate("/reports")
	}, [])

	return <></>
}
