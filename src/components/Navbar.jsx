import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LogOut, reset } from "../features/AuthSlices";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logout = () => {
    dispatch(LogOut());
    dispatch(reset());
    navigate("/");

    showLogoutNotification();
  };

  const showLogoutNotification = () => {
    Toastify({
      text: "Anda telah logout, sampai jumpa lagi!",
      duration: 3000,
      gravity: "bottom",
      position: "right",
      backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
    }).showToast();
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav
      className="navbar is-fixed-top has-background-primary"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <NavLink to={"/dashboard"} className="navbar-item">
          <p className="menu-label has-text-dark">
            Sistem Pengarsipan Ijazah dan Sertifikat Ujikom (SMK Ma'arif Terpadu
            Cicalengka)
          </p>
        </NavLink>

        <button
          type="button"
          className={`navbar-burger burger ${isMenuOpen ? "is-active" : ""}`}
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
          onClick={handleMenuToggle}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
      </div>

      <div
        id="navbarBasicExample"
        className={`navbar-menu ${isMenuOpen ? "is-active" : ""}`}
      >
        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              <button onClick={logout} className="button is-lighter">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
