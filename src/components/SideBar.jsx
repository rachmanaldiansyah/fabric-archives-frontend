import React from "react";
import { NavLink } from "react-router-dom";
import { IoCheckmarkCircleOutline, IoFileTrayFullOutline, IoGridOutline, IoLibraryOutline, IoPeopleOutline } from "react-icons/io5";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div>
      <aside className="menu pl-2 has-shadow">
        <p className="menu-label mt-4">General</p>
        <ul className="menu-list">
          <li>
            <NavLink to={"/dashboard"}>
              <IoGridOutline /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to={"/ijazah"}>
              <IoLibraryOutline /> Daftar Ijazah
            </NavLink>
          </li>
          <li>
            <NavLink to={"/sertifikat"}>
              <IoLibraryOutline /> Daftar Sertifikat
            </NavLink>
          </li>
        </ul>
        {user && user.roles === "admin" && (
          <div>
            <p className="menu-label">Admin</p>
            <ul className="menu-list">
              <li>
                <NavLink to={"/users"}>
                  <IoPeopleOutline /> Kelola Pengguna
                </NavLink>
              </li>
              <li>
                <NavLink to={"/siswa"}>
                  <IoPeopleOutline /> Kelola Siswa
                </NavLink>
              </li>
              <li>
                <NavLink to={"/ijazah/create"}>
                  <IoFileTrayFullOutline /> Arsipkan Ijazah
                </NavLink>
              </li>
              <li>
                <NavLink to={"/sertifikat/create"}>
                  <IoFileTrayFullOutline /> Arsipkan Sertifikat
                </NavLink>
              </li>
            </ul>
          </div>
        )}
        {user && user.roles === "kepala sekolah" && (
          <div>
            <p className="menu-label">Kepala Sekolah</p>
            <ul className="menu-list">
              <li>
                <NavLink to={"/"}>
                  <IoCheckmarkCircleOutline /> Konfirmasi Ijazah
                </NavLink>
              </li>
              <li>
                <NavLink to={"/"}>
                  <IoCheckmarkCircleOutline /> Konfirmasi Sertifikat
                </NavLink>
              </li>
            </ul>
          </div>
        )}
        {user && user.roles === "kesiswaan" && (
          <div>
            <p className="menu-label">Kesiswaan</p>
            <ul className="menu-list">
              <li>
                <NavLink to={"/"}>
                  <IoCheckmarkCircleOutline /> Konfirmasi Ijazah
                </NavLink>
              </li>
            </ul>
          </div>
        )}
        {user && user.roles === "mitra" && (
          <div>
            <p className="menu-label">Mitra Sertifikasi</p>
            <ul className="menu-list">
              <li>
                <NavLink to={"/"}>
                  <IoCheckmarkCircleOutline /> Konfirmasi Sertifikat
                </NavLink>
              </li>
            </ul>
          </div>
        )}
      </aside>
    </div>
  );
};

export default Sidebar;