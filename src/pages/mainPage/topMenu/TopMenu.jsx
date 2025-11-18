import React from "react";
import {
  ArrowLineLeft,
  ArrowLineRight,
  ChartBar,
  MoonStars,
  SignOut,
  SunDim,
} from "@phosphor-icons/react";
import { employee_role } from "../../employees/employee_role";
import { log_out } from "../../../components/log_out/delete_modal";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

export default function TopMenu({
  sidebar,
  setSidebar,
  darkMode,
  setDarkMode,
  userInfo,
  setInfoModal,
  user_image,
  infoModal,
}) {
  const navigate = useNavigate();
  const url = useLocation();

  // Navigation links configuration based on current pathname
  const navigationLinks = {
    "/home": {
      to: "/",
      label: "Qoldiq Statistikasi",
    },
    "/": {
      to: "/home",
      label: "Bosh sahifa",
    },
  };

  const currentLink = navigationLinks[url.pathname];

  return (
    <div className={`top-menu ${darkMode ? "dark" : null}`}>
      {sidebar ? (
        <ArrowLineLeft size={24} onClick={() => setSidebar(!sidebar)} />
      ) : (
        <ArrowLineRight size={24} onClick={() => setSidebar(!sidebar)} />
      )}
      {currentLink && (
        <div className="top-menu-links">
          <NavLink
            to={currentLink.to}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            {currentLink.label}
          </NavLink>
        </div>
      )}
      <div className="top-menu-right">
        {darkMode ? (
          <SunDim size={24} onClick={() => setDarkMode(!darkMode)} />
        ) : (
          <MoonStars size={24} onClick={() => setDarkMode(!darkMode)} />
        )}
        <div className="user-info" onClick={(e) => e.stopPropagation()}>
          <img
            src={user_image}
            alt="xodim-rasm"
            onClick={() => setInfoModal(!infoModal)}
          />
          {infoModal ? (
            <>
              <div className="user-info-modal-pointer"></div>
              <div className="user-info-modal">
                <p>{userInfo?.name ? userInfo?.name : "Xodim"}</p>
                <span>{employee_role(userInfo?.role)}</span>
                <button
                  title="Hisobdan chiqish"
                  onClick={(e) => {
                    log_out(e, navigate, darkMode);
                  }}
                  className="btn-logout"
                >
                  Saytdan chiqish &nbsp;
                  <SignOut size={24} />
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
