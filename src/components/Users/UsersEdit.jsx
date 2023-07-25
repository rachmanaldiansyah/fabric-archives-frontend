import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

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

  const updateUsers = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/users/${id}`, {
        nama: nama,
        email: email,
        password: password,
        confPassword: confPassword,
        roles: roles,
      });
      navigate("/users");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div>
      <h1 className="title">Kelola Pengguna</h1>
      <h2 className="subtitle">Ubah Data Pengguna</h2>
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