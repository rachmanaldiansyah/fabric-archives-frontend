import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Logo from "../img/logo-mtc.png";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import {
  FaEnvelope,
  FaUnlock,
  FaUserAlt,
  FaUserLock,
  FaUsers,
} from "react-icons/fa";

const Register = () => {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [roles, setRoles] = useState("");
  const [nip, setNip] = useState("");

  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  const handleInputChange = (e, setterFunction) => {
    const inputValue = e.target.value;

    // Menghilangkan spasi dari input value
    const sanitizedValue = inputValue.replace(/\s/g, "");

    // Update state hanya jika nilai sudah dihilangkan spasi
    if (sanitizedValue !== inputValue) {
      setterFunction(sanitizedValue);
    } else {
      setterFunction(inputValue);
    }
  };

  const showSuccessNotification = () => {
    Toastify({
      text: "Registrasi data pengguna berhasil!",
      duration: 3000,
      gravity: "bottom",
      position: "right",
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
    }).showToast();
  };

  const showErrorNotification = (errorMsg) => {
    Toastify({
      text: errorMsg,
      duration: 3000,
      gravity: "bottom",
      position: "right",
      style: {
        background: "linear-gradient(to right, #ff0000, #940000)",
      },
    }).showToast();
  };

  const verifyNIPRole = () => {
    const validNIPs = {
      1100049712: "kesiswaan",
      1100049713: "kepala sekolah",
    };

    if (validNIPs[nip]) {
      if (validNIPs[nip] === "kepala sekolah") {
        return nip === "1100049713";
      } else if (validNIPs[nip] === "kesiswaan") {
        return nip === "1100049712";
      } else {
        return validNIPs[nip] === roles;
      }
    }

    if (roles === "kepala sekolah") {
      return false;
    } else if (roles === "kesiswaan") {
      return false;
    }
  
    return true;
  };

  const validateEmail = (email) => {
    // Simple email validation using regex
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const SaveUsers = async (e) => {
    e.preventDefault();

    if (!nama || !email || !password || !confPassword || !roles) {
      showErrorNotification(
        "Data registrasi pengguna tidak boleh kosong, silahkan diisi."
      );
      return;
    } else if (password !== confPassword) {
      showErrorNotification("Konfirmasi password salah, silahkan ulangi.");
      return;
    } else if (!validateEmail(email)) {
      showErrorNotification(
        "Format email tidak valid, silahkan periksa kembali."
      );
      return;
    } else if (!/[0-9]{10}/.test(nip)) {
      showErrorNotification("NIP harus terdiri dari 10 digit angka.");
      return;
    } else if (!verifyNIPRole()) {
      showErrorNotification("NIP tidak sesuai dengan hak akses yang dipilih.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/users", {
        nama: nama,
        email: email,
        password: password,
        confPassword: confPassword,
        roles: roles,
        nip: nip,
      });
      showSuccessNotification();
      navigate("/");
    } catch (error) {
      if (error.response) {
        showErrorNotification(error.response.data.msg);
      }
    }
  };

  const renderNipInputField = () => {
    if (
      roles === "admin" ||
      roles === "kepala sekolah" ||
      roles === "kesiswaan" ||
      roles === "mitra"
    ) {
      return (
        <div className="field">
          <label className="label has-text-weight-semibold">NIP</label>
          <div className="control has-icons-left">
            <input
              type="text"
              className="input"
              value={nip}
              onChange={(e) => handleInputChange(e, setNip)}
              placeholder="Nomor Induk Pegawai"
            />
            <span className="icon is-small is-left">
              <FaUsers />
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="hero has-background-grey-lighter is-fullheight is-fullwidth">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-5">
              <p className="is-size-4 has-text-centered has-text-weight-semibold mb-2 mt-2">
                Registrasi Pengguna <br />{" "}
                <span className="is-size-5 has-text-weight-light is-capitalized">
                  Silahkan untuk melakukan registrasi pengguna untuk autentikasi
                  ke sistem pengarsipan
                </span>
              </p>
              <div className="columns is-centered mb-0">
                <div className="column is-half">
                  <img
                    src={Logo}
                    width="250"
                    height="250"
                    className="center"
                    alt="logo"
                  />
                </div>
              </div>
              <form onSubmit={SaveUsers} className="box">
                <div className="field">
                  <label className="label has-text-weight-semibold">Nama</label>
                  <div className="control has-icons-left">
                    <input
                      type="text"
                      className="input"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      placeholder="Nama Lengkap"
                    />
                    <span className="icon is-small is-left">
                      <FaUserAlt />
                    </span>
                  </div>
                </div>
                <div className="field">
                  <label className="label has-text-weight-semibold">Email</label>
                  <div className="control has-icons-left">
                    <input
                      type="text"
                      className="input"
                      value={email}
                      onChange={(e) => handleInputChange(e, setEmail)}
                      placeholder="Email"
                    />
                    <span className="icon is-small is-left">
                      <FaEnvelope />
                    </span>
                  </div>
                </div>
                <div className="field">
                  <label className="label has-text-weight-semibold">Password</label>
                  <div className="control has-icons-left">
                    <input
                      type="password"
                      className="input"
                      value={password}
                      onChange={(e) => handleInputChange(e, setPassword)}
                      placeholder="Password"
                    />
                    <span className="icon is-small is-left">
                      <FaUnlock />
                    </span>
                  </div>
                </div>
                <div className="field">
                  <label className="label has-text-weight-semibold">Konfirmasi Password</label>
                  <div className="control has-icons-left">
                    <input
                      type="password"
                      className="input"
                      value={confPassword}
                      onChange={(e) => handleInputChange(e, setConfPassword)}
                      placeholder="Konfirmasi Password"
                    />
                    <span className="icon is-small is-left">
                      <FaUnlock />
                    </span>
                  </div>
                </div>
                <div className="field">
                  <label className="label has-text-weight-semibold">Hak Akses</label>
                  <div className="control has-icons-left">
                    <div className="select is-fullwidth">
                      <select
                        value={roles}
                        onChange={(e) => setRoles(e.target.value)}
                      >
                        <option value="" disabled>
                          Pilih Hak Akses
                        </option>
                        <option value="admin">Staff Tata Usaha</option>
                        <option value="kesiswaan">Kesiswaan</option>
                        <option value="kepala sekolah">Kepala Sekolah</option>
                        <option value="mitra">Mitra</option>
                      </select>
                    </div>
                    <span className="icon is-small is-left">
                      <FaUserLock />
                    </span>
                  </div>
                </div>
                {renderNipInputField()}{" "}
                {/* Show the NIP input field based on selected role */}
                <div className="field mt-5">
                  <button
                    type="submit"
                    className="button is-primary is-fullwidth"
                  >
                    {isLoading ? "Loading..." : "Registrasi"}
                  </button>
                </div>
                <div className="field mt-5 has-text-centered">
                  Sudah punya akun?{" "}
                  <Link to={"/"} className="is-underlined">
                    Masuk
                  </Link>
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
