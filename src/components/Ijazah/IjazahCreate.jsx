import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Web3Storage } from "web3.storage";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import {
  IoArchiveOutline
} from "react-icons/io5";

const IjazahCreate = () => {
  const [no_ijazah, setNoIjazah] = useState("");
  const [nisn, setNisn] = useState("");
  const [nis, setNis] = useState("");
  const [nama, setNama] = useState("");
  const [jk, setJk] = useState("");
  const [nama_orangtua, setNamaOrangtua] = useState("");
  const [prodi, setProdi] = useState("");
  const [arsip_ijazah, setArsipIjazah] = useState("");
  const [msg] = useState("");
  const navigate = useNavigate();

  const fetchStudentData = async (nisn) => {
    try {
      const response = await axios.get(`http://localhost:5000/siswa/nisn/${nisn}`);
      const studentData = response.data;

      setNisn(studentData.nisn);
      setNis(studentData.nis);
      setNama(studentData.nama);
      setJk(studentData.jk);
      setNamaOrangtua(studentData.nama_orangtua);
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
    const files = [new File([file], `Arsip Ijazah ${nama}`)];

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
      text: "Data arsip ijazah siswa berhasil diarsipkan.",
      duration: 3000,
      gravity: "bottom",
      position: "right",
      backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
    }).showToast();

    Swal.fire({
      title: "Success",
      icon: "success",
      text: "Data ijazah siswa berhasil diarsipkan!",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    });
  };

  const showErrorNotification = (errorMsg) => {
    Toastify({
      text: "Gagal saat mengarsipkan data ijazah: " + errorMsg,
      duration: 3000,
      gravity: "bottom",
      position: "right",
      backgroundColor: "linear-gradient(to right, #ff0000, #940000)",
    }).showToast();

    Swal.fire({
      title: "Error",
      icon: "error",
      text: "Gagal saat mengarsipkan data ijazah: " + errorMsg,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    });
  };

  const SaveIjazah = async (e) => {
    e.preventDefault();

    if (!arsip_ijazah) {
      showErrorNotification("File arsip ijazah belum dipilih.");
      return;
    }

    try {
      const cid = await uploadToIPFS(arsip_ijazah);
      await axios.post("http://localhost:5000/ijazah", {
        no_ijazah: no_ijazah,
        nisn: nisn,
        nis: nis,
        nama: nama,
        jk: jk,
        nama_orangtua: nama_orangtua,
        prodi: prodi,
        arsip_ijazah: cid,
      });
      showSuccessNotification();
      navigate("/ijazah");
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
          Kelola Daftar Arsip Ijazah Siswa
        </h1>
        <h2 className="subtitle is-family-sans-serif is-capitalized has-text-dark has-text-centered has-text-weight-light">
          Mengarsipkan data ijazah siswa
        </h2>
      </div>

      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form onSubmit={SaveIjazah}>
              <p className="has-text-centered">{msg}</p>
              <div className="field">
                <label className="label">No Ijazah</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={no_ijazah}
                    onChange={(e) => handleInputChange(e, setNoIjazah)}
                    placeholder="Isi nomor ijazah siswa"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">NISN</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={nisn}
                    onChange={(e) => {
                      handleInputChange(e, setNisn);
                      fetchStudentData(e.target.value);
                    }}
                    placeholder="Isi nomor siswa induk nasional"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Nomor Induk Siswa</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={nis}
                    onChange={(e) => handleInputChange(e, setNis)}
                    placeholder="Isi nomor induk siswa"
                    readOnly
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
                    readOnly
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
                <label className="label">Nama Orang Tua/Wali</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={nama_orangtua}
                    onChange={(e) => setNamaOrangtua(e.target.value)}
                    placeholder="Isi nama lengkap orang tua siswa"
                    readOnly
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
                      <option value="" selected disabled>
                        Pilih Program Keahlian
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
                <label className="label">Arsip Ijazah</label>
                <div className="control">
                  <input
                    className="input"
                    type="file"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    name={arsip_ijazah}
                    onChange={(e) => setArsipIjazah(e.target.files[0])}
                    required
                  />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <button type="submit" className="button has-text-weight-semibold is-success">
                    <span className="icon mr-1">
                      <IoArchiveOutline />
                    </span>
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

export default IjazahCreate;