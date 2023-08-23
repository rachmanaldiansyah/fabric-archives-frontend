import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  IoEyeOutline,
  IoTrashOutline,
  IoCreateOutline,
  IoHandRightOutline,
  IoCheckmarkDoneCircleOutline,
  IoSearchOutline,
} from "react-icons/io5";
import "../../styles/sertifikat.css";

const SertifikatList = () => {
  const { user } = useSelector((state) => state.auth);
  const [sertifikat, setSertifikat] = useState([]);
  const [selectedProdi, setSelectedProdi] = useState("");
  const [confirmedSertifikat, setConfirmedSertifikat] = useState([]);

  const [rejectButtonClicked, setRejectButtonClicked] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSertifikatDetail, setSelectedSertifikatDetail] =
    useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const openDetailModal = (sertifikat) => {
    setSelectedSertifikatDetail(sertifikat);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setSelectedSertifikatDetail(null);
    setIsDetailModalOpen(false);
  };

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
          konfirmasi_kepsekUpdatedAt: new Date(),
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
      closeDetailModal();
    } catch (error) {
      console.log(error);
    }
  };

  // fungsi untuk konfirmasi data sebagai kesiswaan
  const konfirmasiMitra = async (sertifikatId) => {
    Swal.fire({
      title: "Apakah Data Arsip Sertifikat Siswa Sudah Sesuai?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Konfirmasi",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Apakah Anda Benar Yakin Bahwa Arsip Sertifikat Sudah Sesuai?",
          text: "Perhatian: data arsip yang sudah dikonfirmasi tidak dapat diubah kembali, mohon di periksa dengan teliti!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ya, Konfirmasi",
          cancelButtonText: "Batal",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const response = await axios({
                url: `http://localhost:5000/sertifikat/${sertifikatId}`,
                method: "PATCH",
                data: {
                  konfirmasi_mitra: "Dikonfirmasi",
                  konfirmasi_mitraUpdatedAt: new Date(),
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
              closeDetailModal();
            } catch (error) {
              console.log(error);
            }
          }
        });
      }
    });
  };

  const tolakSertifikat = async (sertifikatId) => {
    if (!rejectButtonClicked) {
      setRejectButtonClicked(true);
    } else {
      try {
        const response = await axios({
          url: `http://localhost:5000/sertifikat/${sertifikatId}`,
          method: "PATCH",
          data: {
            konfirmasi_mitra: "Ditolak",
            alasan_penolakan: rejectionReason,
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
        closeDetailModal();
      } catch (error) {
        console.log(error);
      }
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

  const handleRejectionReasonChange = (event) => {
    setRejectionReason(event.target.value);
  };

  const handleProdiFilterChange = (event) => {
    setSelectedProdi(event.target.value);
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

  return (
    <div className="container box is-max-widescreen">
      <div className="hero is-primary is-bold box">
        <h1 className="title is-family-sans-serif is-uppercase has-text-centered has-text-weight-semibold mt-2">
          Kelola Daftar Arsip Sertifikat Uji Kompetensi
        </h1>
        <h2 className="subtitle is-family-sans-serif is-capitalized has-text-dark has-text-centered has-text-weight-light">
          Daftar data arsip sertifikat uji kompetensi siswa
        </h2>
      </div>
      
      <div className="columns">
        <div className="column is-one-third">
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
        <div className="column is-one-third is-hidden-mobile"></div>{" "}
        {/* Kolom kosong */}
        <div className="column is-one-third">
          <div className="field has-addons is-pulled-right">
            <div className="control has-icons-left">
              <input
                type="text"
                className="input is-primary"
                placeholder="Cari Nama Siswa"
                value={searchQuery}
                onChange={handleSearch}
              />
              <span className="icon is-small is-left">
                <IoSearchOutline />
              </span>
            </div>
          </div>
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
                    !isSertifikatConfirmed(sertifikat.uuid) &&
                    sertifikat.konfirmasi_mitra === "Dikonfirmasi") ||
                  (user.roles === "mitra" &&
                    getStatus(sertifikat) === "Pending")) &&
                sertifikat.nama
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) && (
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
                            onClick={() => openDetailModal(sertifikat)}
                            className="button is-small is-info is-fullwidth mt-1 custom-popover-button-detail"
                          >
                            <IoEyeOutline />
                          </button>
                        )}
                      </td>
                    )}
                    {user && user.roles === "mitra" && (
                      <td>
                        {isSertifikatConfirmed(sertifikat.uuid) ? (
                          <span className="tag is-success">Terkonfirmasi</span>
                        ) : (
                          <button
                            onClick={() => openDetailModal(sertifikat)}
                            className="button is-small is-info is-fullwidth mt-1 custom-popover-button-detail"
                          >
                            <IoEyeOutline />
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
        <div className={`modal${isDetailModalOpen ? " is-active" : ""}`}>
          <div className="modal-background" onClick={closeDetailModal}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title has-text-centered has-text-weight-semibold">
                Detail Arsip Sertifikat
              </p>
              <button
                className="delete"
                aria-label="close"
                onClick={closeDetailModal}
              ></button>
            </header>
            {user && user.roles === "kepala sekolah" && (
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
                          <div className="timeline-step mb-0">
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
            )}
            {user && user.roles === "mitra" && (
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
                          {rejectButtonClicked && (
                            <div className="field">
                              <div className="control">
                                <p className="is-size-7 mb-1">
                                  <strong>Alasan Penolakan</strong>
                                </p>
                                <textarea
                                  className="textarea is-small"
                                  value={rejectionReason}
                                  onChange={handleRejectionReasonChange}
                                  placeholder="Ketikan alasannya disini..."
                                ></textarea>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
            <footer className="modal-card-foot">
              <button className="button is-primary" onClick={closeDetailModal}>
                Tutup
              </button>
              {user && user.roles === "kepala sekolah" && (
                <button
                  onClick={() =>
                    konfirmasiKepalaSekolah(selectedSertifikatDetail.uuid)
                  }
                  className="button is-info"
                >
                  <IoCheckmarkDoneCircleOutline className="mr-2" /> Konfirmasi
                  Arsip
                </button>
              )}
              {user && user.roles === "mitra" && (
                <>
                  <button
                    onClick={() =>
                      konfirmasiMitra(selectedSertifikatDetail.uuid)
                    }
                    className="button is-info"
                  >
                    <IoCheckmarkDoneCircleOutline className="mr-2" /> Konfirmasi
                    Arsip
                  </button>
                  <button
                    onClick={() =>
                      tolakSertifikat(selectedSertifikatDetail.uuid)
                    }
                    className="button is-danger"
                  >
                    <IoHandRightOutline className="mr-2" /> Tolak Arsip
                  </button>
                </>
              )}
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default SertifikatList;
