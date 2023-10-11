import noDataImg from "../../assets/img/no data.png"
import "./no data.css"

const NoData = () => {
	return (
		<div className="no-data-wrapper">
			<img src={noDataImg} alt="no-data-image" />
			<h4>Ma'lumot topilmadi</h4>
		</div>
	)
}

export default NoData
