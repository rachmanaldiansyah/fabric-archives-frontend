import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Web3Storage } from "web3.storage";

const SertifikatCreate = () => {
  const [no_sertifikat, setNoSertifikat] = useState("");
  const [nis, setNis] = useState("");
  const [nama, setNama] = useState("");
  const [jk, setJk] = useState("");
  const [keahlian, setKeahlian] = useState("");
  const [arsip_sertifikat, setArsipSertifikat] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const uploadToIPFS = async (file) => {
    const apiKey = process.env.WEB3STORAGE_TOKEN;
    const storage = new Web3Storage({ token: apiKey });
    const files = [new File([file], "arsip_sertifikat")];

    try {
      const cid = await storage.put(files);
      return cid;
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      return null;
    }
  };

  const saveSertifikat = async (e) => {
    e.preventDefault();
    try {
      const cid = await uploadToIPFS(arsip_sertifikat);
      await axios.post("http://localhost:5000/sertifikat", {
        no_sertifikat: no_sertifikat,
        nis: nis,
        nama: nama,
        jk: jk,
        keahlian: keahlian,
        arsip_sertifikat: cid,
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
          <h2 className="subtitle">Menambahkan data arsip sertifikat uji kompetensi siswa</h2>
          <div className="content">
            <form onSubmit={saveSertifikat}>
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
                    className="input"
                    type="file"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    name={arsip_sertifikat}
                    onChange={(e) => setArsipSertifikat(e.target.files[0])}
                    required
                  />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <button type="submit" className="button is-success">
                    Arsipkan
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

export default SertifikatCreate;
