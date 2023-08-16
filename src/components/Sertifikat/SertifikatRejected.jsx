import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { IoEyeOutline } from "react-icons/io5";

const SertifikatRejected = () => {
  const { user } = useSelector((state) => state.auth);

  const [sertifikatDitolak, setSertifikatDitolak] = useState([]);

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
    getSertifikatDitolak();
  }, []);

  const getSertifikatDitolak = async () => {
    try {
      const response = await axios.get("http://localhost:5000/sertifikat");
      const sertifikatDitolak = response.data.filter(
        (item) => item.konfirmasi_mitra === "Ditolak"
      );
      setSertifikatDitolak(sertifikatDitolak);
    } catch (error) {
      console.error("Error fetching data:", error);
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

  return (
    <div className="container box">
      <div className="hero is-primary is-bold box">
        <h1 className="title is-family-sans-serif is-uppercase has-text-centered has-text-weight-semibold mt-2">
          Daftar Arsip Sertifikat Siswa yang Ditolak
        </h1>
        <h2 className="subtitle is-family-sans-serif is-capitalized has-text-dark has-text-centered has-text-weight-light">
          Arsipkan ulang data sertifikat siswa yang ditolak
        </h2>
      </div>

      <div className="table-container">
        {sertifikatDitolak.length === 0 ? (
          <div className="box">
            <p className="has-text-centered has-text-weight-semibold is-capitalized">
              Tidak ada data arsip sertifikat siswa yang ditolak.
            </p>
          </div>
        ) : (
          <table className="table is-narrow is-striped is-fullwidth is-hoverable">
            <thead>
              <tr>
                <th>No</th>
                <th>No Sertifikat</th>
                <th>Nomor Induk</th>
                <th>Nama Siswa</th>
                <th>Jenis Kelamin</th>
                <th>Program Studi</th>
                <th>Arsip Sertifikat</th>
                {user && user.roles === "admin" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {sertifikatDitolak.map((sertifikat, index) => (
                <tr key={sertifikat.uuid}>
                  <td>{index + 1}</td>
                  <td>{sertifikat.no_sertifikat}</td>
                  <td>{sertifikat.nis}</td>
                  <td>{sertifikat.nama}</td>
                  <td>{sertifikat.jk}</td>
                  <td>{sertifikat.keahlian}</td>
                  <td>
                    <a
                      href={
                        "https://" +
                        sertifikat.arsip_sertifikat +
                        ".ipfs.w3s.link"
                      }
                      className="button is-small is-fullwidth is-primary mt-1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Arsip Sertifikat
                    </a>
                  </td>
                  {user && user.roles === "admin" && (
                    <td>
                      <button
                        onClick={() => openDetailModal(sertifikat)}
                        className="button is-small is-info is-fullwidth mt-1"
                      >
                        <IoEyeOutline />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

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
            <section className="modal-card-body">
              <div className="content">
                <div className="container">
                  <div className="columns is-centered">
                    <div className="column is-fullwidth">
                      <div className="box p-4 has-background-warning mt-0 mb-2">
                        <p className="is-size-7 has-text-centered">
                          <strong>Alasan Penolakan:</strong>{" "}
                          {selectedSertifikatDetail.alasan_penolakan}
                        </p>
                      </div>
                      <div className="box p-4 has-background-grey-lighter">
                        <h2 className="is-size-5 has-text-weight-semibold is-underlined has-text-centered">
                          Keterangan Arsip Sertifikat Uji Kompetensi
                        </h2>
                        <h3 className="is-size-6 has-text-weight-light is-capitalized has-text-centered mt-1">
                          Keterangan arsip sertifikat uji kompetensi siswa <br />{" "}
                          {selectedSertifikatDetail.nama}
                        </h3>
                        <p className="is-size-7">
                          <strong>Nomor Sertifikat:</strong>{" "}
                          {selectedSertifikatDetail.no_ijazah}
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

export default SertifikatRejected;
