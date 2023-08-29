import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Web3Storage } from "web3.storage";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const SertifikatCreate = () => {
  const [no_sertifikat, setNoSertifikat] = useState("");
  const [nis, setNis] = useState("");
  const [nama, setNama] = useState("");
  const [jk, setJk] = useState("");
  const [prodi, setProdi] = useState("");
  const [arsip_sertifikat, setArsipSertifikat] = useState("");
  const [msg] = useState("");
  const navigate = useNavigate();

  const fetchStudentData = async (nis) => {
    try {
      const response = await axios.get(`http://localhost:5000/siswa/nomor_induk/${nis}`);
      const studentData = response.data;

      setNis(studentData.nis);
      setNama(studentData.nama);
      setJk(studentData.jk);
      setProdi(studentData.prodi);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

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
      text: "Data arsip sertifikat siswa berhasil diarsipkakn!",
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
      text: "Data arsip sertifikat uji kompetensi siswa berhasil diarsipkan!",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    });
  };

  const showErrorNotification = (errorMsg) => {
    Toastify({
      text: "Gagal saat mengarsipkan data sertifikat: " + errorMsg,
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
      text: "Gagal saat mengarsipkan data sertifikat" + errorMsg,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    });
  };

  const saveSertifikat = async (e) => {
    e.preventDefault();

    if (!arsip_sertifikat) {
      showErrorNotification(
        "File arsip sertifikat uji kompetensi belum dipilih."
      );
      return;
    }

    try {
      const cid = await uploadToIPFS(arsip_sertifikat);
      await axios.post("http://localhost:5000/sertifikat", {
        no_sertifikat: no_sertifikat,
        nis: nis,
        nama: nama,
        jk: jk,
        keahlian: prodi,
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
      <div className="hero is-primary is-bold box">
        <h1 className="title is-family-sans-serif is-uppercase has-text-centered has-text-weight-semibold mt-2">
          Kelola Daftar Arsip Sertifikat Uji Kompetensi
        </h1>
        <h2 className="subtitle is-family-sans-serif is-capitalized has-text-dark has-text-centered has-text-weight-light">
          Mengarsipkan data sertifikat uji kompetensi siswa
        </h2>
      </div>

      <div className="card is-shadowless">
        <div className="card-content">
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
                    onChange={(e) => handleInputChange(e, setNoSertifikat)}
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
                    onChange={(e) => {
                      handleInputChange(e, setNis);
                      fetchStudentData(e.target.value);
                    }}
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
                      value={prodi}
                      onChange={(e) => setProdi(e.target.value)}
                    >
                      <option value="" selected disabled>
                        Pilih Keahlian Kompetensi
                      </option>
                      <option value="Teknik Komputer & Jaringan">
                        Teknik Komputer & Jaringan
                      </option>
                      <option value="Perhotelan">Perhotelan</option>
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
