import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { IoTrashOutline, IoCreateOutline } from "react-icons/io5";
import Swal from "sweetalert2";

const UsersList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate the index range of items to display for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getUsers = async () => {
    const response = await axios.get("http://localhost:5000/users");
    const sortedUsers = response.data.sort((a, b) =>
      a.roles.localeCompare(b.roles)
    );
    setUsers(sortedUsers);
  };

  const deleteUsers = async (userId) => {
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
        await axios.delete(`http://localhost:5000/users/${userId}`);
        getUsers();
        Swal.fire("Terhapus!", "Data pengguna berhasil dihapus.", "success");
      }
    });
  };

  return (
    <div className="container box">
      <div className="hero is-primary is-bold box">
        <h1 className="title mt-2">Kelola Data Pengguna</h1>
        <h2 className="subtitle">Daftar data pengguna</h2>
      </div>

      <div className="table-container">
        <table className="table is-narrow is-striped is-fullwidth is-hoverable">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Lengkap</th>
              <th>Email</th>
              <th>Roles</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((users, index) => (
              <tr key={users.uuid}>
                <td>{index + 1}</td>
                <td>{users.nama}</td>
                <td>{users.email}</td>
                <td>{users.roles}</td>
                <td>
                  <Link
                    to={`/users/edit/${users.uuid}`}
                    className="button is-small is-info is-fullwidth"
                  >
                    <IoCreateOutline />
                  </Link>
                  <button
                    onClick={() => deleteUsers(users.uuid)}
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
            length: Math.ceil(users.length / itemsPerPage),
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

export default UsersList;
