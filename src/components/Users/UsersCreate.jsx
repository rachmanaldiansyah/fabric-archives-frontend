import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const UsersCreate = () => {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [roles, setRoles] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const showSuccessNotification = () => {
    Toastify({
      text: "Registrasi data pengguna berhasil!",
      duration: 3000,
      gravity: "bottom",
      position: "right",
      backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
    }).showToast();

    Swal.fire({
      title: "Success",
      icon: "success",
      text: "Registrasi data pengguna berhasil!",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    });
  };

  const showErrorNotification = (errorMsg) => {
    Toastify({
      text: "Gagal saat melakukan registrasi pengguna: " + errorMsg,
      duration: 3000,
      gravity: "bottom",
      position: "right",
      backgroundColor: "linear-gradient(to right, #ff0000, #940000)",
    }).showToast();

    Swal.fire({
      title: "Error",
      icon: "error",
      text: "Gagal saat melakukan registrasi pengguna: " + errorMsg,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    });
  };

  const SaveUsers = async (e) => {
    e.preventDefault();

    if (!nama && !email && !password && !confPassword && !roles) {
      showErrorNotification(
        "Data registrasi pengguna tidak boleh kosong, silahkan diisi."
      );
      return;
    }

    try {
      await axios.post("http://localhost:5000/users", {
        nama: nama,
        email: email,
        password: password,
        confPassword: confPassword,
        roles: roles,
      });
      showSuccessNotification();
      navigate("/users");
    } catch (error) {
      if (error.response) {
        showErrorNotification(error.response.data.msg);
      }
    }
  };

  return (
    <div>
      <div className="card is-shadowless">
        <div className="card-content">
          <h1 className="title">Kelola Data Pengguna</h1>
          <h2 className="subtitle">Menambahk data pengguna baru</h2>
          <div className="content">
            <form onSubmit={SaveUsers}>
              <p className="has-text-centered">{msg}</p>
              <div className="field">
                <label className="label">Nama Lengkap</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Isi nama lengkap siswa"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Email</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Isi email pengguna"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Password</label>
                <div className="control">
                  <input
                    type="password"
                    className="input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="******"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Konfirmasi Password</label>
                <div className="control">
                  <input
                    type="password"
                    className="input"
                    value={confPassword}
                    onChange={(e) => setConfPassword(e.target.value)}
                    placeholder="******"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Hak Akses</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select
                      value={roles}
                      onChange={(e) => setRoles(e.target.value)}
                    >
                      <option value="admin">Admin</option>
                      <option value="kepala sekolah">Kepala Sekolah</option>
                      <option value="kesiswaan">Kesiswaan</option>
                      <option value="mitra penerbit">Mitra</option>
                    </select>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersCreate;
