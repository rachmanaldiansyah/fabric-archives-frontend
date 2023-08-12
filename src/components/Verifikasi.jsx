import React, { useState } from "react";
import axios from "axios";
import Logo from "../img/logo-mtc.png";
import {
  IoCloudDownloadOutline,
  IoRibbonOutline,
  IoSchoolOutline,
} from "react-icons/io5";
import { Link } from "react-router-dom";

const Verifikasi = () => {
  const [hashValue, setHashValue] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationError, setVerificationError] = useState(null);

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

      sortInputValuesAscending(); // melakukan sorting secara ascending
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

      sortInputValuesAscending(); // melakukan sorting secara ascending
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
                    className="button is-info"
                    onClick={verifyArsipIjazah}
                  >
                    <IoSchoolOutline />
                  </button>
                </div>
                <div className="control">
                  <button
                    className="button is-info"
                    onClick={verifyArsipSertifikat}
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
                  Hasil Verifikasi:
                </h3>
                <form>
                  {Object.keys(verificationResult.response).map(
                    (key, index) => (
                      <div className="field" key={index}>
                        <label
                          className="label has-text-left pl-2"
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
                            value={verificationResult.response[key] || ""}
                            readOnly
                          />
                        </div>
                      </div>
                    )
                  )}
                </form>
                {verificationResult.response &&
                  verificationResult.response.ArsipIjazah && (
                    <div className="field mt-2">
                      <div className="control has-icons-left">
                        <Link
                          to={`https://${getArsipIjazahDownloadLink()}.ipfs.w3s.link`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="button is-info mt-2"
                        >
                          <p className="has-text-weight-semibold ml-5">Download Arsip Ijazah</p>
                          <span className="icon is-left">
                            <IoCloudDownloadOutline />
                          </span>
                        </Link>
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
                          className="button is-info mt-2"
                        >
                          <p className="has-text-weight-semibold ml-5">Download Arsip Sertifikat</p>
                          <span className="icon is-left">
                            <IoCloudDownloadOutline />
                          </span>
                        </Link>
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
