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

  const hitungTotalArsip = (arsipData) => {
    if (!arsipData) return 0;
    return arsipData.reduce((total, arsip) => total + arsip.jumlah, 0);
  };

  const totalArsipIjazah = hitungTotalArsip(ijazah);
  const totalArsipSertifikat = hitungTotalArsip(sertifikat);

  return (
    <div className="container">
      <h1 className="title">Dashboard</h1>
      <h2 className="subtitle">
        Selamat Datang, <strong>{user && user.nama} !</strong>
      </h2>

      <nav className="level mt-2">
        <div className="level-item has-text-centered">
          <div>
            <p className="heading">Arsip Ijazah di Database</p>
            <p className="title">{totalArsipIjazah}</p>
          </div>
        </div>
        <div className="level-item has-text-centered">
          <div>
            <p className="heading">Arsip Sertifikat di Database</p>
            <p className="title">{totalArsipSertifikat}</p>
          </div>
        </div>
        {/* ... */}
      </nav>
    </div>
  );
};

export default Welcome;
