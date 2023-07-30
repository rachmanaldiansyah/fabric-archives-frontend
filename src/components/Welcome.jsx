import React from "react";
import { useSelector } from "react-redux";

const Welcome = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div>
      <h1 className="title">Dashboard</h1>
      <h2 className="subtitle">
        Selamat Datang, <strong>{user && user.nama} !</strong>
      </h2>

      <nav class="level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Arsip Ijazah di Database</p>
            <p class="title">123</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Arsip Sertifikat di Database</p>
            <p class="title">123</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Arsip Ijazah di Blockchain</p>
            <p class="title">123</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Arsip Sertifikat di Blockchain</p>
            <p class="title">123</p>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Welcome;
