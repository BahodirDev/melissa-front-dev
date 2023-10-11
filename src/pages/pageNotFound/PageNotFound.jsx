import { Link, useNavigate } from "react-router-dom"
import not_found from "../../assets/img/404.png"
import "./page not found.css"

export default function PageNotFound() {
	const navigate = useNavigate()

	return (
		<div className="not-found-wrapper">
			<h1>Melissa Kids</h1>

			{/* left */}
			<div className="not-found-lar">
				<div className="not-found-left">
					<div className="not-found-info">
						<h2><nobr>Sahifa topilmadi</nobr></h2>
						<h4><nobr>Siz izlayotgan sahifa topilmadi</nobr></h4>
						<div>
							<Link to="/" className="primary-btn">
								Asosiy sahifaga qaytish
							</Link>
							<button className="secondary-btn" onClick={() => navigate(-1)}>
								Orta qaytish
							</button>
						</div>
					</div>
				</div>

				{/* right */}
				<div className="not-found-right">
					<img src={not_found} alt="404-not-found-image" />
				</div>
			</div>
		</div>
	)
}
