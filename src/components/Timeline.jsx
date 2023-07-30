import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Timeline = () => {
  const [Ijazah, setIjazahList] = useState([]);

  useEffect(() => {
    fetchIjazah();
  }, []);

  const fetchIjazah = async () => {
    try {
      const response = await axios.get('http://localhost:5000/ijazah');
      setIjazahList(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleApprove = async (id, status) => {
    try {
      const response = await axios.put('http://localhost:5000/ijazah/approve', { id, status });
      setIjazahList((prevData) =>
        prevData.map((data) => (data.id === id ? { ...data, status: response.data.status } : data))
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Data Ijazah Timeline</h1>
      <div className="timeline">
        {Ijazah.map((ijazah) => (
          <div key={ijazah.uuid} className="timeline-item">
            <div className="timeline-content">
              <p className="heading">{ijazah.nama}</p>
              <p>Status: {ijazah.status}</p>
              {ijazah.status === 'Belum Disetujui' && (
                <div className="buttons are-small">
                  <button
                    className="button is-success is-outlined"
                    onClick={() => handleApprove(ijazah.uuid, 'Disetujui Kepala Sekolah')}
                  >
                    Setujui Kepala Sekolah
                  </button>
                  <button
                    className="button is-success is-outlined"
                    onClick={() => handleApprove(ijazah.uuid, 'Disetujui Kesiswaan')}
                  >
                    Setujui Kesiswaan
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;