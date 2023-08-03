import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { IoCloudUploadOutline } from "react-icons/io5";
import axios from "axios";
import Modal from "../Modal";

const SertifikatConfirm = () => {
  const [sertifikat, setSertifikat] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const [selectedProdi, setSelectedProdi] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedSertifikat, setSelectedSertifikat] = useState(null);

  useEffect(() => {
    getSertifikat();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate the index range of items to display for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sertifikat.slice(indexOfFirstItem, indexOfLastItem);

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getSertifikat = async () => {
    const response = await axios.get("http://localhost:5000/sertifikat");
    setSertifikat(response.data);
  };

  // fungsi untuk mendapatkan status valid/invalid
  const getStatus = (sertifikat) => {
    const isKepsekConfirmed = sertifikat.konfirmasi_kepsek === "Dikonfirmasi";
    const isKesiswaanConfirmed = sertifikat.konfirmasi_mitra === "Dikonfirmasi";

    if (isKepsekConfirmed && isKesiswaanConfirmed) {
      return "Dikonfirmasi";
    } else {
      return "Pending";
    }
  };

  const openModal = (arsipSertifikat) => {
    setSelectedSertifikat(arsipSertifikat);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleProdiFilterChange = (event) => {
    setSelectedProdi(event.target.value);
  };

  // Function to upload data arsip sertifikat to the blockchain
  const uploadToBlockchain = async (uuid) => {
    try {
      // Call the API to enroll user and get the token
      const enrollResponse = await axios.post("http://localhost:8803/user/enroll", {
        id: "admin",
        secret: "adminpw",
      });
      const token = enrollResponse.data.token;

      // Prepare the data for the asset creation
      const selectedSertifikat = sertifikat.find((item) => item.uuid === uuid);
      const assetData = {
        method: "CreateAsset",
        args: [
          selectedSertifikat.no_sertifikat,
          selectedSertifikat.nis,
          selectedSertifikat.date,
          selectedSertifikat.nama,
          selectedSertifikat.jk,
          selectedSertifikat.keahlian,
          selectedSertifikat.arsip_sertifikat,
          getStatus(selectedSertifikat),
          getStatus(selectedSertifikat),
        ],
      };

      // Make the API request to create the asset on the blockchain
      const createAssetResponse = await axios.post(
        "http://144.126.209.213:8803/invoke/ijazah/chaincode-ijazah",
        assetData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      // Handle the response accordingly
      console.log(createAssetResponse.data); // You can modify this to handle the response as needed

      // Optional: You can also show a success message or trigger some action after successful upload
    } catch (error) {
      // Handle errors
      console.error("Error uploading to blockchain:", error);
      // Optional: You can show an error message to the user or trigger some error handling
    }
  };

  return (
    <div className="container">
      <h1 className="title mt-2">Kelola Daftar Arsip Sertifikat</h1>
      <h2 className="subtitle">
        Daftar data arsip sertifikat uji kompetensi siswa
      </h2>
      <div className="container mb-2">
        <div className="control">
          <select
            className="select"
            id="prodiFilter"
            value={selectedProdi}
            onChange={handleProdiFilterChange}
          >
            <option value="" selected disabled>
              Pilih Program Studi
            </option>
            <option value="Teknik Komputer & Jaringan">
              Teknik Komputer & Jaringan
            </option>
            <option value="Perhotelan">Perhotelan</option>
            <option value="Multimedia">Multimedia</option>
          </select>
        </div>
      </div>
      <div className="table-container">
        <table className="table is-striped is-fullwidth is-hoverable">
          <thead>
            <tr>
              <th>No</th>
              <th>No Sertifikat</th>
              <th>Nomor Induk</th>
              <th>Nama Siswa</th>
              <th>Jenis Kelamin</th>
              <th>Kompetensi Keahlian</th>
              <th>Arsip Sertifikat</th>
              {user && user.roles === "kepala sekolah" && (
                <>
                  <th>Status</th>
                  <th>Actions</th>
                </>
              )}
              {user && user.roles === "mitra penerbit" && (
                <>
                  <th>Status</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {currentItems.map(
              (sertifikat, index) =>
                (!selectedProdi || selectedProdi === sertifikat.keahlian) && (
                  <tr key={sertifikat.uuid}>
                    <td>{index + 1}</td>
                    <td>{sertifikat.no_sertifikat}</td>
                    <td>{sertifikat.nis}</td>
                    <td>{sertifikat.nama}</td>
                    <td>{sertifikat.jk}</td>
                    <td>{sertifikat.keahlian}</td>
                    <td>
                      <button
                        className="button is-small is-primary is-fullwidth"
                        onClick={() =>
                          openModal(
                            "https://" +
                              sertifikat.arsip_sertifikat +
                              ".ipfs.w3s.link"
                          )
                        }
                      >
                        Arsip Sertifikat
                      </button>
                      {modalIsOpen && (
                        <Modal
                          title="Arsip Sertifikat"
                          content={selectedSertifikat}
                          onClose={closeModal}
                        />
                      )}
                    </td>
                    {user && user.roles === "kepala sekolah" && (
                      <>
                        {getStatus(sertifikat) === "Dikonfirmasi" && (
                          <td className="tag is-small is-success is-fullwidth mt-2">
                            {getStatus(sertifikat)}
                          </td>
                        )}
                        {getStatus(sertifikat) === "Pending" && (
                          <td className="tag is-small is-warning is-fullwidth mt-2">
                            {getStatus(sertifikat)}
                          </td>
                        )}
                        <td>
                          <button
                            onClick={() => uploadToBlockchain(sertifikat.uuid)}
                            className="button is-small is-info is-fullwidth"
                          >
                            <IoCloudUploadOutline />
                          </button>
                        </td>
                      </>
                    )}
                    {user && user.roles === "mitra penerbit" && (
                      <>
                        {getStatus(sertifikat) === "Dikonfirmasi" && (
                          <td className="tag is-small is-success is-fullwidth mt-2">
                            {getStatus(sertifikat)}
                          </td>
                        )}
                        {getStatus(sertifikat) === "Pending" && (
                          <td className="tag is-small is-warning is-fullwidth mt-2">
                            {getStatus(sertifikat)}
                          </td>
                        )}
                      </>
                    )}
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>
      {/* Tampilan Pagination */}
      <nav
        className="pagination is-small is-rounded is-centered"
        role="navigation"
        aria-label="pagination"
      >
        <ul className="pagination-list">
          {Array.from({
            length: Math.ceil(sertifikat.length / itemsPerPage),
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
      </nav>
    </div>
  );
};

export default SertifikatConfirm;
