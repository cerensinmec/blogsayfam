import React, { useEffect, useState } from "react";
import axios from "axios";
import BirthPlace from "../constants/data/birthPlace.json";
import { useNavigate } from 'react-router-dom';

function BirthPlacePage() {
  const [cityInfo, setCityInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .post("https://countriesnow.space/api/v0.1/countries/population/cities", {
        city: "adana",
      })
      .then((response) => setCityInfo(response.data))
      .catch((error) => console.error("API'den şehir verisi alınamadı:", error));
  }, []);

  if (!cityInfo || !cityInfo.data) return <h2>Yükleniyor...</h2>;

  return (
    <div className="page-wrapper">
      <div className="info-container">
        <h2>{BirthPlace.name}</h2>
        <img
          src={BirthPlace.image}
          alt={BirthPlace.name}
          style={{ maxWidth: "400px" }}
        />
        <p>{BirthPlace.description}</p>
        <p>Şehir: {cityInfo.data.city}</p>
        <p>Ülke: {cityInfo.data.country}</p>

        <p>
          Daha fazla bilgi için{" "}
          <a href={BirthPlace.link} target="_blank" rel="noopener noreferrer">
            buraya tıklayabilirsiniz
          </a>
          .
        </p>
        <button 
          style={{ marginBottom: 20, background: '#1976d2', color: 'white', border: 'none', borderRadius: 6, padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => navigate('/adana-medya')}
        >
          Medyaya Ulaşmak İçin
        </button>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button className="back-button" onClick={() => navigate('/okul')}>Önceki Sayfa</button>
          <button className="back-button" onClick={() => navigate('/iletisim')}>Sonraki Sayfa</button>
        </div>
      </div>
    </div>
  );
}

export default BirthPlacePage;
