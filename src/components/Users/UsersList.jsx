import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const UsersList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const response = await axios.get("http://localhost:5000/users");
    const sortedUsers = response.data.sort((a, b) =>
      a.roles.localeCompare(b.roles)
    );
    setUsers(sortedUsers);
  };

  const deleteUsers = async (userId) => {
    await axios.delete(`http://localhost:5000/users/${userId}`);
    getUsers();
  };

  return (
    <div>
      <h1 className="title">Kelola Pengguna</h1>
      <h2 className="subtitle">Daftar Data Pengguna Sistem</h2>
      <div className="table-container">
        <table className="table is-striped is-hoverable is-fullwidth">
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
            {users.map((users, index) => (
              <tr key={users.uuid}>
                <td>{index + 1}</td>
                <td>{users.nama}</td>
                <td>{users.email}</td>
                <td>{users.roles}</td>
                <td>
                  <Link
                    to={`/users/edit/${users.uuid}`}
                    className="button is-small is-info mr-1"
                  >
                    Ubah
                  </Link>
                  <button
                    onClick={() => deleteUsers(users.uuid)}
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
    </div>
  );
};

export default UsersList;
