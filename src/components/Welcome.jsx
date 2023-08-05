import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const Welcome = () => {
  const { user } = useSelector((state) => state.auth);
  const [sertifikat, setSertifikat] = useState([]);
  const [ijazah, setIjazah] = useState([]);

  useEffect(() => {
    getDataArsipIjazah();
    getDataArsipSertifikat();
  }, []);

  const getDataArsipSertifikat = async () => {
    try {
      const response = await axios.get("http://localhost:5000/sertifikat");
      setSertifikat(response.data);
    } catch (error) {
      console.error("Error fetching sertifikat data:", error);
    }
  };

  const getDataArsipIjazah = async () => {
    try {
      const response = await axios.get("http://localhost:5000/ijazah");
      setIjazah(response.data);
    } catch (error) {
      console.error("Error fetching ijazah data:", error);
    }
  };

  const getTotalArsipById = (arsipData) => {
    if (!arsipData) return 0;
    const uniqueUUIDs = [...new Set(arsipData.map((arsip) => arsip.uuid))];
    return uniqueUUIDs.length;
  };

  const totalArsipIjazah = getTotalArsipById(ijazah);
  const totalArsipSertifikat = getTotalArsipById(sertifikat);

  return (
    <div className="container box">
      <section className="hero is-info is-bold box">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">Dashboard</h1>
            <h2 className="subtitle">
              Selamat Datang, <strong>{user && user.nama}!</strong>
            </h2>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="columns is-centered is-multiline">
          <div className="column is-6-mobile is-4-tablet is-3-desktop">
            <div className="box hero is-info is-bold has-text-centered">
              <p className="heading">Arsip Ijazah</p>
              <p className="title">{totalArsipIjazah}</p>
            </div>
          </div>
          <div className="column is-6-mobile is-4-tablet is-3-desktop">
            <div className="box hero is-info has-text-centered">
              <p className="heading">Arsip Sertifikat</p>
              <p className="title">{totalArsipSertifikat}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Welcome;
