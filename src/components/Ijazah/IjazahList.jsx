import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Modal from "../Modal";

const IjazahList = () => {
  const [ijazah, setIjazah] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const [selectedProdi, setSelectedProdi] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedIjazah, setSelectedIjazah] = useState(null)

  useEffect(() => {
    getIjazah();
  }, []);

  const getIjazah = async () => {
    const response = await axios.get("http://localhost:5000/ijazah");
    setIjazah(response.data);
  };

  const deleteIjazah = async (ijazahId) => {
    await axios.delete(`http://localhost:5000/ijazah/${ijazahId}`);
    getIjazah();
  };

  const openModal = (arsipIjazah) => {
    setSelectedIjazah(arsipIjazah);
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
      <h1 className="title">Kelola Daftar Ijazah</h1>
      <h2 className="subtitle">Daftar Data Ijazah</h2>
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
      <div className="table-container">
        <table className="table is-striped is-fullwidth">
          <thead>
            <tr>
              <th>No</th>
              <th>No Ijazah</th>
              <th>NISN</th>
              <th>NIS</th>
              <th>Nama Siswa</th>
              <th>Jenis Kelamin</th>
              <th>Nama Orangtua</th>
              <th>Prodi</th>
              <th>Arsip Ijazah</th>
              {user && user.roles === "admin" && <th>Actions</th>}
              {user && user.roles === "kesiswaan" && <th>Actions</th>}
              {user && user.roles === "kepala sekolah" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {ijazah.map(
              (ijazah, index) =>
                (!selectedProdi || selectedProdi === ijazah.prodi) && (
                  <tr key={ijazah.uuid}>
                    <td>{index + 1}</td>
                    <td>{ijazah.no_ijazah}</td>
                    <td>{ijazah.nisn}</td>
                    <td>{ijazah.nis}</td>
                    <td>{ijazah.nama}</td>
                    <td>{ijazah.jk}</td>
                    <td>{ijazah.nama_orangtua}</td>
                    <td>{ijazah.prodi}</td>
                    <td>
                      <button
                        className="button is-small is-primary"
                        onClick={() => openModal(ijazah.arsip_ijazah)}
                      >
                        Arsip Ijazah
                      </button>
                      {modalIsOpen && (
                        <Modal
                          title="Arsip Ijazah"
                          content={selectedIjazah}
                          onClose={closeModal}
                        />
                      )}
                    </td>
                    {user && user.roles === "admin" && (
                      <td>
                        <Link
                          to={`/ijazah/edit/${ijazah.uuid}`}
                          className="button is-small is-info"
                        >
                          Ubah
                        </Link>
                        <button
                          onClick={() => deleteIjazah(ijazah.uuid)}
                          className="button is-small is-danger"
                        >
                          Hapus
                        </button>
                      </td>
                    )}
                    {user && user.roles === "kepala sekolah" && (
                      <td>
                        <Link
                          to={`/ijazah/edit/${ijazah.uuid}`}
                          className="button is-small is-info"
                        >
                          Konfirmasi
                        </Link>
                      </td>
                    )}
                    {user && user.roles === "kesiswaan" && (
                      <td>
                        <Link
                          to={`/ijazah/edit/${ijazah.uuid}`}
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
    </div>
  );
};

export default IjazahList;
