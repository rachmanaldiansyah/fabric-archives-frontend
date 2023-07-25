import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const SiswaList = () => {
  const [siswa, setSiswa] = useState([]);

  useEffect(() => {
    getSiswa();
  }, []);

  const getSiswa = async () => {
    const response = await axios.get("http://localhost:5000/siswa");
    setSiswa(response.data);
  };

  const deleteSiswa = async (siswaId) => {
    await axios.delete(`http://localhost:5000/siswa/${siswaId}`);
    getSiswa();
  };

  return (
    <div>
      <h1 className="title">Kelola Daftar Siswa</h1>
      <h2 className="subtitle">Daftar Data Siswa</h2>
      <Link to={"/siswa/create"} className="button is-primary mb-2">
        Tambah Siswa Baru
      </Link>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>No</th>
            <th>NISN</th>
            <th>NIS</th>
            <th>Nama Siswa</th>
            <th>Jenis Kelamin</th>
            <th>Nama Orang Tua</th>
            <th>Program Keahlian</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {siswa.map((siswa, index) => (
            <tr key={siswa.uuid}>
              <td>{index + 1}</td>
              <td>{siswa.nisn}</td>
              <td>{siswa.nis}</td>
              <td>{siswa.nama_siswa}</td>
              <td>{siswa.jk}</td>
              <td>{siswa.nama_orangtua}</td>
              <td>{siswa.prodi}</td>
              <td>
                <Link
                  to={`/siswa/edit/${siswa.uuid}`}
                  className="button is-small is-info"
                >
                  Ubah
                </Link>
                <button
                  onClick={() => deleteSiswa(siswa.uuid)}
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

export default SiswaList;