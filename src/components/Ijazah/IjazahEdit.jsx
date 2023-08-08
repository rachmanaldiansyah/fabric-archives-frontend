import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Web3Storage } from "web3.storage";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const IjazahEdit = () => {
  const [no_ijazah, setNoIjazah] = useState("");
  const [nisn, setNisn] = useState("");
  const [nis, setNis] = useState("");
  const [nama, setNama] = useState("");
  const [jk, setJk] = useState("");
  const [nama_orangtua, setNamaOrangtua] = useState("");
  const [prodi, setProdi] = useState("");
  const [arsip_ijazah, setArsipIjazah] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getIjazahById = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/ijazah/${id}`);
        setNoIjazah(response.data.no_ijazah);
        setNisn(response.data.nisn);
        setNis(response.data.nis);
        setNama(response.data.nama);
        setJk(response.data.jk);
        setNamaOrangtua(response.data.nama_orangtua);
        setProdi(response.data.prodi);
        setArsipIjazah(response.data.arsip_ijazah);
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    };
    getIjazahById();
  }, [id]);

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

  const updateIjazah = async (e) => {
    e.preventDefault();

    if (!arsip_ijazah) {
      showErrorNotification("File arsip ijazah belum dipilih.");
      return;
    }

    try {
      const cid = await uploadToIPFS(arsip_ijazah);
      await axios.patch(`http://localhost:5000/ijazah/${id}`, {
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

  const showSuccessNotification = () => {
    Toastify({
      text: "Data arsip ijazah siswa berhasil diubah!",
      duration: 3000,
      gravity: "bottom",
      position: "right",
      backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
    }).showToast();

    Swal.fire({
      title: "Success",
      icon: "success",
      text: "Data arsip ijazah siswa berhasil diubah!",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    });
  };

  const showErrorNotification = (errorMsg) => {
    Toastify({
      text: "Error saat mengubah data arsip ijazah: " + errorMsg,
      duration: 3000,
      gravity: "bottom",
      position: "right",
      backgroundColor: "linear-gradient(to right, #ff0000, #940000)",
    }).showToast();

    Swal.fire({
      title: "Error",
      icon: "error",
      text: "Gagal saat mengubah data arsip ijazah: " + errorMsg,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    });
  };

  return (
    <div className="container box">
      <div className="hero is-primary is-bold box">
        <h1 className="title is-family-sans-serif is-uppercase has-text-centered has-text-weight-semibold mt-2">
          Kelola Daftar Arsip Ijazah Siswa
        </h1>
        <h2 className="subtitle is-family-sans-serif is-capitalized has-text-dark has-text-centered has-text-weight-light">
          Mengubah data arsip ijazah siswa
        </h2>
      </div>

      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form onSubmit={updateIjazah}>
              <p className="has-text-centered">{msg}</p>
              <div className="field">
                <label className="label">No Ijazah</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={no_ijazah}
                    onChange={(e) => setNoIjazah(e.target.value)}
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
                    onChange={(e) => setNisn(e.target.value)}
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
                <label className="label">Nama Orang Tua/Wali</label>
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
                  <button type="submit" className="button mt-4 is-primary">
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

export default IjazahEdit;
