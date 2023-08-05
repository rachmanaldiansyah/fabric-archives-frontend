import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Web3Storage } from "web3.storage";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

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

  const uploadToIPFS = async (file) => {
    const apiKey =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGUwOUJDQjZBYjAxRDQzMzlEMjY3MjVDRDcyQWFjMUEyYzUyRWJiOTciLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODQyNzc5OTU2NjgsIm5hbWUiOiJ0ZXN0aW5nIn0.gCHtwTQvqHYInM4qXKyhOtextW-fxkJlqYSR8NUfqyE";
    const storage = new Web3Storage({ token: apiKey });
    const files = [new File([file], `Arsip Sertifikat ${nama}`)];

    try {
      const cid = await storage.put(files);
      return cid;
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      return null;
    }
  };

  const showSuccessNotification = () => {
    Toastify({
      text: "Data arsip sertifikat siswa berhasil diubah!",
      duration: 3000,
      gravity: "bottom",
      position: "right",
      backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
    }).showToast();

    Swal.fire({
      title: "Success",
      icon: "success",
      text: "Data arsip sertifikat uji kompetensi siswa berhasil diubah!",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    });
  };

  const showErrorNotification = (errorMsg) => {
    Toastify({
      text: "Gagal saat mengubah data arsip sertifikat: " + errorMsg,
      duration: 3000,
      gravity: "bottom",
      position: "right",
      backgroundColor: "linear-gradient(to right, #ff0000, #940000)",
    }).showToast();

    Swal.fire({
      title: "Error",
      icon: "error",
      text: "Gagal saat mengubah data arsip sertifikat: " + errorMsg,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    });
  };

  const updateSertifikat = async (e) => {
    e.preventDefault();

    if (!arsip_sertifikat) {
      showErrorNotification(
        "File arsip sertifikat uji kompetensi belum dipilih."
      );
      return;
    }

    try {
      const cid = await uploadToIPFS(arsip_sertifikat);
      await axios.patch(`http://localhost:5000/sertifikat/${id}`, {
        no_sertifikat: no_sertifikat,
        nis: nis,
        nama: nama,
        jk: jk,
        keahlian: keahlian,
        arsip_sertifikat: cid,
      });
      showSuccessNotification();
      navigate("/sertifikat");
    } catch (error) {
      if (error.response) {
        showErrorNotification(error.response.data.msg);
      }
    }
  };

  return (
    <div className="container box">
      <div className="hero is-info is-bold box">
        <h1 className="title mt-2">
          Kelola Daftar Arsip Sertifikat Uji Kompetensi
        </h1>
        <h2 className="subtitle">
          Mengubah data arsip sertifikat ujikom siswa
        </h2>
      </div>

      <div className="card is-shadowless">
        <div className="card-content">
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
                  <button type="submit" className="button mt-4 is-info is-fullwidth">
                    Ubah Data Arsip Sertifikat
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
