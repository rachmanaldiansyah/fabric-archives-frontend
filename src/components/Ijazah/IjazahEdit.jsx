import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const IjazahEdit = () => {
  const [no_ijazah, setNoIjazah] = useState("");
  const [arsip_ijazah, setArsipIjazah] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getIjazahById = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/ijazah/${id}`);
        setNoIjazah(response.data.no_ijazah);
        setArsipIjazah(response.data.arsip_ijazah);
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    };
    getIjazahById();
  }, [id]);

  const updateIjazah = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/ijazah/${id}`, {
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
      <h2 className="subtitle">Ubah arsip ijazah siswa</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form onSubmit={updateIjazah}>
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
                    Ubah Arsip
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

export default IjazahEdit;
