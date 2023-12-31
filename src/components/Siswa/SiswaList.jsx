import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoTrashOutline, IoCreateOutline } from "react-icons/io5";
import axios from "axios";
import Swal from "sweetalert2";
import { IoSearchOutline, IoPersonAddOutline } from "react-icons/io5";

const SiswaList = () => {
  const [siswa, setSiswa] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProdi, setSelectedProdi] = useState("");

  useEffect(() => {
    getSiswa();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate the index range of items to display for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = siswa.slice(indexOfFirstItem, indexOfLastItem);

  const handleProdiFilterChange = (event) => {
    setSelectedProdi(event.target.value);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getSiswa = async () => {
    const response = await axios.get("http://localhost:5000/siswa");
    const sortedSiswa = response.data.sort((a, b) =>
      a.nama.localeCompare(b.nama)
    );
    setSiswa(sortedSiswa);
  };

  const deleteSiswa = async (siswaId) => {
    Swal.fire({
      title: "Apakah Anda Yakin Akan Menghapus Data Ini?",
      text: "Perhatian: data siswa yang terhapus tidak akan bisa kembali!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`http://localhost:5000/siswa/${siswaId}`);
        getSiswa();
        Swal.fire("Terhapus!", "Data siswa berhasil dihapus.", "success");
      }
    });
  };

  return (
    <div className="container box">
      <div className="hero is-primary is-bold box">
        <h1 className="title is-family-sans-serif is-uppercase has-text-centered has-text-weight-semibold mt-2">
          Kelola Daftar Siswa
        </h1>
        <h2 className="subtitle is-family-sans-serif is-capitalized has-text-dark has-text-centered has-text-weight-light">
          Daftar Data Siswa yang Telah Lulus
        </h2>
      </div>

      <div className="columns">
        <div className="column is-one-third">
          <div className="field has-addons">
            <div className="control select is-primary">
              <select
                id="prodiFilter"
                value={selectedProdi}
                onChange={handleProdiFilterChange}
              >
                <option value="" disabled>
                  Pilih Program Studi
                </option>
                <option value="Teknik Komputer & Jaringan">
                  Teknik Komputer & Jaringan
                </option>
                <option value="Perhotelan">Perhotelan</option>
                <option value="Multimedia">Multimedia</option>
              </select>
            </div>
            <div className="control">
              <Link to={`/siswa/tambah`} className="button is-primary">
                <IoPersonAddOutline />
              </Link>
            </div>
          </div>
        </div>
        <div className="column is-one-third is-hidden-mobile"></div>
        <div className="column is-one-third">
          <div className="field has-addons is-pulled-right">
            <div className="control has-icons-left">
              <input
                type="text"
                className="input is-primary"
                placeholder="Cari Nama Siswa"
                value={searchQuery}
                onChange={handleSearch}
              />
              <span className="icon is-small is-left">
                <IoSearchOutline />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="table is-narrow is-striped is-fullwidth is-hoverable">
          <thead>
            <tr>
              <th>No</th>
              <th>NISN</th>
              <th>NIS</th>
              <th>Nama Siswa</th>
              <th>Jenis kelamin</th>
              <th>Nama Orangtua</th>
              <th>Prodi</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((siswa, index) => (
              <tr key={siswa.uuid}>
                <td>{index + 1}</td>
                <td>{siswa.nisn}</td>
                <td>{siswa.nis}</td>
                <td>{siswa.nama}</td>
                <td>{siswa.jk}</td>
                <td>{siswa.nama_orangtua}</td>
                <td>{siswa.prodi}</td>
                <td>
                  <Link
                    to={`/siswa/ubah/${siswa.uuid}`}
                    className="button is-small is-info is-fullwidth"
                  >
                    <IoCreateOutline />
                  </Link>
                  <button
                    onClick={() => deleteSiswa(siswa.uuid)}
                    className="button is-small is-danger is-fullwidth mt-1"
                  >
                    <IoTrashOutline />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tampilan Pagination */}
      <div
        className="pagination is-centered is-rounded"
        role="navigation"
        aria-label="pagination"
      >
        <ul className="pagination-list">
          {Array.from({
            length: Math.ceil(siswa.length / itemsPerPage),
          }).map((_, i) => (
            <li key={i}>
              <button
                className={`pagination-link${
                  currentPage === i + 1 ? " is-current" : ""
                }`}
                aria-label={`Goto page ${i + 1}`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SiswaList;
