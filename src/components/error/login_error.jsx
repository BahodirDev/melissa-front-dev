import "./modal.css"

export default function login_error(xabar, msg, close) {
	return (
		<div className="modalWrapper">
			<div className="errorModal">
				<h1>{xabar}</h1>
				<h4>{msg}</h4>
				<button
					className="btn btn-primary modal-btn"
					onClick={() => close(false)}
				>
					OK
				</button>
			</div>
		</div>
	)
}
