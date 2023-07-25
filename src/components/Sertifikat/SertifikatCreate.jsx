import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SertifikatCreate = () => {
  const [no_sertifikat, setNoSertifikat] = useState("");
  const [arsip_sertifikat, setArsipSertifikat] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const SaveSertifikat = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/sertifikat", {
        no_sertifikat: no_sertifikat,
        arsip_sertifikat: arsip_sertifikat,
      });
      navigate("/sertifikat");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div>
      <h1 className="title">Kelola Arsip Sertifikat</h1>
      <h2 className="subtitle">Arsip Sertifikat Baru</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form onSubmit={SaveSertifikat}>
              <p className="has-text-centered">{msg}</p>
              <div className="field">
                <label className="label">No Sertifikat</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={no_sertifikat}
                    onChange={(e) => setNoSertifikat(e.target.value)}
                    placeholder="Isi nomor sertifikat siswa"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Arsip Sertifikat</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={arsip_sertifikat}
                    onChange={(e) => setArsipSertifikat(e.target.value)}
                    placeholder="Isi arsip sertifikat siswa"
                  />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <button type="submit" className="button is-success">
                    Arsipkan
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SertifikatCreate;
