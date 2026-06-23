import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo1.jpg";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const dropdownRef = useRef(null);
  const sidebarRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const currentUser = {
    name: localStorage.getItem("name") || "Tamu",
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

    console.log("Current Path :", path);

    // Stakeholder Profile Setup
    if (path.startsWith("/stakeholderprofilesetup")) {
      return "Stakeholder Setup Profile";
    }

    // Dashboard
    if (path.startsWith("/dashboard")) {
      return "Stakeholder Analysis System";
    }

    // Engagement Justification
    if (path.startsWith("/engagementjustification")) {
      return "Engagement Justification";
    }

     // Deep Analysis 2
    if (path.startsWith("/deep-analysist2")) {
      return "Deep Analysis 2";
    }

    // Deep Analysis
    if (
      path.startsWith("/deepanalyst") ||
      path.startsWith("/deep-analysist")
    ) {
      return "Deep Analysis";
    }

    // Engagement Priority
    if (path.startsWith("/engagement-priority")) {
      return "Engagement Priority";
    }

    // FAQ
    if (path.startsWith("/faq")) {
      return "Frequently Asked Questions";
    }

    // About
    if (path.startsWith("/about")) {
      return "About Us";
    }

    // Validation
    if (path.startsWith("/validation-bpma")) {
      return "Validation BPMA";
    }

    if (path.startsWith("/validation-kkks")) {
      return "My Validation";
    }

    // Cluster
    if (path.startsWith("/cluster/authority")) {
      return "Authority / Legitimacy";
    }

    if (path.startsWith("/cluster/influence")) {
      return "Influence on Project";
    }

    if (path.startsWith("/cluster/interest")) {
      return "Interest";
    }

    if (path.startsWith("/cluster/impactedbyproject")) {
      return "Impacted by Project";
    }

    if (path.startsWith("/cluster/dependency")) {
      return "Dependency";
    }

    if (path.startsWith("/cluster/alignment")) {
      return "Alignment / Policy Role";
    }

    if (path.startsWith("/cluster/opportunity")) {
      return "Opportunity Potential";
    }

    if (path.startsWith("/cluster/risk")) {
      return "Risk Potential";
    }

    if (path.startsWith("/cluster/benefit")) {
      return "Benefit Analysis";
    }

    if (path.startsWith("/cluster/category")) {
      return "Category";
    }

    return "Stakeholder System";
  };

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

          <button
            className="icon-circle"
            onClick={() => navigate("/faq")}
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
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png"
                alt="Profile"
              />
            </button>

            {showDropdown && (
              <div className="dropdown-menu">

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
                  Keluar
                </button>

              </div>
            )}

          </div>

        </div>
      </header>

      {showSidebar && (
        <div
          className="sidebar-overlay"
          onClick={toggleSidebar}
        ></div>
      )}

      <div
        className={`modern-sidebar ${
          showSidebar ? "open" : ""
        }`}
        ref={sidebarRef}
      >

        <div className="sidebar-header">

          <h2 className="sidebar-title">
            Stakeholder System
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
            <span>Main Dashboard</span>
          </Link>

          <Link
            to="/faq"
            className={`sidebar-item ${
              location.pathname.startsWith("/faq")
                ? "active"
                : ""
            }`}
          >
            <span>FAQ</span>
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
              <span>Validation</span>
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
              <span>Validation</span>
            </Link>
          )}

        </nav>

      </div>
    </>
  );
};

export default Navbar;