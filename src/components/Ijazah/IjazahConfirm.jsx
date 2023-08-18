import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IoCloudUploadOutline, IoEyeOutline } from "react-icons/io5";
import axios from "axios";
import Swal from "sweetalert2";

const IjazahConfirm = () => {
  const { user } = useSelector((state) => state.auth);

  const [ijazah, setIjazah] = useState([]);
  const [selectedProdi, setSelectedProdi] = useState("");
  const [token, setToken] = useState(null);

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
    fetchToken();
    getIjazah();
  }, [token]);

  const getIjazah = async () => {
    const response = await axios.get("http://localhost:5000/ijazah");
    setIjazah(response.data);
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

  const konfirmasiUploadToBlockchain = async (uuid) => {
    try {
      const response = await axios({
        url: `http://localhost:5000/ijazah/${uuid}`,
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

  const isIjazahConfirmed = (ijazahId) => {
    return confirmedIjazah.includes(ijazahId);
  };

  const filterConfirmedIjazah = () => {
    return ijazah.filter((item) => {
      const isKepsekConfirmed = item.konfirmasi_kepsek === "Dikonfirmasi";
      const isKesiswaanConfirmed = item.konfirmasi_kesiswaan === "Dikonfirmasi";
      return isKepsekConfirmed && isKesiswaanConfirmed;
    });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const confirmedIjazah = filterConfirmedIjazah();
  const currentItems = confirmedIjazah.slice(indexOfFirstItem, indexOfLastItem);

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

  const uploadToBlockchain = async (uuid) => {
    try {
      konfirmasiUploadToBlockchain(uuid);

      const selectedIjazah = ijazah.find((item) => item.uuid === uuid);

      // Mengubah string tanggal menjadi objek tanggal
      const createdAtDate = new Date(selectedIjazah.createdAt);
      const kepsekUpdatedAtDate = new Date(
        selectedIjazah.konfirmasi_kepsekUpdatedAt
      );
      const kesiswaanUpdatedAtDate = new Date(
        selectedIjazah.konfirmasi_kesiswaanUpdatedAt
      );
      const blockchainUpdatedAtDate = new Date(
        selectedIjazah.konfirmasi_uploadToBlockchain
      );

      // Mengonversi objek tanggal ke format ISO
      const createdAtISO = createdAtDate.toISOString();
      const kepsekUpdatedAtISO = kepsekUpdatedAtDate.toISOString();
      const kesiswaanUpdatedAtISO = kesiswaanUpdatedAtDate.toISOString();
      const blockchainUpdatedAtISO = blockchainUpdatedAtDate.toISOString();

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
          createdAtISO,
          getStatus(selectedIjazah),
          kepsekUpdatedAtISO,
          getStatus(selectedIjazah),
          kesiswaanUpdatedAtISO,
          blockchainUpdatedAtISO,
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
              (ijazah, index) =>
                (!selectedProdi || selectedProdi === ijazah.prodi) &&
                ((user.roles === "kepala sekolah" &&
                  getStatus(ijazah) === "Dikonfirmasi") ||
                  (user.roles === "kesiswaan" &&
                    getStatus(ijazah) === "Dikonfirmasi")) && (
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
                        className="button is-small is-primary is-fullwidth mt-1"
                        rel="noopener noreferrer"
                      >
                        Arsip Ijazah
                      </Link>
                    </td>
                    {user && user.roles === "kepala sekolah" && (
                      <>
                        <td>
                          {getStatus(ijazah) === "Dikonfirmasi" ? (
                            <span className="tag is-success is-fullwidth mt-1">
                              {getStatus(ijazah)}
                            </span>
                          ) : (
                            <span className="tag is-warning is-fullwidth mt-1">
                              {getStatus(ijazah)}
                            </span>
                          )}
                        </td>
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
                      </>
                    )}
                    {user && user.roles === "kesiswaan" && (
                      <>
                        <td>
                          {getStatus(ijazah) === "Dikonfirmasi" ? (
                            <span className="tag is-success is-fullwidth mt-1">
                              {getStatus(ijazah)}
                            </span>
                          ) : (
                            <span className="tag is-warning is-fullwidth mt-1">
                              {getStatus(ijazah)}
                            </span>
                          )}
                        </td>
                        <td>
                          <button
                            onClick={() => handleUpload(ijazah.uuid)}
                            className="button is-small is-info is-fullwidth mt-1"
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
                              {formatDateTime(
                                selectedIjazahDetail.konfirmasi_kesiswaanUpdatedAt
                              )}
                            </p>
                            <p className="h6 text-muted mb-0 mb-lg-0 is-size-7 is-capitalized">
                              <strong>Kesiswaan</strong> mengkonfirmasi ijazah{" "}
                              <strong>{selectedIjazahDetail.nama}</strong>
                            </p>
                          </div>
                        </div>
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
                              {formatDateTime(
                                selectedIjazahDetail.konfirmasi_kepsekUpdatedAt
                              )}
                            </p>
                            <p className="h6 text-muted mb-0 mb-lg-0 is-size-7 is-capitalized">
                              <strong>Kepala Sekolah</strong> mengkonfirmasi
                              ijazah{" "}
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
                              {formatDateTime(
                                selectedIjazahDetail.konfirmasi_uploadToBlockchain
                              )}
                            </p>
                            <p className="h6 text-muted mb-0 mb-lg-0 is-size-7 is-capitalized">
                              <strong>Kesiswaan</strong> mengunggah ijazah{" "}
                              <strong>{selectedIjazahDetail.nama}</strong> ke
                              blockchain.
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

export default IjazahConfirm;
