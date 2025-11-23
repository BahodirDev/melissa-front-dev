import user_image from "../../assets/img/user.jpg";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { log_out } from "../log_out/delete_modal";
import "./sidebar.css";
import {
  ChartBar,
  Cube,
  CurrencyDollar,
  FileText,
  HandCoins,
  Recycle,
  SecurityCamera,
  SignOut,
  SquaresFour,
  Truck,
  Users,
  UsersFour,
  Warehouse,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";

export default function Sidebar({
  setSidebar,
  sidebar,
  userInfo,
  activeSectionIndex,
  darkMode,
}) {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(0);
  const url = useLocation();

  useEffect(() => {
    setUserRole(JSON.parse(localStorage.getItem("role")));
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        switch (activeSectionIndex) {
          case 0:
            navigate("/");
            break;
          case 1:
            navigate("/reports");
            break;
          case 2:
            navigate("/products");
            break;
          case 3:
            navigate("/goods");
            break;
          case 4:
            navigate("/return");
            break;
          case 5:
            navigate("/debts");
            break;
          case 6:
            navigate("/store");
            break;
          case 7:
            navigate("/deliver");
            break;
          case 8:
            navigate("/clients");
            break;
          case 9:
            navigate("/monitoring");
            break;
          case 10:
            navigate("/employees");
            break;
          case 11:
            navigate("/currency");
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [activeSectionIndex]);

  return (
    <div className={`sidebar ${darkMode ? "dark" : null}`}>
      <div className="sicon">
        <h1 type="button" onClick={() => setSidebar((prev) => !prev)}>
          Melissa Kids
        </h1>
      </div>

      {/* links */}
      <ul>
        {userRole === 1 && (
          <li>
            <NavLink
              to="/"
              className={`${
                activeSectionIndex === 0 && url.pathname !== "/"
                  ? "tabFocus"
                  : null
              }`}
            >
              <ChartBar size={24} /> Statistika
            </NavLink>
          </li>
        )}
        {userRole === 1 && (
          <li>
            <NavLink
              to="/reports"
              className={`${
                activeSectionIndex === 1 && url.pathname !== "/reports"
                  ? "tabFocus"
                  : null
              }`}
            >
              <FileText size={24} /> Hisobot
            </NavLink>
          </li>
        )}
        <li>
          <NavLink
            to="/products"
            className={`${
              activeSectionIndex === 2 && url.pathname !== "/products"
                ? "tabFocus"
                : null
            }`}
          >
            <Cube size={24} /> Mahsulotlar
          </NavLink>
        </li>
        {userRole === 1 && (
          <li>
            <NavLink
              to="/goods"
              className={`${
                activeSectionIndex === 3 && url.pathname !== "/goods"
                  ? "tabFocus"
                  : null
              }`}
            >
              <SquaresFour size={24} /> Kategoriyalar
            </NavLink>
          </li>
        )}
        {userRole === 1 && (
          <li>
            <NavLink
              to="/return"
              className={`${
                activeSectionIndex === 4 && url.pathname !== "/return"
                  ? "tabFocus"
                  : null
              }`}
            >
              <Recycle size={24} /> Qaytgan mahsulotlar
            </NavLink>
          </li>
        )}
        {userRole === 1 && (
          <li>
            <NavLink
              to="/debts"
              className={`${
                activeSectionIndex === 5 && url.pathname !== "/debts"
                  ? "tabFocus"
                  : null
              }`}
            >
              <HandCoins size={24} /> Moliya
            </NavLink>
          </li>
        )}
        {userRole === 1 && (
          <li>
            <NavLink
              to="/store"
              className={`${
                activeSectionIndex === 6 && url.pathname !== "/store"
                  ? "tabFocus"
                  : null
              }`}
            >
              <Warehouse size={24} /> Omborlar
            </NavLink>
          </li>
        )}
        {userRole === 1 && (
          <li>
            <NavLink
              to="/deliver"
              className={`${
                activeSectionIndex === 7 && url.pathname !== "/deliver"
                  ? "tabFocus"
                  : null
              }`}
            >
              <Truck size={24} /> Ta'minotchilar
            </NavLink>
          </li>
        )}
        <li>
          <NavLink
            to="/clients"
            className={`${
              activeSectionIndex === 8 && !url.pathname.startsWith("/clients")
                ? "tabFocus"
                : null
            }`}
          >
            <UsersFour size={24} /> Mijozlar
          </NavLink>
        </li>
        {/* <li>
					<NavLink
						to="/monitoring"
						className={`${
							activeSectionIndex === 9 && url.pathname !== "/monitoring"
								? "tabFocus"
								: null
						}`}
					>
						<SecurityCamera size={24} style={{transform: 'rotateY(180deg)'}} /> Monitoring
					</NavLink>
				</li> */}
        {userRole === 1 && (
          <li>
            <NavLink
              to="/employees"
              className={`${
                activeSectionIndex === 10 && url.pathname !== "/employees"
                  ? "tabFocus"
                  : null
              }`}
            >
              <Users size={24} /> Xodimlar
            </NavLink>
          </li>
        )}
        {userRole === 1 && (
          <li>
            <NavLink
              to="/employee-performance"
              className={`${
                activeSectionIndex === 12 &&
                url.pathname !== "/employee-performance"
                  ? "tabFocus"
                  : null
              }`}
            >
              <Users size={24} /> Xodimlar ishlashi
            </NavLink>
          </li>
        )}
        {userRole === 1 && (
          <li>
            <NavLink
              to="/currency"
              className={`${
                activeSectionIndex === 11 && url.pathname !== "/currency"
                  ? "tabFocus"
                  : null
              }`}
            >
              <CurrencyDollar size={24} /> Pul birliklari
            </NavLink>
          </li>
        )}
        {/* <li>
					<NavLink to="/settings">
						<i className="fa-solid fa-gear"></i>
					</NavLink>
				</li> */}
      </ul>
    </div>
  );
}
