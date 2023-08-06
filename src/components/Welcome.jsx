import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const Welcome = () => {
  const { user } = useSelector((state) => state.auth);
  const [sertifikat, setSertifikat] = useState([]);
  const [ijazah, setIjazah] = useState([]);
  const [pengguna, setPengguna] = useState([]);

  const [confirmedIjazah, setConfirmedIjazah] = useState([]);
  const [confirmedSertifikat, setConfirmedSertifikat] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getDataArsipIjazah();
    getDataArsipSertifikat();
    getDataPengguna();
    getConfirmedIjazah();
    getConfirmedSertifikat();
  }, []);

  const getConfirmedIjazah = async () => {
    try {
      const response = await axios.get("http://localhost:5000/ijazah");
      const confirmedIjazah = response.data.filter(
        (item) =>
          item.konfirmasi_kepsek === "Dikonfirmasi" &&
          item.konfirmasi_kesiswaan === "Dikonfirmasi"
      );
      setConfirmedIjazah(confirmedIjazah);
    } catch (error) {
      console.error("Error fetching confirmed ijazah data:", error);
    }
  };

  const getConfirmedSertifikat = async () => {
    try {
      const response = await axios.get("http://localhost:5000/sertifikat");
      const confirmedSertifikat = response.data.filter(
        (item) =>
          item.konfirmasi_kepsek === "Dikonfirmasi" &&
          item.konfirmasi_mitra === "Dikonfirmasi"
      );
      setConfirmedSertifikat(confirmedSertifikat);
    } catch (error) {
      console.error("Error fetching confirmed sertifikat data:", error);
    }
  };

  const getDataArsipSertifikat = async () => {
    try {
      const response = await axios.get("http://localhost:5000/sertifikat");
      setSertifikat(response.data);
    } catch (error) {
      console.error("Error fetching sertifikat data:", error);
    }
  };

  const getDataArsipIjazah = async () => {
    try {
      const response = await axios.get("http://localhost:5000/ijazah");
      setIjazah(response.data);
    } catch (error) {
      console.error("Error fetching ijazah data:", error);
    }
  };

  const getDataPengguna = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      setPengguna(response.data);
    } catch (error) {
      console.error("Error fetching pengguna data:", error);
    }
  };

  const getTotalArsipById = (arsipData) => {
    if (!arsipData) return 0;
    const uniqueUUIDs = [...new Set(arsipData.map((arsip) => arsip.uuid))];
    return uniqueUUIDs.length;
  };

  const itemsPerPage = 4;
  const totalPages = Math.ceil(confirmedIjazah.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const totalArsipIjazah = getTotalArsipById(ijazah);
  const totalArsipSertifikat = getTotalArsipById(sertifikat);
  const totalPengguna = getTotalArsipById(pengguna);

  return (
    <div className="container box">
      <section className="hero is-primary is-bold box">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">Dashboard</h1>
            <h2 className="subtitle">
              Selamat Datang, <strong>{user && user.nama}!</strong>
            </h2>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="columns is-centered is-multiline">
          <div className="column">
            <div className="box hero is-warning has-text-centered">
              <p className="heading">Total Pengguna</p>
              <p className="title">{totalPengguna}</p>
            </div>
          </div>
          <div className="column">
            <div className="box hero is-warning is-bold has-text-centered">
              <p className="heading">Total Arsip Ijazah</p>
              <p className="title">{totalArsipIjazah}</p>
            </div>
          </div>
          <div className="column">
            <div className="box hero is-warning has-text-centered">
              <p className="heading">Total Arsip Sertifikat</p>
              <p className="title">{totalArsipSertifikat}</p>
            </div>
          </div>
        </div>

        <h2 className="subtitle">Data Ijazah yang Telah Dikonfirmasi</h2>
        <div className="columns is-multiline">
          {confirmedIjazah.slice(startIndex, endIndex).map((ijazahItem) => (
            <div
              key={ijazahItem.id}
              className="column is-6-tablet is-4-desktop"
            >
              <div className="notification box">
                <p className="has-text-dark">
                  Nama Siswa: <strong>{ijazahItem.nama}</strong>
                </p>
                <p className="has-text-dark">
                  Nomor Ijazah: <strong>{ijazahItem.no_ijazah}</strong>
                </p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="subtitle">Data Sertifikat yang Telah Dikonfirmasi</h2>
        <div className="columns is-multiline">
          {confirmedSertifikat
            .slice(startIndex, endIndex)
            .map((sertifikatItem) => (
              <div
                key={sertifikatItem.id}
                className="column is-6-tablet is-4-desktop"
              >
                <div className="notification box">
                  <p className="has-text-dark">
                    Nama Siswa: <strong>{sertifikatItem.nama}</strong>
                  </p>
                  <p className="has-text-dark">
                    Nomor Sertifikat:{" "}
                    <strong>{sertifikatItem.no_sertifikat}</strong>
                  </p>
                </div>
              </div>
            ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            className="pagination is-centered is-rounded mt-4"
            role="navigation"
            aria-label="pagination"
          >
            <ul className="pagination-list">
              {Array.from({ length: totalPages }).map((_, index) => (
                <li key={index}>
                  <button
                    className={`pagination-link ${
                      index + 1 === currentPage ? "is-current" : ""
                    }`}
                    aria-label={`Goto page ${index + 1}`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </section>
    </div>
  );
};

export default Welcome;
