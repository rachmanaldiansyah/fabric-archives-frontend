import React from "react";

const Verifikasi = () => {
  return (
    <section className="hero has-background-grey-lighter is-fullheight is-fullwidth">
      <div className="hero-body">
        <div className="container has-text-centered">
          <div className="column is-6 is-offset-3">
            <h1 className="title">Verifikasi Dokumen</h1>
            <h2 className="subtitle">
              Silahkan melakukan verifikasi dengan memasukan hash dari dokumen
              ijazah atau sertifikat siswa.
            </h2>
            <div className="container box">
              <div className="field is-grouped">
                <p className="control is-expanded">
                  <input
                    className="input"
                    type="text"
                    placeholder="Masukkan Hash dari dokumen ijazah/sertifikat siswa"
                  />
                </p>
                <p className="control">
                  <button className="button is-info">Verifikasi</button>
                </p>
              </div>
            </div>

            <div className="table-container box">
              <table className="table is-striped is-hoverable is-fullwidth">
                <thead>
                  <tr>
                    <th>No Ijazah</th>
                    <th>NISN</th>
                    <th>Nama Siswa</th>
                    <th>Jenis Kelamin</th>
                    <th>Program Studi</th>
                    <th>Arsip Ijazah</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Verifikasi;
