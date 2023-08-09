import React, { useState } from "react";
import axios from "axios";
import { IoRibbonOutline, IoSchoolOutline } from "react-icons/io5";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const Verifikasi = () => {
  const [hashValue, setHashValue] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationError, setVerificationError] = useState(null);

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
    } catch (error) {
      console.error("Failed to verify asset:", error);
      setVerificationResult(null);
      setVerificationError(
        "Data arsip ijazah siswa tidak ditemukan, nomor ijazah yang dimasukan tidak valid."
      );
    }
  };

  const handleHashInputChange = (e) => {
    const inputValue = e.target.value;
    const sanitizedValue = inputValue.replace(/\s/g, "");
    setHashValue(sanitizedValue);
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
    } catch (error) {
      console.error("Failed to verify asset:", error);
      setVerificationResult(null);
      setVerificationError(
        "Data arsip sertifikat siswa tidak ditemukan, nomor sertifikat yang dimasukan tidak valid."
      );
    }
  };

  return (
    <section className="hero has-background-grey-lighter is-fullheight">
      <div className="hero-body">
        <div className="container has-text-centered">
          <div className="column is-10 is-offset-1">
            <h1 className="title">Verifikasi Dokumen</h1>
            <h2 className="subtitle">
              Silahkan melakukan verifikasi dengan memasukkan hash dari dokumen
              ijazah atau sertifikat siswa.
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

            {verificationResult && (
              <div className="box">
                <h3 className="subtitle">Hasil Verifikasi:</h3>
                <SyntaxHighlighter language="json" style={atomDark}>
                  {JSON.stringify(verificationResult, null, 2)}
                </SyntaxHighlighter>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Verifikasi;
