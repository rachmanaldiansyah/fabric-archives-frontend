import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { IoEyeOutline } from "react-icons/io5";

const IjazahRejected = () => {
  const { user } = useSelector((state) => state.auth);

  const [ijazahDitolak, setIjazahDitolak] = useState([]);

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
    getIjazahDitolak();
  }, []);

  const getIjazahDitolak = async () => {
    try {
      const response = await axios.get("http://localhost:5000/ijazah");
      const ijazahDitolak = response.data.filter(
        (item) => item.konfirmasi_kesiswaan === "Ditolak"
      );
      setIjazahDitolak(ijazahDitolak);
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
          Daftar Arsip Ijazah Siswa yang Ditolak
        </h1>
        <h2 className="subtitle is-family-sans-serif is-capitalized has-text-dark has-text-centered has-text-weight-light">
          Arsipkan ulang data sertifikat siswa yang ditolak
        </h2>
      </div>

      <div className="table-container">
        {ijazahDitolak.length === 0 ? (
          <div className="box">
            <p className="has-text-centered has-text-weight-semibold is-capitalized">
              Tidak ada data arsip ijazah siswa yang ditolak.
            </p>
          </div>
        ) : (
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
                {user && user.roles === "admin" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {ijazahDitolak.map((ijazah, index) => (
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
                    <a
                      href={"https://" + ijazah.arsip_ijazah + ".ipfs.w3s.link"}
                      className="button is-small is-fullwidth is-primary mt-1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Arsip Ijazah
                    </a>
                  </td>
                  {user && user.roles === "admin" && (
                    <td>
                      <button
                        onClick={() => openDetailModal(ijazah)}
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
                  <div className="columns is-centered">
                    <div className="column is-fullwidth">
                      <div className="box p-4 has-background-warning mt-0 mb-2">
                        <p className="is-size-7 has-text-centered">
                          <strong>
                            Alasan Penolakan:
                          </strong>{" "}
                          {selectedIjazahDetail.alasan_penolakan}
                        </p>
                      </div>
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

export default IjazahRejected;
