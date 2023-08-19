import React, { useState } from "react";
import axios from "axios";
import Logo from "../img/logo-mtc.png";
import {
  IoCloudDownloadOutline,
  IoEyeOutline,
  IoRibbonOutline,
  IoSchoolOutline,
} from "react-icons/io5";
import { Link } from "react-router-dom";
import "../styles/global.css";
import "../styles/ijazah.css";
import "../styles/sertifikat.css";

const Verifikasi = () => {
  const [hashValue, setHashValue] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationError, setVerificationError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Menambahkan state untuk nilai input yang akan diubah
  const [inputValues, setInputValues] = useState({});

  const sortInputValuesAscending = () => {
    const sortedInputValues = {};
    const sortedKeys = Object.keys(inputValues).sort((a, b) => {
      return inputValues[a].localeCompare(inputValues[b]);
    });

    sortedKeys.forEach((key) => {
      sortedInputValues[key] = inputValues[key];
    });

    setInputValues(sortedInputValues);
  };

  const handleHashInputChange = (e) => {
    const inputValue = e.target.value;
    const sanitizedValue = inputValue.replace(/\s/g, "");
    setHashValue(sanitizedValue);
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

  // Tambahkan state untuk melacak tipe verifikasi yang dipilih
  const [verificationType, setVerificationType] = useState(null);

  // Fungsi untuk menampilkan traceability sesuai dengan tipe verifikasi yang dipilih
  const displayTraceability = () => {
    if (verificationType === "ijazah") {
      return (
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
                    <p className="is-size-7 mt-3 mb-1">
                      {formatDateTime(verificationResult.response.TanggalArsip)}
                    </p>
                    <p className="is-size-7 text-muted mb-0 mb-lg-0">
                      <strong>Staff TU</strong> mengarsipkan data ijazah{" "}
                      <strong>{verificationResult.response.Nama}</strong>
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
                    <p className="is-size-7 mt-3 mb-1">
                      {formatDateTime(
                        verificationResult.response.TanggalKonfirmasiKesiswaan
                      )}
                    </p>
                    <p className="is-size-7 text-muted mb-0 mb-lg-0">
                      <strong>Kesiswaan</strong> mengkonfirmasi data ijazah{" "}
                      <strong>{verificationResult.response.Nama}</strong>
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
                    <p className="is-size-7 mt-3 mb-1">
                      {formatDateTime(
                        verificationResult.response.TanggalKonfirmasiKepsek
                      )}
                    </p>
                    <p className="is-size-7 text-muted mb-0 mb-lg-0">
                      <strong>Kepala Sekolah</strong> mengkonfirmasi data ijazah{" "}
                      <strong>{verificationResult.response.Nama}</strong>
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
                    <p className="is-size-7 mt-3 mb-1">
                      {formatDateTime(
                        verificationResult.response.TanggalUpload
                      )}
                    </p>
                    <p className="is-size-7 text-muted mb-0 mb-lg-0">
                      <strong>Kesiswaan</strong> mengarsipkan data ijazah{" "}
                      <strong>{verificationResult.response.Nama}</strong> ke
                      Blockchain
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (verificationType === "sertifikat") {
      return (
        <div className="container">
          <div className="row text-center justify-content-center mb-5">
            <div className="col-xl-6 col-lg-8">
              <h2 className="font-weight-bold is-size-5 has-text-centered has-text-weight-semibold">
                Traceability Arsip Sertifikat Uji Kompetensi
              </h2>
              <p className="text-muted is-size-6 has-text-centered has-text-weight-light is-capitalized">
                Ketertelusuran alur pengarsipan sertifikat uji kompetensi
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
                    <p className="is-size-7 mt-3 mb-1">
                      {formatDateTime(verificationResult.response.TanggalArsip)}
                    </p>
                    <p className="is-size-7 text-muted mb-0 mb-lg-0">
                      <strong>Staff TU</strong> mengarsipkan data sertifikat{" "}
                      <strong>{verificationResult.response.Nama}</strong>
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
                    <p className="is-size-7 mt-3 mb-1">
                      {formatDateTime(
                        verificationResult.response.TanggalKonfirmasiKepsek
                      )}
                    </p>
                    <p className="is-size-7 text-muted mb-0 mb-lg-0">
                      <strong>Kepala Sekolah</strong> mengkonfirmasi data arsip
                      sertifikat{" "}
                      <strong>{verificationResult.response.Nama}</strong>
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
                    <p className="is-size-7 mt-3 mb-1">
                      {formatDateTime(
                        verificationResult.response.TanggalKonfirmasiMitra
                      )}
                    </p>
                    <p className="is-size-7 text-muted mb-0 mb-lg-0">
                      <strong>Mitra</strong> mengkonfirmasi data arsip
                      sertifikat{" "}
                      <strong>{verificationResult.response.Nama}</strong>
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
                    <p className="is-size-7 mt-3 mb-1">
                      {formatDateTime(
                        verificationResult.response.TanggalUpload
                      )}
                    </p>
                    <p className="is-size-7 text-muted mb-0 mb-lg-0">
                      <strong>Kesiswaan</strong> mengupload data arsip
                      sertifikat{" "}
                      <strong>{verificationResult.response.Nama}</strong> ke
                      Blockchain
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  const verifyArsipIjazah = async () => {
    try {
      const verifyAsset = { method: "VerifyArsipIjazah", args: [hashValue] };
      const verifyAssetResponse = await axios.post(
        "http://localhost:5001/invoke/ijazah/chaincode-ijazah",
        verifyAsset,
        { withCredentials: true }
      );
      setVerificationResult(verifyAssetResponse.data);
      setVerificationError(null);

      sortInputValuesAscending();
    } catch (error) {
      console.error("Failed to verify asset:", error);
      setVerificationResult(null);
      setVerificationError(
        "Data arsip ijazah siswa tidak ditemukan, nomor ijazah yang dimasukan tidak valid."
      );
    }
  };

  const verifyArsipSertifikat = async () => {
    try {
      const verifyAsset = {
        method: "VerifyArsipSertifikat",
        args: [hashValue],
      };
      const verifyAssetResponse = await axios.post(
        "http://localhost:5002/invoke/sertifikat/chaincode-sertifikat",
        verifyAsset,
        { withCredentials: true }
      );
      setVerificationResult(verifyAssetResponse.data);
      setVerificationError(null);

      sortInputValuesAscending();
    } catch (error) {
      console.error("Failed to verify asset:", error);
      setVerificationResult(null);
      setVerificationError(
        "Data arsip sertifikat siswa tidak ditemukan, nomor sertifikat yang dimasukan tidak valid."
      );
    }
  };

  const getArsipIjazahDownloadLink = () => {
    if (
      verificationResult &&
      verificationResult.response &&
      verificationResult.response.ArsipIjazah
    ) {
      return verificationResult.response.ArsipIjazah;
    }
    return "";
  };

  const getArsipSertifikatDownloadLink = () => {
    if (
      verificationResult &&
      verificationResult.response &&
      verificationResult.response.ArsipSertifikat
    ) {
      return verificationResult.response.ArsipSertifikat;
    }
    return "";
  };

  return (
    <section className="hero has-background-grey-lighter is-fullheight">
      <div className="hero-body">
        <div className="container has-text-centered">
          <div className="column is-10 is-offset-1">
            <img
              src={Logo}
              width="250"
              height="250"
              className="center mb-2"
              alt="logo"
            />
            <h1 className="title has-text-weight-semibold is-uppercase">
              Verifikasi Dokumen Siswa
            </h1>
            <h2 className="subtitle has-text-weight-light is-capitalized">
              Silahkan melakukan verifikasi dengan memasukkan nomor dari dokumen
              ijazah atau <br /> sertifikat uji kompetensi siswa yang ingin
              diverifikasi.
            </h2>
            <div className="box">
              <div className="field has-addons">
                <div className="control is-expanded">
                  <input
                    className="input"
                    type="text"
                    placeholder="Masukkan nomor ijazah atau sertifikat siswa"
                    value={hashValue}
                    onChange={handleHashInputChange}
                  />
                </div>
                <div className="control">
                  <button
                    className="button is-info custom-popover-button-ijazah"
                    onClick={() => {
                      verifyArsipIjazah();
                      setVerificationType("ijazah");
                    }}
                  >
                    <IoSchoolOutline />
                  </button>
                </div>
                <div className="control">
                  <button
                    className="button is-info custom-popover-button-sertifikat"
                    onClick={() => {
                      verifyArsipSertifikat();
                      setVerificationType("sertifikat");
                    }}
                  >
                    <IoRibbonOutline />
                  </button>
                </div>
              </div>
            </div>

            {verificationError && (
              <div className="notification is-danger">{verificationError}</div>
            )}
            {verificationResult && verificationResult.response && (
              <div className="box">
                <h3 className="subtitle has-text-weight-semibold is-uppercase">
                  Hasil Verifikasi
                </h3>

                {displayTraceability()}

                {verificationResult.response &&
                  verificationResult.response.ArsipIjazah && (
                    <div className="field mt-2">
                      <div className="control has-icons-left">
                        <Link
                          to={`https://${getArsipIjazahDownloadLink()}.ipfs.w3s.link`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="button is-primary mt-2"
                        >
                          <p className="has-text-weight-semibold ml-5">
                            Download Arsip
                          </p>
                          <span className="icon is-left">
                            <IoCloudDownloadOutline />
                          </span>
                        </Link>
                        <button
                          className="button is-info mt-2 ml-2"
                          onClick={toggleModal}
                        >
                          <p className="has-text-weight-semibold ml-5">Detail Arsip</p>
                          <span className="icon is-left">
                            <IoEyeOutline />
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                {verificationResult.response &&
                  verificationResult.response.ArsipSertifikat && (
                    <div className="field mt-2">
                      <div className="control has-icons-left">
                        <Link
                          to={`https://${getArsipSertifikatDownloadLink()}.ipfs.w3s.link`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="button is-primary mt-2"
                        >
                          <p className="has-text-weight-semibold ml-5">
                            Download Arsip
                          </p>
                          <span className="icon is-left">
                            <IoCloudDownloadOutline />
                          </span>
                        </Link>
                        <button
                          className="button is-info mt-2 ml-2"
                          onClick={toggleModal}
                        >
                          <p className="has-text-weight-semibold ml-5">Detail Arsip</p>
                          <span className="icon is-left">
                            <IoEyeOutline />
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                {isModalOpen && (
                  <div className="modal is-active">
                    <div
                      className="modal-background"
                      onClick={toggleModal}
                    ></div>
                    <div className="modal-card">
                      <header className="modal-card-head">
                        <p className="modal-card-title">Detail Arsip</p>
                        <button
                          className="delete"
                          aria-label="close"
                          onClick={toggleModal}
                        ></button>
                      </header>
                      <section className="modal-card-body">
                        <form className="container">
                          <div className="row text-center justify-content-center mb-5">
                            <div className="col-xl-6 col-lg-8">
                              <h2 className="font-weight-bold is-size-5 has-text-centered has-text-weight-semibold">
                                Keterangan Arsip{" "}
                                {verificationResult.response.Nama}
                              </h2>
                              <p className="text-muted is-size-6 has-text-centered has-text-weight-light is-capitalized">
                                Keterangan arsip siswa yang telah diterbitkan di
                                Blockchain.
                              </p>
                            </div>
                          </div>
                          {Object.keys(verificationResult.response).map(
                            (key, index) => (
                              <div className="field" key={index}>
                                <label
                                  className="label has-text-left has-text-weight-semibold pl-2"
                                  htmlFor={key}
                                >
                                  {key}
                                </label>
                                <div className="control pl-2">
                                  <input
                                    className="input"
                                    type="text"
                                    id={key}
                                    name={key}
                                    value={
                                      verificationResult.response[key] || ""
                                    }
                                    readOnly
                                  />
                                </div>
                              </div>
                            )
                          )}
                        </form>
                      </section>
                      <footer className="modal-card-foot">
                        <button className="button is-primary" onClick={toggleModal}>
                          Tutup
                        </button>
                      </footer>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Verifikasi;
