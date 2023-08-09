import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const UsersEdit = () => {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [roles, setRoles] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getUsersById = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users/${id}`);
        setNama(response.data.nama);
        setEmail(response.data.email);
        setRoles(response.data.roles);
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    };
    getUsersById();
  }, [id]);

  const showSuccessNotification = () => {
    Toastify({
      text: "Data pengguna berhasil diubah!",
      duration: 3000,
      gravity: "bottom",
      position: "right",
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      }
    }).showToast();

    Swal.fire({
      title: "Success",
      icon: "success",
      text: "Data pengguna berhasil diubah!",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    });
  };

  const showErrorNotification = (errorMsg) => {
    Toastify({
      text: "Gagal saat mengubah data pengguna: " + errorMsg,
      duration: 3000,
      gravity: "bottom",
      position: "right",
      style: {
        background: "linear-gradient(to right, #ff0000, #940000)",
      }
    }).showToast();

    Swal.fire({
      title: "Error",
      icon: "error",
      text: "Gagal saat mengubah data pengguna: " + errorMsg,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    });
  };

  const updateUsers = async (e) => {
    e.preventDefault();

    if (!nama && !email && !password && !confPassword && !roles) {
      showErrorNotification(
        "Data registrasi pengguna tidak boleh kosong, silahkan diisi."
      );
      return;
    }

    try {
      await axios.patch(`http://localhost:5000/users/${id}`, {
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
    <div className="container box">
      <div className="hero is-primary is-bold box">
        <h1 className="title is-family-sans-serif is-uppercase has-text-centered has-text-weight-semibold mt-2">
          Kelola Daftar Akun Pengguna
        </h1>
        <h2 className="subtitle is-family-sans-serif is-capitalized has-text-dark has-text-centered has-text-weight-light">
          Mengubah data akun pengguna
        </h2>
      </div>

      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form onSubmit={updateUsers}>
              <p className="has-text-centered">{msg}</p>
              <div className="field">
                <label className="label">Nama Pengguna</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="nama pengguna"
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
                    placeholder="email pengguna"
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
                    placeholder="********"
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
                    placeholder="********"
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
                      <option value="kesiswaan">Kesiswaan</option>
                      <option value="kepala sekolah">Kepala Sekolah</option>
                      <option value="mitra">Mitra</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <button type="submit" className="button is-success">
                    Ubah
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersEdit;
