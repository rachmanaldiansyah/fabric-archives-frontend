import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Modal from "../Modal";

const SertifikatList = () => {
  const [sertifikat, setSertifikat] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const [selectedProdi, setSelectedProdi] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedSertifikat, setSelectedSertifikat] = useState(null);

  useEffect(() => {
    getSertifikat();
  }, []);

  const getSertifikat = async () => {
    const response = await axios.get("http://localhost:5000/sertifikat");
    setSertifikat(response.data);
  };

  const deleteSertifikat = async (sertifikatId) => {
    await axios.delete(`http://localhost:5000/sertifikat/${sertifikatId}`);
    getSertifikat();
  };

  const openModal = (arsipSertifikat) => {
    setSelectedSertifikat(arsipSertifikat);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleProdiFilterChange = (event) => {
    setSelectedProdi(event.target.value);
  };

  return (
    <div>
      <h1 className="title">Kelola Arsip Sertifikat</h1>
      <h2 className="subtitle">Daftar Data Sertifikat</h2>
      <div className="container mb-2">
        <div className="control">
          <select
            className="select"
            id="prodiFilter"
            value={selectedProdi}
            onChange={handleProdiFilterChange}
          >
            <option value="" selected disabled>
              Pilih Program Studi
            </option>
            <option value="Teknik Komputer & Jaringan">
              Teknik Komputer & Jaringan
            </option>
            <option value="Perhotelan">Perhotelan</option>
            <option value="Multimedia">Multimedia</option>
          </select>
        </div>
      </div>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>No</th>
            <th>No Sertifikat</th>
            <th>Nomor Induk</th>
            <th>Nama Siswa</th>
            <th>Jenis Kelamin</th>
            <th>Kompetensi Keahlian</th>
            <th>Arsip Sertifikat</th>
            {user && user.roles === "admin" && <th>Actions</th>}
            {user && user.roles === "kepala sekolah" && <th>Actions</th>}
            {user && user.roles === "mitra penerbit" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {sertifikat.map(
            (sertifikat, index) =>
              (!selectedProdi || selectedProdi === sertifikat.keahlian) && (
                <tr key={sertifikat.uuid}>
                  <td>{index + 1}</td>
                  <td>{sertifikat.no_sertifikat}</td>
                  <td>{sertifikat.nis}</td>
                  <td>{sertifikat.nama}</td>
                  <td>{sertifikat.jk}</td>
                  <td>{sertifikat.keahlian}</td>
                  <td>
                    <button
                      className="button is-small is-primary"
                      onClick={() => openModal(sertifikat.arsip_sertifikat)}
                    >
                      Arsip Sertifikat
                    </button>
                    {modalIsOpen && (
                      <Modal
                        title="Arsip Sertifikat"
                        content={selectedSertifikat}
                        onClose={closeModal}
                      />
                    )}
                  </td>
                  {user && user.roles === "admin" && (
                    <td>
                      <Link
                        to={`/sertifikat/edit/${sertifikat.uuid}`}
                        className="button is-small is-info"
                      >
                        Ubah
                      </Link>
                      <button
                        onClick={() => deleteSertifikat(sertifikat.uuid)}
                        className="button is-small is-danger"
                      >
                        Hapus
                      </button>
                    </td>
                  )}
                  {user && user.roles === "kepala sekolah" && (
                    <td>
                      <Link
                        to={`/sertifikat/edit/${sertifikat.uuid}`}
                        className="button is-small is-info"
                      >
                        Konfirmasi
                      </Link>
                    </td>
                  )}
                  {user && user.roles === "mitra penerbit" && (
                    <td>
                      <Link
                        to={`/sertifikat/edit/${sertifikat.uuid}`}
                        className="button is-small is-info"
                      >
                        Konfirmasi
                      </Link>
                    </td>
                  )}
                </tr>
              )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SertifikatList;
