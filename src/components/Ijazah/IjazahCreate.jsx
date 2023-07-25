import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const IjazahCreate = () => {
  const [no_ijazah, setNoIjazah] = useState("");
  const [arsip_ijazah, setArsipIjazah] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const SaveIjazah = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/ijazah", {
        no_ijazah: no_ijazah,
        arsip_ijazah: arsip_ijazah,
      });
      navigate("/ijazah");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div>
      <h1 className="title">Kelola Arsip Ijazah</h1>
      <h2 className="subtitle">Arsip Ijazah Baru</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form onSubmit={SaveIjazah}>
              <p className="has-text-centered">{msg}</p>
              <div className="field">
                <label className="label">No Ijazah</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={no_ijazah}
                    onChange={(e) => setNoIjazah(e.target.value)}
                    placeholder="Isi nomor ijazah siswa"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Arsip Ijazah</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={arsip_ijazah}
                    onChange={(e) => setArsipIjazah(e.target.value)}
                    placeholder="Isi arsip ijazah siswa"
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

export default IjazahCreate;
