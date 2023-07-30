import React from "react";
import { useSelector } from "react-redux";
import Timeline from "./Timeline";

const Welcome = () => {
  const { user } = useSelector((state) => state.auth);

  const data = [
    {
      id: 1,
      date: "27 Juli 2023",
      description: "Dokumen ijazah diterima dan disetujui.",
      active: true,
    },
    {
      id: 2,
      date: "26 Juli 2023",
      description: "Dokumen ijazah sedang dalam proses verifikasi.",
      active: false,
    },
  ];

  return (
    <div>
      <h1 className="title">Dashboard</h1>
      <h2 className="subtitle">
        Selamat Datang, <strong>{user && user.nama} !</strong>
      </h2>

      <div className="container">
        <h1 className="title">Timeline Aktif Ijazah</h1>
        <Timeline data={data} />
      </div>
    </div>
  );
};

export default Welcome;
