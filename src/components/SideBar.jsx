import React from "react";
import { NavLink } from "react-router-dom";
import {
  IoCheckmarkCircleOutline,
  IoFileTrayFullOutline,
  IoGridOutline,
  IoLibraryOutline,
  IoPeopleOutline,
  IoTrashBinOutline,
} from "react-icons/io5";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

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
              <NavLink to={"/ijazah/arsipkan"}>
                <span className="icon is-small">
                  <IoFileTrayFullOutline />
                </span>
                <span className="ml-1">Arsipkan Ijazah</span>
              </NavLink>
            </li>
            <li>
              <NavLink to={"/sertifikat/arsipkan"}>
                <span className="icon is-small">
                  <IoFileTrayFullOutline />
                </span>
                <span className="ml-1">Arsipkan Sertifikat</span>
              </NavLink>
            </li>
            <li>
              <NavLink to={"/ijazah/rejected"}>
                <span className="icon is-small">
                  <IoTrashBinOutline />
                </span>
                <span className="ml-1">Ijazah Ditolak</span>
              </NavLink>
            </li>
            <li>
              <NavLink to={"/sertifikat/rejected"}>
                <span className="icon is-small">
                  <IoTrashBinOutline />
                </span>
                <span className="ml-1">Sertifikat Ditolak</span>
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
              </NavLink>
            </li>
            <li>
              <NavLink to={`/sertifikat`}>
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
              <NavLink to={"/ijazah"}>
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
              <NavLink to={"/sertifikat"}>
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
