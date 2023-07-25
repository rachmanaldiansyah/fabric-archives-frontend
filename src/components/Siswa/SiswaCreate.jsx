import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SiswaCreate = () => {
  const [nisn, setNisn] = useState("");
  const [nis, setNis] = useState("");
  const [nama_siswa, setNamaSiswa] = useState("");
  const [jk, setJk] = useState("");
  const [nama_orangtua, setNamaOrangtua] = useState("");
  const [prodi, setProdi] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const SaveSiswa = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/siswa", {
        nisn: nisn,
        nis: nis,
        nama_siswa: nama_siswa,
        jk: jk,
        nama_orangtua: nama_orangtua,
        prodi: prodi,
      });
      navigate("/siswa");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div>
      <h1 className="title">Siswa</h1>
      <h2 className="subtitle">Daftar Siswa Baru</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form onSubmit={SaveSiswa}>
              <p className="has-text-centered">{msg}</p>
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
                <label className="label">Nama Siswa</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={nama_siswa}
                    onChange={(e) => setNamaSiswa(e.target.value)}
                    placeholder="Isi nama lengkap siswa"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Jenis Kelamin</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select
                      value={jk}
                      onChange={(e) => setJk(e.target.value)}
                    >
                      <option value="admin">Laki-laki</option>
                      <option value="kepala sekolah">Perempuan</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="field">
                <label className="label">Nama Orangtua</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={nama_orangtua}
                    onChange={(e) => setNamaOrangtua(e.target.value)}
                    placeholder="Isi nama lengkap orang tua siswa"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Program Keahlian</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select
                      value={prodi}
                      onChange={(e) => setProdi(e.target.value)}
                    >
                      <option value="Teknik Komputer & Jaringan">Teknik Komputer & Jaringan</option>
                      <option value="Multimedia">Multimedia</option>
                      <option value="Perhotelan">Perhotelan</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <button type="submit" className="button is-success">
                    Daftarkan
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
