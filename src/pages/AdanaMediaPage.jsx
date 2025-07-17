import React, { useState } from 'react';
import { Box, Typography, Button, Modal } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const images = [
  {
    src: '/images/Demiryolu_Koprusu.jpeg',
    desc: 'Adana Demiryolu Köprüsü, şehrin simgelerinden biridir.'
  },
  {
    src: '/images/adanamerkezcamii.jpeg',
    desc: 'Sabancı Merkez Camii, Adana’nın en büyük camilerindendir.'
  },
  {
    src: '/images/adanabaraj.jpeg',
    desc: 'Seyhan Barajı, Adana’nın doğal güzelliklerinden biridir.'
  },
  {
    src: '/images/adanakarnaval.jpeg',
    desc: 'Adana Portakal Çiçeği Karnavalı, her yıl düzenlenen renkli bir festivaldir.'
  },
  {
    src: '/images/adana-lezzet-festivali.jpeg',
    desc: 'Adana Lezzet Festivali, şehrin zengin mutfağını kutlar.'
  },
  {
    src: '/images/adanalezzet.jpeg',
    desc: 'Adana mutfağı, kebap ve daha fazlasıyla ünlüdür.'
  },
  {
    src: '/images/bici-bici-.jpeg',
    desc: 'Bici bici, Adana’ya özgü serinletici bir tatlıdır.'
  }
];

function AdanaMediaPage() {
  const navigate = useNavigate();
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div className="page-wrapper">
      <div className="info-container">
        <Typography variant="h4" gutterBottom>Adana ile İlgili Medya</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'nowrap' }}>
            {images.slice(0, 4).map((img, idx) => (
              <img
                key={idx}
                src={img.src}
                alt={`adana-media-${idx}`}
                style={{ width: '100%', maxWidth: 220, maxHeight: 180, objectFit: 'cover', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer' }}
                onClick={() => setOpenIdx(idx)}
              />
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'nowrap' }}>
            {images.slice(4).map((img, idx) => (
              <img
                key={idx+4}
                src={img.src}
                alt={`adana-media-${idx+4}`}
                style={{ width: '100%', maxWidth: 220, maxHeight: 180, objectFit: 'cover', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer' }}
                onClick={() => setOpenIdx(idx+4)}
              />
            ))}
          </Box>
        </Box>
        <Modal open={openIdx !== null} onClose={() => setOpenIdx(null)}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 3, borderRadius: 2, outline: 'none', maxWidth: 600, width: '90%' }}>
            {openIdx !== null && (
              <>
                <img src={images[openIdx].src} alt={`adana-media-large-${openIdx}`} style={{ width: '100%', maxHeight: 400, objectFit: 'contain', borderRadius: 8, marginBottom: 16 }} />
                <Typography variant="body1" align="center">{images[openIdx].desc}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button variant="contained" onClick={() => setOpenIdx(null)}>Kapat</Button>
                </Box>
              </>
            )}
          </Box>
        </Modal>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <Button variant="contained" onClick={() => navigate(-1)}>Geri Dön</Button>
        </div>
      </div>
    </div>
  );
}

export default AdanaMediaPage; 