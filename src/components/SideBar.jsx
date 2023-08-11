import React, { useState, useEffect } from "react";
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
import axios from "axios";

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const [ijazahDitolak, setIjazahDitolak] = useState([]);
  const [sertifikatDitolak, setSertifikatDitolak] = useState([]);
  const [ijazahKonfirmasi, setIjazahKonfirmasi] = useState([]);
  const [sertifikatKonfirmasi, setSertifikatKonfirmasi] = useState([]);
  const [ijazahPending, setIjazahPending] = useState([]);
  const [sertifikatPending, setSertifikatPending] = useState([]);

  useEffect(() => {
    getIjazahDitolak();
    getSertifikatDitolak();
    getIjazahKonfirmasi();
    getSertifikatKonfirmasi();
    getIjazahPending();
    getSertifikatPending();
  }, []);

  const getIjazahKonfirmasi = async () => {
    try {
      const response = await axios.get("http://localhost:5000/ijazah");
      const ijazahKonfirmasi = response.data.filter(
        (item) => item.konfirmasi_kesiswaan === "Dikonfirmasi"
      );
      setIjazahKonfirmasi(ijazahKonfirmasi);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getSertifikatKonfirmasi = async () => {
    try {
      const response = await axios.get("http://localhost:5000/sertifikat");
      const sertifikatKonfirmasi = response.data.filter(
        (item) => item.konfirmasi_mitra === "Dikonfirmasi"
      );
      setSertifikatKonfirmasi(sertifikatKonfirmasi);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getIjazahPending = async () => {
    try {
      const response = await axios.get("http://localhost:5000/ijazah");
      const ijazahPending = response.data.filter(
        (item) => item.konfirmasi_kesiswaan === "False"
      );
      setIjazahPending(ijazahPending);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const getSertifikatPending = async () => {
    try {
      const response = await axios.get("http://localhost:5000/sertifikat");
      const sertifikatPending = response.data.filter(
        (item) => item.konfirmasi_mitra === "False"
      );
      setSertifikatPending(sertifikatPending);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const getIjazahDitolak = async () => {
    try {
      const response = await axios.get("http://localhost:5000/ijazah");
      const ijazahDitolak = response.data.filter(
        (item) => item.konfirmasi_kesiswaan === "Ditolak"
      );
      setIjazahDitolak(ijazahDitolak);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getSertifikatDitolak = async () => {
    try {
      const response = await axios.get("http://localhost:5000/sertifikat");
      const sertifikatDitolak = response.data.filter(
        (item) => item.konfirmasi_mitra === "Ditolak"
      );
      setSertifikatDitolak(sertifikatDitolak);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const countRejectedIjazah = () => {
    return ijazahDitolak.length;
  };

  const countRejectedSertifikat = () => {
    return sertifikatDitolak.length;
  };

  const countIjazahKonfirmasi = () => {
    return ijazahKonfirmasi.length;
  };

  const countSertifikatKonfirmasi = () => {
    return sertifikatKonfirmasi.length;
  };

  const countIjazahPending = () => {
    return ijazahPending.length;
  };

  const countSertifikatPending = () => {
    return sertifikatPending.length;
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
          <NavLink to={"/dashboard"}>
            <span className="icon is-small">
              <IoGridOutline />
            </span>
            <span className="ml-1">Dashboard</span>
          </NavLink>
        </li>
        {user && user.roles === "admin" && (
          <li>
            <NavLink to={"/ijazah"}>
              <span className="icon is-small">
                <IoLibraryOutline />
              </span>
              <span className="ml-1">Daftar Ijazah</span>
            </NavLink>
          </li>
        )}
        {user && user.roles === "kepala sekolah" && (
          <li>
            <NavLink to={"/ijazah/confirm"}>
              <span className="icon is-small">
                <IoLibraryOutline />
              </span>
              <span className="ml-1">Daftar Ijazah</span>
            </NavLink>
          </li>
        )}
        {user && user.roles === "kesiswaan" && (
          <li>
            <NavLink to={"/ijazah/confirm"}>
              <span className="icon is-small">
                <IoLibraryOutline />
              </span>
              <span className="ml-1">Daftar Ijazah</span>
            </NavLink>
          </li>
        )}
        {user && user.roles === "admin" && (
          <li>
            <NavLink to={"/sertifikat"}>
              <span className="icon is-small">
                <IoLibraryOutline />
              </span>
              <span className="ml-1">Daftar Sertifikat</span>
            </NavLink>
          </li>
        )}
        {user && user.roles === "kepala sekolah" && (
          <li>
            <NavLink to={"/sertifikat/confirm"}>
              <span className="icon is-small">
                <IoLibraryOutline />
              </span>
              <span className="ml-1">Daftar Sertifikat</span>
            </NavLink>
          </li>
        )}
        {user && user.roles === "mitra" && (
          <li>
            <NavLink to={"/sertifikat/confirm"}>
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
              <NavLink to={"/users"}>
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
                <span className="icon is-small ml-1"></span>
              </a>
              <ul>
                <li>
                  <NavLink
                    to={"/ijazah/arsipkan"}
                    activeClassName="active-menu"
                  >
                    <IoSchoolOutline /> Arsip Ijazah
                  </NavLink>
                </li>
                <li>
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
              <NavLink to={"/ijazah/rejected"}>
                <span className="icon is-small">
                  <IoTrashBinOutline />
                </span>
                <span className="ml-1">Ijazah Ditolak</span>
                {countRejectedIjazah() > 0 && (
                  <span className="tag is-danger is-rounded ml-2">
                    {countRejectedIjazah()}
                  </span>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to={"/sertifikat/rejected"}>
                <span className="icon is-small">
                  <IoTrashBinOutline />
                </span>
                <span className="ml-1">Sertifikat Ditolak</span>
                {countRejectedSertifikat() > 0 && (
                  <span className="tag is-danger is-rounded ml-2">
                    {countRejectedSertifikat()}
                  </span>
                )}
              </NavLink>
            </li>
          </ul>
        </div>
      )}
      {user && user.roles === "kepala sekolah" && (
        <div>
          <p className="menu-label has-text-dark">Kepala Sekolah</p>
          <ul className="menu-list">
            <li>
              <NavLink to={`/ijazah`}>
                <span className="icon is-small">
                  <IoCheckmarkCircleOutline />
                </span>
                <span className="ml-1">Konfirmasi Ijazah</span>
                {countIjazahKonfirmasi() > 0 && (
                  <span className="tag is-danger is-rounded ml-2">
                    {countIjazahKonfirmasi()}
                  </span>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to={`/sertifikat`}>
                <span className="icon is-small">
                  <IoCheckmarkCircleOutline />
                </span>
                <span className="ml-1">Konfirmasi Sertifikat</span>
                {countSertifikatKonfirmasi() > 0 && (
                  <span className="tag is-danger is-rounded ml-2">
                    {countSertifikatKonfirmasi()}
                  </span>
                )}
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
              <NavLink to={"/ijazah"}>
                <span className="icon is-small">
                  <IoCheckmarkCircleOutline />
                </span>
                <span className="ml-1">Konfirmasi Ijazah</span>
                {countIjazahPending() > 0 && (
                  <span className="tag is-danger is-rounded ml-2">
                    {countIjazahPending()}
                  </span>
                )}
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
              <NavLink to={"/sertifikat"}>
                <span className="icon is-small">
                  <IoCheckmarkCircleOutline />
                </span>
                <span className="ml-1">Konfirmasi Sertifikat</span>
                {countSertifikatPending() > 0 && (
                  <span className="tag is-danger is-rounded ml-2">
                    {countSertifikatPending()}
                  </span>
                )}
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
