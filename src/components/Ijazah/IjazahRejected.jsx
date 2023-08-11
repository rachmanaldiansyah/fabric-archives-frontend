import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { IoTrashOutline } from "react-icons/io5";

const IjazahRejected = () => {
  const [ijazahDitolak, setIjazahDitolak] = useState([]);
  const { user } = useSelector((state) => state.auth);

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

  const deleteIjazah = async (ijazahId) => {
    Swal.fire({
      title: "Apakah Anda Yakin Akan Menghapus Data Ini?",
      text: "Data arsip ijazah yang terhapus tidak akan bisa kembali!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`http://localhost:5000/ijazah/${ijazahId}`);
        getIjazahDitolak();
        Swal.fire("Terhapus!", "Data Arsip Ijazah Telah Dihapus.", "success");
      }
    });
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
                        onClick={() => deleteIjazah(ijazah.uuid)}
                        className="button is-small is-danger is-fullwidth mt-1"
                      >
                        <IoTrashOutline />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default IjazahRejected;
