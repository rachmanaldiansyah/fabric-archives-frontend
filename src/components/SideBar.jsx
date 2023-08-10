import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  IoCheckmarkCircleOutline,
  IoFileTrayFullOutline,
  IoGridOutline,
  IoLibraryOutline,
  IoPeopleOutline,
  IoTrashBinOutline,
  IoRibbonOutline,
  IoSchoolOutline,
} from "react-icons/io5";
import { useSelector } from "react-redux";
import "../styles/global.css";

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const [isDropdownOpen1, setIsDropdownOpen1] = useState(false);
  const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);
  const [isSubmenuOpen1, setIsSubmenuOpen1] = useState(false);
  const [isSubmenuOpen2, setIsSubmenuOpen2] = useState(false);
  const [activeButton, setActiveButton] = useState(null); // Tambahkan state lokal

  const toggleDropdown1 = () => {
    setIsDropdownOpen1(!isDropdownOpen1);
    setIsSubmenuOpen1(false);
  };

  const toggleSubmenu1 = () => {
    setIsSubmenuOpen1(!isSubmenuOpen1);
  };

  const toggleDropdown2 = () => {
    setIsDropdownOpen2(!isDropdownOpen2);
    setIsSubmenuOpen2(false);
  };

  const toggleSubmenu2 = () => {
    setIsSubmenuOpen2(!isSubmenuOpen2);
  };

  // Fungsi untuk mengatur tombol yang aktif
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  return (
    <aside className="menu has-background-white">
      {user && (
        <div className="menu has-background-white">
          <div className="menu-list">
            <p className="has-text-dark has-text-centered has-text-weight-bold is-uppercase is-underlined is-family-sans-serif">
              Info Pengguna
            </p>
            <p className="has-text-dark has-text-centered has-text-weight-medium is-capitalized is-family-sans-serif mt-4">
              {user.nama}
            </p>
            <p className="has-text-dark has-text-centered has-text-weight-light is-uppercase is-family-sans-serif mt-2">
              {user.roles}
            </p>
          </div>
        </div>
      )}
      <p className="menu-label mt-4 has-text-dark">General</p>
      <ul className="menu-list">
        <li>
          <NavLink
            to={"/dashboard"}
            activeClassName="active-menu"
            onClick={() => handleButtonClick("dashboard")}
          >
            <span className="icon is-small">
              <IoGridOutline />
            </span>
            <span className="ml-1">Dashboard</span>
          </NavLink>
        </li>
        {user && user.roles === "admin" && (
          <li>
            <NavLink
              to={"/ijazah"}
              activeClassName="active-menu"
              onClick={() => handleButtonClick("daftar-ijazah")}
            >
              <span className="icon is-small">
                <IoLibraryOutline />
              </span>
              <span className="ml-1">Daftar Ijazah</span>
            </NavLink>
          </li>
        )}
        {user && user.roles === "kepala sekolah" && (
          <li>
            <NavLink
              to={"/ijazah/confirm"}
              activeClassName="active-menu"
              onClick={() => handleButtonClick("daftar-ijazah")}
            >
              <span className="icon is-small">
                <IoLibraryOutline />
              </span>
              <span className="ml-1">Daftar Ijazah</span>
            </NavLink>
          </li>
        )}
        {user && user.roles === "kesiswaan" && (
          <li>
            <NavLink
              to={"/ijazah/confirm"}
              activeClassName="active-menu"
              onClick={() => handleButtonClick("daftar-ijazah")}
            >
              <span className="icon is-small">
                <IoLibraryOutline />
              </span>
              <span className="ml-1">Daftar Ijazah</span>
            </NavLink>
          </li>
        )}
        {user && user.roles === "admin" && (
          <li>
            <NavLink
              to={"/sertifikat"}
              activeClassName="active-menu"
              onClick={() => handleButtonClick("daftar-sertifikat")}
            >
              <span className="icon is-small">
                <IoLibraryOutline />
              </span>
              <span className="ml-1">Daftar Sertifikat</span>
            </NavLink>
          </li>
        )}
        {user && user.roles === "kepala sekolah" && (
          <li>
            <NavLink
              to={"/sertifikat/confirm"}
              activeClassName="active-menu"
              onClick={() => handleButtonClick("daftar-sertifikat")}
            >
              <span className="icon is-small">
                <IoLibraryOutline />
              </span>
              <span className="ml-1">Daftar Sertifikat</span>
            </NavLink>
          </li>
        )}
        {user && user.roles === "mitra" && (
          <li>
            <NavLink
              to={"/sertifikat/confirm"}
              activeClassName="active-menu"
              onClick={() => handleButtonClick("daftar-sertifikat")}
            >
              <span className="icon is-small">
                <IoLibraryOutline />
              </span>
              <span className="ml-1">Daftar Sertifikat</span>
            </NavLink>
          </li>
        )}
      </ul>
      {user && user.roles === "admin" && (
        <div>
          <p className="menu-label mt-2 has-text-dark">Admin</p>
          <ul className="menu-list">
            <li>
              <NavLink
                to={"/users"}
                activeClassName="active-menu"
                onClick={() => handleButtonClick("kelola-pengguna")}
              >
                <span className="icon is-small">
                  <IoPeopleOutline />
                </span>
                <span className="ml-1">Kelola Pengguna</span>
              </NavLink>
            </li>
            <li>
              <a
                className={`has-dropdown-icon ${
                  isDropdownOpen1 ? "active" : ""
                }`}
                onClick={toggleDropdown1}
              >
                <span className="icon is-small">
                  <IoFileTrayFullOutline />
                </span>
                <span className="ml-1">Kelola Pengarsipan</span>
                <span className="icon is-small ml-1">
                  <i
                    className={`dropdown-icon ${
                      isDropdownOpen1 ? "rotate-up" : ""
                    }`}
                  >
                    &#9662;
                  </i>
                </span>
              </a>
              <ul
                className={`menu-list ${
                  isDropdownOpen1 ? "is-active" : ""
                }`}
              >
                <li
                  className={`submenu-list ${
                    isSubmenuOpen1 ? "is-active" : ""
                  }`}
                  onClick={toggleSubmenu1}
                >
                  <NavLink
                    to={"/ijazah/arsipkan"}
                    activeClassName="active-menu"
                  >
                    <IoSchoolOutline /> Arsip Ijazah
                  </NavLink>
                </li>
                <li
                  className={`submenu-list ${
                    isSubmenuOpen1 ? "is-active" : ""
                  }`}
                  onClick={toggleSubmenu1}
                >
                  <NavLink
                    to={"/sertifikat/arsipkan"}
                    activeClassName="active-menu"
                  >
                    <IoRibbonOutline /> Arsip Sertifikat
                  </NavLink>
                </li>
              </ul>
            </li>
            <li>
              <a
                className={`has-dropdown-icon ${
                  isDropdownOpen2 ? "active" : ""
                }`}
                onClick={toggleDropdown2}
              >
                <span className="icon is-small">
                  <IoTrashBinOutline />
                </span>
                <span className="ml-1">Kelola Penolakan</span>
                <span className="icon is-small ml-1">
                  <i
                    className={`dropdown-icon ${
                      isDropdownOpen2 ? "rotate-up" : ""
                    }`}
                  >
                    &#9662;
                  </i>
                </span>
              </a>
              <ul
                className={`menu-list ${
                  isDropdownOpen2 ? "is-active" : ""
                }`}
              >
                <li
                  className={`submenu-list ${
                    isSubmenuOpen2 ? "is-active" : ""
                  }`}
                  onClick={toggleSubmenu2}
                >
                  <NavLink
                    to={"/ijazah/rejected"}
                    activeClassName="active-menu"
                  >
                    <IoSchoolOutline /> Arsip Ijazah
                  </NavLink>
                </li>
                <li
                  className={`submenu-list ${
                    isSubmenuOpen2 ? "is-active" : ""
                  }`}
                  onClick={toggleSubmenu2}
                >
                  <NavLink
                    to={"/sertifikat/rejected"}
                    activeClassName="active-menu"
                  >
                    <IoRibbonOutline /> Arsip Sertifikat
                  </NavLink>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      )}
      {user && user.roles === "kepala sekolah" && (
        <div>
          <p className="menu-label has-text-dark">Kepala Sekolah</p>
          <ul className="menu-list">
            <li>
              <NavLink
                to={`/ijazah`}
                activeClassName="active-menu"
                onClick={() => handleButtonClick("konfirmasi-ijazah")}
              >
                <span className="icon is-small">
                  <IoCheckmarkCircleOutline />
                </span>
                <span className="ml-1">Konfirmasi Ijazah</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/sertifikat`}
                activeClassName="active-menu"
                onClick={() => handleButtonClick("konfirmasi-sertifikat")}
              >
                <span className="icon is-small">
                  <IoCheckmarkCircleOutline />
                </span>
                <span className="ml-1">Konfirmasi Sertifikat</span>
              </NavLink>
            </li>
          </ul>
        </div>
      )}
      {user && user.roles === "kesiswaan" && (
        <div>
          <p className="menu-label has-text-dark">Kesiswaan</p>
          <ul className="menu-list">
            <li>
              <NavLink
                to={"/ijazah"}
                activeClassName="active-menu"
                onClick={() => handleButtonClick("konfirmasi-ijazah")}
              >
                <span className="icon is-small">
                  <IoCheckmarkCircleOutline />
                </span>
                <span className="ml-1">Konfirmasi Ijazah</span>
              </NavLink>
            </li>
          </ul>
        </div>
      )}
      {user && user.roles === "mitra" && (
        <div>
          <p className="menu-label has-text-dark">Mitra Sertifikasi</p>
          <ul className="menu-list">
            <li>
              <NavLink
                to={"/sertifikat"}
                activeClassName="active-menu"
                onClick={() => handleButtonClick("konfirmasi-sertifikat")}
              >
                <span className="icon is-small">
                  <IoCheckmarkCircleOutline />
                </span>
                <span className="ml-1">Konfirmasi Sertifikat</span>
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
