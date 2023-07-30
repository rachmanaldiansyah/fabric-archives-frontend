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
    <div>
      <h1>Data Ijazah Timeline</h1>
      <ul>
        {Ijazah.map((ijazah) => (
          <li key={ijazah.uuid}>
            {ijazah.nama} - {ijazah.status}
            {ijazah.status === 'Belum Disetujui' && (
              <>
                <button onClick={() => handleApprove(ijazah.uuid, 'Disetujui Kepala Sekolah')}>
                  Setujui Kepala Sekolah
                </button>
                <button onClick={() => handleApprove(ijazah.uuid, 'Disetujui Kesiswaan')}>
                  Setujui Kesiswaan
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Timeline;
