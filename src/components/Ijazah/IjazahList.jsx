import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const IjazahList = () => {
  const [ijazah, setIjazah] = useState([]);

  useEffect(() => {
    getIjazah();
  }, []);

  const getIjazah = async () => {
    const response = await axios.get("http://localhost:5000/ijazah");
    setIjazah(response.data);
  };

  const deleteIjazah = async (ijazahId) => {
    await axios.delete(`http://localhost:5000/ijazah/${ijazahId}`);
    getIjazah();
  };

  return (
    <div>
      <h1 className="title">Kelola Daftar Ijazah</h1>
      <h2 className="subtitle">Daftar Data Ijazah</h2>
      <Link to={"/ijazah/create"} className="button is-primary mb-2">
        Tambah Ijazah Baru
      </Link>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>No</th>
            <th>No Ijazah</th>
            <th>Arsip Ijazah</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ijazah.map((ijazah, index) => (
            <tr key={ijazah.uuid}>
              <td>{index + 1}</td>
              <td>{ijazah.no_ijazah}</td>
              <td>{ijazah.arsip_ijazah}</td>
              <td>
                <Link
                  to={`/ijazah/edit/${ijazah.uuid}`}
                  className="button is-small is-info"
                >
                  Ubah
                </Link>
                <button
                  onClick={() => deleteIjazah(ijazah.uuid)}
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

export default IjazahList;