import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  IoTrashOutline,
  IoCreateOutline,
  IoHandRightOutline,
  IoCheckmarkDoneCircleOutline,
} from "react-icons/io5";

const SertifikatList = () => {
  const { user } = useSelector((state) => state.auth);
  const [sertifikat, setSertifikat] = useState([]);
  const [selectedProdi, setSelectedProdi] = useState("");
  const [confirmedSertifikat, setConfirmedSertifikat] = useState([]);

  useEffect(() => {
    getSertifikat();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate the index range of items to display for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sertifikat.slice(indexOfFirstItem, indexOfLastItem);

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getSertifikat = async () => {
    const response = await axios.get("http://localhost:5000/sertifikat");
    setSertifikat(response.data);
  };

  const deleteSertifikat = async (sertifikatId) => {
    Swal.fire({
      title: "Apakah Anda Yakin Akan Menghapus Data Ini?",
      text: "Data arsip sertifikat yang terhapus tidak akan bisa kembali!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`http://localhost:5000/sertifikat/${sertifikatId}`);
        getSertifikat();
        Swal.fire(
          "Terhapus!",
          "Data Arsip Sertifikat Telah Dihapus.",
          "success"
        );
      }
    });
  };

  // fungsi untuk konfirmasi data sebagai Kepala Sekolah
  const konfirmasiKepalaSekolah = async (sertifikatId) => {
    try {
      const response = await axios({
        url: `http://localhost:5000/sertifikat/${sertifikatId}`,
        method: "PATCH",
        data: {
          konfirmasi_kepsek: "Dikonfirmasi",
        },
      });
      // Setelah berhasil dikonfirmasi oleh kepala sekolah, update status di state
      setConfirmedSertifikat((prevConfirmedSertifikat) => [
        ...prevConfirmedSertifikat,
        response.data,
      ]);
      Swal.fire(
        "Terkonfirmasi!",
        "Data Arsip Sertifikat Telah Dikonfirmasi oleh Kepala Sekolah.",
        "success"
      );
    } catch (error) {
      console.log(error);
    }
  };

  // fungsi untuk konfirmasi data sebagai kesiswaan
  const konfirmasiMitra = async (sertifikatId) => {
    try {
      const response = await axios({
        url: `http://localhost:5000/sertifikat/${sertifikatId}`,
        method: "PATCH",
        data: {
          konfirmasi_mitra: "Dikonfirmasi",
        },
      });
      // Setelah berhasil dikonfirmasi oleh kesiswaan, update status di state
      setConfirmedSertifikat((prevConfirmedSertifikat) => [
        ...prevConfirmedSertifikat,
        response.data,
      ]);
      Swal.fire(
        "Terkonfirmasi!",
        "Data Arsip Sertifikat Telah Dikonfirmasi oleh Mitra.",
        "success"
      );
    } catch (error) {
      console.log(error);
    }
  };

  const tolakSertifikat = async (sertifikatId) => {
    try {
      const response = await axios({
        url: `http://localhost:5000/sertifikat/${sertifikatId}`,
        method: "PATCH",
        data: {
          konfirmasi_mitra: "Ditolak",
        },
      });
      setConfirmedSertifikat((prevConfirmedSertifikat) => [
        ...prevConfirmedSertifikat,
        response.data,
      ]);
      Swal.fire(
        "Ditolak!",
        "Data arsip sertifikat uji kompetensi siswa ditolak.",
        "success"
      );
    } catch (error) {
      console.log(error);
    }
  };

  const isSertifikatConfirmed = (sertifikatId) => {
    return confirmedSertifikat.includes(sertifikatId);
  };

  const getStatus = (sertifikat) => {
    const isKepsekConfirmed = sertifikat.konfirmasi_kepsek === "Dikonfirmasi";
    const isMitraConfirmed = sertifikat.konfirmasi_mitra === "Dikonfirmasi";

    if (isKepsekConfirmed && isMitraConfirmed) {
      return "Dikonfirmasi";
    } else {
      return "Pending";
    }
  };

  const handleProdiFilterChange = (event) => {
    setSelectedProdi(event.target.value);
  };

  return (
    <div className="container box">
      <div className="hero is-primary is-bold box">
        <h1 className="title is-family-sans-serif is-uppercase has-text-centered has-text-weight-semibold mt-2">
          Kelola Daftar Arsip Sertifikat Uji Kompetensi
        </h1>
        <h2 className="subtitle is-family-sans-serif is-capitalized has-text-dark has-text-centered has-text-weight-light">
          Daftar data arsip sertifikat uji kompetensi siswa
        </h2>
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
              <th className="is-size-6">No</th>
              <th className="is-size-6">No Sertifikat</th>
              <th className="is-size-6">Nomor Induk</th>
              <th className="is-size-6">Nama Siswa</th>
              <th className="is-size-6">Jenis Kelamin</th>
              <th className="is-size-6">Kompetensi Keahlian</th>
              <th className="is-size-6">Arsip Sertifikat</th>
              {user && user.roles === "admin" && (
                <>
                  <th className="is-size-6">Status</th>
                  <th className="is-size-6">Actions</th>
                </>
              )}
              {user && user.roles === "kepala sekolah" && (
                <th className="is-size-6">Actions</th>
              )}
              {user && user.roles === "mitra" && (
                <th className="is-size-6">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentItems.map(
              (sertifikat, index) =>
                (!selectedProdi || selectedProdi === sertifikat.keahlian) &&
                (user.roles === "admin" ||
                  (user.roles === "kepala sekolah" &&
                    !isSertifikatConfirmed(sertifikat.uuid)) ||
                  (user.roles === "mitra" &&
                    getStatus(sertifikat) === "Pending")) && (
                  <tr key={sertifikat.uuid}>
                    <td className="is-size-6">{index + 1}</td>
                    <td className="is-size-6">{sertifikat.no_sertifikat}</td>
                    <td className="is-size-6">{sertifikat.nis}</td>
                    <td className="is-size-6">{sertifikat.nama}</td>
                    <td className="is-size-6">{sertifikat.jk}</td>
                    <td className="is-size-6">{sertifikat.keahlian}</td>
                    <td className="is-size-6">
                      <Link
                        to={
                          "https://" +
                          sertifikat.arsip_sertifikat +
                          ".ipfs.w3s.link"
                        }
                        className="button is-small is-fullwidth is-primary mt-1"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Arsip Sertifikat
                      </Link>
                    </td>
                    {user && user.roles === "admin" && (
                      <>
                        {getStatus(sertifikat) === "Dikonfirmasi" && (
                          <td className="tag is-small is-success is-fullwidth mt-2">
                            {getStatus(sertifikat)}
                          </td>
                        )}
                        {getStatus(sertifikat) === "Pending" && (
                          <td className="tag is-small is-warning is-fullwidth mt-2">
                            {getStatus(sertifikat)}
                          </td>
                        )}
                        <td>
                          <Link
                            to={`/sertifikat/edit/${sertifikat.uuid}`}
                            className="button is-small is-info is-fullwidth"
                          >
                            <IoCreateOutline />
                          </Link>
                          <button
                            onClick={() => deleteSertifikat(sertifikat.uuid)}
                            className="button is-small is-danger is-fullwidth mt-1"
                          >
                            <IoTrashOutline />
                          </button>
                        </td>
                      </>
                    )}
                    {user && user.roles === "kepala sekolah" && (
                      <td>
                        {isSertifikatConfirmed(sertifikat.uuid) ? (
                          <span className="tag is-success">Terkonfirmasi</span>
                        ) : (
                          <button
                            onClick={() =>
                              konfirmasiKepalaSekolah(sertifikat.uuid)
                            }
                            className="button is-fullwidth is-small is-info mt-1"
                          >
                            <IoCheckmarkDoneCircleOutline />
                          </button>
                        )}
                      </td>
                    )}
                    {user && user.roles === "mitra" && (
                      <td>
                        {isSertifikatConfirmed(sertifikat.uuid) ? (
                          <span className="tag is-success">Terkonfirmasi</span>
                        ) : (
                          <>
                            <button
                              onClick={() => konfirmasiMitra(sertifikat.uuid)}
                              className="button is-fullwidth is-small is-info mt-1"
                            >
                              <IoCheckmarkDoneCircleOutline />
                            </button>
                            <button
                              onClick={() => tolakSertifikat(sertifikat.uuid)}
                              className="button is-fullwidth is-small is-danger mt-1"
                            >
                              <IoHandRightOutline />
                            </button>
                          </>
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
          {Array.from({
            length: Math.ceil(sertifikat.length / itemsPerPage),
          }).map((_, i) => (
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
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default SertifikatList;
