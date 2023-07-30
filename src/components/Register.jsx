import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [roles, setRoles] = useState("");
  const [nip, setNip] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  const saveUsers = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/users", {
        nama: nama,
        email: email,
        password: password,
        confPassword: confPassword,
        roles: roles,
        nip: nip,
      });
      navigate("/");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  // Function to show the NIP input field based on selected role
  const renderNipInputField = () => {
    if (roles === "admin" || roles === "kepala sekolah" || roles === "kesiswaan" || roles === "mitra penerbit") {
      return (
        <div className="field">
          <label className="label">NIP</label>
          <div className="control">
            <input
              type="text"
              className="input"
              value={nip}
              onChange={(e) => setNip(e.target.value)}
              placeholder="Masukkan NIP"
            />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="hero has-background-grey-light is-fullheight is-fullwidth">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-4">
              <form onSubmit={saveUsers} className="box">
                <p className="has-text-centered">{msg}</p>
                <p className="title has-text-centered">REGISTRASI PENGGUNA</p>
                <div className="field">
                  <label className="label">Nama</label>
                  <div className="control">
                    <input
                      type="text"
                      className="input"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      placeholder="Masukkan nama lengkap anda"
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
                      placeholder="Masukkan email anda"
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
                      placeholder="Masukkan password Anda"
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
                      placeholder="Konfirmasi kembali password"
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
                        <option value="" disabled>Pilih Hak Akses</option>
                        <option value="admin">Admin</option>
                        <option value="kepala sekolah">Kepala Sekolah</option>
                        <option value="kesiswaan">Kesiswaan</option>
                        <option value="mitra penerbit">Mitra</option>
                      </select>
                    </div>
                  </div>
                </div>
                {renderNipInputField()} {/* Show the NIP input field based on selected role */}
                <div className="field mt-5">
                  <button
                    type="submit"
                    className="button is-primary is-fullwidth"
                  >
                    {isLoading ? "Loading..." : "Registrasi"}
                  </button>
                </div>
                <div className="field mt-5 has-text-centered">
                  Sudah punya akun? <Link to={"/"}>Masuk</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
