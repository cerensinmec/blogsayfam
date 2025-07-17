
import InfoRow from '../components/InfoRow';
import { useNavigate } from 'react-router-dom';

function ContactPage() {
  const contactInfo = [
    { label: 'İsim', value: 'Ceren' },
    { label: 'Soyisim', value: 'Sinmec' },
    { label: 'Telefon', value: '0552 540 86 93' },
    { label: 'E-posta', value: 'cerennsinmec@gmail.com' },
    { label: 'Adres', value: 'İstanbul, Türkiye' },
  ];
  const navigate = useNavigate();

  return (
    <div className="page-wrapper">
      <div className="info-container">
        <h2>İletişim Bilgileri</h2>

        {contactInfo.map((item, index) => (
          <InfoRow key={index} label={item.label} value={item.value} />
        ))}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button className="back-button" onClick={() => navigate('/dogumyeri')}>Önceki Sayfa</button>
          <button className="back-button" onClick={() => navigate('/')}>Sonraki Sayfa</button>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
