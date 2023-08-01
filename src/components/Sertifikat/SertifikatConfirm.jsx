import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { IoCloudUploadOutline } from "react-icons/io5";
import axios from "axios";
import Modal from "../Modal";

const SertifikatConfirm = () => {
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

  // fungsi untuk mendapatkan status valid/invalid
  const getStatus = (sertifikat) => {
    const isKepsekConfirmed = sertifikat.konfirmasi_kepsek === "Dikonfirmasi";
    const isKesiswaanConfirmed = sertifikat.konfirmasi_mitra === "Dikonfirmasi";

    if (isKepsekConfirmed && isKesiswaanConfirmed) {
      return "Valid";
    } else {
      return "Invalid";
    }
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
      <h1 className="title mt-2">Kelola Daftar Arsip Sertifikat</h1>
      <h2 className="subtitle">
        Daftar data arsip sertifikat uji kompetensi siswa
      </h2>
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
            {user && user.roles === "kepala sekolah" && (
              <>
                <th>Status</th>
                <th>Actions</th>
              </>
            )}
            {user && user.roles === "mitra penerbit" && (
              <>
                <th>Status</th>
              </>
            )}
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
                      className="button is-small is-primary is-fullwidth"
                      onClick={() =>
                        openModal(
                          "https://" +
                            sertifikat.arsip_sertifikat +
                            ".ipfs.w3s.link"
                        )
                      }
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
                  {user && user.roles === "kepala sekolah" && (
                    <>
                      {getStatus(sertifikat) === "Valid" && (
                        <td className="button is-small is-success is-fullwidth mt-2">
                          {getStatus(sertifikat)}
                        </td>
                      )}
                      {getStatus(sertifikat) === "Invalid" && (
                        <td className="button is-small is-warning is-fullwidth mt-2">
                          {getStatus(sertifikat)}
                        </td>
                      )}
                      <td>
                        <button
                          className="button is-small is-info is-fullwidth"
                        >
                          <IoCloudUploadOutline />
                        </button>
                      </td>
                    </>
                  )}
                  {user && user.roles === "mitra penerbit" && (
                    <>
                      {getStatus(sertifikat) === "Valid" && (
                        <td className="button is-small is-success is-fullwidth mt-2">
                          {getStatus(sertifikat)}
                        </td>
                      )}
                      {getStatus(sertifikat) === "Invalid" && (
                        <td className="button is-small is-warning is-fullwidth mt-2">
                          {getStatus(sertifikat)}
                        </td>
                      )}
                    </>
                  )}
                </tr>
              )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SertifikatConfirm;
