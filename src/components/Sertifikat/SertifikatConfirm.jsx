import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { IoCloudUploadOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const SertifikatConfirm = () => {
  const { user } = useSelector((state) => state.auth);
  const [sertifikat, setSertifikat] = useState([]);
  const [selectedProdi, setSelectedProdi] = useState("");
  const [token, setToken] = useState(null);

  useEffect(() => {
    fetchToken();
    getSertifikat();
  }, [token]);

  // Fungsi untuk melakukan filter hanya menampilkan data arsip yang statusnya telah dikonfirmasi
  const filterConfirmedSertifikat = () => {
    return sertifikat.filter((item) => {
      const isKepsekConfirmed = item.konfirmasi_kepsek === "Dikonfirmasi";
      const isMitraConfirmed = item.konfirmasi_mitra === "Dikonfirmasi";
      return isKepsekConfirmed && isMitraConfirmed;
    });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // menghitung halaman yang akan ditampilkan
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Mendapatkan data arsip yang statusnya telah dikonfirmasi
  const confirmedSertifikat = filterConfirmedSertifikat();

  // Menggunakan data arsip yang statusnya telah dikonfirmasi sebagai data yang akan ditampilkan
  const currentItems = confirmedSertifikat.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // fungsi untuk meng-handle halaman
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // fungsi untuk mendapatkan data arsip sertifikat di database
  const getSertifikat = async () => {
    const response = await axios.get("http://localhost:5000/sertifikat");
    setSertifikat(response.data);
  };

  // fungsi untuk mendapatkan status konfirmasi
  const getStatus = (sertifikat) => {
    const isKepsekConfirmed = sertifikat.konfirmasi_kepsek === "Dikonfirmasi";
    const isKesiswaanConfirmed = sertifikat.konfirmasi_mitra === "Dikonfirmasi";

    if (isKepsekConfirmed && isKesiswaanConfirmed) {
      return "Dikonfirmasi";
    } else {
      return "Pending";
    }
  };

  const handleProdiFilterChange = (event) => {
    setSelectedProdi(event.target.value);
  };

  const fetchToken = async () => {
    try {
      const enrollResponse = await axios.post(
        "http://localhost:5002/user/enroll",
        {
          id: "admin",
          secret: "adminpw",
        }
      );
      const token = enrollResponse.data.token;
      // console.log("Fetched token:", token);
      setToken(token);
    } catch (error) {
      console.error("Failed to fetch token:", error);
    }
  };

  const uploadToBlockchain = async (uuid) => {
    try {
      const selectedSertifikat = sertifikat.find((item) => item.uuid === uuid);
      const assetData = {
        method: "CreateAsset",
        args: [
          selectedSertifikat.no_sertifikat,
          selectedSertifikat.nis,
          selectedSertifikat.nama,
          selectedSertifikat.jk,
          selectedSertifikat.keahlian,
          selectedSertifikat.arsip_sertifikat,
          getStatus(selectedSertifikat),
          getStatus(selectedSertifikat),
        ],
      };

      const createAssetResponse = await axios.post(
        "http://localhost:5002/invoke/sertifikat/chaincode-sertifikat",
        assetData,
        { withCredentials: true }
      );

      const { response } = createAssetResponse.data;
      Swal.fire({
        icon: "success",
        title: "Success",
        text: `${response}`,
      });
      console.log(createAssetResponse.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal mengarsipkan data sertifikat ke blockchain!",
      });
      console.error("Gagal mengarsipkan data ke blockchain:", error);
    }
  };

  const handleUpload = (uuid) => {
    uploadToBlockchain(uuid);
  };

  return (
    <div className="container box">
      <div className="hero is-primary is-bold box">
        <h1 className="title is-family-sans-serif is-uppercase has-text-centered has-text-weight-semibold mt-2">
          Kelola Daftar Arsip Sertifikat Uji Kompetensi
        </h1>
        <h2 className="subtitle is-family-sans-serif is-capitalized has-text-dark has-text-centered has-text-weight-light">
          Daftar arsip sertifikat siswa yang telah di konfirmasi
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
        <table className="table is-striped is-narrow is-fullwidth is-hoverable">
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
                </>
              )}
              {user && user.roles === "mitra" && (
                <>
                  <th>Status</th>
                </>
              )}
              {user && user.roles === "kesiswaan" && (
                <>
                  <th>Status</th>
                  <th>Actions</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {currentItems.map(
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
                      <Link
                        to={`https://${sertifikat.arsip_sertifikat}.ipfs.w3s.link`}
                        target="_blank"
                        className="button is-small is-primary is-fullwidth"
                      >
                        Arsip Sertifikat
                      </Link>
                    </td>
                    {user && user.roles === "kepala sekolah" && (
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
                      </>
                    )}
                    {user && user.roles === "mitra" && (
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
                      </>
                    )}
                    {user && user.roles === "kesiswaan" && (
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
                          <button
                            onClick={() => handleUpload(sertifikat.uuid)}
                            className="button is-small is-info is-fullwidth"
                          >
                            <IoCloudUploadOutline />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>
      {/* Tampilan Pagination */}
      <nav
        className="pagination is-rounded is-centered"
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

export default SertifikatConfirm;
