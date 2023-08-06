import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { IoTrashOutline } from "react-icons/io5";

const SertifikatRejected = () => {
  const [sertifikatDitolak, setSertifikatDitolak] = useState([]);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    getSertifikatDitolak();
  }, []);

  const getSertifikatDitolak = async () => {
    try {
      const response = await axios.get("http://localhost:5000/sertifikat");
      const sertifikatDitolak = response.data.filter(
        (item) => item.konfirmasi_kepsek === "Ditolak"
      );
      setSertifikatDitolak(sertifikatDitolak);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteSertifikat = async (sertifikatId) => {
    Swal.fire({
      title: "Apakah Anda Yakin Akan Menghapus Data Ini?",
      text: "Data arsip sertifikat yang terhapus tidak akan bisa kembali!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`http://localhost:5000/sertifikat/${sertifikatId}`);
        getSertifikatDitolak();
        Swal.fire(
          "Terhapus!",
          "Data Arsip Sertifikat Telah Dihapus.",
          "success"
        );
      }
    });
  };

  return (
    <div className="container box">
      <div className="hero is-primary is-bold box">
        <h1 className="title mt-2">Data Arsip Sertifikat Ditolak</h1>
      </div>
      <div className="table-container">
        <table className="table is-narrow is-striped is-fullwidth is-hoverable">
          <thead>
            <tr>
              <th>No</th>
              <th>No Sertifikat</th>
              <th>Nomor Induk</th>
              <th>Nama Siswa</th>
              <th>Jenis Kelamin</th>
              <th>Program Studi</th>
              <th>Arsip Sertifikat</th>
              {user && user.roles === "admin" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {sertifikatDitolak.map((sertifikat, index) => (
              <tr key={sertifikat.uuid}>
                <td>{index + 1}</td>
                <td>{sertifikat.no_sertifikat}</td>
                <td>{sertifikat.nis}</td>
                <td>{sertifikat.nama}</td>
                <td>{sertifikat.jk}</td>
                <td>{sertifikat.keahlian}</td>
                <td>{sertifikat.arsip_sertifikat}</td>
                <td>
                  <a
                    href={"https://" + sertifikat.arsip_sertifikat + ".ipfs.w3s.link"}
                    className="button is-small is-fullwidth is-primary mt-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Arsip Sertifikat
                  </a>
                </td>
                {user && user.roles === "admin" && (
                  <td>
                    <button
                      onClick={() => deleteSertifikat(sertifikat.uuid)}
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
      </div>
    </div>
  );
};

export default SertifikatRejected;
