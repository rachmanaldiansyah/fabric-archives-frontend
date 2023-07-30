import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const SertifikatEdit = () => {
  const [no_sertifikat, setNoSertifikat] = useState("");
  const [nis, setNis] = useState("");
  const [nama, setNama] = useState("");
  const [jk, setJk] = useState("");
  const [keahlian, setKeahlian] = useState("");
  const [arsip_sertifikat, setArsipSertifikat] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getSertifikatById = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/sertifikat/${id}`
        );
        setNoSertifikat(response.data.no_sertifikat);
        setNis(response.data.nis);
        setNama(response.data.nama);
        setJk(response.data.jk);
        setKeahlian(response.data.keahlian);
        setArsipSertifikat(response.data.arsip_sertifikat);
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    };
    getSertifikatById();
  }, [id]);

  const updateSertifikat = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/sertifikat/${id}`, {
        no_sertifikat: no_sertifikat,
        nis: nis,
        nama: nama,
        jk: jk,
        keahlian: keahlian,
        arsip_sertifikat: arsip_sertifikat,
      });
      navigate("/sertifikat");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div>
      <div className="card is-shadowless">
        <div className="card-content">
          <h1 className="title">Kelola Arsip Sertifikat</h1>
          <h2 className="subtitle">Mengubah data arsip sertifikat Baru</h2>
          <div className="content">
            <form onSubmit={updateSertifikat}>
              <p className="has-text-centered">{msg}</p>
              <div className="field">
                <label className="label">No Sertifikat</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={no_sertifikat}
                    onChange={(e) => setNoSertifikat(e.target.value)}
                    placeholder="Isi nomor sertifikat siswa"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Nomor Induk</label>
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
                      <option value="" selected disabled>
                        Pilih Jenis Kelamin
                      </option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="field">
                <label className="label">Keahlian Kompetensi</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select
                      value={keahlian}
                      onChange={(e) => setKeahlian(e.target.value)}
                    >
                      <option value="" selected disabled>
                        Pilih Keahlian Kompetensi
                      </option>
                      <option value="Teknik Komputer & Jaringan">
                        Teknik Komputer & Jaringan
                      </option>
                      <option value="Pethotelan">Perhotelan</option>
                      <option value="Multimedia">Multimedia</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="field">
                <label className="label">Arsip Sertifikat</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={arsip_sertifikat}
                    onChange={(e) => setArsipSertifikat(e.target.value)}
                    placeholder="Isi arsip sertifikat siswa"
                  />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <button type="submit" className="button is-success">
                    Update
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

export default SertifikatEdit;
