import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function School() {
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const schoolName = 'Medeniyet_Üniversitesi';
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`https://tr.wikipedia.org/api/rest_v1/page/summary/${schoolName}`)
      .then((response) => {
        const data = response.data;
        setSchool({
          name: data.title,
          description: data.extract,
          image: data.thumbnail?.source || '',
          link:
            data.content_urls?.desktop.page ||
            `https://tr.wikipedia.org/wiki/${schoolName}`,
        });
      })
      .catch((error) => {
        console.error('Okul bilgisi alınamadı:', error);
        setSchool(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Yükleniyor...</p>;
  if (!school) return <p>Okul bilgisi bulunamadı.</p>;

  return (
    <div className="page-wrapper">
      <div className="info-container">
        <h2>{school.name}</h2>
        {school.image && (
          <img
            src={school.image}
            alt={school.name}
            style={{ maxWidth: '400px' }}
          />
        )}
        <p>{school.description}</p>
        <p>
          Daha fazla bilgi için{' '}
          <a href={school.link} target="_blank" rel="noopener noreferrer">
            buraya tıklayabilirsiniz
          </a>
          .
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button className="back-button" onClick={() => navigate('/bilgiler')}>Önceki Sayfa</button>
          <button className="back-button" onClick={() => navigate('/dogumyeri')}>Sonraki Sayfa</button>
        </div>
      </div>
    </div>
  );
}

export default School;
