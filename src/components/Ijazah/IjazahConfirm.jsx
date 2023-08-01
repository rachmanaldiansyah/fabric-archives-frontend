import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { IoCloudUploadOutline } from "react-icons/io5";
import axios from "axios";
import Modal from "../Modal";

const IjazahConfirm = () => {
  const [ijazah, setIjazah] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const [selectedProdi, setSelectedProdi] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedIjazah, setSelectedIjazah] = useState(null);

  useEffect(() => {
    getIjazah();
  }, []);

  const getIjazah = async () => {
    const response = await axios.get("http://localhost:5000/ijazah");
    setIjazah(response.data);
  };

  const getStatus = (ijazah) => {
    const isKepsekConfirmed = ijazah.konfirmasi_kepsek === "Dikonfirmasi";
    const isKesiswaanConfirmed = ijazah.konfirmasi_kesiswaan === "Dikonfirmasi";

    if (isKepsekConfirmed && isKesiswaanConfirmed) {
      return "Valid";
    } else {
      return "Invalid";
    }
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
    <div className="container">
      <h1 className="title mt-2">Kelola Daftar Arsip Ijazah</h1>
      <h2 className="subtitle">Daftar data arsip ijazah siswa</h2>
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
        <table className="table is-striped is-fullwidth is-hoverable">
          <thead>
            <tr>
              <th>No</th>
              <th>No Ijazah</th>
              <th>NISN</th>
              <th>NIS</th>
              <th>Nama Siswa</th>
              <th>Jenis Kelamin</th>
              <th>Nama Orangtua</th>
              <th>Program Studi</th>
              <th>Arsip Ijazah</th>
              {user && user.roles === "kepala sekolah" && (
                <>
                  <th>Status</th>
                  <th>Actions</th>
                </>
              )}
              {user && user.roles === "kesiswaan" && (
                <>
                  <th>Status</th>
                </>
              )}
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
                        className="button is-small is-fullwidth is-primary"
                        onClick={() =>
                          openModal(
                            "https://" + ijazah.arsip_ijazah + ".ipfs.w3s.link"
                          )
                        }
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
                    {user && user.roles === "kepala sekolah" && (
                      <>
                        <td>
                          {getStatus(ijazah) === "Valid" && (
                            <td className="button is-small is-success is-fullwidth">
                              {getStatus(ijazah)}
                            </td>
                          )}
                          {getStatus(ijazah) === "Invalid" && (
                            <td className="button is-small is-warning is-fullwidth">
                              {getStatus(ijazah)}
                            </td>
                          )}
                        </td>
                        <td>
                          <button className="button is-small is-info is-fullwidth">
                            <IoCloudUploadOutline />
                          </button>
                        </td>
                      </>
                    )}
                    {user && user.roles === "kesiswaan" && (
                      <>
                        <td>
                          {getStatus(ijazah) === "Valid" && (
                            <td className="button is-small is-success is-fullwidth">
                              {getStatus(ijazah)}
                            </td>
                          )}
                          {getStatus(ijazah) === "Invalid" && (
                            <td className="button is-small is-warning is-fullwidth">
                              {getStatus(ijazah)}
                            </td>
                          )}
                        </td>
                      </>
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

export default IjazahConfirm;
