import React from "react";

const Verifikasi = () => {
  return (
    <section className="hero has-background-grey-light is-fullheight is-fullwidth">
      <div className="hero-body">
        <div className="container has-text-centered">
          <div className="column is-6 is-offset-3">
            <h1 className="title">Verifikasi Dokumen</h1>
            <h2 className="subtitle">
              Silahkan melakukan verifikasi dengan memasukan hash dari dokumen
              ijazah atau sertifikat siswa.
            </h2>
            <div className="box">
              <div className="field is-grouped">
                <p className="control is-expanded">
                  <input
                    className="input"
                    type="text"
                    placeholder="Masukkan Hash dari dokumen ijazah/sertifikat siswa"
                  />
                </p>
                <p class="control">
                  <a className="button is-info">Verifikasi</a>
                </p>
              </div>
            </div>

            <table className="table is-striped is-hoverable is-fullwidth">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Hasil Verifikasi</th>
                  </tr>
                </thead>
                <tbody>
                  
                </tbody>
              </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Verifikasi;
