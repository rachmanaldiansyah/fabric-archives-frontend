import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { IoSaveOutline } from "react-icons/io5";

const SiswaCreate = () => {
  const [nisn, setNisn] = useState("");
  const [nis, setNis] = useState("");
  const [nama, setNama] = useState("");
  const [jk, setJk] = useState("");
  const [nama_orangtua, setNamaOrangtua] = useState("");
  const [prodi, setProdi] = useState("");

  const navigate = useNavigate();

  const showSuccessNotification = () => {
    Toastify({
      text: "Data siswa berhasil ditambahkan!",
      duration: 3000,
      gravity: "bottom",
      position: "right",
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
    }).showToast();

    Swal.fire({
      title: "Success",
      icon: "success",
      text: "Data siswa berhasil ditambahkan!",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    });
  };

  const showErrorNotification = (errorMsg) => {
    Toastify({
      text: "Error saat menambahkan data siswa: " + errorMsg,
      duration: 3000,
      gravity: "bottom",
      position: "right",
      style: {
        background: "linear-gradient(to right, #ff0000, #940000)",
      },
    }).showToast();

    Swal.fire({
      title: "Error",
      icon: "error",
      text: "Error saat menambahkan data siswa: " + errorMsg,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    });
  };

  const SaveSiswa = async (e) => {
    e.preventDefault();

    if (!nisn && !nis && !nama && !jk && !nama_orangtua && !prodi) {
      showErrorNotification("Data siswa tidak boleh kosong, silahkan diisi.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/siswa", {
        nisn: nisn,
        nis: nis,
        nama: nama,
        jk: jk,
        nama_orangtua: nama_orangtua,
        prodi: prodi,
      });
      showSuccessNotification();
      navigate("/siswa");
    } catch (error) {
      if (error.response) {
        showErrorNotification(error.response.data.msg);
      }
    }
  };

  return (
    <div className="container box">
      <div className="card is-shadowless">
        <div className="hero is-primary is-bold box">
          <h1 className="title is-family-sans-serif is-uppercase has-text-centered has-text-weight-semibold mt-2">
            Kelola Daftar Siswa
          </h1>
          <h2 className="subtitle is-family-sans-serif is-capitalized has-text-dark has-text-centered has-text-weight-light">
            Menambah data siswa yang akan diarsipkan
          </h2>
        </div>

        <div className="card-content">
          <div className="content">
            <form onSubmit={SaveSiswa}>
              <div className="field">
                <label className="label">NISN</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={nisn}
                    onChange={(e) => setNisn(e.target.value)}
                    placeholder="Isi nomor induk siswa nasional"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">NIS</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={nis}
                    onChange={(e) => setNis(e.target.value)}
                    placeholder="Isi nomor induk siswa"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Nama</label>
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
                <label className="label">Jenis Kelamin</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select value={jk} onChange={(e) => setJk(e.target.value)}>
                      <option value="" disabled>
                        Pilih Jenis Kelamin
                      </option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="perempuan">Perempuan</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="field">
                <label className="label">Nama Orangtua/Wali</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={nama_orangtua}
                    onChange={(e) => setNamaOrangtua(e.target.value)}
                    placeholder="Isi nama orang tua atau wali siswa"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Program Studi</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select value={prodi} onChange={(e) => setProdi(e.target.value)}>
                      <option value="" disabled>
                        Pilih Program Studi
                      </option>
                      <option value="Teknik Komputer & Jaringan">Teknik Komputer & Jaringan</option>
                      <option value="Perhotelan">Perhotelan</option>
                      <option value="Multimedia">Multimedia</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <button type="submit" className="button has-text-weight-semibold is-success">
                    <span className="icon mr-1">
                      <IoSaveOutline />
                    </span>
                    Simpan
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

export default SiswaCreate;
