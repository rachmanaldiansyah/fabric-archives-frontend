import React from "react";
import { NavLink } from "react-router-dom";
import {
  IoCheckmarkCircleOutline,
  IoFileTrayFullOutline,
  IoGridOutline,
  IoLibraryOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <aside className="menu">
      <p className="menu-label mt-4 has-text-dark">General</p>
      <ul className="menu-list">
        <li>
          <NavLink to={"/dashboard"}>
            <span className="icon is-small">
              <IoGridOutline />
            </span>
            <span>Dashboard</span>
          </NavLink>
        </li>
        {user && user.roles === "admin" && (
          <li>
            <NavLink to={"/ijazah"}>
              <span className="icon is-small">
                <IoLibraryOutline />
              </span>
              <span>Daftar Ijazah</span>
            </NavLink>
          </li>
        )}
        {user && user.roles === "kepala sekolah" && (
          <li>
            <NavLink to={"/ijazah/confirm"}>
              <span className="icon is-small">
                <IoLibraryOutline />
              </span>
              <span>Daftar Ijazah</span>
            </NavLink>
          </li>
        )}
        {user && user.roles === "kesiswaan" && (
          <li>
            <NavLink to={"/ijazah/confirm"}>
              <span className="icon is-small">
                <IoLibraryOutline />
              </span>
              <span>Daftar Ijazah</span>
            </NavLink>
          </li>
        )}
        {user && user.roles === "admin" && (
          <li>
            <NavLink to={"/sertifikat"}>
              <span className="icon is-small">
                <IoLibraryOutline />
              </span>
              <span>Daftar Sertifikat</span>
            </NavLink>
          </li>
        )}
        {user && user.roles === "kepala sekolah" && (
          <li>
            <NavLink to={"/sertifikat/confirm"}>
              <span className="icon is-small">
                <IoLibraryOutline />
              </span>
              <span>Daftar Sertifikat</span>
            </NavLink>
          </li>
        )}
        {user && user.roles === "mitra" && (
          <li>
            <NavLink to={"/sertifikat/confirm"}>
              <span className="icon is-small">
                <IoLibraryOutline />
              </span>
              <span>Daftar Sertifikat</span>
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
                <span>Kelola Pengguna</span>
              </NavLink>
            </li>
            <li>
              <NavLink to={"/ijazah/create"}>
                <span className="icon is-small">
                  <IoFileTrayFullOutline />
                </span>
                <span>Arsipkan Ijazah</span>
              </NavLink>
            </li>
            <li>
              <NavLink to={"/sertifikat/create"}>
                <span className="icon is-small">
                  <IoFileTrayFullOutline />
                </span>
                <span>Arsipkan Sertifikat</span>
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
                <span>Konfirmasi Ijazah</span>
              </NavLink>
            </li>
            <li>
              <NavLink to={`/sertifikat`}>
                <span className="icon is-small">
                  <IoCheckmarkCircleOutline />
                </span>
                <span>Konfirmasi Sertifikat</span>
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
                <span>Konfirmasi Ijazah</span>
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
                <span>Konfirmasi Sertifikat</span>
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
