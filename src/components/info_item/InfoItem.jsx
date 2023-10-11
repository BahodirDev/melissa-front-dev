const InfoItem = ({ value, name, icon, iconBgColor }) => {
	return (
		<div className="info-item">
			<div>
				<h3>{value > 0 ? value : 0}</h3>
				<h4>{name}</h4>
			</div>
			<div>
				<span style={{ backgroundColor: iconBgColor }}>{icon}</span>
			</div>
		</div>
	)
}

export default InfoItem
