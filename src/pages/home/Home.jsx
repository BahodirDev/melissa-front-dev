import { Button, DatePicker, Select, Space } from "antd"
import { Option } from "antd/es/mentions"
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
	const data = {
		labels: ["Mon", "Tue", "Wed"],
		datasets: [
			{
				label: "Data",
				data: [1, 4, 3],
				backgroundColor: ["aqua", "blue", "darkblue"],
				borderColor: "black",
				borderWidth: 1,
			},
		],
	}

	const [dataTopProduct, setDataTopProduct] = useState({
		labels: ["Dush", "Sesh", "Chor", "Pay", "Jum", "Sha", "Yak"],
		datasets: [
			{
				label: "Mahsulot 1",
				data: [4, 6, 1, 7, 9, 4, 3],
				cubicInterpolationMode: "monotone",
				borderWidth: 2,
				fill: true,
				pointBorderWidth: 1,
				borderColor: "rgb(65, 32, 169)",
				pointBackgroundColor: "rgb(65, 32, 169)",
				backgroundColor: "rgba(65, 32, 169, 0.2)",
			},
			{
				label: "Mahsulot 2",
				data: [2, 3, 1, 5, 7, 5, 4],
				cubicInterpolationMode: "monotone",
				borderWidth: 2,
				fill: true,
				pointBorderWidth: 1,
				borderColor: "rgb(92, 175, 252)",
				pointBackgroundColor: "rgb(92, 175, 252)",
				backgroundColor: "rgba(92, 175, 252, 0.2)",
			},
			{
				label: "Mahsulot 3",
				data: [7, 8, 3, 4, 6, 1, 4],
				cubicInterpolationMode: "monotone",
				borderWidth: 2,
				fill: true,
				pointBorderWidth: 1,
				borderColor: "rgb(235, 124, 166)",
				pointBackgroundColor: "rgb(235, 124, 166)",
				backgroundColor: "rgba(235, 124, 166, 0.2)",
			},
			{
				label: "Mahsulot 4",
				data: [1, 4, 3, 6, 2, 8, 9],
				cubicInterpolationMode: "monotone",
				borderWidth: 2,
				fill: true,
				pointBorderWidth: 1,
				borderColor: "rgb(255, 172, 200)",
				pointBackgroundColor: "rgb(255, 172, 200)",
				backgroundColor: "rgba(255, 172, 200, 0.2)",
			},
		],
	})
	const [dataStoreProduct, setDataStoreProduct] = useState({
		labels: ["Ombor 1", "Ombor 2", "Ombor 3", "Ombor 4", "Ombor 5"],
		datasets: [
			{
				label: "Mahsulotlar",
				data: [65, 59, 80, 81, 34],
				barThickness: 10,
				borderRadius: 8,
				backgroundColor: [
					"rgb(65, 32, 169)",
					"rgb(92, 175, 252)",
					"rgb(235, 124, 166)",
					"rgb(255, 172, 200)",
					"rgb(126, 37, 140)",
				],
				borderColor: [
					"rgb(65, 32, 169)",
					"rgb(92, 175, 252)",
					"rgb(235, 124, 166)",
					"rgb(255, 172, 200)",
					"rgb(126, 37, 140)",
				],
				borderWidth: 2,
			},
		],
	})
	const [dataCapital, setDataCapital] = useState({
		labels: ["Dush", "Sesh", "Chor", "Pay", "Jum", "Sha", "Yak"],
		datasets: [
			{
				label: "So'm",
				data: [
					4020500.5, 6020500.5, 1020500.5, 7020500.5, 9020500.5, 4020500.5,
					3020500.5,
				],
				cubicInterpolationMode: "monotone",
				borderWidth: 2,
				borderColor: "rgba(126, 37, 140, 1)",
				fill: true,
				backgroundColor: "rgba(126, 37, 140, .5)",
				pointBorderWidth: 1,
				pointBackgroundColor: "rgba(126, 37, 140, 1)",
			},
		],
	})
	const [dataBenefit, setDataBenefit] = useState({
		labels: ["Dush", "Sesh", "Chor", "Pay", "Jum", "Sha", "Yak"],
		datasets: [
			{
				label: "So'm",
				data: [
					4020500.5, 6020500.5, 1020500.5, 7020500.5, 9020500.5, 4020500.5,
					3020500.5,
				],
				cubicInterpolationMode: "monotone",
				borderWidth: 2,
				fill: true,
				pointBorderWidth: 1,
				borderColor: "rgb(65, 32, 169)",
				backgroundColor: "rgba(65, 32, 169, .5)",
				pointBackgroundColor: "rgb(65, 32, 169)",
			},
		],
	})
	const [debtClient, setDebtClient] = useState({
		labels: ["Alisher", "Jahongir", "Miron", "Doniyor"],
		datasets: [
			{
				label: "So'm",
				data: [65020000.5, 2000000.5, 40020000.5, 101020000.5],
				backgroundColor: [
					"rgb(65, 32, 169)",
					"rgb(92, 175, 252)",
					"rgb(235, 124, 166)",
					"rgb(255, 172, 200)",
				],
			},
		],
	})
	const [debtSupplier, setDebtSupplier] = useState({
		labels: ["Alisher", "Jahongir", "Miron", "Doniyor"],
		datasets: [
			{
				label: "So'm",
				data: [65020000.5, 29020000.5, 101020000.5, 46020000.5],
				backgroundColor: [
					"rgb(65, 32, 169)",
					"rgb(92, 175, 252)",
					"rgb(235, 124, 166)",
					"rgb(255, 172, 200)",
				],
			},
		],
	})

	const options = { cutout: "75%" }

	const textCenter = {
		id: "textCenter",
		beforeDatasetsDraw(chart, args, pluginOptions) {
			const { ctx, data } = chart
			let totalDebt = 0
			for (let i = 0; i < data.datasets[0].data.length; i++) {
				totalDebt += data.datasets[0].data[i]
			}

			ctx.save()
			ctx.font = "bolder 26px sans-serif"
			ctx.textAlign = "center"
			ctx.textBaseline = "middle"
			ctx.fillText(
				`${formatSumma(totalDebt)}`,
				chart.getDatasetMeta(0).data[0].x,
				chart.getDatasetMeta(0).data[0].y
			)
		},
	}

	return (
		<>
			<div className="stat-filter-form">
				<Select
					style={{ width: "200px" }}
					placeholder="Oraliq sana"
					optionLabelProp="label"
					// onChange={(e) => setClientId(e)}
					// value={clientId ? clientId : null}
					defaultValue="lastWeek"
				>
					<Select.Option value="lastWeek" label="Ohirgi hafta">
						Ohirgi hafta
					</Select.Option>
					<Select.Option value="lastMonth" label="Ohirgi oy">
						Ohirgi oy
					</Select.Option>
					<Select.Option value="last3Months" label="Ohirgi 3 oy">
						Ohirgi 3 oy
					</Select.Option>
					<Select.Option value="lastHalfYear" label="Ohirgi yaril yil">
						Ohirgi yarim yil
					</Select.Option>
				</Select>
				<Space direction="vertical" size={12} style={{ margin: "0 10px" }}>
					<DatePicker.RangePicker
						clearIcon={true}
						// disabled // if select selected disable
						// value={dateRange}
						// onChange={(e) => setDateRange(e)}
					/>
				</Space>
				<Button>Ko'rish</Button>
			</div>

			{/* charts */}
			<div className="stat-grid-wrapper">
				<div className="stat-col">
					<h5>Byudjet</h5>
					<div className="stat-item-wrapper">
						<Line
							data={dataCapital}
							options={options}
							className="stat-item stat-line"
						></Line>
					</div>
				</div>
				<div className="stat-col">
					<h5>Daromad</h5>
					<div className="stat-item-wrapper">
						<Line
							data={dataBenefit}
							options={options}
							className="stat-item stat-line"
						></Line>
					</div>
				</div>
				<div className="stat-col">
					<h5>Balans</h5>
					<div className="stat-item-wrapper stat-balance">
						<h6>
							{formatSumma(1200000000)} <span>so'm</span>
						</h6>
						<h5>Soft balans</h5>
						<h6>
							{formatSumma(1200000000)} <span>so'm</span>
						</h6>
					</div>
				</div>
				<div className="stat-col">
					<h5>Qarzdorlik - Ta'minotchi</h5>
					<div className="stat-item-wrapper">
						<Doughnut
							data={debtSupplier}
							options={options}
							plugins={[textCenter]}
							className="stat-item stat-pie"
						></Doughnut>
					</div>
				</div>
				<div className="stat-col">
					<h5>Qarzdorlik - Mijoz</h5>
					<div className="stat-item-wrapper">
						<Doughnut
							data={debtClient}
							options={options}
							plugins={[textCenter]}
							className="stat-item stat-pie"
						></Doughnut>
					</div>
				</div>
				<div className="stat-col">
					<h5>Eng ko'p sotilgan mahsulotlar</h5>
					<div className="stat-item-wrapper">
						<Line
							data={dataTopProduct}
							options={options}
							className="stat-item stat-line"
						></Line>
					</div>
				</div>
				<div className="stat-col">
					<h5>Eng yaxshi mijozlar</h5>
					<table className="stat-item stat-table">
						<thead>
							<tr>
								<td>Ism</td>
								<td>Tel</td>
								<td>Summa</td>
							</tr>
						</thead>
						{/* <div className="tBodyMargin"></div> */}
						<tbody>
							<tr>
								<td>Alisher</td>
								<td>+998 (99) 999-99-99</td>
								<td>24,000,000.00 so'm</td>
							</tr>
							<tr>
								<td>Alisher</td>
								<td>+998 (99) 999-99-99</td>
								<td>24,000,000.00 so'm</td>
							</tr>
							<tr>
								<td>Alisher</td>
								<td>+998 (99) 999-99-99</td>
								<td>24,000,000.00 so'm</td>
							</tr>
							<tr>
								<td>Alisher</td>
								<td>+998 (99) 999-99-99</td>
								<td>24,000,000.00 so'm</td>
							</tr>
							<tr>
								<td>Alisher</td>
								<td>+998 (99) 999-99-99</td>
								<td>24,000,000.00 so'm</td>
							</tr>
							<tr>
								<td>Alisher</td>
								<td>+998 (99) 999-99-99</td>
								<td>24,000,000.00 so'm</td>
							</tr>
						</tbody>
					</table>
					<hr />
					<h5>Eng yaxshi ta'minotchilar</h5>
					<table className="stat-item stat-table">
						<thead>
							<tr>
								<td>Ism</td>
								<td>Manzil</td>
								<td>Summa</td>
							</tr>
						</thead>
						{/* <div className="tBodyMargin"></div> */}
						<tbody>
							<tr>
								<td>Alisher</td>
								<td>Termiz</td>
								<td>24,000,000.00 so'm</td>
							</tr>
							<tr>
								<td>Alisher</td>
								<td>Termiz</td>
								<td>24,000,000.00 so'm</td>
							</tr>
							<tr>
								<td>Alisher</td>
								<td>Termiz</td>
								<td>24,000,000.00 so'm</td>
							</tr>
							<tr>
								<td>Alisher</td>
								<td>Termiz</td>
								<td>24,000,000.00 so'm</td>
							</tr>
							<tr>
								<td>Alisher</td>
								<td>Termiz</td>
								<td>24,000,000.00 so'm</td>
							</tr>
							<tr>
								<td>Alisher</td>
								<td>Termiz</td>
								<td>24,000,000.00 so'm</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div className="stat-col">
					<h5>Omborlar bo'yicha mahsulotlar</h5>
					<div className="stat-item-wrapper">
						<Bar
							data={dataStoreProduct}
							options={options}
							className="stat-item stat-line"
						></Bar>
					</div>
				</div>
			</div>
		</>
	)
}
