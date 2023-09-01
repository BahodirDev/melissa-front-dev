import { Modal } from "antd"
import "./error_modal.css"

export const error_modal = (xabar, msg, toggle, setToggle) => {
	return (
		<Modal
			style={{textAlign: 'center'}}
			centered
			open={toggle}
			onOk={() => setToggle(false)}
			onCancel={() => setToggle(false)}
			width={400}
			footer={[]}
			closable={false}
		>
			<h4>{xabar}</h4>
			<p>{msg}</p>
			<button className="btn btn-melissa px-5" onClick={() => setToggle(false)}>OK</button>
		</Modal>
	)
}
