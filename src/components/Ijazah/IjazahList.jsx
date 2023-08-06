import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Modal from "../Modal";
import Swal from "sweetalert2";
import { IoTrashOutline, IoCreateOutline, IoHandRightOutline, IoCheckmarkDoneCircleOutline } from "react-icons/io5";

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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate the index range of items to display for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = ijazah.slice(indexOfFirstItem, indexOfLastItem);

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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

  const tolakIjazah = async (ijazahId) => {
    try {
      const response = await axios({
        url: `http://localhost:5000/ijazah/${ijazahId}`,
        method: "PATCH",
        data: {
          konfirmasi_kepsek: "Ditolak",
        },
      });
      setConfirmedIjazah((prevConfirmedIjazah) => [
        ...prevConfirmedIjazah,
        response.data,
      ]);
      Swal.fire(
        "Ditolak!",
        "Data Arsip Ijazah Telah Ditolak oleh Kepala Sekolah.",
        "success"
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getStatus = (ijazah) => {
    const isKepsekConfirmed = ijazah.konfirmasi_kepsek === "Dikonfirmasi";
    const isKesiswaanConfirmed = ijazah.konfirmasi_kesiswaan === "Dikonfirmasi";

    if (isKepsekConfirmed && isKesiswaanConfirmed) {
      return "Dikonfirmasi";
    } else {
      return "Pending";
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
    <div className="container box">
      <div className="hero is-primary is-bold box">
        <h1 className="title mt-2">Kelola Daftar Arsip Ijazah</h1>
        <h2 className="subtitle">Daftar data arsip ijazah siswa</h2>
      </div>

      <div className="container mb-2">
        <div className="control select is-primary">
          <select
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
        <table className="table is-narrow is-striped is-fullwidth is-hoverable">
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
            {currentItems.map(
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
                        className="button is-small is-fullwidth is-primary mt-1"
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
                        {getStatus(ijazah) === "Dikonfirmasi" && (
                          <td className="tag is-small is-success is-fullwidth mt-2">
                            {getStatus(ijazah)}
                          </td>
                        )}
                        {getStatus(ijazah) === "Pending" && (
                          <td className="tag is-small is-warning is-fullwidth mt-2">
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
                          <>
                            <button
                              onClick={() =>
                                konfirmasiKepalaSekolah(ijazah.uuid)
                              }
                              className="button is-fullwidth is-small is-info mt-1"
                            >
                              <IoCheckmarkDoneCircleOutline />
                            </button>
                            <button
                              onClick={() => tolakIjazah(ijazah.uuid)}
                              className="button is-fullwidth is-small is-danger mt-1"
                            >
                              <IoHandRightOutline />
                            </button>
                          </>
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
                            className="button is-fullwidth is-small is-info mt-1"
                          >
                            <IoCheckmarkDoneCircleOutline />
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
      {/* Tampilan Pagination */}
      <nav
        className="pagination is-centered is-rounded"
        role="navigation"
        aria-label="pagination"
      >
        <ul className="pagination-list">
          {Array.from({ length: Math.ceil(ijazah.length / itemsPerPage) }).map(
            (_, i) => (
              <li key={i}>
                <button
                  className={`pagination-link${
                    currentPage === i + 1 ? " is-current" : ""
                  }`}
                  aria-label={`Goto page ${i + 1}`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            )
          )}
        </ul>
      </nav>
    </div>
  );
};

export default IjazahList;
