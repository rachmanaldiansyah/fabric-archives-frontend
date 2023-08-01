import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Modal from "../Modal";
import Swal from "sweetalert2";
import { IoTrashOutline, IoCreateOutline } from "react-icons/io5";

const IjazahList = () => {
  const [ijazah, setIjazah] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const [selectedProdi, setSelectedProdi] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedIjazah, setSelectedIjazah] = useState(null);
  const [confirmedIjazah, setConfirmedIjazah] = useState([]);

  useEffect(() => {
    getIjazah();
  }, []);

  const getIjazah = async () => {
    const response = await axios.get("http://localhost:5000/ijazah");
    setIjazah(response.data);
  };

  const deleteIjazah = async (ijazahId) => {
    Swal.fire({
      title: "Apakah Anda Yakin Akan Menghapus Data Ini?",
      text: "Data arsip ijazah yang terhapus tidak akan bisa kembali!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`http://localhost:5000/ijazah/${ijazahId}`);
        getIjazah();
        Swal.fire("Terhapus!", "Data Arsip Ijazah Telah Dihapus.", "success");
      }
    });
  };

  // fungsi untuk konfirmasi data sebagai Kepala Sekolah
  const konfirmasiKepalaSekolah = async (ijazahId) => {
    try {
      const response = await axios({
        url: `http://localhost:5000/ijazah/${ijazahId}`,
        method: "PATCH",
        data: {
          konfirmasi_kepsek: "Dikonfirmasi",
        },
      });
      // Setelah berhasil dikonfirmasi oleh kepala sekolah, update status di state
      setConfirmedIjazah((prevConfirmedIjazah) => [
        ...prevConfirmedIjazah,
        response.data,
      ]);
      Swal.fire(
        "Terkonfirmasi!",
        "Data Arsip Ijazah Telah Dikonfirmasi oleh Kepala Sekolah.",
        "success"
      );
    } catch (error) {
      console.log(error);
    }
  };

  // fungsi untuk konfirmasi data sebagai kesiswaan
  const konfirmasiKesiswaan = async (ijazahId) => {
    try {
      const response = await axios({
        url: `http://localhost:5000/ijazah/${ijazahId}`,
        method: "PATCH",
        data: {
          konfirmasi_kesiswaan: "Dikonfirmasi",
        },
      });
      // Setelah berhasil dikonfirmasi oleh kesiswaan, update status di state
      setConfirmedIjazah((prevConfirmedIjazah) => [
        ...prevConfirmedIjazah,
        response.data,
      ]);
      Swal.fire(
        "Terkonfirmasi!",
        "Data Arsip Ijazah Telah Dikonfirmasi oleh Kesiswaan.",
        "success"
      );
    } catch (error) {
      console.log(error);
    }
  };

  const isIjazahConfirmed = (ijazahId) => {
    return confirmedIjazah.includes(ijazahId);
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
              {user && user.roles === "admin" && (
                <>
                  <th>Status</th>
                  <th>Actions</th>
                </>
              )}
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
                    {user && user.roles === "admin" && (
                      <>
                        {getStatus(ijazah) === "Valid" && (
                          <td className="button is-small is-success is-fullwidth mt-2">
                            {getStatus(ijazah)}
                          </td>
                        )}
                        {getStatus(ijazah) === "Invalid" && (
                          <td className="button is-small is-warning is-fullwidth mt-2">
                            {getStatus(ijazah)}
                          </td>
                        )}
                        <td>
                          <Link
                            to={`/ijazah/edit/${ijazah.uuid}`}
                            className="button is-small is-info is-fullwidth"
                          >
                            <IoCreateOutline />
                          </Link>
                          <button
                            onClick={() => deleteIjazah(ijazah.uuid)}
                            className="button is-small is-danger is-fullwidth mt-1"
                          >
                            <IoTrashOutline />
                          </button>
                        </td>
                      </>
                    )}
                    {user && user.roles === "kepala sekolah" && (
                      <td>
                        {isIjazahConfirmed(ijazah.uuid) ? (
                          <span className="tag is-success">Terkonfirmasi</span>
                        ) : (
                          <button
                            onClick={() => konfirmasiKepalaSekolah(ijazah.uuid)}
                            className="button is-small is-info"
                          >
                            Konfirmasi
                          </button>
                        )}
                      </td>
                    )}
                    {user && user.roles === "kesiswaan" && (
                      <td>
                        {isIjazahConfirmed(ijazah.uuid) ? (
                          <span className="tag is-success">Terkonfirmasi</span>
                        ) : (
                          <button
                            onClick={() => konfirmasiKesiswaan(ijazah.uuid)}
                            className="button is-small is-info"
                          >
                            Konfirmasi
                          </button>
                        )}
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
