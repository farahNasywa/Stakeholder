import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import "./Navbar.css";
import logo from "../assets/logo1.jpg";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const dropdownRef = useRef(null);
  const sidebarRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const currentUser = {
    name: localStorage.getItem("name") || t("navbar.guestName"),
    email: localStorage.getItem("email") || "",
    role: localStorage.getItem("role") || "",
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleLogout = () => {
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("token");

    navigate("/");
  };

  const handleBack = () => {
    navigate(-1);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }

      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        !e.target.closest(".menu-btn")
      ) {
        setShowSidebar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    const titles = t("navbar.titles", { returnObjects: true });

    if (path.startsWith("/stakeholderprofilesetup")) {
      return titles.stakeholderProfileSetup;
    }
    if (path.startsWith("/dashboard")) {
      return titles.dashboard;
    }
    if (path.startsWith("/add-stakeholder")) {
      return titles.addStakeholder;
    }
    if (path.startsWith("/engagementjustification")) {
      return titles.engagementJustification;
    }
    if (path.startsWith("/deep-analysist2")) {
      return titles.deepAnalysis2;
    }
    if (path.startsWith("/deepanalyst") || path.startsWith("/deep-analysist")) {
      return titles.deepAnalysis;
    }
    if (path.startsWith("/engagement-priority")) {
      return titles.engagementPriority;
    }
    if (path.startsWith("/faq")) {
      return titles.faq;
    }
    if (path.startsWith("/about")) {
      return titles.about;
    }
    if (path.startsWith("/validation-bpma")) {
      return titles.validationBpma;
    }
    if (path.startsWith("/validation-kkks")) {
      return titles.myValidation;
    }
    if (path.startsWith("/cluster/authority")) {
      return t("stakeholderProfileSetup.clusters.authority");
    }
    if (path.startsWith("/cluster/influence")) {
      return t("stakeholderProfileSetup.clusters.influence");
    }
    if (path.startsWith("/cluster/interest")) {
      return t("stakeholderProfileSetup.clusters.interest");
    }
    if (path.startsWith("/cluster/impactedbyproject")) {
      return t("stakeholderProfileSetup.clusters.impactedbyproject");
    }
    if (path.startsWith("/cluster/dependency")) {
      return t("stakeholderProfileSetup.clusters.dependency");
    }
    if (path.startsWith("/cluster/alignment")) {
      return t("stakeholderProfileSetup.clusters.alignment");
    }
    if (path.startsWith("/cluster/opportunity")) {
      return t("stakeholderProfileSetup.clusters.opportunity");
    }
    if (path.startsWith("/cluster/risk")) {
      return t("stakeholderProfileSetup.clusters.risk");
    }
    if (path.startsWith("/cluster/benefit")) {
      return t("stakeholderProfileSetup.clusters.benefit");
    }
    if (path.startsWith("/cluster/category")) {
      return t("stakeholderProfileSetup.clusters.category");
    }

    return titles.default;
  };

  // Halaman yang TIDAK menampilkan language switcher
  const hideLanguageSwitcherPaths = ["/", "/login", "/welcome"];
  const showLanguageSwitcher = !hideLanguageSwitcherPaths.includes(
    location.pathname
  );

  return (
    <>
      <header className="navbar">
        <div className="navbar-left">

          <div className="menu-back-container">

            <button
              className="menu-btn"
              onClick={toggleSidebar}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/56/56763.png"
                alt="menu"
                className="menu-icon"
              />
            </button>

            <button
              className="back-btn"
              onClick={handleBack}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/93/93634.png"
                alt="Back"
                className="back-icon"
              />
            </button>

          </div>

          <img
            src={logo}
            alt="Logo"
            className="logo"
          />

          <h1
            style={{
              fontWeight: "bold",
              fontSize: "24px",
              color: "#204D93",
              marginLeft: "12px",
            }}
          >
            {getPageTitle()}
          </h1>

        </div>

        <div className="navbar-right">

          {showLanguageSwitcher && (
            <div className="lang-toggle" role="group" aria-label="Language switcher">
              <button
                type="button"
                className={i18n.language === "id" ? "active" : ""}
                onClick={() => changeLanguage("id")}
              >
                ID
              </button>
              <span className="lang-toggle-divider">|</span>
              <button
                type="button"
                className={i18n.language === "en" ? "active" : ""}
                onClick={() => changeLanguage("en")}
              >
                EN
              </button>
            </div>
          )}

          <button
            className="icon-circle"
            onClick={() => navigate("/faq")}
            title={t("navbar.help")}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/3156/3156280.png"
              alt="Help"
            />
          </button>

          <div
            className="profile-dropdown"
            ref={dropdownRef}
          >

            <button
              className="icon-circle"
              onClick={toggleDropdown}
              title={t("navbar.profile")}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png"
                alt="Profile"
              />
            </button>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  className="dropdown-menu"
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >

                  <div className="user-info">
                    <strong>
                      {currentUser.name}
                    </strong>

                    <small>
                      {currentUser.email}
                    </small>
                  </div>

                  <hr />

                  <button
                    className="logout-btn"
                    onClick={handleLogout}
                  >
                    {t("navbar.logout")}
                  </button>

                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>
      </header>

      <AnimatePresence>
        {showSidebar && (
          <motion.div
            className="sidebar-overlay"
            onClick={toggleSidebar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          ></motion.div>
        )}
      </AnimatePresence>

      <div
        className={`modern-sidebar ${
          showSidebar ? "open" : ""
        }`}
        ref={sidebarRef}
      >

        <div className="sidebar-header">

          <h2 className="sidebar-title">
            {t("sidebar.title")}
          </h2>

          <button
            className="sidebar-close-btn1"
            onClick={toggleSidebar}
          >
            ✕
          </button>

        </div>

        <nav className="sidebar-nav">

          <Link
            to="/dashboard"
            className={`sidebar-item ${
              location.pathname.startsWith("/dashboard")
                ? "active"
                : ""
            }`}
          >
            <span>{t("sidebar.mainDashboard")}</span>
          </Link>

          <Link
            to="/add-stakeholder"
            className={`sidebar-item ${
              location.pathname.startsWith("/add-stakeholder")
                ? "active"
                : ""
            }`}
          >
            <span>+ {t("sidebar.addStakeholder")}</span>
          </Link>

          <Link
            to="/faq"
            className={`sidebar-item ${
              location.pathname.startsWith("/faq")
                ? "active"
                : ""
            }`}
          >
            <span>{t("sidebar.faq")}</span>
          </Link>

          {currentUser.role === "bpma" && (
            <Link
              to="/validation-bpma"
              className={`sidebar-item ${
                location.pathname.startsWith(
                  "/validation-bpma"
                )
                  ? "active"
                  : ""
              }`}
            >
              <span>{t("sidebar.validation")}</span>
            </Link>
          )}

          {currentUser.role === "kkks" && (
            <Link
              to="/validation-kkks"
              className={`sidebar-item ${
                location.pathname.startsWith(
                  "/validation-kkks"
                )
                  ? "active"
                  : ""
              }`}
            >
              <span>{t("sidebar.validation")}</span>
            </Link>
          )}

        </nav>

      </div>
    </>
  );
};

export default Navbar;
