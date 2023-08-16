import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { IoCloudUploadOutline, IoEyeOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "../../styles/global.css";

const SertifikatConfirm = () => {
  const { user } = useSelector((state) => state.auth);

  const [sertifikat, setSertifikat] = useState([]);
  const [selectedProdi, setSelectedProdi] = useState("");
  const [token, setToken] = useState(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSertifikatDetail, setSelectedSertifikatDetail] =
    useState(null);

  const openDetailModal = (sertifikat) => {
    setSelectedSertifikatDetail(sertifikat);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setSelectedSertifikatDetail(null);
    setIsDetailModalOpen(false);
  };

  useEffect(() => {
    fetchToken();
    getSertifikat();
  }, [token]);

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

  const konfirmasiUploadToBlockchain = async (uuid) => {
    try {
      const response = await axios({
        url: `http://localhost:5000/sertifikat/${uuid}`,
        method: "PATCH",
        data: {
          konfirmasi_uploadToBlockchain: new Date(),
        },
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Define a function to format the date and time in Indonesian format
  const formatDateTime = (isoDateTime) => {
    const dateTime = new Date(isoDateTime);

    const optionsDate = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };

    const optionsTime = {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };

    const formattedDate = dateTime.toLocaleDateString("id-ID", optionsDate);
    const formattedTime = dateTime.toLocaleTimeString("id-ID", optionsTime);

    // Get the timezone offset in minutes
    const timezoneOffset = dateTime.getTimezoneOffset();

    // Calculate the timezone abbreviation based on offset
    let timezoneAbbr = "WITA";
    if (timezoneOffset === -420) {
      timezoneAbbr = "WIB";
    } else if (timezoneOffset === -480) {
      timezoneAbbr = "WIT";
    }

    return `${formattedDate}, ${formattedTime} ${timezoneAbbr}`;
  };

  const isSertifikatConfirmed = (sertifikatId) => {
    return confirmedSertifikat.includes(sertifikatId);
  };

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

  const handleProdiFilterChange = (event) => {
    setSelectedProdi(event.target.value);
    setCurrentPage(1);
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
      // Menambah timestamp setelah di klik upload
      konfirmasiUploadToBlockchain(uuid);

      const selectedSertifikat = sertifikat.find((item) => item.uuid === uuid);

      // Mengubah string tanggal menjadi objek tanggal
      const createdAtDate = new Date(selectedSertifikat.createdAt);
      const kepsekUpdatedAtDate = new Date(
        selectedSertifikat.konfirmasi_kepsekUpdatedAt
      );
      const mitraUpdatedAtDate = new Date(
        selectedSertifikat.konfirmasi_mitraUpdatedAt
      );
      const blockchainUpdatedAtDate = new Date(
        selectedSertifikat.konfirmasi_uploadToBlockchain
      );

      // Mengonversi objek tanggal ke format ISO
      const createdAtISO = createdAtDate.toISOString();
      const kepsekUpdatedAtISO = kepsekUpdatedAtDate.toISOString();
      const mitraUpdatedAtISO = mitraUpdatedAtDate.toISOString();
      const blockchainUpdatedAtISO = blockchainUpdatedAtDate.toISOString();

      const assetData = {
        method: "CreateAsset",
        args: [
          selectedSertifikat.no_sertifikat,
          selectedSertifikat.nis,
          selectedSertifikat.nama,
          selectedSertifikat.jk,
          selectedSertifikat.keahlian,
          selectedSertifikat.arsip_sertifikat,
          createdAtISO,
          getStatus(selectedSertifikat),
          kepsekUpdatedAtISO,
          getStatus(selectedSertifikat),
          mitraUpdatedAtISO,
          blockchainUpdatedAtISO,
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
            <option value="">Pilih Program Studi</option>
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
                  <th>Actions</th>
                </>
              )}
              {user && user.roles === "mitra" && (
                <>
                  <th>Status</th>
                  <th>Actions</th>
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
                        <td>
                          {!isSertifikatConfirmed(sertifikat.uuid) && (
                            <button
                              onClick={() => openDetailModal(sertifikat)}
                              className="button is-small is-info is-fullwidth has-tooltip-top"
                              data-tooltip="Lihat Detail"
                            >
                              <IoEyeOutline />
                            </button>
                          )}
                        </td>
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
                        <td>
                          {!isSertifikatConfirmed(sertifikat.uuid) && (
                            <button
                              onClick={() => openDetailModal(sertifikat)}
                              className="button is-small is-info is-fullwidth has-tooltip-top"
                              data-tooltip="Lihat Detail"
                            >
                              <IoEyeOutline />
                            </button>
                          )}
                        </td>
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
                            className="button is-small is-info is-fullwidth has-tooltip-bottom"
                            data-tooltip="Upload ke Blockchain"
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

      {/* Tampilan Modal */}
      {selectedSertifikatDetail && (
        <div className={`modal ${isDetailModalOpen ? "is-active" : ""}`}>
          <div className="modal-background" onClick={closeDetailModal}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <h2 className="modal-card-title font-weight-bold is-size-4 has-text-centered has-text-weight-semibold">
                Detail Arsip Sertifikat Siswa
              </h2>
              <button
                className="delete"
                aria-label="close"
                onClick={closeDetailModal}
              ></button>
            </header>
            <section className="modal-card-body">
              <div className="content">
                <div className="container">
                  <div className="row text-center justify-content-center mb-5">
                    <div className="col-xl-6 col-lg-8">
                      <h2 className="font-weight-bold is-size-5 has-text-centered has-text-weight-semibold">
                        Traceability Arsip Sertifikat
                      </h2>
                      <p className="text-muted is-size-6 has-text-centered has-text-weight-light is-capitalized">
                        Ketertelusuran pengarsipan sertifikat uji kompetensi
                        siswa
                      </p>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col">
                      <div
                        className="timeline-steps aos-init aos-animate"
                        data-aos="fade-up"
                      >
                        <div className="timeline-step">
                          <div
                            className="timeline-content"
                            data-toggle="popover"
                            data-trigger="hover"
                            data-placement="top"
                            title="Staff tata usaha telah mengarsipkan data sertifikat"
                          >
                            <div className="inner-circle"></div>
                            <p className="h6 mt-3 mb-1 is-size-7">
                              {formatDateTime(
                                selectedSertifikatDetail.createdAt
                              )}
                            </p>
                            <p className="h6 text-muted mb-0 mb-lg-0 is-size-7 is-capitalized">
                              <strong>Staff Tata Usaha</strong> mengarsipkan
                              sertifikat{" "}
                              <strong>{selectedSertifikatDetail.nama}</strong>
                            </p>
                          </div>
                        </div>
                        <div className="timeline-step">
                          <div
                            className="timeline-content"
                            data-toggle="popover"
                            data-trigger="hover"
                            data-placement="top"
                            title="Mitra telah mengkonfirmasi data arsip sertifikat"
                          >
                            <div className="inner-circle"></div>
                            <p className="h6 mt-3 mb-1 is-size-7">
                              {formatDateTime(
                                selectedSertifikatDetail.konfirmasi_mitraUpdatedAt
                              )}
                            </p>
                            <p className="h6 text-muted mb-0 mb-lg-0 is-size-7 is-capitalized">
                              <strong>Mitra</strong> mengkonfirmasi sertifikat{" "}
                              <strong>{selectedSertifikatDetail.nama}</strong>
                            </p>
                          </div>
                        </div>
                        <div className="timeline-step">
                          <div
                            className="timeline-content"
                            data-toggle="popover"
                            data-trigger="hover"
                            data-placement="top"
                            title="Kepala sekolah telah mengkonfirmasi data arsip sertifikat"
                          >
                            <div className="inner-circle"></div>
                            <p className="h6 mt-3 mb-1 is-size-7">
                              {formatDateTime(
                                selectedSertifikatDetail.konfirmasi_kepsekUpdatedAt
                              )}
                            </p>
                            <p className="h6 text-muted mb-0 mb-lg-0 is-size-7 is-capitalized">
                              <strong>Kepala Sekolah</strong> mengkonfirmasi
                              sertifikat{" "}
                              <strong>{selectedSertifikatDetail.nama}</strong>
                            </p>
                          </div>
                        </div>
                        <div className="timeline-step mb-0">
                          <div
                            className="timeline-content"
                            data-toggle="popover"
                            data-trigger="hover"
                            data-placement="top"
                            title="Data arsip sertifikat telah diunggah ke jaringan Blockchain"
                          >
                            <div className="inner-circle"></div>
                            <p className="h6 mt-3 mb-1 is-size-7">
                              {formatDateTime(
                                selectedSertifikatDetail.konfirmasi_uploadToBlockchain
                              )}
                            </p>
                            <p className="h6 text-muted mb-0 mb-lg-0 is-size-7 is-capitalized">
                              <strong>Kesiswaan</strong> mengunggah sertifikat{" "}
                              <strong>{selectedSertifikatDetail.nama}</strong>{" "}
                              ke blockchain.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="container mt-4">
                  <div className="columns is-centered">
                    <div className="column is-fullwidth">
                      <div className="box p-4 has-background-grey-lighter">
                        <h2 className="is-size-5 has-text-weight-semibold is-underlined has-text-centered">
                          Keterangan Arsip Sertifikat
                        </h2>
                        <h3 className="is-size-6 has-text-weight-light is-capitalized has-text-centered mt-1">
                          Keterangan arsip sertifikat uji kompetensi siswa{" "}
                          <br /> {selectedSertifikatDetail.nama}
                        </h3>
                        <p className="is-size-7">
                          <strong>Nomor Sertifikat:</strong>{" "}
                          {selectedSertifikatDetail.no_sertifikat}
                        </p>
                        <p className="is-size-7">
                          <strong>Nomor Induk Siswa:</strong>{" "}
                          {selectedSertifikatDetail.nis}
                        </p>
                        <p className="is-size-7">
                          <strong>Nama Lengkap:</strong>{" "}
                          {selectedSertifikatDetail.nama}
                        </p>
                        <p className="is-size-7">
                          <strong>Jenis Kelamin:</strong>{" "}
                          {selectedSertifikatDetail.jk}
                        </p>
                        <p className="is-size-7">
                          <strong>Program Kompetensi:</strong>{" "}
                          {selectedSertifikatDetail.keahlian}
                        </p>
                        <p className="is-size-7">
                          <strong>Arsip Sertifikat:</strong>{" "}
                          <a
                            href={`https://${selectedSertifikatDetail.arsip_sertifikat}.ipfs.w3s.link`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {selectedSertifikatDetail.arsip_sertifikat}
                          </a>
                        </p>
                        <p className="is-size-7">
                          <strong>Tanggal Arsip:</strong>{" "}
                          {formatDateTime(selectedSertifikatDetail.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <footer className="modal-card-foot">
              <button className="button is-primary" onClick={closeDetailModal}>
                Tutup
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default SertifikatConfirm;
