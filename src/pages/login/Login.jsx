import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import login_img from "../../assets/img/login.png"
import { post } from "../../customHook/api"
import "./login.css"
import { toast } from "react-toastify"

export default function Login() {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [showPassword, setShowPassword] = useState(false)
	const [loading, setLoading] = useState(false)
	const [modalMsg, setModalMsg] = useState({})
	const history = useNavigate()

	useEffect(() => {
		if (localStorage.getItem("user")) {
			history("/")
		}
	}, [])

	const checkIsTrue = () => username.length > 0 && password.length > 0

	const sign_in = (e) => {
		e.preventDefault()
		setLoading(true)

		const data = {
			user_login: username,
			user_password: password,
		}

		post("/auth/auth-user", data).then((data) => {
			if (data?.status === 200) {
				localStorage.setItem("user", data?.data?.token)
				localStorage.setItem("role", data?.data?.user?.user_role)
				localStorage.setItem("name", data?.data?.user?.user_name)
				localStorage.setItem("id", data?.data?.user?.user_id)
				window.location.reload(false)
			} else if (data?.response?.data?.error === "USER_PASSWORD_NOTCORRECT") {
				toast.error("Login yoki parol noto'g'ri")
			} else if (data?.response?.data?.error === "USER_NOT_FOUND") {
				toast.error("Foydalanuvchi topilmadi")
			} else {
				toast.error("Nomalum server xatolik")
			}
			setLoading(false)
		})
	}

	return (
		<div className="login-wrapper">
			{/* left */}
			<div className="login-left">
				<h1>Melissa Kids</h1>
				<img src={login_img} alt="login_image" />
			</div>

			{/* right */}
			<div className="login-right">
				<form className="login-form" onSubmit={sign_in}>
					<div>
						<h2>Tizimga kirish</h2>
						<h4>Tizimga kirish uchun Login va Parolni tering.</h4>
					</div>

					<div className="input-wrapper">
						<label>Log in</label>
						<input
							type="text"
							placeholder="Loginingizni kiriting"
							required
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>

					<div className="input-wrapper password-input">
						<label>Parol</label>
						<input
							type={showPassword ? "text" : "password"}
							placeholder="Parolingizni kiriting"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						{showPassword ? (
							<svg
								onClick={() => setShowPassword((prev) => !prev)}
								width="18"
								height="16"
								viewBox="0 0 22 14"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M20.96 5.39994C17 -0.12006 9.2 -1.44006 3.68 2.63994C2.24 3.71994 1.04 5.15994 0.0800018 6.71994C0.320002 7.19994 0.680002 7.67994 1.04 8.15994C5 13.6799 12.56 14.8799 18.08 11.0399C19.16 10.1999 20.12 9.35994 20.96 8.15994C21.32 7.67994 21.56 7.19994 21.92 6.71994C21.56 6.23994 21.32 5.75994 20.96 5.39994ZM11.12 2.63994C11.72 2.03994 12.68 2.03994 13.28 2.63994C13.88 3.23994 13.88 4.19994 13.28 4.79994C12.68 5.39994 11.72 5.39994 11.12 4.79994C10.52 4.19994 10.52 3.23994 11.12 2.63994ZM11 11.8799C7.28 11.8799 3.8 9.95994 1.76 6.83994C3.2 4.79994 5.12 3.35994 7.4 2.63994C6.56 3.59994 6.2 4.67994 6.2 5.87994C6.2 8.51994 8.24 10.7999 11 10.7999C13.64 10.7999 15.92 8.75994 15.92 5.99994V5.87994C15.92 4.67994 15.44 3.47994 14.6 2.63994C16.88 3.35994 18.8 4.79994 20.24 6.83994C18.2 9.95994 14.72 11.8799 11 11.8799Z"
									fill="var(--color-secondary)"
								/>
							</svg>
						) : (
							<svg
								onClick={() =>
									password.length && setShowPassword((prev) => !prev)
								}
								width="18"
								height="16"
								viewBox="0 0 22 19"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M19.76 0.959976C19.28 0.479976 18.44 0.479976 17.84 0.959976L14.96 3.83998C13.64 3.35998 12.32 3.11998 11 3.11998C6.44 3.23998 2.36 5.63998 0.199997 9.59998C0.439997 10.08 0.799997 10.56 1.16 11.04C2.12 12.36 3.32 13.44 4.64 14.28L2.6 16.32C2.12 16.8 2 17.64 2.6 18.24C3.08 18.72 3.92 18.84 4.52 18.24L19.76 2.87998C20.24 2.27998 20.24 1.43998 19.76 0.959976ZM7.04 11.76L5.48 13.32C4.04 12.48 2.72 11.28 1.76 9.83998C3.2 7.79998 5.12 6.35998 7.4 5.63998C5.84 7.31998 5.72 9.95998 7.04 11.76ZM11.12 7.79998C10.52 7.19998 10.64 6.23998 11.24 5.63998C11.84 5.15998 12.68 5.15998 13.28 5.63998L11.12 7.79998ZM20.96 8.39998C20.36 7.55998 19.64 6.71998 18.8 6.11998L17.6 7.31998C18.56 8.03998 19.4 8.87998 20.12 9.95998C18.08 13.08 14.6 15 10.88 15H9.92L8.72 16.2C9.56 16.08 10.28 16.2 11 16.2C14.96 16.2 18.68 14.28 20.96 11.04C21.32 10.56 21.56 10.08 21.92 9.59998C21.56 9.23998 21.32 8.75998 20.96 8.39998ZM15.8 8.99998L11 13.8C13.64 13.8 15.8 11.64 15.8 8.99998Z"
									fill="var(--color-modal-placeholder)"
								/>
							</svg>
						)}
					</div>

					{/* <div className="save-check">
						<input id="save" onChange={() => setSave(!save)} type="checkbox" />
						<label htmlFor="save" style={{ color: save && "#000" }}>
							Saqlash
						</label>
					</div> */}

					<button className="login-btn" disabled={loading}>
						Kirish{" "}
						{loading && (
							<span
								className="spinner-grow spinner-grow-sm"
								role="status"
								aria-hidden="true"
								style={{ marginLeft: "5px" }}
							></span>
						)}
					</button>
				</form>
			</div>
		</div>
	)
}
