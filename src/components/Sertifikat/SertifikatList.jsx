import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const SertifikatList = () => {
  const [sertifikat, setSertifikat] = useState([]);

  useEffect(() => {
    getSertifikat();
  }, []);

  const getSertifikat = async () => {
    const response = await axios.get("http://localhost:5000/sertifikat");
    setSertifikat(response.data);
  };

  const deleteSertifikat = async (sertifikatId) => {
    await axios.delete(`http://localhost:5000/sertifikat/${sertifikatId}`);
    getSertifikat();
  };

  return (
    <div>
      <h1 className="title">Kelola Arsip Sertifikat</h1>
      <h2 className="subtitle">Daftar Data Sertifikat</h2>
      <Link to={"/sertifikat/create"} className="button is-primary mb-2">
        Tambah Sertifikat Baru
      </Link>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>No</th>
            <th>No Sertifikat</th>
            <th>Arsip Sertifikat</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sertifikat.map((sertifikat, index) => (
            <tr key={sertifikat.uuid}>
              <td>{index + 1}</td>
              <td>{sertifikat.no_sertifikat}</td>
              <td>{sertifikat.arsip_sertifikat}</td>
              <td>
                <Link
                  to={`/sertifikat/edit/${sertifikat.uuid}`}
                  className="button is-small is-info"
                >
                  Ubah
                </Link>
                <button
                  onClick={() => deleteSertifikat(sertifikat.uuid)}
                  className="button is-small is-danger"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SertifikatList;
