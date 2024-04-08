import "./loader.css"
import { useOutletContext } from "react-router-dom"

export default function Loader() {
	const [
		inputRef,
		showDropdown,
		setshowDropdown,
		addModalVisible,
		setAddModalVisible,
		addModalDisplay,
		setAddModalDisplay,
		miniModal,
		setMiniModal,
		sidebar,
		userInfo,
		darkMode,
	] = useOutletContext()

	return (
		<div className={`loader ${darkMode ? "dark" : null}`}>
			<div className="loaderBar"></div>
		</div>
	)
}
