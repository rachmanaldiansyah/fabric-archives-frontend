import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  IoEyeOutline,
  IoTrashOutline,
  IoCreateOutline,
  IoHandRightOutline,
  IoCheckmarkDoneCircleOutline,
} from "react-icons/io5";

const IjazahList = () => {
  const { user } = useSelector((state) => state.auth);

  const [ijazah, setIjazah] = useState([]);
  const [selectedProdi, setSelectedProdi] = useState("");
  const [confirmedIjazah, setConfirmedIjazah] = useState([]);

  const [rejectButtonClicked, setRejectButtonClicked] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedIjazahDetail, setSelectedIjazahDetail] = useState(null);

  const openDetailModal = (ijazah) => {
    setSelectedIjazahDetail(ijazah);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setSelectedIjazahDetail(null);
    setIsDetailModalOpen(false);
  };

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
          konfirmasi_kepsekUpdatedAt: new Date(),
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
          konfirmasi_kesiswaanUpdatedAt: new Date(),
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
    if (!rejectButtonClicked) {
      setRejectButtonClicked(true);
    } else {
      try {
        const response = await axios({
          url: `http://localhost:5000/ijazah/${ijazahId}`,
          method: "PATCH",
          data: {
            konfirmasi_kesiswaan: "Ditolak",
            alasan_penolakan: rejectionReason,
          },
        });
        setConfirmedIjazah((prevConfirmedIjazah) => [
          ...prevConfirmedIjazah,
          response.data,
        ]);
        Swal.fire(
          "Ditolak!",
          "Data Arsip Ijazah Telah Ditolak oleh Kesiswaan.",
          "success"
        );
      } catch (error) {
        console.log(error);
      }
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

  const handleRejectionReasonChange = (event) => {
    setRejectionReason(event.target.value);
  };

  const handleProdiFilterChange = (event) => {
    setSelectedProdi(event.target.value);
    setCurrentPage(1);
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
          Kelola Daftar Arsip Ijazah Siswa
        </h1>
        <h2 className="subtitle is-family-sans-serif is-capitalized has-text-dark has-text-centered has-text-weight-light">
          Daftar data arsip ijazah siswa
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
              <th className="is-size-6">No Ijazah</th>
              <th className="is-size-6">NISN</th>
              <th className="is-size-6">NIS</th>
              <th className="is-size-6">Nama Siswa</th>
              <th className="is-size-6">Jenis Kelamin</th>
              <th className="is-size-6">Nama Orangtua</th>
              <th className="is-size-6">Program Studi</th>
              <th className="is-size-6">Arsip Ijazah</th>
              {user && user.roles === "admin" && (
                <>
                  <th className="is-size-6">Status</th>
                  <th className="is-size-6">Actions</th>
                </>
              )}
              {user && user.roles === "kesiswaan" && (
                <th className="is-size-6">Actions</th>
              )}
              {user && user.roles === "kepala sekolah" && (
                <th className="is-size-6">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentItems.map(
              (ijazah, index) =>
                (!selectedProdi || selectedProdi === ijazah.prodi) &&
                (user.roles === "admin" ||
                  (user.roles === "kepala sekolah" &&
                    !isIjazahConfirmed(ijazah.uuid) &&
                    ijazah.konfirmasi_kesiswaan === "Dikonfirmasi") ||
                  (user.roles === "kesiswaan" &&
                    getStatus(ijazah) === "Pending")) && (
                  <tr key={ijazah.uuid}>
                    <td className="is-size-6">{index + 1}</td>
                    <td className="is-size-6">{ijazah.no_ijazah}</td>
                    <td className="is-size-6">{ijazah.nisn}</td>
                    <td className="is-size-6">{ijazah.nis}</td>
                    <td className="is-size-6">{ijazah.nama}</td>
                    <td className="is-size-6">{ijazah.jk}</td>
                    <td className="is-size-6">{ijazah.nama_orangtua}</td>
                    <td className="is-size-6">{ijazah.prodi}</td>
                    <td>
                      <Link
                        to={`https://${ijazah.arsip_ijazah}.ipfs.w3s.link`}
                        target="_blank"
                        className="button is-small is-primary is-fullwidth"
                        rel="noopener noreferrer"
                      >
                        Arsip Ijazah
                      </Link>
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
                        {!isIjazahConfirmed(ijazah.uuid) && (
                          <button
                            onClick={() => openDetailModal(ijazah)}
                            className="button is-small is-info is-fullwidth"
                          >
                            <IoEyeOutline />
                          </button>
                        )}
                      </td>
                    )}
                    {user && user.roles === "kesiswaan" && (
                      <td>
                        {!isIjazahConfirmed(ijazah.uuid) && (
                          <button
                            onClick={() => openDetailModal(ijazah)}
                            className="button is-small is-info is-fullwidth"
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
            length: Math.ceil(ijazah.length / itemsPerPage),
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
      {selectedIjazahDetail && (
        <div className={`modal${isDetailModalOpen ? " is-active" : ""}`}>
          <div className="modal-background" onClick={closeDetailModal}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title has-text-centered has-text-weight-semibold">
                Detail Arsip Ijazah
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
                          Traceability Arsip Ijazah
                        </h2>
                        <p className="text-muted is-size-6 has-text-centered has-text-weight-light is-capitalized">
                          Ketertelusuran pengarsipan ijazah siswa
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
                              title=""
                            >
                              <div className="inner-circle"></div>
                              <p className="h6 mt-3 mb-1 is-size-7">
                                {formatDateTime(selectedIjazahDetail.createdAt)}
                              </p>
                              <p className="h6 text-muted mb-0 mb-lg-0 is-size-7 is-capitalized">
                                <strong>Staff Tata Usaha</strong> mengarsipkan
                                sertifikat{" "}
                                <strong>{selectedIjazahDetail.nama}</strong>
                              </p>
                            </div>
                          </div>
                          <div className="timeline-step mb-0">
                            <div
                              className="timeline-content"
                              data-toggle="popover"
                              data-trigger="hover"
                              data-placement="top"
                              title=""
                            >
                              <div className="inner-circle"></div>
                              <p className="h6 mt-3 mb-1 is-size-7">
                                {formatDateTime(selectedIjazahDetail.konfirmasi_kesiswaanUpdatedAt)}
                              </p>
                              <p className="h6 text-muted mb-0 mb-lg-0 is-size-7 is-capitalized">
                                <strong>Kesiswaan</strong> mengkonfirmasi ijazah{" "}
                                <strong>{selectedIjazahDetail.nama}</strong>
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
                            Keterangan Arsip Ijazah
                          </h2>
                          <h3 className="is-size-6 has-text-weight-light is-capitalized has-text-centered mt-1">
                            Keterangan arsip ijazah siswa <br />{" "}
                            {selectedIjazahDetail.nama}
                          </h3>
                          <p className="is-size-7">
                            <strong>Nomor Ijazah:</strong>{" "}
                            {selectedIjazahDetail.no_ijazah}
                          </p>
                          <p className="is-size-7">
                            <strong>Nomor Induk Siswa Nasional:</strong>{" "}
                            {selectedIjazahDetail.nisn}
                          </p>
                          <p className="is-size-7">
                            <strong>Nomor Induk Siswa:</strong>{" "}
                            {selectedIjazahDetail.nis}
                          </p>
                          <p className="is-size-7">
                            <strong>Nama Lengkap:</strong>{" "}
                            {selectedIjazahDetail.nama}
                          </p>
                          <p className="is-size-7">
                            <strong>Jenis Kelamin:</strong>{" "}
                            {selectedIjazahDetail.jk}
                          </p>
                          <p className="is-size-7">
                            <strong>Nama Orangtua/Wali:</strong>{" "}
                            {selectedIjazahDetail.nama_orangtua}
                          </p>
                          <p className="is-size-7">
                            <strong>Program Studi:</strong>{" "}
                            {selectedIjazahDetail.prodi}
                          </p>
                          <p className="is-size-7">
                            <strong>Arsip Ijazah:</strong>{" "}
                            <a
                              href={`https://${selectedIjazahDetail.arsip_ijazah}.ipfs.w3s.link`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {selectedIjazahDetail.arsip_ijazah}
                            </a>
                          </p>
                          <p className="is-size-7">
                            <strong>Tanggal Arsip:</strong>{" "}
                            {formatDateTime(selectedIjazahDetail.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
            {user && user.roles === "kesiswaan" && (
              <section className="modal-card-body">
                <div className="content">
                  <div className="container">
                    <div className="row text-center justify-content-center mb-5">
                      <div className="col-xl-6 col-lg-8">
                        <h2 className="font-weight-bold is-size-5 has-text-centered has-text-weight-semibold">
                          Traceability Arsip Ijazah
                        </h2>
                        <p className="text-muted is-size-6 has-text-centered has-text-weight-light is-capitalized">
                          Ketertelusuran pengarsipan ijazah siswa
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
                              title=""
                            >
                              <div className="inner-circle"></div>
                              <p className="h6 mt-3 mb-1 is-size-7">
                                {formatDateTime(selectedIjazahDetail.createdAt)}
                              </p>
                              <p className="h6 text-muted mb-0 mb-lg-0 is-size-7 is-capitalized">
                                <strong>Staff Tata Usaha</strong> mengarsipkan
                                sertifikat{" "}
                                <strong>{selectedIjazahDetail.nama}</strong>
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
                            Keterangan Arsip Ijazah
                          </h2>
                          <h3 className="is-size-6 has-text-weight-light is-capitalized has-text-centered mt-1">
                            Keterangan arsip ijazah siswa <br />{" "}
                            {selectedIjazahDetail.nama}
                          </h3>
                          <p className="is-size-7">
                            <strong>Nomor Ijazah:</strong>{" "}
                            {selectedIjazahDetail.no_ijazah}
                          </p>
                          <p className="is-size-7">
                            <strong>Nomor Induk Siswa Nasional:</strong>{" "}
                            {selectedIjazahDetail.nisn}
                          </p>
                          <p className="is-size-7">
                            <strong>Nomor Induk Siswa:</strong>{" "}
                            {selectedIjazahDetail.nis}
                          </p>
                          <p className="is-size-7">
                            <strong>Nama Lengkap:</strong>{" "}
                            {selectedIjazahDetail.nama}
                          </p>
                          <p className="is-size-7">
                            <strong>Jenis Kelamin:</strong>{" "}
                            {selectedIjazahDetail.jk}
                          </p>
                          <p className="is-size-7">
                            <strong>Nama Orangtua/Wali:</strong>{" "}
                            {selectedIjazahDetail.nama_orangtua}
                          </p>
                          <p className="is-size-7">
                            <strong>Program Studi:</strong>{" "}
                            {selectedIjazahDetail.prodi}
                          </p>
                          <p className="is-size-7">
                            <strong>Arsip Ijazah:</strong>{" "}
                            <a
                              href={`https://${selectedIjazahDetail.arsip_ijazah}.ipfs.w3s.link`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {selectedIjazahDetail.arsip_ijazah}
                            </a>
                          </p>
                          <p className="is-size-7">
                            <strong>Tanggal Arsip:</strong>{" "}
                            {formatDateTime(selectedIjazahDetail.createdAt)}
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
                    konfirmasiKepalaSekolah(selectedIjazahDetail.uuid)
                  }
                  className="button is-info"
                >
                  <IoCheckmarkDoneCircleOutline className="mr-2" /> Konfirmasi
                  Arsip
                </button>
              )}
              {user && user.roles === "kesiswaan" && (
                <>
                  <button
                    onClick={() =>
                      konfirmasiKesiswaan(selectedIjazahDetail.uuid)
                    }
                    className="button is-info"
                  >
                    <IoCheckmarkDoneCircleOutline className="mr-2" /> Konfirmasi
                    Arsip
                  </button>
                  <button
                    onClick={() => tolakIjazah(selectedIjazahDetail.uuid)}
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

export default IjazahList;
