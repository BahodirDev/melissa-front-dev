import { Button, DatePicker, Select, Space } from "antd"
import {
	ArcElement,
	BarElement,
	CategoryScale,
	Chart as ChartJs,
	Filler,
	Legend,
	LineElement,
	LinearScale,
	PointElement,
	Tooltip,
} from "chart.js"
import { useState } from "react"
import { Bar, Doughnut, Line } from "react-chartjs-2"
import { formatSumma } from "../../components/addComma"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

import "./home.css"

ChartJs.register(
	BarElement,
	CategoryScale,
	LinearScale,
	Tooltip,
	Legend,
	ArcElement,
	PointElement,
	LineElement,
	Filler
)

export default function Home() {
	const navigate = useNavigate()

	useEffect(() => {
		if (localStorage.getItem("role") !== "1") navigate("/products")
	}, [])

	return <></>
}
