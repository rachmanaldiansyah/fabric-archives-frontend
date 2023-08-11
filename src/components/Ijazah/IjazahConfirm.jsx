import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IoCloudUploadOutline } from "react-icons/io5";
import axios from "axios";
import Swal from "sweetalert2";

const IjazahConfirm = () => {
  const { user } = useSelector((state) => state.auth);
  const [ijazah, setIjazah] = useState([]);
  const [selectedProdi, setSelectedProdi] = useState("");
  const [token, setToken] = useState(null);

  useEffect(() => {
    fetchToken();
    getIjazah();
  }, [token]);

  // Fungsi untuk melakukan filter hanya menampilkan data arsip yang statusnya telah dikonfirmasi
  const filterConfirmedIjazah = () => {
    return ijazah.filter((item) => {
      const isKepsekConfirmed = item.konfirmasi_kepsek === "Dikonfirmasi";
      const isKesiswaanConfirmed = item.konfirmasi_kesiswaan === "Dikonfirmasi";
      return isKepsekConfirmed && isKesiswaanConfirmed;
    });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // menghitung halaman yang akan ditampilkan
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Mendapatkan data arsip yang statusnya telah dikonfirmasi
  const confirmedIjazah = filterConfirmedIjazah();

  // Menggunakan data arsip yang statusnya telah dikonfirmasi sebagai data yang akan ditampilkan
  const currentItems = confirmedIjazah.slice(indexOfFirstItem, indexOfLastItem);

  // fungsi untuk meng-handle halaman
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // fungsi untuk mendapatkan data arsip ijazah dari database
  const getIjazah = async () => {
    const response = await axios.get("http://localhost:5000/ijazah");
    setIjazah(response.data);
  };

  // fungsi untuk mendapatkan status konfirmasi
  const getStatus = (ijazah) => {
    const isKepsekConfirmed = ijazah.konfirmasi_kepsek === "Dikonfirmasi";
    const isKesiswaanConfirmed = ijazah.konfirmasi_kesiswaan === "Dikonfirmasi";

    if (isKepsekConfirmed && isKesiswaanConfirmed) {
      return "Dikonfirmasi";
    } else {
      return "Pending";
    }
  };

  // fungsi untuk melakukan filter prodi
  const handleProdiFilterChange = (event) => {
    setSelectedProdi(event.target.value);
  };

  // fungsi untuk mendapatkan token dengan melakukan enroll user
  const fetchToken = async () => {
    try {
      const enrollResponse = await axios.post(
        "http://localhost:5001/user/enroll",
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

  // fungsi untuk mengarsipkan data ijazah siswa ke jaringan blockchain
  const uploadToBlockchain = async (uuid) => {
    try {
      const selectedIjazah = ijazah.find((item) => item.uuid === uuid);
      const assetData = {
        method: "CreateAsset",
        args: [
          selectedIjazah.no_ijazah,
          selectedIjazah.nisn,
          selectedIjazah.nis,
          selectedIjazah.nama,
          selectedIjazah.jk,
          selectedIjazah.nama_orangtua,
          selectedIjazah.prodi,
          selectedIjazah.arsip_ijazah,
          getStatus(selectedIjazah),
          getStatus(selectedIjazah),
        ],
      };

      const createAssetResponse = await axios.post(
        "http://localhost:5001/invoke/ijazah/chaincode-ijazah",
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
        text: "Gagal mengarsipkan data ijazah siswa ke blockchain!",
      });
      console.error("Gagal mengarsipkan data ke blockchain:", error);
    }
  };

  // fungsi untuk handle upload ke blockchain
  const handleUpload = (uuid) => {
    uploadToBlockchain(uuid);
  };

  return (
    <div className="container box">
      <div className="hero is-primary is-bold box">
        <h1 className="title is-family-sans-serif is-uppercase has-text-centered has-text-weight-semibold mt-2">
          Kelola Daftar Arsip Ijazah Siswa
        </h1>
        <h2 className="subtitle is-family-sans-serif is-capitalized has-text-dark has-text-centered has-text-weight-light">
          Daftar arsip ijazah siswa yang telah dikonfirmasi
        </h2>
      </div>
      <div className="container mb-2">
        <div className="control select is-primary">
          <select
            id="prodiFilter"
            value={selectedProdi}
            onChange={handleProdiFilterChange}
          >
            <option value="" disabled>
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
              <th>No Ijazah</th>
              <th>NISN</th>
              <th>NIS</th>
              <th>Nama Siswa</th>
              <th>Jenis Kelamin</th>
              <th>Program Studi</th>
              <th>Arsip Ijazah</th>
              {user && user.roles === "kepala sekolah" && (
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
              (ijazah, index) =>
                (!selectedProdi || selectedProdi === ijazah.prodi) && (
                  <tr key={ijazah.uuid}>
                    <td>{index + 1}</td>
                    <td>{ijazah.no_ijazah}</td>
                    <td>{ijazah.nisn}</td>
                    <td>{ijazah.nis}</td>
                    <td>{ijazah.nama}</td>
                    <td>{ijazah.jk}</td>
                    <td>{ijazah.prodi}</td>
                    <td>
                      <Link
                        to={`https://${ijazah.arsip_ijazah}.ipfs.w3s.link`}
                        target="_blank"
                        className="button is-small is-primary is-fullwidth"
                      >
                        Arsip Ijazah
                      </Link>
                    </td>
                    {user && user.roles === "kepala sekolah" && (
                      <>
                        <td>
                          {getStatus(ijazah) === "Dikonfirmasi" && (
                            <td className="tag is-success is-fullwidth">
                              {getStatus(ijazah)}
                            </td>
                          )}
                          {getStatus(ijazah) === "Pending" && (
                            <td className="tag is-warning is-fullwidth">
                              {getStatus(ijazah)}
                            </td>
                          )}
                        </td>
                      </>
                    )}
                    {user && user.roles === "kesiswaan" && (
                      <>
                        <td>
                          {getStatus(ijazah) === "Dikonfirmasi" && (
                            <td className="tag is-success is-fullwidth">
                              {getStatus(ijazah)}
                            </td>
                          )}
                          {getStatus(ijazah) === "Pending" && (
                            <td className="tag is-warning is-fullwidth">
                              {getStatus(ijazah)}
                            </td>
                          )}
                        </td>
                        <td>
                          <button
                            onClick={() => handleUpload(ijazah.uuid)}
                            className="button is-small is-warning is-fullwidth"
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

export default IjazahConfirm;
